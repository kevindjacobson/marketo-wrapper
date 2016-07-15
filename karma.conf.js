// karma.conf.js
module.exports = function(config) {
  config.set({
    frameworks: ['jasmine'],
    reporters: ['spec'],
    browsers: ['PhantomJS'], 
    files: [
      'globals.js',      
      'node_modules/jquery/dist/jquery.min.js',
      'lib/forms2.js',
      'app.js',
      'spec/*.js'
    ]
  });
};