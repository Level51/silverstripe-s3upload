import { library } from '@fortawesome/fontawesome-svg-core';
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome';

import { faFile, faFileImage, faFileVideo, faVideo } from '@fortawesome/free-solid-svg-icons';

library.add(faFile, faFileImage, faFileVideo, faVideo);

export function IconsPlugin(app) {
  app.component('fa-icon', FontAwesomeIcon);
}
