const fs = require("fs")
const path = require("path")
const util = require("util")
const colors = require("colors")

const logFilePath = path.join(__dirname, "logs.txt")
const logStream = fs.createWriteStream(logFilePath, { flags: "a" })

const ansiRegex = /[\u001b\u009b][[()#;?]?[0-9]{1,4}(?:;[0-9]{0,4})?[0-9A-ORZcf-nqry=><]/g;

function stripAnsi(str) {
    return str.replace(ansiRegex, "");
}

function formatLog(level, ...args) {
    const processedArgs = args.map(arg => {
        if (typeof arg === 'function') {
            return '';
        }
        return arg;
    });
    const msg = processedArgs.length > 0 ? util.format(...processedArgs) : '';
    const timestamp = new Date().toISOString()
    return `${timestamp} [${level}] ${stripAnsi(msg)}\n`
}

const originalLog = console.log
const originalError = console.error
const originalWarn = console.warn

console.log = (...args) => {
    logStream.write(formatLog("LOG", ...args))
    originalLog.apply(console, args)
}

console.error = (...args) => {
    logStream.write(formatLog("ERROR", ...args))
    originalError.apply(console, args)
}

console.warn = (...args) => {
    logStream.write(formatLog("WARN", ...args))
    originalWarn.apply(console, args)
}

console.log(`${'o'.green} Logger iniciado com sucesso!`.white)