'use babel'

import { CompositeDisposable } from 'atom'

import revertParagraphs from './commands/revertParagraphs'
import splitParagraphs from './commands/splitParagraphs'
import SyncTool from './utils/syncTool'
import getTwoPanes from './utils/getTwoPanes'
import TranslatomView from './views/TranslatomView'

export default {
  isOpend: false,
  isOpening: false,
  syncTool: null,
  translatomView: null,
  subscriptions: null,
  tempSubscriptions: null,

  activate (state) {
    this.translatomView = new TranslatomView(state)

    // register commands
    this.subscriptions = new CompositeDisposable()
    this.subscriptions.add(atom.commands.add('atom-workspace', {
      'translatom:split-paragraphs': splitParagraphs
    }))
    this.subscriptions.add(atom.commands.add('atom-workspace', {
      'translatom:revert-paragraphs': revertParagraphs
    }))
    this.subscriptions.add(atom.commands.add('atom-workspace', {
      'translatom:toggle-translatom': () => this.toggleTranslatom()
    }))
  },

  deactivate () {
    this.disposeSyncTool()
    this.subscriptions.dispose()
    this.translatomView.destroy()
  },

  serialize () {
    return this.translatomView.serialize()
  },

  toggleTranslatom () {
    if (this.isOpened) this.closeTranslatom()
    else this.openTranslatom()
  },

  async openTranslatom () {
    if (this.isOpening) return
    this.isOpening = true

    // subscribe first two panes
    this.tempSubscriptions = new CompositeDisposable()
    const twoPanes = await getTwoPanes()
    twoPanes.forEach(pane => {
      this.tempSubscriptions.add(pane.onDidChangeActiveItem(() => this.updateSyncTool()))
      this.tempSubscriptions.add(pane.onDidDestroy(() => this.closeTranslatom()))
    })
    this.updateSyncTool()

    this.translatomView.toggle(true)

    this.isOpening = false
    this.isOpened = true
  },

  closeTranslatom () {
    this.disposeSyncTool()
    this.tempSubscriptions.dispose()
    this.tempSubscriptions = null

    this.translatomView.toggle(false)

    this.isOpened = false
  },

  updateSyncTool () {
    this.disposeSyncTool()
    const twoPanes = atom.workspace.getCenter().getPanes().slice(0, 2)
    let activeIndex = twoPanes.findIndex(pane => pane.isActive())
    if (activeIndex < 0) activeIndex = 0
    const activeItems = twoPanes.map(pane => pane.getActiveItem())
    this.syncTool = new SyncTool(activeItems[0], activeItems[1], activeIndex)
  },

  disposeSyncTool () {
    if (!this.syncTool) return

    this.syncTool.dispose()
    this.syncTool = null
  }
}
