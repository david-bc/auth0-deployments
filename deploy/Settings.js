import _ from 'lodash';
import path from 'path'
import fs from 'fs'

import FileService from './FileService'

const _s = {};

const isLocal = () => !!_s.local

const init = () => {
  _.assignIn(_s, {
    local: !!process.env.BC_DEV_LOCAL,
    auth0: {
      api: {
        clientId: 'get from vault',
        clientSecret: 'get from vault',
      },
      clientId: 'get from vault',
      domain: 'get from settings',
    }
  });

  if (isLocal()) {
    const configPath = FileService.getAbsolutePath(null, 'dev.settings.json');
    const rawDevSettings = FileService.getFileContent(configPath);
    _.assignIn(_s, JSON.parse(rawDevSettings));
  }

  return new Promise(function(resolve, reject) {
    resolve()
  })
};

const getSecret = (key) => {
  if (isLocal()) {
    return _.get(_s, key);
  } else {
    // TODO: vault
  }
  return null;
}

const setValue = (key, value) => _.set(_s, key, value)

const toString = () => JSON.stringify(_s, null, 2)

export default {
  isLocal,
  init,
  getSecret,
  setValue,
  toString
}
