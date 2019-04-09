import Vue from 'vue';
import { library } from '@fortawesome/fontawesome-svg-core';
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome';

import { faVideo, faFileVideo, faFile } from '@fortawesome/free-solid-svg-icons';

library.add(faVideo, faFileVideo, faFile);

Vue.component('fa-icon', FontAwesomeIcon);
