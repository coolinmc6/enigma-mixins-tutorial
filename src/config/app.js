import enigma from 'enigma.js';
const schema = require('enigma.js/schemas/12.170.2.json');
const SenseUtilities = require('enigma.js/sense-utilities');
import { docMixin, objectMixin, objectMixin2 } from './mixins';

const config = {
  host: 'sense-demo.qlik.com',
  secure: true,
  port: 443,
  prefix: '',
  appId: '372cbc85-f7fb-4db6-a620-9a5367845dce', // Consumer Sales
};

const url = SenseUtilities.buildUrl(config);

export default enigma.create({ 
  schema, url, mixins: [docMixin, objectMixin, objectMixin2]
}).open().then(global => global.openDoc(config.appId));