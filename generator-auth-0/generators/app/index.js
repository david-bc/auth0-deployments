'use strict';
var yeoman = require('yeoman-generator');
var chalk = require('chalk');
var yosay = require('yosay');
var _ = require('lodash');

var VERSION = '0.1.3';

module.exports = yeoman.Base.extend({
  prompting: function () {
    this.log(yosay(
      'Welcome to ' + chalk.blue('BetterCloud\'s') + ' ' + chalk.red('generator-auth-0') + ' generator!'
    ));

    var prompts = [
      {
        type: 'input',
        name: 'name',
        message: 'Connector name?'
      }, {
        type: 'input',
        name: 'provider',
        message: 'Provider name?',
        default: 'google'
      }, {
        type: 'input',
        name: 'authUrl',
        message: 'OAuth authorization URL?'
      }, {
        type: 'input',
        name: 'tokenUrl',
        message: 'OAuth token URL?'
      }, {
        type: 'input',
        name: 'scopes',
        message: 'OAuth scopes?'
      }, {
        type: 'input',
        name: 'clientId',
        message: 'OAuth app client ID?'
      }, {
        type: 'input',
        name: 'clientSecret',
        message: 'OAuth app client secret?'
      }
    ];

    return this.prompt(prompts).then(function (props) {
      // To access props later use this.props.someAnswer;
      this.props = props;
    }.bind(this));
  },

  writing: function () {
    var props = this.props;
    var name = props.name;
    var provider = props.provider;
    this.fs.copyTpl(
      this.templatePath('_script.js'),
      this.destinationPath('config', name, name + '.js'),
      { provider: provider, version: VERSION }
    );
    this.fs.copyTpl(
      this.templatePath('_script.test.js'),
      this.destinationPath('config', name, name + '.test.js'),
      { name: name, provider: provider }
    );
    this.fs.copyTpl(
      this.templatePath('_conf.json'),
      this.destinationPath('config', name, name + '.json'),
      props
    );

    var DEV_SETTINGS_PATH = this.destinationPath('./dev.settings.json');
    console.log("attempting to modify", DEV_SETTINGS_PATH);

    this.fs.copy(DEV_SETTINGS_PATH, DEV_SETTINGS_PATH, {
      process: function(content) {
        var cont;
        if (!_.isNil(content) && _.isFunction(content.toString)) {
          cont = JSON.parse(content.toString())
        } else {
          cont = {};
        }
        var basePropPath = 'core.auth0.' + props.provider + '.client';
        _.set(cont, basePropPath + '.id', props.clientId)
        _.set(cont, basePropPath + '.secret', props.clientSecret)
        return JSON.stringify(cont, null, 2)
      }
    })
  },

  install: function () {
    // this.installDependencies();
  }
});
