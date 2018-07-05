'use babel'

import { CompositeDisposable } from 'atom'

import SyncTool from './utils/syncTool'

const toggleTranslatom = async () => {
  if (this.isOpened) closeTranslatom()
  else {
    if (this.isOpening) return
    this.isOpening = true
    this.subscriptions = new CompositeDisposable()

    let panes = atom.workspace.getCenter().getPanes()
    let leftPane, rightPane, leftEditor, rightEditor
    if (panes.length === 0) {
      await atom.workspace.open('', { split: 'right' })
      await atom.workspace.open('', { split: 'right' })
    } else if (panes.length === 1) {
      leftPane = panes[0]
      leftEditor = panes[0].getActiveItem()
      rightEditor = await atom.workspace.open('', { split: 'right' })
      const leftText = leftEditor.getBuffer().getText()
      rightEditor.getBuffer().setText(leftText)
    }
    panes = atom.workspace.getCenter().getPanes()
    leftPane = panes[0]
    rightPane = panes[1]
    leftEditor = panes[0].getActiveItem()
    rightEditor = panes[1].getActiveItem()
    let activeIndex = 0
    if (rightPane.isActive()) activeIndex = 1

    this.subscriptions.add(leftPane.onDidChangeActiveItem(activeItem => updateSyncTool(activeItem, null, 1)))
    this.subscriptions.add(rightPane.onDidChangeActiveItem(activeItem => updateSyncTool(null, activeItem, 0)))
    this.subscriptions.add(leftPane.onDidDestroy(closeTranslatom))
    this.subscriptions.add(rightPane.onDidDestroy(closeTranslatom))

    if (leftEditor && rightEditor) {
      if (this.syncTool) disposeSyncTool()
      this.syncTool = new SyncTool(leftEditor, rightEditor, activeIndex)
    } else {
      atom.notifications.addWarning('Failed to toggle translation')
    }
    this.isOpening = false
    this.isOpened = true
  }
}

export default toggleTranslatom

const closeTranslatom = () => {
  if (this.syncTool) disposeSyncTool()
  this.subscriptions.dispose()
  this.subscriptions = null
  this.isOpened = false
}

const disposeSyncTool = () => {
  if (!this.syncTool) return

  this.syncTool.dispose()
  this.syncTool = null
}

const updateSyncTool = (leftItem, rightItem, activeIndex) => {
  if (this.syncTool) disposeSyncTool()
  const panes = atom.workspace.getCenter().getPanes()
  if (!leftItem) leftItem = panes[0].getActiveItem()
  if (!rightItem) rightItem = panes[1].getActiveItem()
  this.syncTool = new SyncTool(leftItem, rightItem, activeIndex)
}
