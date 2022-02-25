[2.0.0] - 2022-02-25
### Changed
- Full refactor for PHP > 7.4 with a new upload process using [filepond](https://pqina.nl/filepond/)

[0.1.2] - 2021-12-01
### Added
- Methods to use the s3 client outside of the module

[0.1.1] - 2021-11-30
### Added
- getObjectUrl method

### Changed
- PHP Code reformat
- Update npm dependencies
- Update carbon dependency

[0.1.0] - 2019-06-06
### Added
- @babel/polyfill for IE support
- webpack production config used for dist builds

### Changed
- parse S3 XML response on the server side for IE support
- Use v3.5.2 of vue2-dropzone for IE support
- Updated routes config to fix a interference with default admin/graphql route

### Fixed
- "indexOf" of "null" error if the file type is unknown
- isset checks for file information which depends on the used browser
