<?php

namespace Level51\S3;

use Aws\Credentials\Credentials;
use Aws\S3\S3Client;

/**
 * Service class for s3 specific actions.
 *
 * @package Level51\S3
 */
class Service
{

    /**
     * @var Service
     */
    private static $instance = null;

    /**
     * @var S3Client
     */
    private $s3;

    public static function inst()
    {
        if (self::$instance === null) {
            self::$instance = new self();
        }

        return self::$instance;
    }

    /**
     * @return string AWS accessId / key
     */
    public function getAccessId()
    {
        return Util::config()->get('AccessId');
    }

    /**
     * @return string AWS secret
     */
    public function getSecret()
    {
        return Util::config()->get('Secret');
    }


    /**
     * @param S3File $s3File
     *
     * @return S3Client
     */
    public function getClientForFile($s3File)
    {
        $options = [
            'credentials' => new Credentials(
                $this->getAccessId(),
                $this->getSecret()
            ),
            'region'      => $s3File->Region,
            'version'     => 'latest'
        ];

        if ($customOptions = Util::config()->get('client_options')) {
            $options = array_merge_recursive($options, $customOptions);
        }

        $this->s3 = new S3Client($options);

        return $this->s3;
    }

    /**
     * @param S3File $s3File File record
     * @param int    $expiresIn Time in minutes until the link gets invalid
     * @param bool   $directDownload Whether the download should be triggered immediately or not
     *
     * @return string
     */
    public function getTemporaryDownloadLink($s3File, $expiresIn = 60, $directDownload = true)
    {
        $this->getClientForFile($s3File);

        $params = [
            'Bucket' => $s3File->Bucket,
            'Key'    => $s3File->Key
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
    public function getObjectUrl($s3File)
    {
        $this->getClientForFile($s3File);

        return $this->s3->getObjectUrl($s3File->Bucket, $s3File->Key);
    }

    /**
     * Delete file from bucket.
     *
     * @param S3File $s3File
     */
    public function deleteFile($s3File)
    {
        $this->getClientForFile($s3File);

        $command = $this->s3->getCommand('DeleteObject', [
            'Bucket' => $s3File->Bucket,
            'Key'    => $s3File->Key
        ]);

        $this->s3->execute($command);
    }
}
