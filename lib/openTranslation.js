'use babel'

import SyncTool from './utils/syncTool'

const openTranslation = async originalEditor => {
  // allow only one side-by-side view
  if (this.isOpening || this.isOpened) return
  this.isOpening = true
  const translationEditor = await atom.workspace.open('', { split: 'right' })
  if (this.syncTool) disposeSyncTool()
  this.syncTool = new SyncTool(originalEditor, translationEditor)
  this.syncTool.syncPositions()
  // dispose syncTool if one editor is closed.
  originalEditor.onDidDestroy(disposeSyncTool)
  translationEditor.onDidDestroy(disposeSyncTool)
  this.isOpening = false
  this.isOpened = true
}

export default openTranslation

const disposeSyncTool = () => {
  if (!this.syncTool) return

  this.syncTool.dispose()
  this.syncTool = null
  this.isOpened = false
}
