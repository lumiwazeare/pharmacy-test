module.exports = {
  apps: [
    {
      name: 'dev-pharmacy-interview-test',
      cwd: __dirname,
      script: 'yarn run dev',
      args: '',
      env: {
        NODE_ENV: 'development'
      }
    },
    {
      name: 'acc-pharmacy-interview-test',
      script: 'lib/index.js',
      env: {
        NODE_ENV: 'acceptance'
      }
    },
    {
      name: 'pharmacy-interview-test',
      script: 'lib/index.js',
      env: {
        NODE_ENV: 'production'
      }
    }
  ]
};
