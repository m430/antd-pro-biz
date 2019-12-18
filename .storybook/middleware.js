const proxy = require('http-proxy-middleware')

module.exports = function expressMiddleware(router) {
  router.use('/api', proxy({
    target: 'http://dev.mxsic.cn:18081/',
    // target: 'http://oms.magpiee.com.cn:28081',
    changeOrigin: true
  }));

  router.use('/files', proxy({
    target: 'http://oms.magpiee.com.cn:28080',
    changeOrigin: true
  }))
}