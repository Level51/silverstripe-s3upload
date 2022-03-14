<?php

namespace Level51\S3;

use SilverStripe\Control\Controller;
use SilverStripe\Core\Config\Config;
use SilverStripe\Core\Config\Config_ForClass;
use SilverStripe\Core\Convert;

/**
 * Util class for s3 specific tasks.
 *
 * @package Level51\S3
 */
class Util
{
    /**
     * @return Config_ForClass
     */
    public static function config(): Config_ForClass
    {
        return Config::forClass('Level51\S3');
    }

    /**
     * @param string $region
     * @param string $bucket
     *
     * @return string
     */
    public static function getBucketUrl(string $region, string $bucket): string
    {
        // US general doesn't have its name in the bucket URL
        if ($region == 'us-east-1') {
            $region = '';
        } else {
            $region = ".$region";
        }

        $host = 'amazonaws.com';
        $protocol = 'https';
        $usePathStyleSyntax = false;

        if ($clientOptions = self::config()->get('client_options')) {
            if (isset($clientOptions['endpoint'])) {
                $urlParts = parse_url($clientOptions['endpoint']);

                if (isset($urlParts['scheme'])) {
                    $protocol = $urlParts['scheme'];
                }

                if (isset($urlParts['host'])) {
                    $host = $urlParts['host'];

                    if (isset($urlParts['port'])) {
                        $host .= ':' . $urlParts['port'];
                    }
                }
            }

            if (isset($clientOptions['use_path_style_endpoint']) && $clientOptions['use_path_style_endpoint'] === true) {
                $usePathStyleSyntax = true;
            }
        }

        if ($usePathStyleSyntax) {
            return "$protocol://s3$region.$host/$bucket";
        }

        return "$protocol://$bucket.s3$region.$host/";
    }

    public static function sanitizeKey(string $fileName, ?string $folder = null): string
    {
        // Remove slashes
        $result = str_replace('/', '', $fileName);

        // Append a unique id
        $pathinfo = pathinfo($result);
        $result = $pathinfo['filename'] . '_' . uniqid();

        // Convert to valid url
        $result = Convert::raw2url($result);

        // Re-add extension if known
        if (isset($pathinfo['extension'])) {
            $result .= '.' . $pathinfo['extension'];
        }

        // Prepend folder
        if ($folder) {
            $result = Controller::join_links($folder, $result);
        }

        // Trim leading/trailing spaces
        $result = trim($result);

        return $result;
    }
}
