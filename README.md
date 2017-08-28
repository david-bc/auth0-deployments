# Purpose

# Test

Tests are found along side their respective scripts:  `/config/<provider>/<provider>.test.js`

```
npm test
```

# Configuration

Configurations, e.g. `config/slack-login/slack-login.json`, contain property path
inside some properties.

- `options.client_id`
- `options.client_secret`
- `enabled_clients`

Example config:

```
{
  "options": {
    "client_id": "core.auth0.slack.client.id",
    "client_secret": "core.auth0.slack.client.secret",
    "scripts": {
      "fetchUserProfile": null
    },
    "authorizationURL": "https://slack.com/oauth/authorize",
    "tokenURL": "https://slack.com/api/oauth.access",
    "scope": "identity.basic identity.email identity.avatar"
  },
  "strategy": "oauth2",
  "name": "slack-login",
  "enabled_clients": "auth0.clientId",
  "is_domain_connection": false,
  "realms": []
}

```

## Local

These values are pulled from `dev.settings.json`.

Example config file:

```
{
  "core": {
    "auth0": {
      "slack": {
        "client": {
          "id": "asdf-123-qwerty-<slack-client-id>",
          "secret": "asdf-123-qwerty-<slack-client-secret>"
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
