# SilverStripe S3 file upload
Adds a **Level51\S3\S3File** data object and an appropriate uploader using dropzone.js.

## Features
- S3UploadField with direct uploads from the browser to S3 - no local file storage needed
- S3File data object, independent from other SilverStripe files

## Config
### Mandatory S3 config
```yaml
Level51\S3\S3:
  AccessId: **********
  Secret: ********************
```

### Default upload field config
```yaml
Level51\S3\S3UploadField:
  region: eu-central-1 # default region, can be set per field
  acl: private
  maxFileSize: 512 # default max file size in mb, can be set per field
  timeout: 60 # default upload timeout in seconds, can be set per field 
  acceptedFiles: # file extension or mime type used as default, can be set per field
    - video/*
    - image/*
```

## Requirements
- SilverStripe ^4.3
- aws-sdk-php ^3.9.1

## Maintainer
- Daniel Kliemsch <dk@lvl51.de>
