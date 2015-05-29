var React = require('react')
var { Link, RouteHandler, Navigation } = require('react-router')
var Colors = require('../utils/Colors')
var Arrow = require('./Arrow')

var ARROW_SIZE = 10
var IMAGE_SIZE = 100
var IMAGE_MARGIN = 10

var AlbumCover = React.createClass({
  render() {
    var styles = {
      display: 'inline-block',
      margin: IMAGE_MARGIN
    }
    return (
      <div style={styles}>
        <Link to="album" params={{id: this.props.id}}>
          <img
            style={{height: IMAGE_SIZE, width: IMAGE_SIZE}}
            src={this.props.src}
          />
        </Link>
      </div>
    )
  }
})

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

  renderRow (row, index) {
    var rowCurrentIndex, arrowMarginLeft
    var currentId = this.props.params.id
    var { lastChildId } = this.state
    row.map((release, index) => {
      if(release.id === currentId) rowCurrentIndex = index
    })
    var hasCurrent = !isNaN(rowCurrentIndex)
    var hadCurrent = row.filter(release => release.id === lastChildId).length > 0
    var sameRow = hasCurrent && hadCurrent
    if(hasCurrent) {
      var albumBounds = (IMAGE_MARGIN * 2) + IMAGE_SIZE
      arrowMarginLeft = (albumBounds * (rowCurrentIndex + 1)) - (albumBounds / 2)
    }
    var albumCovers = row.map((release) => {
      return <AlbumCover key={release.id} id={release.id} src={release.file} />
    })
    return (
      <div key={index}>
        {albumCovers}
        {hasCurrent ? <Arrow id={currentId} left={arrowMarginLeft} size={ARROW_SIZE} /> : null}
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
