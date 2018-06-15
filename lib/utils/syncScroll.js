'use babel'

// Copied and edited from 'split-diff' by 'mupchrch'
// https://github.com/mupchrch/split-diff/blob/master/lib/sync-scroll.js

var { CompositeDisposable } = require('atom')

export default class SyncScroll {
  constructor (editor1, editor2) {
    this.subscriptions = new CompositeDisposable()
    const editors = [editor1, editor2]
    this.editorWraps = editors.map(editor => ({
      editor,
      editorView: atom.views.getView(editor),
      scrolling: false
    }))
    this.editorWraps.forEach((editorWrap, i) => {
      // 'onDidChangeScrollTop' isn't technically in the public API
      this.subscriptions.add(editorWrap.editorView.onDidChangeScrollTop(() => this.scrollPositionChanged(i)))
      // 'onDidChangeScrollLeft' isn't technically in the public API
      if (this.syncHorizontalScroll) {
        this.subscriptions.add(editorWrap.editorView.onDidChangeScrollLeft(() => this.scrollPositionChanged(i)))
      }
      // bind this so that the editors line up on start of package
      this.subscriptions.add(editorWrap.editor.emitter.on('did-change-scroll-top', () => this.scrollPositionChanged(i)))
    })
  }

  dispose () {
    if (!this.subscriptions) return

    this.subscriptions.dispose()
    this.subscriptions = null
  }

  scrollPositionChanged (index) {
    const thisWrap = this.editorWraps[index]
    const otherWrap = this.editorWraps[1 - index]

    if (thisWrap.scrolling) return

    otherWrap.scrolling = true
    try {
      otherWrap.editorView.setScrollTop(thisWrap.editorView.getScrollTop())
    } catch (e) {
      // console.log(e)
    }
    otherWrap.scrolling = false
  }

  syncPositions () {
    const activeTextEditor = atom.workspace.getActiveTextEditor()
    this.editorWraps.forEach(editorWrap => {
      if (editorWrap.editor === activeTextEditor) {
        editorWrap.editor.emitter.emit('did-change-scroll-top', editorWrap.editorView.getScrollTop())
      }
    })
  }
}
