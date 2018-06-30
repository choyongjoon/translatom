/** @babel */
/** @jsx etch.dom */

import etch from 'etch'

export default class TranslatomView {
  constructor (state) {
    this.useragent = 'Mozilla/5.0 (iPhone; CPU iPhone OS 9_0 like Mac OS X) AppleWebKit/601.1.46 (KHTML, like Gecko) Version/9.0 Mobile/13A344 Safari/601.1'
    etch.initialize(this)
  }

  render () {
    return (
      <div class='tool-panel'>
        <webview autosize src='https://translate.google.com' useragent={this.useragent} style={{height: '100%'}} />
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
