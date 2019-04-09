<?php

namespace Lvl51\S3;

use SilverStripe\Core\Convert;
use SilverStripe\Forms\FormField;
use SilverStripe\View\Requirements;

/**
 * Upload field for S3Files using dropzone.js
 *
 * @package Lvl51\S3
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

    public function Field($properties = array()) {
        Requirements::javascript('level51/silverstripe-s3: client/dist/s3upload.js');
        Requirements::css('level51/silverstripe-s3: client/dist/s3upload.css');

        return parent::Field($properties);
    }

    /**
     * Get frontend payload.
     *
     * @return string
     */
    public function getPayload() {
        return Convert::array2json([
            'id'        => $this->ID(),
            'name'      => $this->getName(),
            'title'     => $this->Title(),
            'bucketUrl' => $this->getBucketUrl(),
            'settings'  => [
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

    // </editor-fold>
}
