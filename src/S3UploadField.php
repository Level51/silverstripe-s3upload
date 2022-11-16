<?php

namespace Level51\S3;

use Exception;
use League\MimeTypeDetection\ExtensionMimeTypeDetector;
use League\MimeTypeDetection\GeneratedExtensionToMimeTypeMap;
use League\MimeTypeDetection\OverridingExtensionToMimeTypeMap;
use SilverStripe\Core\Config\Configurable;
use SilverStripe\Forms\FormField;
use SilverStripe\View\Requirements;

/**
 * Upload field for S3Files.
 *
 * @package Level51\S3
 */
class S3UploadField extends FormField
{
    use Configurable;

    /**
     * @var string|null AWS region
     */
    protected ?string $region = null;

    /**
     * @var string|null AWS bucket
     */
    protected ?string $bucket = null;

    /**
     * @var string|null Folder name
     */
    protected ?string $folderName = null;

    /**
     * @var int|null Max file size in MB, overrides the config value if set
     */
    protected ?int $maxFileSize = null;

    /**
     * List of accepted file types.
     *
     * Must be mime types (e.g. image/jpeg) including wildcards like image/*.
     *
     * @var array
     */
    protected array $acceptedFiles = [];

    /**
     * Custom payload passed to the handleFileUpload method of the upload controller.
     *
     * @var array
     */
    protected array $customPayload = [];

    public function Field($properties = array())
    {
        Requirements::javascript('level51/silverstripe-s3upload: client/dist/s3upload.js');
        Requirements::css('level51/silverstripe-s3upload: client/dist/s3upload.css');

        return parent::Field($properties);
    }

    /**
     * Get frontend payload.
     *
     * @return string
     */
    public function getPayload(): string
    {
        return json_encode(
            [
                'id'              => $this->ID(),
                'name'            => $this->getName(),
                'value'           => $this->Value(),
                'file'            => ($file = $this->getFile()) ? $file->flatten() : null,
                'title'           => $this->Title(),
                'bucketUrl'       => $this->getBucketUrl(),
                'uploaderOptions' => [
                    'maxFilesize'   => $this->getMaxFileSize(),
                    'acceptedFiles' => $this->getAcceptedFiles(),
                ],
                'settings'        => [
                    'bucket'               => $this->getBucket(),
                    'region'               => $this->getRegion(),
                    'folderName'           => $this->getFolderName(),
                    'usePathStyleEndpoint' => $this->shouldUsePathStyleEndpoint(),
                ],
                'customPayload'   => $this->getCustomPayload()
            ]
        );
    }

    // <editor-fold defaultstate="collapsed" desc="getter">

    /**
     * Get the URL of our bucket based off the bucket name and its region.
     *
     * @return string URL
     */
    public function getBucketUrl(): string
    {
        return Util::getBucketUrl($this->getRegion(), $this->getBucket());
    }

    /**
     * Get the region name, either custom for this field or from the config.
     *
     * @return string
     */
    public function getRegion(): string
    {
        return $this->region ?: Util::config()->get('default_region');
    }

    /**
     * Get the bucket name, either custom for this field or from the config.
     *
     * @return string
     */
    public function getBucket(): string
    {
        return $this->bucket ?: Util::config()->get('bucket');
    }

    /**
     * Get the folder name if set, false otherwise.
     *
     * @return bool|string
     */
    public function getFolderName()
    {
        return $this->folderName ? ($this->folderName . DIRECTORY_SEPARATOR) : false;
    }

    /**
     * The max allowed file size.
     *
     * @return int
     */
    public function getMaxFileSize(): int
    {
        return $this->maxFileSize ?: Util::config()->get('maxFileSize');
    }

    /**
     * Get accepted files config.
     *
     * @return array
     */
    public function getAcceptedFiles(): array
    {
        if ($this->acceptedFiles) {
            return array_values(array_unique($this->acceptedFiles));
        }

        if ($accepted = Util::config()->get('acceptedFiles')) {
            return $accepted;
        }

        return [];
    }

    /**
     * Get the file record according to the value if set.
     *
     * @return null|S3File
     */
    public function getFile(): ?S3File
    {
        if ($this->Value()) {
            /** @var S3File $file */
            $file = S3File::get()->byID($this->Value());

            return $file ?? null;
        }

        return null;
    }

    /**
     * Get any kind of custom payload.
     *
     * @return array
     */
    public function getCustomPayload(): array
    {
        return $this->customPayload;
    }

    /**
     * Whether the endpoint should use the "path style" syntax.
     *
     * @return bool
     */
    public function shouldUsePathStyleEndpoint()
    {
        $usePathStyleSyntax = false;

        if ($clientOptions = Util::config()->get('client_options')) {
            if (isset($clientOptions['use_path_style_endpoint']) && $clientOptions['use_path_style_endpoint'] === true) {
                $usePathStyleSyntax = true;
            }
        }

        return $usePathStyleSyntax;
    }

