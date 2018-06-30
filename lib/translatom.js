'use babel'

import { CompositeDisposable } from 'atom'

import TranslatomView from './views/TranslatomView'
import splitParagraphs from './splitParagraphs'
import revertParagraphs from './revertParagraphs'
import toggleTranslatom from './toggleTranslatom'

export default {
  translatomView: null,
  subscriptions: null,

  activate (state) {
    this.translatomView = new TranslatomView(state)

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
        this.toggleTranslatom()
        this.translatomView.toggle()
      }
    }))
  },

  deactivate () {
    this.subscriptions.dispose()
    this.translatomView.destroy()
  },

  serialize () {
    return this.translatomView.serialize()
  },

  splitParagraphs,
  revertParagraphs,
  toggleTranslatom
}
