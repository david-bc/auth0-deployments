import fs from 'fs'
import path from 'path'
import _ from 'lodash';
import Settings from './Settings'

const sep = path.sep
const basePath = `${__dirname}${sep}..`;

const getAbsolutePath = (dirs = [], filename) => {
  var p = basePath;
  if (_.isArray(dirs)) {
    _.forEach(dirs, dir => p += sep + dir)
  } else if (_.isString(dirs)) {
    p += sep + dirs
  }
  if (_.isString(filename) && filename.length > 0) {
    p += sep + filename
  }
  return p
}

const baseConfigPath = getAbsolutePath('config');

const listDir = (absolutePath, exclude = []) => {
  return new Promise((resolve, reject) => {
    fs.readdir(absolutePath, (err, items) => {
      resolve(items.filter(item => !exclude.includes(item)))
    });
  });
}

const getConfigDirectories = () => listDir(baseConfigPath)

const getFileContent = (absolutePath) => fs.readFileSync(absolutePath, 'utf8')

const getConfigFilesContent = (filenames) => {
  return filenames
      .map(filename => ({
          name: filename,
          src: getAbsolutePath(['config', filename], filename + '.js'),
          cfg: getAbsolutePath(['config', filename], filename + '.json')
        }))
      .map(f => ({
          src: getFileContent(f.src),
          cfg: JSON.parse(getFileContent(f.cfg))
        }));
}

const processConfigs = (configs) => configs.map(processConfig)

const processConfig = (config) => {
  const p = _.assignIn({}, config.cfg)
  p.options.scripts.fetchUserProfile = config.src
  p.options.client_id = Settings.getSecret(p.options.client_id)
  p.options.client_secret = Settings.getSecret(p.options.client_secret)
  p.enabled_clients = [Settings.getSecret(p.enabled_clients)] // this need to be an array with a single string entry
  config.payload = p;
  return config;
}

const getConfigPayloads = () => {
  return getConfigDirectories()
      .then(filenames => getConfigFilesContent(filenames))
      .then(cfgs => processConfigs(cfgs))
}

export default {
  sep,
  basePath,
  getAbsolutePath,
  listDir,
  getFileContent,
  getConfigPayloads,
}
