import _ from 'lodash';
import request from 'request'
import fs from 'fs'
import path from 'path'

import Settings from './Settings'
import ManagementApi from './ManagementApi'
import FileService from './FileService'

Settings.init()
  .then(() => Promise.all([
    FileService.getConfigPayloads(),
    ManagementApi.init(),
  ]))
  .then((resolutions) => {
    const configs = resolutions[0]
    return Promise.all(configs.map(cfg => ManagementApi.upsertConfig(cfg)))
  })
  .then(
    successResolutions => successResolutions.forEach(resolution => console.log(resolution.name, ' => ', JSON.stringify(resolution))),
    failureResolutions => failureResolutions.forEach(resolution => console.log(resolution.name, ' => ', JSON.stringify(resolution)))
  )
