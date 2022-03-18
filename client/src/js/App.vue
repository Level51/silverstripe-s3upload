<template>
  <div class="s3-file-upload-component">
    <file-pond
      v-if="!file"
      :name="payload.name"
      lable-idle="Drop files here to upload"
      :allow-multiple="false"
      :allow-file-type-validation="payload.uploaderOptions.validateFileType"
      :accepted-file-types="payload.uploaderOptions.acceptedFiles"
      :server="filepondServerConfig"
      :max-file-size="maxFileSize"
    />

    <div
      v-else
      class="s3-file-upload-preview">
      <div
        class="s3-file-upload-preview-icon"
        v-if="iconClass">
        <fa-icon :icon="['fas', iconClass]" />
      </div>

      <div class="s3-file-upload-preview-info fill-height flexbox-area-grow">
        <div class="s3-file-upload-meta">
          <a
            :href="file.location"
            target="_blank">
            {{ file.name }}
          </a>
          <span class="s3-file-upload-muted">
            {{ file.size }}
          </span>
        </div>
      </div>

      <button
        class="btn uploadfield-item__remove-btn btn-secondary btn--no-text font-icon-cancel btn--icon-md"
        @click.prevent="removeFile" />
    </div>

    <input
      type="hidden"
      :id="payload.id"
      :name="payload.name"
      :value="value">
  </div>
</template>

<script>
import vueFilePond from 'vue-filepond';
import 'filepond/dist/filepond.min.css';
import FilePondPluginFileValidateType from 'filepond-plugin-file-validate-type';
import FilePondPluginFileValidateSize from 'filepond-plugin-file-validate-size';
import axios from 'axios';
import qs from 'qs';
import 'src/icons';

const FilePond = vueFilePond(FilePondPluginFileValidateType, FilePondPluginFileValidateSize);

export default {
  props: {
    payload: {
      type: Object,
      required: true,
    },
  },
  data() {
    return {
      file: null,
    };
  },
  components: { FilePond },
  created() {
    if (this.payload.file) this.file = this.payload.file;
  },
  computed: {
    value() {
      return this.file ? this.file.id : 0;
    },
    iconClass() {
      if (!this.file) return null;
      const { type } = this.file;

      if (type && type.indexOf('video') > -1) return 'file-video';

      return 'file';
    },
    filepondServerConfig() {
      return {
        process: (fieldName, file, metadata, load, error, progress, abort, transfer, options) => {
          const requestController = new AbortController();

          this.process(file, metadata, load, error, progress, requestController);

          return {
            abort: () => {
              requestController.abort();
              abort();
            }
          };
        },
        revert: null,
        restore: null,
        load: null,
        fetch: null,
      };
    },
    maxFileSize() {
      return this.payload?.uploaderOptions?.maxFilesize ? `${this.payload.uploaderOptions.maxFilesize}MB` : null;
    }
  },
  methods: {
    async process(file, metadata, load, error, progress, requestController) {
      try {
        const presignedUrlParams = {
          ...this.payload.settings,
          file: {
            name: file.name,
            type: file.type,
          }
        };

        const presignedUrl = (await axios.post(`${location.origin}/admin/s3/sign?${qs.stringify(presignedUrlParams)}`, null, {
          signal: requestController.signal,
        })).data;

        const awsResponse = await axios.put(presignedUrl, file, {
          headers: {
            'Content-Type': file.type
          },
          signal: requestController.signal,
          onUploadProgress: (progressEvent) => {
            progress(true, progressEvent.loaded, progressEvent.total);
          }
        });

        const bucket = this.payload.settings.bucket;

        // Get the file key
        const urlParts = (new URL(presignedUrl)).pathname.slice(1).split('/');

        // Remove the bucket name from the key if the path style syntax is active
        if (this.payload.settings.usePathStyleEndpoint) {
          urlParts.shift();
        }

        const key = urlParts.join('/');

        const fileData = {
          name: file.name,
          size: file.size,
          type: file.type,
          region: this.payload.settings.region,
          lastModified: file.lastModified,
          customPayload: this.payload.customPayload,
          bucket,
          key,
        };

        const fileCreateResponse = await axios.post(
          `${location.origin}/admin/s3/uploaded`,
          fileData,
          {
            signal: requestController.signal,
          }
        );

        this.file = fileCreateResponse.data;
        load();
      } catch (e) {
        if (e?.response?.data && typeof e.response.data === 'string') {
          error(e.response.data);
        } else {
          error(e.message);
        }
      }
    },
    removeFile() {
      axios.post(
        `${location.origin}/admin/s3/remove/${this.file.id}`,
        {
          customPayload: this.payload.customPayload
        }
      ).then((response) => {
        this.file = null;
      });
    },
  }
};
</script>

<style lang="less">
@import "~styles/vars";

.s3-file-upload-component {
  .s3-file-upload-muted {
    color: @color-mono-50;
  }

  .s3-file-upload-preview {
    background: @color-mono-100;
    border: 1px solid @color-border;
    display: flex;
    align-items: center;
    border-radius: @border-radius;
    padding: @space-2;

    .s3-file-upload-preview-icon {
      margin-right: @space-4;
      font-size: 30px;
    }
  }
}
</style>
