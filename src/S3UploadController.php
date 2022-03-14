<?php

namespace Level51\S3;

use Exception;
use Psr\Container\NotFoundExceptionInterface;
use SilverStripe\Control\Controller;
use SilverStripe\Core\Injector\Injector;
use SilverStripe\ORM\DataObject;
use SilverStripe\Security\Security;

/**
 * Controller for S3 file/upload specific actions.
 *
 * Used to sign the upload request and handle the actual file creation after successful upload.
 *
 * @package Level51\S3
 */
class S3UploadController extends Controller
{
    private static $allowed_actions = ['signRequest', 'handleFileUpload', 'removeFile'];

    private static $url_handlers = [
        'sign'        => 'signRequest',
        'uploaded'    => 'handleFileUpload',
        'remove/$ID!' => 'removeFile'
    ];

    protected function init()
    {
        parent::init();

        if (!Security::getCurrentUser()) {
            return $this->httpError(401);
        }
    }

    /**
     * Create a presigned upload url.
     *
     * @see https://docs.aws.amazon.com/sdk-for-php/v3/developer-guide/s3-presigned-url.html
     *
     * @return string
     * @throws NotFoundExceptionInterface
     */
    public function signRequest(): string
    {
        /** @var Service $service */
        $service = Injector::inst()->get(Service::class);
        $client = $service->getClient();

        $request = $this->getRequest();
        $params = $request->getVars();
        $bucket = $params['bucket'];

        $file = $params['file'];

        $filePath = Util::sanitizeKey($file['name'], $params['folderName'] ?? null);

        $cmd = $client->getCommand('PutObject', [
            'Bucket' => $bucket,
            'Key'    => $filePath
        ]);

        $awsRequest = $client->createPresignedRequest($cmd, '+30 minutes');

        return (string)$awsRequest->getUri();
    }

    /**
     * Handle s3file creation after s3 upload.
     *
     * @return string
     */
    public function handleFileUpload(): string
    {
        $request = $this->getRequest();
        $body = json_decode($request->getBody(), true);

        try {
            $s3File = S3File::fromUpload($body);

            // Check if there is a callback defined, trigger if the record and method exists
            if (isset($body['customPayload']['recordCreateCallback'])) {
                $callback = $body['customPayload']['recordCreateCallback'];
                $record = DataObject::get($callback['class'])->byID($callback['id']);

                if ($record && $record->hasMethod($callback['method'])) {
                    $record->{$callback['method']}($s3File, $body);
                }
            }

            return json_encode($s3File->flatten());
        } catch (Exception $e) {
            return $e->getMessage();
        }
    }

    /**
     * Remove / Delete given file by id.
     *
     * @return mixed
     */
    public function removeFile()
    {
        $request = $this->getRequest();
        $body = json_decode($request->getBody(), true);

        if (
            !$request->param('ID') ||
            !($file = S3File::get()->byID($request->param('ID')))
        ) {
            return $this->httpError(404);
        }

        if (!$file->canDelete()) {
            return $this->httpError(403);
        }

        $cancelDeletion = false;
        // Check if there is a callback defined, trigger if the record and method exists
        if (isset($body['customPayload']['recordDeleteCallback'])) {
            $callback = $body['customPayload']['recordDeleteCallback'];
            $record = DataObject::get($callback['class'])->byID($callback['id']);

            if ($record && $record->hasMethod($callback['method'])) {
                $response = $record->{$callback['method']}($file, $body);

                if ($response === false) {
                    $cancelDeletion = true;
                }
            }
        }

        if (!$cancelDeletion) {
            $file->delete();
        }
    }
}
