'use babel'

const sentenceEndRegex = /[^.]\w+[.?!]*[。.?!][\s)]/g

const splitParagraphs = editor => {
  const buffer = editor.getBuffer()
  buffer.transact(() => {
    buffer.backwardsScan(sentenceEndRegex, ({ matchText, replace }) => {
      const trimmedText = matchText.replace(/ ([\r\n]?$)/, '$1')
      const replacingText = trimmedText + '\n'
      replace(replacingText)
    })
  })
}

export default splitParagraphs
