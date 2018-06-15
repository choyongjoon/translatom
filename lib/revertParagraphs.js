'use babel'

const sentenceEndRegex = /[^.]\w+[.?!]*[。.?!][\s)]?\r?\n/g
const trailingSpaceRegex = / (\r?\n)/g

const revertParagraphs = editor => {
  const buffer = editor.getBuffer()
  buffer.transact(() => {
    buffer.backwardsScan(sentenceEndRegex, ({ matchText, replace }) => {
      const replacingText = matchText.replace('\r\n', ' ').replace('\n', ' ')
      replace(replacingText)
    })
    buffer.backwardsScan(trailingSpaceRegex, ({ match, replace }) => {
      replace(match[1])
    })
  })
}

export default revertParagraphs
