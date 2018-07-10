/** @babel */
/** @jsx etch.dom */

import etch from 'etch'
import { CompositeDisposable, TextEditor } from 'atom'
import SearchForm from '../components/SearchForm'
import SearchList from '../components/SearchList'

export default class TranslatomView {
  constructor (state) {
    this.left = ''
    this.right = ''
    this.updateSubscriptions()

    etch.initialize(this)
  }

  update (state) {
    // custom update logic
    return etch.update(this)
  }

  serialize () {}

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

  getTitle () { return 'Translatom' }
  getURI () { return 'atom://translatom-view' }

  toggle (show) {
    if (show) {
      this.updateSubscriptions()
      atom.workspace.open(this)
    } else atom.workspace.hide(this)
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

  updateSubscriptions () {
    this.subscriptions = new CompositeDisposable()
    const panes = atom.workspace.getCenter().getPanes()
    this.editorSubs = new Array(panes.length)
    panes.forEach((pane, i) => {
      this.subscriptions.add(pane.onDidChangeActiveItem(
        activeItem => this.updateEditor(activeItem, i)))
    })
    const activeItems = panes.map(pane => pane.getActiveItem())
    activeItems.map((activeItem, i) => this.updateEditor(activeItem, i))
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

  onChangeLeft (e) {
    this.left = e.target.value
    etch.update(this)
  }

  onChangeRight (e) {
    this.right = e.target.value
    etch.update(this)
  }

  render () {
    const results = [
      {
        key: 'Original 1',
        values: [
          ['Translation 1', 'Long Description'],
          ['Translation 2', 'Description 2']
        ]
      },
      {
        key: 'Original 2',
        values: [
          ['Translation 1', 'Description 1'],
          ['Translation 2', 'Description 2'],
          ['Translation 3', 'Description 3']
        ]
      }
    ]

    return (
      <div class='tool-panel translatom-view'>
        <SearchForm
          left={this.left}
          right={this.right}
          onChangeLeft={this.onChangeLeft}
          onChangeRight={this.onChangeRight}
        />
        <SearchList
          results={results}
        />
      </div>
    )
  }
}