    // </editor-fold>

    // <editor-fold defaultstate="collapsed" desc="setter">

    /**
     * @param string $region
     *
     * @return $this
     */
    public function setRegion(string $region): self
    {
        $this->region = $region;

        return $this;
    }

    /**
     * @param string $bucket
     *
     * @return $this
     */
    public function setBucket(string $bucket): self
    {
        $this->bucket = $bucket;

        return $this;
    }

    /**
     * @param string $folderName
     *
     * @return $this
     */
    public function setFolderName(string $folderName): self
    {
        $this->folderName = trim($folderName, DIRECTORY_SEPARATOR);

        return $this;
    }

    /**
     * Try to get the mime type for a given file extension.
     *
     * @param string $extension
     * @return string|null
     */
    private function guessMimeTypeFromExtension(string $extension): ?string
    {
        if ($extension[0] !== '.') {
            $extension = '.' . $extension;
        }

        $map = new OverridingExtensionToMimeTypeMap(
            new GeneratedExtensionToMimeTypeMap(),
            self::config()->get('ExtensionToMimeTypeOverrides') ?: []
        );

        return (new ExtensionMimeTypeDetector($map))->detectMimeTypeFromPath('file.' . $extension);
    }

    /**
     * Add an acceptedFiles entry.
     *
     * Can either be a mime type or a file extension. In case of a file extension
     * we will try to detect the according mime type and throw an exception if not found.
     *
     * @param string $extensionOrMimeType
     *
     * @return $this
     * @throws Exception
     */
    public function addAcceptedFile(string $extensionOrMimeType): self
    {
        if (!$this->acceptedFiles) {
            $this->acceptedFiles = [];
        }

        if (strpos($extensionOrMimeType, '/') !== false) {
            // Is already a mime type, so just add
            $this->acceptedFiles[] = $extensionOrMimeType;
        } else {
            // Is file extension, try to detect mime type
            $mimeType = $this->guessMimeTypeFromExtension($extensionOrMimeType);

            if (!$mimeType) {
                throw new Exception('Could not detect mime type for ' . $extensionOrMimeType);
            }

            $this->acceptedFiles[] = $mimeType;
        }

        return $this;
    }

    /**
     * Set the accepted file types / extensions.
     *
     * @param array|string $accepted
     *
     * @return $this
     * @throws Exception
     */
    public function setAcceptedFiles($accepted): self
    {
        if (is_string($accepted)) {
            $accepted = [$accepted];
        }

        foreach ($accepted as $extensionOrMimeType) {
            $this->addAcceptedFile($extensionOrMimeType);
        }

        return $this;
    }

    /**
     * @param array|string $extension
     *
     * @return S3UploadField
     * @throws Exception
     */
    public function setAllowedExtensions($extension): self
    {
        return $this->setAcceptedFiles($extension);
    }

    /**
     * Override the allowed max file size.
     *
     * @param int $maxFileSize In MB
     *
     * @return $this
     */
    public function setMaxFileSize(int $maxFileSize): self
    {
        $this->maxFileSize = $maxFileSize;

        return $this;
    }

    /**
     * Set some custom payload.
     *
     * Will override any existing custom payload.
     *
     * @param array $payload
     * @return $this
     */
    public function setCustomPayload(array $payload): self
    {
        $this->customPayload = $payload;

        return $this;
    }

    /**
     * Add something to the custom payload array.
     *
     * @param array $payload
     * @return $this
     */
    public function addCustomPayload(array $payload): self
    {
        $this->customPayload = array_merge_recursive($this->customPayload, $payload);

        return $this;
    }

    /**
     * Set a callback triggered on the given record after successful S3File creation.
     *
     * @param string $class e.g. My\Namespaced\DataObject
     * @param int    $id
     * @param string $method
     * @return $this
     */
    public function setRecordCreateCallback(string $class, int $id, string $method = 'onAfterS3FileCreate'): self
    {
        $this->customPayload['recordCreateCallback'] = [
            'class'  => $class,
            'id'     => $id,
            'method' => $method
        ];

        return $this;
    }

    /**
     * Set a callback griggered on the given record during S3File deletion.
     *
     * @param string $class e.g. My\Namespaced\DataObject
     * @param int    $id
     * @param string $method
     * @return $this
     */
    public function setRecordDeleteCallback(string $class, int $id, string $method = 'onBeforeS3FileDelete'): self
    {
        $this->customPayload['recordDeleteCallback'] = [
            'class'  => $class,
            'id'     => $id,
            'method' => $method
        ];

        return $this;
    }

    // </editor-fold>
}
