'use babel'

import TranslatomView from './translatom-view'
import { CompositeDisposable } from 'atom'

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
      'translatom:toggle': () => this.toggle()
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

  toggle () {
    return (
      this.modalPanel.isVisible()
        ? this.modalPanel.hide()
        : this.modalPanel.show()
    )
  }
}
