const PROXY_CONFIG = {
  '/api': {
    target: 'http://hecate-dev.devqa.trustarc-svc.net',
    secure: false,
    changeOrigin: true,
    logLevel: 'debug',
    bypass: function(req, res, proxyOptions) {
      // overwrite 'Origin' HTTP Header value for POST and PUT
      if ('PUT' === req.method || 'POST' === req.method) {
        req.headers['origin'] = 'http://hecate-dev.devqa.trustarc-svc.net';
        console.debug(
          'Have overwritten the Origin HTTP Header value for: ' +
            req.method +
            ' ' +
            req.url
        );
      }
    }
  }
};
module.exports = PROXY_CONFIG;
