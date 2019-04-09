import Vue from 'vue';
import S3Upload from 'src/App.vue';
import watchElement from './util';

const render = (el) => {
  new Vue({
    render(h) {
      return h(S3Upload, { props: { payload: JSON.parse(el.dataset.payload) } });
    }
  }).$mount(`#${el.id}`);
};

watchElement('.s3-upload-field', (el) => {
  setTimeout(() => {
    render(el);
  }, 1);
});
