const path = require('path');
const CracoLessPlugin = require('craco-less');

module.exports = ({ env }) => {
  const baseURL = 'https://wj.ikeqiao.net';
  return {
    webpack: { alias: { '@src': path.join(__dirname, '/src') } },
    eslint: {
      extends: ['react-app', 'react-app/jest'],
    },
    devServer: {
      port: 3030,
      headers: { 'Access-Control-Allow-Origin': '*' },
      proxy: { '/yh/file': { target: baseURL, changeOrigin: true } },
    },
    plugins: [{ plugin: CracoLessPlugin }],
  };
};
