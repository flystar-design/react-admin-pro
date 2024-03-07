import * as AxiosLogger from 'axios-logger';

AxiosLogger.setGlobalConfig({
  prefixText: 'ADMIN',
  dateFormat: 'HH:MM:ss',
  status: true,
  headers: false,
  logger: console.log.bind(this)
});

export default AxiosLogger;
