// /home/user/projects/evi/src/utils/logger.js
const winston = require('winston');

const logger = winston.createLogger({
  level: 'info',
  format: winston.format.combine(
    winston.format.timestamp(),
    winston.format.errors({ stack: true }),
    winston.format.printf(({ level, message, timestamp, stack }) => {
      return `${timestamp} ${level}: ${stack || message}`;
    })
  ),
  transports: [
    new winston.transports.Console(),
    new winston.transports.File({ filename: '/home/user/projects/evi/logs/error.log', level: 'error' }),
    new winston.transports.File({ filename: '/home/user/projects/evi/logs/combined.log' }),
  ],
});

module.exports = logger;
