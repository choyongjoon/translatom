/** @babel */
/** @jsx etch.dom */

import etch from 'etch'

export default class SearchList {
  constructor (props) {
    this.results = props.results
    etch.initialize(this)
  }

  update (props) {
    this.results = props.results
    return etch.update(this)
  }

  async destroy () {
    await etch.destroy(this)
  }

  serialize () {}

  render () {
    const { results } = this
    let count = 0
    const offsets = results.map(result => {
      const offset = count
      count += result.values.length
      return offset
    })

    return (
      <div class='search-list-container padded'>
        <ul class='search-list list-group'>
          {results.map((result, i) => (
            <li key={result.key} class='search-result list-item'>
              <div class='result-left inline-block-tight'>
                <span class='text-highlight'>
                  {result.key}
                </span>
              </div>
              <div class='result-right inline-block-tight'>
                <ul class='right-list list-group'>
                  {result.values.map(value => (
                    <li key={value[0]} class='right-item list-item'>
                      <span class='text-highlight'>
                        {value[0]}
                      </span>
                      <span class='description'>
                        {value[1]}
                      </span>
                    </li>
                  ))}
                </ul>
              </div>
              <div class='result-index'>
                <ul class='list-group'>
                  {result.values.map((value, j) => (
                    <li key={value[0]} class='list-item'>
                      <span class='numbering highlight'>
                        {offsets[i] + j + 1}
                      </span>
                    </li>
                  ))}
                </ul>
              </div>
            </li>
          ))}
        </ul>
      </div>
    )
  }
}
