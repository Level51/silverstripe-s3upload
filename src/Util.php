<?php

namespace Level51\S3;

use SilverStripe\Core\Config\Config;

/**
 * Util class for s3 specific tasks.
 *
 * @package Level51\S3
 */
class Util
{

    /**
     * @return \SilverStripe\Core\Config\Config_ForClass
     */
    public static function config()
    {
        return Config::forClass('Level51\S3\S3');
    }

    /**
     * @param string $region
     * @param string $bucket
     *
     * @return string
     */
    public static function getBucketUrl($region, $bucket)
    {
        // US general doesn't have its name in the bucket URL
        if ($region == 'us-east-1') {
            $region = '';
        } else {
            $region = "-$region";
        }

        return "https://$bucket.s3$region.amazonaws.com/";
    }
}
