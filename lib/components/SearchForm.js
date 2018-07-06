/** @babel */
/** @jsx etch.dom */

import etch from 'etch'

export default class SearchForm {
  constructor (props) {
    this.left = props.left
    this.right = props.right
    this.onChangeLeft = props.onChangeLeft
    this.onChangeRight = props.onChangeRight
    etch.initialize(this)
  }

  update (props) {
    this.left = props.left
    this.right = props.right
    return etch.update(this)
  }

  async destroy () {
    await etch.destroy(this)
  }

  serialize () {}

  render () {
    return (
      <div class='search-form list-item inset-panel padded'>
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
      </div>
    )
  }
}
