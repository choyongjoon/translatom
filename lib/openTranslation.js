'use babel'

import SyncScroll from './utils/syncScroll'

const openTranslation = async originalEditor => {
  // allow only one side-by-side view
  if (this.isOpening || this.isOpened) return
  this.isOpening = true
  const translationEditor = await atom.workspace.open('', { split: 'right' })
  if (this.syncScroll) disposeSyncScroll()
  this.syncScroll = new SyncScroll(originalEditor, translationEditor)
  this.syncScroll.syncPositions()
  // dispose syncScroll if one editor is closed.
  originalEditor.onDidDestroy(disposeSyncScroll)
  translationEditor.onDidDestroy(disposeSyncScroll)
  this.isOpening = false
  this.isOpened = true
}

export default openTranslation

const disposeSyncScroll = () => {
  if (!this.syncScroll) return

  this.syncScroll.dispose()
  this.syncScroll = null
  this.isOpened = false
}
