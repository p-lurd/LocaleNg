const winston = require('winston');
const logger = winston.createLogger({
    format: winston.format.json(),
    transports: [
        new winston.transports.File({filename: 'combined.log'})
    ]
});
exports={logger};