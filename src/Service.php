<?php

namespace Level51\S3;

use Aws\Credentials\Credentials;
use Aws\S3\S3MultiRegionClient;
use SilverStripe\Core\Config\Configurable;
use SilverStripe\Core\Injector\Injectable;

/**
 * Service class for s3 specific actions.
 *
 * @package Level51\S3
 */
class Service
{
    use Injectable;
    use Configurable;

    private S3MultiRegionClient $s3;

    public function __construct()
    {
        $options = [
            'credentials' => new Credentials(
                $this->getAccessId(),
                $this->getSecret()
            ),
            'version'     => 'latest',
            'region'      => $this->getDefaultRegion(),
        ];

        if ($customOptions = Util::config()->get('client_options')) {
            $options = array_merge_recursive($options, $customOptions);
        }

        $this->s3 = new S3MultiRegionClient($options);
    }

    /**
     * @return string AWS accessId / key
     */
    public function getAccessId(): string
    {
        return Util::config()->get('AccessId');
    }

    /**
     * @return string AWS secret
     */
    public function getSecret(): string
    {
        return Util::config()->get('Secret');
    }

    /**
     * @return string Default region to use if not specified other.
     */
    public function getDefaultRegion(): string
    {
        return Util::config()->get('default_region');
    }

    /**
     * @return S3MultiRegionClient
     */
    public function getClient(): S3MultiRegionClient
    {
        return $this->s3;
    }

    /**
     * @param S3File $s3File File record
     * @param int    $expiresIn Time in minutes until the link gets invalid
     * @param bool   $directDownload Whether the download should be triggered immediately or not
     *
     * @return string
     */
    public function getTemporaryDownloadLink(S3File $s3File, int $expiresIn = 60, bool $directDownload = true): string
    {
        $params = [
            'Bucket' => $s3File->Bucket,
            'Key'    => $s3File->Key,
            'Region' => $s3File->Region
        ];

        if ($directDownload) {
            $params['ResponseContentDisposition'] = 'attachment; filename="' . $s3File->Name . '"';
        }

        $command = $this->s3->getCommand('GetObject', $params);
        $request = $this->s3->createPresignedRequest($command, "+$expiresIn minutes");

        return (string)$request->getUri();
    }

    /**
     * @param S3File $s3File
     * @return string
     */
    public function getObjectUrl(S3File $s3File): string
    {
        return $this->s3->getObjectUrl($s3File->Bucket, $s3File->Key);
    }

    /**
     * Delete file from bucket.
     *
     * @param S3File $s3File
     */
    public function deleteFile(S3File $s3File)
    {
        $command = $this->s3->getCommand('DeleteObject', [
            'Bucket' => $s3File->Bucket,
            'Key'    => $s3File->Key,
            'Region' => $s3File->Region,
        ]);

        $this->s3->execute($command);
    }

    /**
     * Get file information for a specific key.
     *
     * @param string $bucket
     * @param string $key
     * @return array
     */
    public function headObject(string $bucket, string $key): array
    {
        $command = $this->s3->getCommand('HeadObject', [
            'Bucket' => $bucket,
            'Key'    => $key
        ]);

        return $this->s3->execute($command)->toArray();
    }
}
