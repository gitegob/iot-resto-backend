import { utilities } from 'nest-winston';
import { format, transports } from 'winston';

export default {
  levels: {
    error: 0,
    warn: 1,
    verbose: 3,
    info: 4,
    debug: 5,
    silly: 6,
  },
  format: format.combine(
    format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
    format.printf(
      (entry) => `${entry.timestamp} ${entry.level}: ${entry.message}`,
    ),
    format.colorize({ all: true }),
  ),
  transports: [
    new transports.File({
      filename: 'logs/errors.log',
      level: 'error',
    }),
    new transports.File({
      filename: 'logs/traffic.log',
      level: 'verbose',
    }),
    new transports.Console({
      format: format.combine(format.timestamp(), utilities.format.nestLike()),
      level: 'info',
    }),
  ],
  rejectionHandlers: [
    new transports.File({ filename: 'logs/exceptions-rejections.log' }),
  ],
};
