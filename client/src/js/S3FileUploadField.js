import { createApp } from 'vue';
import S3Upload from 'src/App.vue';
import watchElement from './util';
import { IconsPlugin } from './icons';

const render = (el) => {
  const app = createApp(S3Upload, {
    payload: JSON.parse(el.dataset.payload)
  });

  app.use(IconsPlugin);

  app.mount(`#${el.id}`);
};

watchElement('.s3-upload-field', (el) => {
  setTimeout(() => {
    render(el);
  }, 1);
});
