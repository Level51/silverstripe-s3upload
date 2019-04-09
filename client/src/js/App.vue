<template>
  <div class="s3-file-upload-component">
    <vue2-dropzone
      :awss3="aws"
      :options="options"
      :id="payload.id"
      ref="dropzone"
      @vdropzone-s3-upload-error="uploadError"
      @vdropzone-sending="sendingEvent"
      @vdropzone-complete="completeEvent" />
  </div>
</template>

<script>
import vue2Dropzone from 'vue2-dropzone';
import 'vue2-dropzone/dist/vue2Dropzone.min.css';
import qs from 'qs';
import axios from 'axios';

export default {
  props: {
    payload: {
      type: Object,
      required: true
    }
  },
  components: { vue2Dropzone },
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
        url: `${location.origin}/admin/s3`,
        autoProcessQueue: true
      };
    }
  },
  methods: {
    uploadError(errorMessage) {
      // TODO error handling AWS
    },
    completeEvent(response) {
      // Get basic file info
      const data = {
        name: response.name,
        size: response.size,
        type: response.type,
        region: this.payload.settings.region,
        lastModified: response.lastModified
      };

      // Read info from the s3 xml response
      const xml = response.xhr.responseXML;
      Object.values(xml.getElementsByTagName('PostResponse')[0].children).forEach((child) => {
        data[child.tagName] = child.textContent;
      });

      // TODO error handling
      axios.post(
        `${location.origin}/admin/s3/uploaded`,
        data
      ).then((sR) => {
        console.log('server response', sR);
      }).catch((err) => {
        console.log('server error', err);
      });
    }
  }
};
</script>

<style lang="less">
@import "~styles/vars";
/* TODO custom styling */
.s3-file-upload-component {

}
</style>
