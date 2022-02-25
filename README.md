# SilverStripe S3 file upload
Adds a **Level51\S3\S3File** data object and an appropriate uploader.

## Features
- S3UploadField with direct uploads from the browser to S3 - no local file storage needed
- S3File data object, independent from other SilverStripe files

## Config
### Mandatory S3 config
```yaml
Level51\S3:
  AccessId: **********
  Secret: ********************
  bucket: MY_BUCKET_NAME # can also be set per field
```

### Default config
```yaml
Level51\S3:
  default_region: eu-central-1 # default region, can be set per field
  acl: private
  maxFileSize: 512 # default max file size in mb, can be set per field 
  acceptedFiles: # file extension or mime type used as default, can be set per field
    - video/*
    - image/*
```

## Requirements
- SilverStripe ^4.3
- aws-sdk-php ^3.9.1

## Maintainer
- Level51 <hallo@lvl51.de>
