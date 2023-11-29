const winston = require('winston')
const now = new Date().toISOString()
///////////////////////////////////////////////////////



let errLog = winston.createLogger({
    level: 'info',
    format: winston.format.json(),
    transports: [new winston.transports.File({
        filename: `logs/errLogs/${now}.log`
    })],
    
})

let successLog = winston.createLogger({
    level: 'info', 
    format: winston.format.json(),
    transports: [new winston.transports.File({
        filename: `logs/successLogs/${now}.log`
    })]
})


///////////////////////////////////////////////////////
let logger = winston.createLogger({
    level: process.env.LOG_LEVEL || 'info',
    format: winston.format.json(),
    transports: [
        new winston.transports.File({
            filename: `logs/successLogs/${now}.log`
        }), 
        new winston.transports.File({
            filename: `logs/errLogs/${now}.log`, 
            level: 'error'
        })
    ]
})

///////////////////////////////////////////////////////

winston.loggers.add('errorLogger', {
    level: process.env.LOG_LEVEL || 'info',
    defaultMeta: {
        service: 'error-log'
    },
    format: winston.format.json(),
    transports: [
        new winston.transports.File({
            filename: `logs/errLogs/${now}.log`,
        })
    ]
})

winston.loggers.add('successLogger', {
    level: process.env.LOG_LEVEL || 'info',
    defaultMeta: {
        service: 'success-log'
    },
    format: winston.format.json(),
    transports: [
        new winston.transports.File({
            filename: `logs/successLogs/${now}.log`,
        })
    ]
})


//////////////////////////////////////////////////////////

exports.success = successLog
exports.errLog = errLog
exports.logger = logger

