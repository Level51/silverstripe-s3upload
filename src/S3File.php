<?php

namespace Level51\S3;

use Aws\S3\S3MultiRegionClient;
use Carbon\Carbon;
use Psr\Container\NotFoundExceptionInterface;
use SilverStripe\Assets\File;
use SilverStripe\Core\Injector\Injector;
use SilverStripe\ORM\DataObject;
use SilverStripe\ORM\FieldType\DBDatetime;

/**
 * AWS S3 File record.
 *
 * @property string     $Title
 * @property string     $Location
 * @property string     $Region
 * @property string     $Bucket
 * @property string     $Key
 * @property string     $ETag
 * @property string     $Name
 * @property int        $Size
 * @property string     $Type
 * @property DBDatetime $LastModified
 *
 * @package Level51\S3
 */
class S3File extends DataObject
{
    private static $table_name = 'S3File';

    private static $db = [
        'Title'        => 'Varchar(255)', // Proper title for the file
        'Location'     => 'Varchar(255)', // Public URL of the file
        'Region'       => 'Varchar(255)', // AWS region of the bucket
        'Bucket'       => 'Varchar(255)', // AWS Bucket name
        'Key'          => 'Varchar(255)', // Filename under which the file is stored in S3
        'ETag'         => 'Varchar(255)', // ETag value returned by S3, usually an MD5 Hash
        'Name'         => 'Varchar(255)', // Original name at upload
        'Size'         => 'Int', // Size of the file in bytes
        'Type'         => 'Varchar(255)', // File type
        'LastModified' => DBDatetime::class
    ];

    protected function onBeforeWrite()
    {
        // If no title provided, reformat filename
        if (!$this->Title) {
            // Strip the extension
            $this->Title = preg_replace('#\.[[:alnum:]]*$#', '', $this->Name);
            // Replace all punctuation with space
            $this->Title = preg_replace('#[[:punct:]]#', ' ', $this->Title);
            // Remove unecessary spaces
            $this->Title = preg_replace('#[[:blank:]]+#', ' ', $this->Title);
        }

        parent::onBeforeWrite();
    }

    protected function onAfterDelete()
    {
        parent::onAfterDelete();

        // Trigger delete on s3 side
        Injector::inst()->get(Service::class)->deleteFile($this);
    }

    /**
     * @param array $body
     *
     * @return S3File
     * @throws \SilverStripe\ORM\ValidationException
     * @throws \Exception
     */
    public static function fromUpload($body)
    {
        /** @var Service $service */
        $service = Injector::inst()->get(Service::class);

        $bucket = $body['bucket'];
        $region = $body['region'];
        $key = $body['key'];

        $headObjectResponse = $service->headObject($bucket, $key);

        $s3file = new self();
        $s3file->Name = $body['name'] ?? $body['key'];
        $s3file->Size = $headObjectResponse['ContentLength'] ?? 0;
        $s3file->Type = $headObjectResponse['ContentType'] ?? null;
        $s3file->Region = $region;
        $s3file->Location = $headObjectResponse['@metadata']['effectiveUri'] ?? null;
        $s3file->Bucket = $bucket;
        $s3file->Key = $key;
        $s3file->ETag = isset($headObjectResponse['ETag']) ? str_replace('"', '', $headObjectResponse['ETag']) : null;
        $s3file->LastModified = isset($headObjectResponse['LastModified']) ? Carbon::parse($headObjectResponse['LastModified'])->toDateTimeString() : null;
        $s3file->write();

        return $s3file;
    }

    /**
     * @param int  $expiresIn Time in minutes until the link gets invalid
     * @param bool $directDownload Whether the download should be triggered immediately or not
     *
     * @return string
     * @throws NotFoundExceptionInterface
     */
    public function getTemporaryDownloadLink(int $expiresIn = 60, bool $directDownload = true): string
    {
        return Injector::inst()->get(Service::class)->getTemporaryDownloadLink($this, $expiresIn, $directDownload);
    }

    /**
     * @return S3MultiRegionClient
     * @throws NotFoundExceptionInterface
     */
    public function getS3Client(): S3MultiRegionClient
    {
        /** @var Service $service */
        $service = Injector::inst()->get(Service::class);

        return $service->getClient();
    }

    /**
     * @return string
     * @throws NotFoundExceptionInterface
     */
    public function getObjectUrl(): string
    {
        /** @var Service $service */
        $service = Injector::inst()->get(Service::class);

        return $service->getObjectUrl($this);
    }

    /**
     * @return string File size in a human-readable format
     */
    public function getSizeForHuman(): string
    {
        return File::format_size($this->Size);
    }

    /**
     * Get a flat version for template usage.
     *
     * @return array
     */
    public function flatten(): array
    {
        return [
            'id'           => $this->ID,
            'title'        => $this->Title,
            'location'     => $this->Location,
            'region'       => $this->Region,
            'bucket'       => $this->Bucket,
            'key'          => $this->Key,
            'etag'         => $this->ETag,
            'name'         => $this->Name,
            'size'         => $this->getSizeForHuman(),
            'type'         => $this->Type,
            'presignedUrl' => $this->getTemporaryDownloadLink(60, false)
        ];
    }
}
