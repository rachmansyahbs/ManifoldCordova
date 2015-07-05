#!/usr/bin/env node

var logger = {
  log: function () {
    if (process.env.NODE_ENV !== 'test') {
      console.log.apply(this, arguments)
    }
  }
};

module.exports = function (context) {
  var fs = context.requireCordovaModule('fs'),
      path = context.requireCordovaModule('path'),
      os = context.requireCordovaModule('os'),
      deferral = context.requireCordovaModule('q').defer();

  // fix permissions only when running in OS X
  if (os.platform() !== 'darwin') {
    return;
  }
    
  logger.log('Restoring script permissions...');
  var scriptPath = path.resolve(context.opts.projectRoot, 'platforms', 'ios', 'cordova', 'lib', 'copy-www-build-step.sh');
  fs.chmod(scriptPath, 0744, function (err) {
    if (err && err.code !== 'ENOENT') {
      logger.log('Failed to restore script permissions!');
      deferral.reject(err);
    } else {
      deferral.resolve();
    }
         
  });
    
  return deferral.promise;
}

