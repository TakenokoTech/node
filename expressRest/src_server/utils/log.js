const _ = require('lodash');
const log4js = require('log4js');
const logger = log4js.getLogger();
logger.level = 'DEBUG';

var isJSON = function(arg) {
    try {
        arg = (typeof arg === "function") ? arg() : arg;
        if (typeof arg  !== "string") return false;
        arg = (!JSON) ? eval("(" + arg + ")") : JSON.parse(arg);
        return true;
    } catch (e) {
        return false;
    }
};

const log = {
    debug:  (...text) => logger.debug(text),
    info:   (...text) => logger.info(text),
    warn:   (...text) => logger.warn(text),
    error:  (...text) => logger.error(text)
}

module.exports = log;