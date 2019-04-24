<?php

namespace Level51\S3;

use SilverStripe\Core\Convert;
use SilverStripe\Forms\FormField;
use SilverStripe\View\Requirements;

/**
 * Upload field for S3Files using dropzone.js
 *
 * @package Level51\S3
 */
class S3UploadField extends FormField {

    /**
     * @var string AWS region
     */
    protected $region;

    /**
     * @var string AWS bucket
     */
    protected $bucket;

    /**
     * @var string|null Folder name
     */
    protected $folderName;

    /**
     * @var int Max file size in MB, overrides the config value if set
     */
    protected $maxFileSize;

    /**
     * @var int Max duration in seconds until the XHR request is canceled, , overrides the config value if set.
     */
    protected $timeout;

    /**
     * List of accepted file types.
     *
     * Can be either the mime type (e.g. image/jpeg, including wildcards like image/*)
     * or file extensions.
     *
     * @var array
     */
    protected $acceptedFiles;

    public function Field($properties = array()) {
        Requirements::javascript('level51/silverstripe-s3upload: client/dist/s3upload.js');
        Requirements::css('level51/silverstripe-s3upload: client/dist/s3upload.css');

        return parent::Field($properties);
    }

    /**
     * Get frontend payload.
     *
     * @return string
     */
    public function getPayload() {
        return Convert::array2json([
            'id'              => $this->ID(),
            'name'            => $this->getName(),
            'value'           => $this->Value(),
            'file'            => ($file = $this->getFile()) ? $file->flatten() : null,
            'title'           => $this->Title(),
            'bucketUrl'       => $this->getBucketUrl(),
            'dropzoneOptions' => [
                'maxFilesize'   => $this->getMaxFileSize(),
                'acceptedFiles' => $this->getAcceptedFiles(),
                'timeout'       => $this->getTimeout(),
            ],
            'settings'        => [
                'bucket'     => $this->getBucket(),
                'region'     => $this->getRegion(),
                'folderName' => $this->getFolderName()
            ]
        ]);
    }

    // <editor-fold defaultstate="collapsed" desc="getter">

    /**
     * Get the URL of our bucket based off the bucket name and its region.
     *
     * @return string URL
     */
    public function getBucketUrl() {
        return Util::getBucketUrl($this->getRegion(), $this->getBucket());
    }

    /**
     * Get the region name, either custom for this field or from the config.
     *
     * @return string
     */
    public function getRegion() {
        return $this->region ?: self::config()->get('region');
    }

    /**
     * Get the bucket name, either custom for this field or from the config.
     *
     * @return string
     */
    public function getBucket() {
        return $this->bucket ?: self::config()->get('bucket');
    }

    /**
     * Get the folder name if set, false otherwise.
     *
     * @return bool|string
     */
    public function getFolderName() {
        return $this->folderName ? $this->folderName . DIRECTORY_SEPARATOR : false;
    }

    /**
     * The max allowed file size.
     *
     * @return int
     */
    public function getMaxFileSize() {
        return $this->maxFileSize ?: self::config()->get('maxFileSize');
    }

    /**
     * Get accepted files config.
     *
     * @return null|string
     */
    public function getAcceptedFiles() {
        if ($this->acceptedFiles)
            return implode(',', $this->acceptedFiles);

        if ($accepted = self::config()->get('acceptedFiles'))
            return implode(',', $accepted);

        return null;
    }

    /**
     * Get the timeout for the dropzone component.
     *
     * @return mixed
     */
    public function getTimeout() {
        return ($this->timeout ?: self::config()->get('timeout')) * 1000;
    }

    /**
     * Get the file record according to the value if set.
     *
     * @return null|\SilverStripe\ORM\DataObject|S3File
     */
    public function getFile() {
        if ($this->Value())
            return S3File::get()->byID($this->Value());

        return null;
    }

    // </editor-fold>

    // <editor-fold defaultstate="collapsed" desc="setter">

    /**
     * @param string $region
     *
     * @return $this
     */
    public function setRegion($region) {
        $this->region = $region;

        return $this;
    }

    /**
     * @param string $bucket
     *
     * @return $this
     */
    public function setBucket($bucket) {
        $this->bucket = $bucket;

        return $this;
    }

    /**
     * @param string $folderName
     *
     * @return $this
     */
    public function setFolderName($folderName) {
        $this->folderName = trim($folderName, DIRECTORY_SEPARATOR);

        return $this;
    }

    /**
     * Add an acceptedFiles entry.
     *
     * @param string $extensionOrMimeType
     *
     * @return $this
     */
    public function addAcceptedFile($extensionOrMimeType) {
        // Check for extensions without leading . - add it if necessary
        if (strpos($extensionOrMimeType, '/') === false
            && $extensionOrMimeType[0] !== '.')
            $extensionOrMimeType = '.' . $extensionOrMimeType;

        if (!$this->acceptedFiles)
            $this->acceptedFiles = [];

        $this->acceptedFiles[] = $extensionOrMimeType;

        return $this;
    }

    /**
     * Set the accepted file types / extensions.
     *
     * @param array|string $accepted
     *
     * @return $this
     */
    public function setAcceptedFiles($accepted) {
        if (is_string($accepted)) $accepted = [$accepted];

        foreach ($accepted as $extensionOrMimeType) {
            $this->addAcceptedFile($extensionOrMimeType);
        }

        return $this;
    }

    /**
     * @param array|string $extension
     *
     * @return S3UploadField
     */
    public function setAllowedExtensions($extension) {
        return $this->setAcceptedFiles($extension);
    }

    /**
     * Override the allowed max file size.
     *
     * @param int $maxFileSize In MB
     *
     * @return $this
     */
    public function setMaxFileSize($maxFileSize) {
        $this->maxFileSize = $maxFileSize;

        return $this;
    }

    /**
     * Override the config timeout value for this field.
     *
     * @param int $timeout Timeout in seconds
     *
     * @return $this
     */
    public function setTimeout($timeout) {
        $this->timeout = $timeout;

        return $this;
    }

    // </editor-fold>
}
