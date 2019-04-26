const fs = require('fs')
const path = require('path')
const NEWLINE = '\n'
const RE_INI_KEY_VAL = /^\s*([\w.-]+)\s*=\s*(.*)?\s*$/
const RE_NEWLINES = /\\n/g

function log(message) {
  console.log(`[simple-env][DEBUG] ${message}`)
}

// Parses src into an Object
function parse(src, debug) {
  const obj = {}

  // convert Buffers before splitting into lines and processing
  src.toString().split(NEWLINE).forEach(function (line, idx) {
    // matching "KEY' and 'VAL' in 'KEY=VAL'
    const keyValueArr = line.match(RE_INI_KEY_VAL)
    // matched?
    if (keyValueArr != null) {
      const key = keyValueArr[1]
      // default undefined or missing values to empty string
      let val = (keyValueArr[2] || '')
      const end = val.length - 1
      const isDoubleQuoted = val[0] === '"' && val[end] === '"'
      const isSingleQuoted = val[0] === "'" && val[end] === "'"

      // if single or double quoted, remove quotes
      if (isSingleQuoted || isDoubleQuoted) {
        val = val.substring(1, end)

        // if double quoted, expand newlines
        if (isDoubleQuoted) {
          val = val.replace(RE_NEWLINES, NEWLINE)
        }
      } else {
        // remove surrounding whitespace
        val = val.trim()
      }

      obj[key] = val
    } else if(debug) {
      log(`did not match key and value when parsing line ${idx + 1}: ${line}`)
    }
  })

  return obj
}

function initialize({ envPath, encoding = 'utf8',debug = false, overwrite = false } = {}) {

  envPath = envPath ? path.resolve(envPath) : path.resolve(process.cwd(),'.env');

  try {
    const parsed = parse(fs.readFileSync(envPath, {
      encoding
    }), debug)

    Object.keys(parsed).forEach(function (key) {
      if (process.env.hasOwnProperty(key)) {
        if (overwrite) {
          process.env[key] = parsed[key]
          debug && log(`"${key}"  in \`process.env\` has been set`)

        } else if(debug) {
          log(`"${key}" is already defined in \`process.env\` and will not be overwritten. to overwrite pass overwrite as true`)
        }
      } else {
        process.env[key] = parsed[key]
        debug && log(`"${key}"  in \`process.env\` has been set`)

      }
    })

    
  } catch (e) {
    debug && log(e)
  }
}

module.exports = initialize;