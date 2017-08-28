# Purpose

# Test

Tests are found along side their respective scripts:  `/config/<provider>/<provider>.test.js`

```shell
npm test
```

# Configuration

Configurations, e.g. `config/slack-login/slack-login.json`, contain property path
inside some properties.

- `options.client_id`
- `options.client_secret`
- `enabled_clients`

Example config:

```javascript
{
  "options": {
    "client_id": "core.auth0.slack.client.id",          // config
    "client_secret": "core.auth0.slack.client.secret",  // config
    "scripts": {
      "fetchUserProfile": null
    },
    "authorizationURL": "https://slack.com/oauth/authorize",
    "tokenURL": "https://slack.com/api/oauth.access",
    "scope": "identity.basic identity.email identity.avatar"
  },
  "strategy": "oauth2",
  "name": "slack-login",
  "enabled_clients": "auth0.clientId",                   // config
  "is_domain_connection": false,
  "realms": []
}

```

## Local

These values are pulled from `dev.settings.json`.

Example config file:

```javascript
{
  "core": {
    "auth0": {
      "slack": {
        "client": {
          "id": "asdf-123-qwerty-<slack-client-id>",          // populated by yo
          "secret": "asdf-123-qwerty-<slack-client-secret>"   // populated by yo
        }
      },
      "google": {
        "client": {
          "id": "asdf-123-qwerty-<google-client-id>",
          "secret": "asdf-123-qwerty-<google-client-secret>"
        }
      },
      "azure": {
        "client": {
          "id": "asdf-123-qwerty-<azure-client-id>",
          "secret": "asdf-123-qwerty-<azure-client-secret>"
        }
      },
      "salesforce": {
        "client": {
          "id": "asdf-123-qwerty-<salesforce-client-id>",
          "secret": "asdf-123-qwerty-<salesforce-client-secret>"
        }
      }
    }
  },
  "auth0": {
    "api": {
      "clientId": "asdf-1234-qwerty-<auth0-api-client-id>",
      "clientSecret": "asdf-1234-qwerty-<auth0-api-client-secret>"
    },
    "clientId": "asdf-1234-qwerty-<auth0-client-id>",
    "domain": "my-a0-domain.auth0.com"
  }
}
```

### Auth Client

- `auth0.clientId`
- `auth0.domain`

![](/assets/client01-min.png)

![](/assets/client02-min.png)

### Deployment Client

- `auth0.api.clientId`
- `auth0.api.clientSecret`

![](/assets/deployment01-min.png)

![](/assets/deployment02-min.png)

![](/assets/deployment03-min.png)

![](/assets/deployment04-min.png)


## Deployed: Non-Prod and Production

TODO: Setup

TODO: Vault

# Deployment

```
npm run deploy
```

# Development

Using the yeoman generator is high recommended:

```
yo auth-0
```

## Setup

```
# setup development env
npm i

# setup yeoman
npm i -g yo

# setup generator
cd generator-auth-0; npm i; npm link; cd ..;

```
