'use babel'

import { splitCheckRegex } from './regexes'

const isSplitted = buffer => {
  let isSplitted = true
  buffer.scan(splitCheckRegex, ({ stop }) => {
    isSplitted = false
    stop()
  })
  return isSplitted
}

export default isSplitted
