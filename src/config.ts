export default ({
  service: {
    name: {
      doc: 'Service namespace',
      format: String,
      default: 'pharmacy-interview-test',
      env: 'SERVICE_NAME',
      arg: 'service-name',
    },
    project: {
      doc: 'Parent project namespace',
      format: String,
      default: 'craftturf',
      env: 'PROJECT_NAME',
      arg: 'project-name',
    },
  },
  redis: {
    mode: {
      doc: 'Redis connection mode',
      format: String,
      default: 'regular',
      env: 'REDIS_MODE',
      arg: 'redis-mode',
    },
    options: {
      port: {
        doc: 'Redis connection port',
        format: Number,
        default: 6379,
        env: 'REDIS_PORT',
        arg: 'redis-port',
      },
      host: {
        doc: 'Redis connection host',
        format: String,
        default: 'localhost',
        env: 'REDIS_HOST',
        arg: 'redis-host',
      },
    },
  },
});
