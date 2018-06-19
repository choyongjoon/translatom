'use babel'

// Referenced 'split-diff' by 'mupchrch'
// https://github.com/mupchrch/split-diff/blob/master/lib/sync-scroll.js

var { CompositeDisposable } = require('atom')

export default class SyncTool {
  constructor (editor1, editor2) {
    this.subscriptions = new CompositeDisposable()
    const editors = [editor1, editor2]
    this.editorWraps = editors.map(editor => ({
      editor,
      editorView: atom.views.getView(editor),
      scrolling: false
    }))
    this.editorWraps.forEach((editorWrap, i) => {
      this.subscriptions.add(editorWrap.editor.onDidChangeCursorPosition(e => this.cursorPositionChanged(i, e)))
    })
  }

  dispose () {
    if (!this.subscriptions) return

    this.subscriptions.dispose()
    this.subscriptions = null
  }

  cursorPositionChanged (index, e) {
    if (this.isChangingCursor) return
    this.isChangingCursor = true
    const thisWrap = this.editorWraps[index]
    const otherWrap = this.editorWraps[1 - index]
    const { newScreenPosition, newBufferPosition } = e
    otherWrap.editor.setCursorBufferPosition(newBufferPosition)

    const thisScrollTop = thisWrap.editorView.getScrollTop()
    if (thisWrap.editor.isSoftWrapped() || otherWrap.editor.isSoftWrapped()) {
      const otherScreenPosition = otherWrap.editor.getCursorScreenPosition()
      const otherScrollTop = otherWrap.editorView.getScrollTop()
      const lineHeight = otherWrap.editor.getLineHeightInPixels()
      const rowOffset = otherScreenPosition.row - newScreenPosition.row
      let offset = thisScrollTop + rowOffset * lineHeight
      if (offset >= 0) otherWrap.editorView.setScrollTop(offset)
      else {
        offset = otherScrollTop + (-rowOffset) * lineHeight
        thisWrap.editorView.setScrollTop(offset)
      }
    } else {
      otherWrap.editorView.setScrollTop(thisScrollTop)
    }
    this.isChangingCursor = false
  }
}
