var React = require('react')
var { Link, RouteHandler, Navigation } = require('react-router')
var Colors = require('../utils/Colors')
var Arrow = require('./Arrow')

var IMAGE_SIZE = 100
var IMAGE_MARGIN = 10

var Albums = React.createClass({

  mixins: [ Navigation ],

  statics: {
    load (params) {
      if (params.id)
        return Colors.load(params.id)
    }
  },

  getInitialState () {
    return {
      viewportWidth: window.innerWidth,
      lastChildId: null
    }
  },

  componentDidMount () {
    window.addEventListener('resize', () => {
      this.setState({ viewportWidth: window.innerWidth })
    })
  },

  componentWillReceiveProps (newProps) {
    var oldId = this.props.params.id
    if (oldId && newProps.params.id !== oldId)
      this.setState({ lastChildId: oldId })
  },

  calcAlbumsPerRow () {
    var fullWidth = IMAGE_SIZE + (IMAGE_MARGIN * 2)
    return Math.floor(this.state.viewportWidth / fullWidth)
  },

  calcRows () {
    var albumsPerRow = this.calcAlbumsPerRow()
    return Object.keys(BOB).reduce((rows, key, index) => {
      if (index % albumsPerRow === 0)
        rows.push([])
      rows[rows.length - 1].push({ id: key, file: BOB[key] })
      return rows
    }, [[]])
  },

  renderAlbum (release) {
    var currentId = this.props.params.id
    var { lastChildId } = this.state
    var isCurrent = currentId === release.id
    var wasCurrent = lastChildId === release.id
    var styles = {
      display: 'inline-block',
      margin: IMAGE_MARGIN
    }
    return (
      <div style={styles} key={release.id}>
        <Link to="album" params={{id: release.id}}>
          <img
            style={{height: IMAGE_SIZE, width: IMAGE_SIZE}}
            src={release.file}
          />
        </Link>
        {isCurrent ? <Arrow id={release.id}/> : null}
      </div>
    )
  },

  renderRow (row, index) {
    var currentId = this.props.params.id
    var { lastChildId } = this.state
    var hasCurrent = row.filter(release => release.id === currentId).length > 0
    var hadCurrent = row.filter(release => release.id === lastChildId).length > 0
    var sameRow = hasCurrent && hadCurrent
    return (
      <div key={index}>
        {row.map(this.renderAlbum)}
        {hasCurrent ? <RouteHandler params={this.props.params} /> : null}
        {(hadCurrent && !sameRow) ? <RouteHandler params={{id: lastChildId}} old={true}/> : null}
      </div>
    )
  },

  render () {
    var releases = this.calcRows().map(this.renderRow)
    return <div>{releases}</div>
  }
})

module.exports = Albums
