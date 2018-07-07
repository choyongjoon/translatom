'use babel'

import { splitEndRegex } from '../utils/regexes'
import isSplitted from '../utils/isSplitted'

const splitParagraphs = () => {
  const editor = atom.workspace.getActiveTextEditor()
  if (!editor) return

  const buffer = editor.getBuffer()
  if (isSplitted(buffer)) {
    atom.notifications.addWarning('All paragraphs are already splitted', {
      dismissable: true,
      buttons: [
        {
          text: 'Force Split',
          onDidClick: () => splitParagraphsByForce(buffer)
        }
      ]
    })
    return
  }
  splitParagraphsByForce(buffer)
}

export default splitParagraphs

const splitParagraphsByForce = buffer => {
  buffer.transact(() => {
    buffer.backwardsScan(splitEndRegex, ({ matchText, replace }) => {
      const trimmedText = matchText.replace(/ ([\r\n]?$)/, '$1')
      const replacingText = trimmedText + '\n'
      replace(replacingText)
    })
  })
}
