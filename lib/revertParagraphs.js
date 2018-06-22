'use babel'

import { revertEndRegex, trailingSpaceRegex } from './utils/regexes'
import isSplitted from './utils/isSplitted'

const revertParagraphs = editor => {
  const buffer = editor.getBuffer()
  if (!isSplitted(buffer)) {
    atom.notifications.addWarning('There is an unsplitted paragraph', {
      dismissable: true,
      buttons: [
        {
          text: 'Force Revert',
          onDidClick: () => revertParagraphsByForce(buffer)
        }
      ]
    })
    return
  }
  revertParagraphsByForce(buffer)
}

export default revertParagraphs

const revertParagraphsByForce = buffer => {
  buffer.transact(() => {
    buffer.backwardsScan(revertEndRegex, ({ matchText, replace }) => {
      const replacingText = matchText.replace('\r\n', ' ').replace('\n', ' ')
      replace(replacingText)
    })
    buffer.backwardsScan(trailingSpaceRegex, ({ match, replace }) => {
      replace(match[1])
    })
  })
}
