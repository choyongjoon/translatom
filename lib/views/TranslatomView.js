/** @babel */
/** @jsx etch.dom */

import etch from 'etch'
import { CompositeDisposable, TextEditor } from 'atom'

export default class TranslatomView {
  constructor (state) {
    this.left = ''
    this.right = ''
    this.subscriptions = new CompositeDisposable()
    const panes = atom.workspace.getCenter().getPanes()
    this.editorSubs = new Array(panes.length)
    panes.forEach((pane, i) => {
      this.subscriptions.add(pane.onDidChangeActiveItem(
        activeItem => this.updateEditor(activeItem, i)))
    })
    const activeItems = panes.map(pane => pane.getActiveItem())
    activeItems.map((activeItem, i) => this.updateEditor(activeItem, i))

    etch.initialize(this)
  }

  updateEditor (activeItem, i) {
    if (!activeItem || !(activeItem instanceof TextEditor)) return
    const editor = activeItem
    if (this.editorSubs[i]) this.editorSubs[i].dispose()
    this.editorSubs[i] = new CompositeDisposable()
    this.editorSubs[i].add(editor.onDidAddSelection(
      selection => this.onChangeSelection(selection, i)))
    this.editorSubs[i].add(editor.onDidChangeSelectionRange(
      e => this.onChangeSelection(e.selection, i)))
  }

  onChangeSelection (selection, i) {
    const maxLength = 30
    if (!selection || !selection.getText) return
    let text = selection.getText()
    text = text.substring(0, maxLength)
    if (!text) return

    if (i === 0) {
      if (this.left === text) return
      this.left = text
    } else if (i === 1) {
      if (this.right === text) return
      this.right = text
    }
    etch.update(this)
  }

  render () {
    return (
      <div class='tool-panel translatom-view'>
        <atom-panel class='padded history-panel'>
          <div class='block'>
            <label>History</label>
            <ul class='list-group'>
              <li class='history-item list-item inset-panel padded'>
                <input
                  class='input-search inline-block-tight native-key-bindings'
                  type='search'
                  placeholder='Original'
                  value={this.left}
                  onChange={this.onChangeLeft}
                />
                <input
                  class='input-search inline-block-tight native-key-bindings'
                  type='search'
                  placeholder='Translation'
                  value={this.right}
                  onChange={this.onChangeRight}
                />
                <button class='btn icon icon-plus' />
              </li>
            </ul>
          </div>
        </atom-panel>
      </div>
    )
  }

  onChangeLeft (e) {
    this.left = e.target.value
    etch.update(this)
  }

  onChangeRight (e) {
    this.right = e.target.value
    etch.update(this)
  }

  update (state) {
    // custom update logic
    return etch.update(this)
  }

  async destroy () {
    await etch.destroy(this)
    if (this.subscriptions) {
      this.subscriptions.dispose()
      this.subscriptions = null
    }
    if (this.editorSubs) {
      this.editorSubs.map(editorSub => {
        editorSub && editorSub.dispose()
      })
      this.editorSubs = null
    }
  }

  serialize () {}

  toggle () {
    atom.workspace.toggle(this)
  }

  async show () {
    await atom.workspace.open(this, {
      searchAllPanes: true,
      activatePane: false,
      activateItem: false,
      location: 'right'
    })
    atom.workspace.paneContainerForURI(this.getURI()).show()
  }

  getTitle () { return 'Translatom' }
  getURI () { return 'atom://translatom-view' }
}
