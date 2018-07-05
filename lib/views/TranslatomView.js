/** @babel */
/** @jsx etch.dom */

import etch from 'etch'

export default class TranslatomView {
  constructor (state) {
    etch.initialize(this)
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

  update (state) {
    // custom update logic
    return etch.update(this)
  }

  async destroy () {
    await etch.destroy(this)
    // then perform custom teardown logic here...
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
