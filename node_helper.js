'use strict';

const NodeHelper = require('node_helper');
var async = require('async');
var sys = require('sys');
var exec = require('child_process').exec;

module.exports = NodeHelper.create({
  start: function() {
    console.log('Starting node helper: ' + this.name);
  },

  // Subclass socketNotificationReceived received.
  socketNotificationReceived: function(notification, payload) {
    var self = this;

    if (notification === 'START_SCREENSAVER') {
		this.startScreensaver();
    }
  },

  startScreensaver: function() {
    var self = this;
	var path = "/usr/bin/xscreensaver-command -activate";

    async.parallel([
      async.apply(exec, path)
    ],
    function (err, res) {
    });
  },

});