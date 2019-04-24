<?php

namespace Level51\S3;

use SilverStripe\Control\Controller;
use SilverStripe\Core\Config\Config;
use SilverStripe\Core\Convert;
use SilverStripe\Security\Security;

/**
 * Controller for S3 file/upload specific actions.
 *
 * Used to sign the upload request and handle the actual file creation after successful upload.
 *
 * @package Level51\S3
 */
class S3UploadController extends Controller {

    private static $allowed_actions = ['signRequest', 'handleFileUpload', 'removeFile'];

    private static $url_handlers = [
        'sign'        => 'signRequest',
        'uploaded'    => 'handleFileUpload',
        'remove/$ID!' => 'removeFile'
    ];

    protected function init() {
        parent::init();

        if (!Security::getCurrentUser())
            return $this->httpError(401);
    }

    /**
     * Sign the upload request for the given params.
     *
     * The postVars have to contain:
     *   bucket: string,
     *   region: string,
     *   file: [
     *     name: string,
     *     type: string
     *   ],
     *   folderName: string (optional)
     *
     * @return string
     */
    public function signRequest() {
        $request = $this->getRequest();
        $params = $request->getVars();
        $conf = Config::forClass('Level51\S3\S3');

        $key = $conf->get('AccessId');
        $secret = $conf->get('Secret');
        $bucket = $params['bucket'];
        $region = $params['region'];

        $file = $params['file'];
        $fileName = uniqid('', true);
        $fileName .= '.' . pathinfo($file['name'])['extension'];
        $filePath = $params['folderName'] ? $params['folderName'] . $fileName : $fileName;

        // Set som defaults
        $algorithm = "AWS4-HMAC-SHA256";
        $service = "s3";
        $date = gmdate('Ymd\THis\Z');
        $shortDate = gmdate('Ymd');
        $requestType = "aws4_request";
        $expires = "" . 60 * 60; // This request will be valid for an hour
        $successStatus = '201';

        $scope = [
            $key,
            $shortDate,
            $region,
            $service,
            $requestType
        ];
        $credentials = implode('/', $scope);

        // Tells AWS under which condition this request will be valid
        $policy = [
            'expiration' => gmdate('Y-m-d\TG:i:s\Z', strtotime('+1 hours')),
            'conditions' => [
                ['bucket' => $bucket],
                ['acl' => 'private'],
                ['starts-with', '$key', $filePath],
                ['starts-with', '$Content-Type', $file['type']],
                ['success_action_status' => $successStatus],
                ['x-amz-credential' => $credentials],
                ['x-amz-algorithm' => $algorithm],
                ['x-amz-date' => $date],
                ['x-amz-expires' => $expires],
            ]
        ];

        $base64Policy = base64_encode(json_encode($policy));
        $dateKey = hash_hmac('sha256', $shortDate, 'AWS4' . $secret, true);
        $dateRegionKey = hash_hmac('sha256', $region, $dateKey, true);
        $dateRegionServiceKey = hash_hmac('sha256', $service, $dateRegionKey, true);
        $signingKey = hash_hmac('sha256', $requestType, $dateRegionServiceKey, true);
        $signature = hash_hmac('sha256', $base64Policy, $signingKey);

        return Convert::array2json([
            'signature'    => [
                'key'                   => $filePath,
                'Content-Type'          => $file['type'],
                'acl'                   => 'private',
                'success_action_status' => $successStatus,
                'policy'                => $base64Policy,
                'X-amz-algorithm'       => $algorithm,
                'X-amz-credential'      => $credentials,
                'X-amz-date'            => $date,
                'X-amz-expires'         => $expires,
                'X-amz-signature'       => $signature
            ],
            'postEndpoint' => Util::getBucketUrl($region, $bucket)
        ]);
    }

    /**
     * Handle s3file creation after s3 upload.
     *
     * @return string
     */
    public function handleFileUpload() {
        $request = $this->getRequest();
        $body = Convert::json2array($request->getBody());

        try {
            $s3File = S3File::fromUpload($body);

            return Convert::array2json($s3File->flatten());
        } catch (\Exception $e) {

        }
    }

    /**
     * Remove / Delete given file by id.
     *
     * @return mixed
     */
    public function removeFile() {
        $request = $this->getRequest();

        if (!$request->param('ID') ||
            !($file = S3File::get()->byID($request->param('ID'))))
            return $this->httpError(404);

        if (!$file->canDelete())
            return $this->httpError(403);

        $file->delete();
    }
}
