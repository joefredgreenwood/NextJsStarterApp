import { createLogger, format, transports } from "winston";
import "winston-daily-rotate-file";

const getLogger = (fileName = "application") => {
  const fileLogTransport = new transports.DailyRotateFile({
    filename: `logs/${fileName}-%DATE%.log`,
    datePattern: "YYYY-MM-DD",
    zippedArchive: true,
    maxFiles: "30d",
    maxSize: "20m",
  });

  const consoleTransport = new transports.Console({
    level: process.env.LOG_LEVEL,
    handleExceptions: false,
    format: format.printf((i) => String(i.message)),
  });

  const logger = createLogger({
    level: "info",
    format: format.combine(
      format.timestamp({
        format: "YYYY-MM-DD HH:mm:ss",
      }),
      format.errors({ stack: true }),
      format.splat(),
      format.printf(
        ({ level, message, label = process.env.NODE_ENV, timestamp }) =>
          `${timestamp} [${label}] ${level} ${message}`
      )
    ),
    defaultMeta: { service: "my-app" },
    transports: consoleTransport,
  });

  if (process.env.LOCAL_DEV === "true") {
    logger.add(fileLogTransport);
  }

  return logger;
};

export default getLogger();
