<template>
  <div class="s3-file-upload-component">
    <div
      v-if="message"
      class="message"
      :class="[message.type]">
      {{ message.message }}
    </div>

    <template v-if="!file">
      <vue2-dropzone
        :awss3="aws"
        :options="options"
        :id="`dropzone-${payload.id}`"
        ref="dropzone"
        @vdropzone-file-added="fileAdded"
        @vdropzone-s3-upload-error="uploadError"
        @vdropzone-success="successEvent"
        @vdropzone-error="errorEvent" />
    </template>

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
import vue2Dropzone from 'vue2-dropzone';
import qs from 'qs';
import axios from 'axios';
import 'src/icons';

export default {
  props: {
    payload: {
      type: Object,
      required: true
    }
  },
  data() {
    return {
      file: null,
      message: null,
      processTimeout: null
    };
  },
  components: { vue2Dropzone },
  created() {
    if (this.payload.file) this.file = this.payload.file;
  },
  computed: {
    aws() {
      const vm = this;
      return {
        signingURL(file) {
          const settings = {
            ...vm.payload.settings,
            file: {
              name: file.name,
              type: file.type
            }
          };

          return `${location.origin}/admin/s3/sign?${qs.stringify(settings)}`;
        },
        sendFileToServer: false
      };
    },
    options() {
      return {
        ...this.payload.dropzoneOptions,
        url: `${location.origin}/admin/s3`,
        maxFiles: 1,
        autoProcessQueue: false
      };
    },
    value() {
      return this.file ? this.file.id : 0;
    },
    iconClass() {
      if (!this.file) return null;
      const { type } = this.file;

      if (type.indexOf('video') > -1) return 'file-video';

      return 'file';
    }
  },
  methods: {
    uploadError(message) {
      this.message = {
        type: 'error',
        message
      };
    },
    successEvent(file) {
      // Get basic file info
      const data = {
        name: file.name,
        size: file.size,
        type: file.type,
        region: this.payload.settings.region,
        lastModified: file.lastModified
      };

      // Read info from the s3 xml response
      const xml = file.xhr.responseXML;
      Object.values(xml.getElementsByTagName('PostResponse')[0].children).forEach((child) => {
        data[child.tagName] = child.textContent;
      });

      axios.post(
        `${location.origin}/admin/s3/uploaded`,
        data
      ).then((sR) => {
        this.file = sR.data;
      }).catch((err) => {
        // TODO error handling
        console.warn('server error', err);
      });
    },
    removeFile() {
      axios.delete(
        `${location.origin}/admin/s3/remove/${this.file.id}`
      ).then((response) => {
        this.file = null;
      });
    },
    handleUpload() {
      this.processTimeout = setTimeout(() => {
        this.$refs.dropzone.processQueue();
      }, 100);
    },
    fileAdded() {
      this.message = null;
      this.handleUpload();
    },
    errorEvent(file, message, xhr) {
      this.message = {
        type: 'error',
        message
      };

      if (xhr) console.log(xhr);

      this.$refs.dropzone.removeAllFiles();
      clearTimeout(this.processTimeout);
    }
  }
};
</script>

<style lang="less">
@import "~styles/vars";

.s3-file-upload-component {
  .s3-file-upload-muted {
    color: @color-mono-50;
  }

  .s3-file-upload-message {
    width: 100%;
    padding: @space-1;
    border: 1px solid;

    &.s3-file-upload-message-error {
      border-color: @color-error;
    }
  }

  .vue-dropzone {
    border: 2px dashed @color-border;
    border-radius: @border-radius;
    background: @color-mono-100;
    padding: @space-2;
    height: 68px;
    display: flex;
    justify-content: center;
    align-items: center;

    &.dz-clickable {
      cursor: pointer;
    }

    &.dz-drag-hover {
      box-shadow: 0 0 10px inset @color-border;
    }

    &.dz-started {
      .dz-message {
        display: none;
      }
    }

    .dz-preview {
      .dz-image, .dz-success-mark, .dz-error-mark {
        display: none;
      }
      .dz-details {
        display: flex;

        .dz-size {
          margin-right: @space-2;
        }
      }
      .dz-progress {
        width: 100%;
        height: 5px;
        position: relative;

        .dz-upload {
          position: absolute;
          top: 0;
          left: 0;
          background: @color-success;
          height: 100%;
        }
      }
    }
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
