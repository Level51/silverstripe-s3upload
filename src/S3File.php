<?php

namespace Level51\S3;

use Carbon\Carbon;
use SilverStripe\Assets\File;
use SilverStripe\Core\Convert;
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
class S3File extends DataObject {

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

    protected function onBeforeWrite() {
        // If no title provided, reformat filename
        if (!$this->Title) {
            // Strip the extension
            $this->Title = preg_replace('#\.[[:alnum:]]*$#', '', $this->Name);
            // Replace all punctuation with space
            $this->Title = preg_replace('#[[:punct:]]#', ' ', $this->Title);
            // Remove unecessary spaces
            $this->Title = preg_replace('#[[:blank:]]+#', ' ', $this->Title);
        }

        return parent::onBeforeWrite();
    }

    protected function onAfterDelete() {
        parent::onAfterDelete();

        // Trigger delete on s3 side
        Service::inst()->deleteFile($this);
    }

    /**
     * @param array $body
     *
     * @return S3File
     * @throws \SilverStripe\ORM\ValidationException
     * @throws \Exception
     */
    public static function fromUpload($body) {

        // Parse s3 xml response
        if (isset($body['s3response']))
            $body = array_merge($body, Convert::xml2array($body['s3response']));

        $s3file = new self();
        $s3file->Name = isset($body['name']) ? $body['name'] : $body['Key'];
        $s3file->Size = $body['size'];
        $s3file->Type = isset($body['type']) && $body['type'] !== '' ? $body['type'] : null;
        $s3file->Region = $body['region'];
        $s3file->Location = $body['Location'];
        $s3file->Bucket = $body['Bucket'];
        $s3file->Key = $body['Key'];
        $s3file->ETag = str_replace('"', '', $body['ETag']);
        $s3file->LastModified = isset($body['lastModified']) ? Carbon::createFromTimestampMs($body['lastModified'])->toDateTimeString() : null;
        $s3file->write();

        return $s3file;
    }

    /**
     * @param int  $expiresIn      Time in minutes until the link gets invalid
     * @param bool $directDownload Whether the download should be triggered immediately or not
     *
     * @return string
     */
    public function getTemporaryDownloadLink($expiresIn = 60, $directDownload = true) {
        return Service::inst()->getTemporaryDownloadLink($this, $expiresIn, $directDownload);
    }

    /**
     * @return string File size in a human readable format
     */
    public function getSizeForHuman() {
        return File::format_size($this->Size);
    }

    /**
     * Get a flat version for template usage.
     *
     * @return array
     */
    public function flatten() {
        return [
            'id'       => $this->ID,
            'title'    => $this->Title,
            'location' => $this->Location,
            'region'   => $this->Region,
            'bucket'   => $this->Bucket,
            'key'      => $this->Key,
            'etag'     => $this->ETag,
            'name'     => $this->Name,
            'size'     => $this->getSizeForHuman(),
            'type'     => $this->Type
        ];
    }
}
