module.exports = {
  apps : [{
    name: 'sp-backend',
    script: 'src/index.js',
    instances: 0,
    exec_mode: 'cluster',
    watch: true,
    log_date_format: 'YYYY-MM-DD HH:mm Z',
    env: {
      NODE_ENV: 'production',
    }
  }]
}
