'use babel'

// Referenced 'split-diff' by 'mupchrch'
// https://github.com/mupchrch/split-diff/blob/master/lib/sync-scroll.js

import { CompositeDisposable, TextEditor } from 'atom'

export default class SyncTool {
  constructor (editor0, editor1, activeIndex = 0) {
    if (!editor0 || !editor1) return
    if (!(editor0 instanceof TextEditor) || !(editor1 instanceof TextEditor)) return

    this.subscriptions = new CompositeDisposable()
    const editors = [editor0, editor1]
    this.editorWraps = editors.map(editor => ({
      editor,
      editorView: atom.views.getView(editor),
      scrolling: false
    }))
    this.editorWraps.forEach((editorWrap, i) => {
      this.subscriptions.add(editorWrap.editor.onDidChangeCursorPosition(e => this.cursorPositionChanged(i, e)))
      this.subscriptions.add(editorWrap.editor.onDidAddSelection(() => this.highlightCurrentLine()))
      this.subscriptions.add(editorWrap.editor.onDidChangeSelectionRange(() => this.highlightCurrentLine()))
      this.subscriptions.add(editorWrap.editor.onDidRemoveSelection(() => this.highlightCurrentLine()))
    })
    this.markers = []
    this.cursorPositionChanged(activeIndex, {
      newScreenPosition: editors[activeIndex].getCursorScreenPosition(),
      newBufferPosition: editors[activeIndex].getCursorBufferPosition()
    })
    this.highlightCurrentLine()
  }

  dispose () {
    if (!this.subscriptions) return

    this.subscriptions.dispose()
    this.subscriptions = null
    this.resetMarkers()
  }

  cursorPositionChanged (index, e) {
    if (this.isChangingCursor) return
    this.isChangingCursor = true
    const thisWrap = this.editorWraps[index]
    const otherWrap = this.editorWraps[1 - index]
    const { oldScreenPosition, newScreenPosition, newBufferPosition } = e
    if (oldScreenPosition && (oldScreenPosition.row === newScreenPosition.row)) {
      this.isChangingCursor = false
      return
    }
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

  resetMarkers () {
    this.markers.forEach(marker => {
      if (!marker) return
      marker.destroy()
      marker = null
    })
    this.markers = []
  }

  highlightCurrentLine () {
    this.markers = this.editorWraps.map((editorWrap, i) => {
      const { editor } = editorWrap
      if (!editor.getSelections()) return

      const prevMarker = this.markers[i]
      const selection = editor.getSelections()[0]
      if (!selection.isSingleScreenLine()) return prevMarker

      const range = selection.getBufferRange()
      if (prevMarker) {
        const prevRange = prevMarker.getBufferRange()
        if (range.coversSameRows(prevRange)) return prevMarker

        prevMarker.destroy()
        this.markers[i] = null
      }
      const marker = editor.markBufferRange(range)
      editor.decorateMarker(marker, { type: 'line', class: 'translatom current-line' })
      return marker
    })
  }
}
