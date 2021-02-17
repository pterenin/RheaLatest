const { name, version, description } = require('../package.json');
const { resolve } = require('path');
const { writeFileSync } = require('fs-extra');
const timestamp = new Date().toISOString();

const APP_DETAILS = {
  name,
  description,
  version,
  timestamp
};

const CREATE_FILE = resolve(__dirname, '.', 'environments', 'version.ts');

writeFileSync(
  CREATE_FILE,
  `// IMPORTANT: THIS FILE IS AUTO GENERATED! DO NOT MANUALLY EDIT OR CHECKIN!
/* tslint:disable */
export const VERSION = ${JSON.stringify(APP_DETAILS, null, 2)};
/* tslint:enable */
`,
  { encoding: 'utf-8' }
);
