'use strict';
var yeoman = require('yeoman-generator');
var chalk = require('chalk');
var yosay = require('yosay');

var VERSION = '0.1.1';

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
      }
    ];

    return this.prompt(prompts).then(function (props) {
      // To access props later use this.props.someAnswer;
      this.props = props;
    }.bind(this));
  },

  writing: function () {
    var name = this.props.name;
    this.fs.copyTpl(
      this.templatePath('_script.js'),
      this.destinationPath('config', name, name + '.js'),
      { name: name, version: VERSION }
    );
    this.fs.copyTpl(
      this.templatePath('_script.test.js'),
      this.destinationPath('config', name, name + '.test.js'),
      { name: name }
    );
    this.fs.copyTpl(
      this.templatePath('_conf.json'),
      this.destinationPath('config', name, name + '.json'),
      this.props
    );
  },

  install: function () {
    // this.installDependencies();
  }
});
