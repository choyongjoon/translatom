'use babel'

import TranslatomView from './translatom-view'
import { CompositeDisposable } from 'atom'
import splitParagraphs from './splitParagraphs'
import revertParagraphs from './revertParagraphs'
import toggleTranslatom from './toggleTranslatom'

export default {
  translatomView: null,
  modalPanel: null,
  subscriptions: null,

  activate (state) {
    this.translatomView = new TranslatomView(state.translatomViewState)
    this.modalPanel = atom.workspace.addModalPanel({
      item: this.translatomView.getElement(),
      visible: false
    })

    // Events subscribed to in atom's system can be easily cleaned up with a CompositeDisposable
    this.subscriptions = new CompositeDisposable()

    // Register command that toggles this view
    this.subscriptions.add(atom.commands.add('atom-workspace', {
      'translatom:split-paragraphs': () => {
        const editor = atom.workspace.getActiveTextEditor()
        if (editor) this.splitParagraphs(editor)
      }
    }))
    this.subscriptions.add(atom.commands.add('atom-workspace', {
      'translatom:revert-paragraphs': () => {
        const editor = atom.workspace.getActiveTextEditor()
        if (editor) this.revertParagraphs(editor)
      }
    }))
    this.subscriptions.add(atom.commands.add('atom-workspace', {
      'translatom:toggle-translatom': () => {
        const editor = atom.workspace.getActiveTextEditor()
        if (editor) this.toggleTranslatom(editor)
      }
    }))
  },

  deactivate () {
    this.modalPanel.destroy()
    this.subscriptions.dispose()
    this.translatomView.destroy()
  },

  serialize () {
    return {
      translatomViewState: this.translatomView.serialize()
    }
  },

  splitParagraphs,
  revertParagraphs,
  toggleTranslatom
}
