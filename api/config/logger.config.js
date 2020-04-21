import * as winston from 'winston';
import * as winston_rotate from 'winston-daily-rotate-file';
import * as fs from 'fs';
import settings from '../settings';
let config = require('./' + settings.environment + '.config');

const logs = config.default.logs;
const logDir = logs.path;

if (!fs.existsSync(logDir)) {
    fs.mkdirSync(logDir);
}

let logger = new winston.Logger({
    level: 'info',
    transports: [
        new (winston.transports.Console)({
            colorize: true
        }),
        new winston.transports.DailyRotateFile({
            filename: logs.file_name,
            dirname: logs.path,
            mazsize: 1024 * 1024 * 20, //20 MB,
            maxFiles: 25,
            datePattern: '.dd-MM-yyyy'
        })
    ]
});

export default logger;