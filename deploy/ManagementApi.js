import _ from 'lodash';
import request from 'request'
import Settings from './Settings'

const configCache = {};

const obtainToken = () => {
  const domain = Settings.getSecret('auth0.domain')
  const clientId = Settings.getSecret('auth0.api.clientId')
  const clientSecret = Settings.getSecret('auth0.api.clientSecret')
  var options = {
    method: 'POST',
    url: `https://${domain}/oauth/token`,
    headers: { 'content-type': 'application/json' },
    body: JSON.stringify({
      client_id: clientId,
      client_secret: clientSecret,
      audience: `https://${domain}/api/v2/`,
      grant_type: "client_credentials"
    })
  };

  return new Promise((resolve, reject) => {
    request(options, function (error, response, body) {
      if (error) throw new Error(error);

      var payload = JSON.parse(body);

      Settings.setValue('auth0.api.accessToken', payload.access_token)
      resolve(payload.access_token)
    });
  })
}

function cacheAllConfigs() {
  return new Promise((resolve, reject) => {
    const domain = Settings.getSecret('auth0.domain')
    const options = {
      method: 'GET',
      url: `https://${domain}/api/v2/connections`,
      headers: {
        'content-type': 'application/json',
        'Authorization': 'Bearer ' + Settings.getSecret('auth0.api.accessToken')
      },
    }
    request(options, (error, response, body) => {
      if (error) reject(error);

      const configs = JSON.parse(body);
      if (_.isArray(configs)) {
        configs.forEach(cfg => configCache[cfg.name] = cfg)
      } else {
        reject('invalid response: ')
      }

      resolve();
    })
  })
}

function init() {
  return obtainToken().then(cacheAllConfigs)
}

function getCurrentConfig(config) {
  return configCache[config.cfg.name]
}

function createConfig(config) {
  return new Promise((resolve, reject) => {
    const domain = Settings.getSecret('auth0.domain')
    const requestBody = JSON.stringify(config.payload);
    const tkn = Settings.getSecret('auth0.api.accessToken')
    const options = {
      method: 'POST',
      url: `https://${domain}/api/v2/connections`,
      headers: {
        'content-type': 'application/json',
        'Authorization': 'Bearer ' + tkn
      },
      body: requestBody
    }
    request(options, (error, response, body) => {
      if (error) reject(error);

      body = JSON.parse(body);

      resolve(body);
    })
  })
}

function updateConfig(config, id) {
  return new Promise((resolve, reject) => {
    const domain = Settings.getSecret('auth0.domain')
    const options = {
      method: 'PATCH',
      url: `https://${domain}/api/v2/connections/${id}`,
      headers: {
        'content-type': 'application/json',
        'Authorization': 'Bearer ' + Settings.getSecret('auth0.api.accessToken')
      },
      body: JSON.stringify({
        options: config.payload.options
      })
    }
    request(options, (error, response, body) => {
      if (error) reject(error);

      body = JSON.parse(body);

      resolve(body);
    })
  })
}

function upsertConfig(config) {
  return new Promise((resolve, reject) => {
    if (!_.isPlainObject(config) || !_.isPlainObject(config.payload)) {
      reject({
        outcome: 'FAILURE',
        method: 'VALIDATION',
        id: null,
        name: _.defaultTo(config, { cfg: { name: null } }).cfg.name,
        errors: ['Invalid config, or config payload'],
      })
    }
    resolve()
  })
  .then(() => {
    const curr = getCurrentConfig(config);
    // TODO: possible to add deployment version to options?
    return new Promise((resolve, reject) => {
      if (_.isNil(curr)) {
        createConfig(config).then(
          newConfig => resolve({
            outcome: 'SUCCESS',
            method: 'CREATE',
            id: newConfig.id,
            name: newConfig.name,
            errors: []
          }),
          err => reject({
            outcome: 'FAILURE',
            method: 'CREATE',
            id: null,
            name: config.cfg.name,
            errors: []
          })
        );
      } else {
        const expected = _.cloneDeep(curr);
        const actual = _.cloneDeep(config.payload);
        actual.id = expected.id
        delete expected.options
        delete actual.options
        if (!_.isEqual(expected, actual)) {
          console.log(JSON.stringify(expected));
          console.log(JSON.stringify(actual));
          reject({
            outcome: 'FAILURE',
            method: 'VALIDATION',
            id: expected.id,
            name: expected.name,
            errors: ['Attempting to modify invalid field']
          })
        } else {
          updateConfig(config, curr.id).then(
            (savedConfig) => resolve({
                outcome: 'SUCCESS',
                method: 'UPDATE',
                id: savedConfig.id,
                name: savedConfig.name,
                errors: []
              }),
            (saveError) => resolve({
                outcome: 'FAILURE',
                method: 'UPDATE',
                id: expected.id,
                name: config.name,
                errors: [saveError]
              })
          )
        }
      }
    })
  })
}

export default {
  init,
  getCurrentConfig,
  upsertConfig,
}
