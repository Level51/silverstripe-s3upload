<script setup>
import { ref, computed } from 'vue';
import vueFilePond from 'vue-filepond';
import 'filepond/dist/filepond.min.css';
import FilePondPluginFileValidateType from 'filepond-plugin-file-validate-type';
import FilePondPluginFileValidateSize from 'filepond-plugin-file-validate-size';
import axios from 'axios';
import qs from 'qs';

const FilePond = vueFilePond(FilePondPluginFileValidateType, FilePondPluginFileValidateSize);

const props = defineProps({
  payload: {
    type: Object,
    required: true,
  },
});

const files = ref(props.payload.files || []);
const maxFileSize = computed(() => (props.payload?.uploaderOptions?.maxFilesize ? `${props.payload.uploaderOptions.maxFilesize}MB` : null));
const maxFiles = computed(() => props.payload?.uploaderOptions?.maxFiles ?? null);
const allowMultiple = computed(() => props.payload?.uploaderOptions?.allowMultiple ?? false);

const isReadonly = computed(() => props.payload?.readonly ?? false);

const showUploader = computed(() => {
  if (isReadonly.value) {
    return false;
  }

  if (allowMultiple.value) {
    if (maxFiles.value !== null) {
      return files.value?.length < maxFiles.value;
    }
    return true;
  }
  return files.value?.length === 0;
});

const showFileList = computed(() => {
  if (allowMultiple.value) {
    return true;
  }
  return !showUploader.value;
});

const processUpload = async (file, metadata, load, error, progress, requestController) => {
  try {
    const presignedUrlParams = {
      ...props.payload.settings,
      file: {
        name: file.name,
        type: file.type,
      }
    };

    const presignedUrl = (await axios.post(`${location.origin}/admin/s3/sign?${qs.stringify(presignedUrlParams)}`, null, {
      signal: requestController.signal,
    })).data;

    await axios.put(presignedUrl, file, {
      headers: {
        'Content-Type': file.type
      },
      signal: requestController.signal,
      onUploadProgress: (progressEvent) => {
        progress(true, progressEvent.loaded, progressEvent.total);
      }
    });

    const { bucket } = props.payload.settings;

    // Get the file key
    const urlParts = (new URL(presignedUrl)).pathname.slice(1).split('/');

    // Remove the bucket name from the key if the path style syntax is active
    if (props.payload.settings.usePathStyleEndpoint) {
      urlParts.shift();
    }

    const key = urlParts.join('/');

    const fileData = {
      name: file.name,
      size: file.size,
      type: file.type,
      region: props.payload.settings.region,
      lastModified: file.lastModified,
      customPayload: props.payload.customPayload,
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

    files.value.push(fileCreateResponse.data);
    load();
  } catch (e) {
    if (e?.response?.data && typeof e.response.data === 'string') {
      error(e.response.data);
    } else {
      error(e.message);
    }
  }
};

const filepondServerConfig = computed(() => ({
  // eslint-disable-next-line no-unused-vars
  process: (fieldName, file, metadata, load, error, progress, abort, transfer, options) => {
    const requestController = new AbortController();

    processUpload(file, metadata, load, error, progress, requestController);

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
}));

const getIconClass = (file) => {
  if (!file) return null;
  const { type } = file;

  if (type && type.indexOf('video') > -1) return 'file-video';

  if (type && type.indexOf('image') > -1) return 'file-image';

  return 'file';
};

const removeFile = (file) => {
  if (isReadonly.value) {
    return;
  }

  axios.post(
    `${location.origin}/admin/s3/remove/${file.id}`,
    {
      customPayload: props.payload.customPayload
    }
  ).then(() => {
    files.value = files.value.filter((f) => f.id !== file.id);
  });
};

const handleFileTypeDetection = (source, type) => new Promise((resolve) => {
  // Try to manually detect the proper file type in case the browser failed
  if (!type) {
    if (typeof source.name === 'string') {
      const extension = source.name.split('.').pop();

      if (extension) {
        // TODO check for further cases
        switch (extension) {
          case 'psd':
            resolve('image/vnd.adobe.photoshop');
            break;
          default:
            resolve(type);
        }
      }
    }
  }

  resolve(type);
});
</script>

<template>
  <div class="s3-file-upload-component">
    <file-pond
      v-if="showUploader"
      :name="payload.name + '-filepond'"
      :class="{ 'mb-4': showFileList }"
      lable-idle="Drop files here to upload"
      :allow-multiple="allowMultiple"
      :allow-file-type-validation="payload.uploaderOptions.validateFileType"
      :accepted-file-types="payload.uploaderOptions.acceptedFiles"
      :file-validate-type-detect-type="handleFileTypeDetection"
      :server="filepondServerConfig"
      :max-file-size="maxFileSize"
      :max-files="maxFiles"
    />

    <div
      v-if="showFileList">
      <div
        v-for="file of files"
        :key="file.id"
        :class="{ 'mt-2': files.length > 1 }"
        class="s3-file-upload-preview">
        <div
          class="s3-file-upload-preview-icon"
          v-if="getIconClass(file)">
          <fa-icon :icon="['fas', getIconClass(file)]" />
        </div>

        <div class="s3-file-upload-preview-info fill-height flexbox-area-grow">
          <div class="s3-file-upload-meta">
            <a
              :href="file.presignedUrl ?? file.location"
              target="_blank">
              {{ file.name }}
            </a>
            <span class="s3-file-upload-muted">
              {{ file.size }}
            </span>
          </div>
        </div>

        <button
          v-if="!isReadonly"
          class="btn uploadfield-item__remove-btn btn-secondary btn--no-text font-icon-cancel btn--icon-md"
          @click.prevent="removeFile(file)" />
      </div>
    </div>

    <input
      v-if="!allowMultiple"
      type="hidden"
      :id="payload.id"
      :name="payload.name"
      :value="files[0]?.id ?? null">

    <template v-else>
      <input
        v-for="file of files"
        type="hidden"
        :name="payload.name + '[]'"
        :value="file.id">
    </template>
  </div>
</template>

<style lang="less">
@import "../styles/vars";

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
