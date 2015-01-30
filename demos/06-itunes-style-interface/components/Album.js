var React = require('react')
var Releases = require('../utils/Releases')
var Colors = require('../utils/Colors')

var Album = React.createClass({

  statics: {
    load (params) {
      return Releases.load(params.id)
    }
  },

  getInitialState () {
    return {
      height: this.props.old ? 'auto' : 0,
      animate: false
    }
  },

  componentDidMount () {
    this.animate()
  },

  componentWillReceiveProps () {
    this.setState({animate: true})
  },

  componentDidUpdate () {
    if (this.state.animate) {
      this.animate()
      this.setState({animate: false})
    }
  },

  animate () {
    var height = this.refs.container.getDOMNode().offsetHeight
    this.setState({ height: height }, () => {
      if (this.props.old) {
        setTimeout(() => {
          this.setState({height: 0})
        }, 10)
      }
    })
  },

  render () {
    var { id } = this.props.params
    var { bg, fg } = Colors.get(id)
    var release = Releases.get(id)
    var styles = {
      background: bg,
      color: fg,
      height: this.state.height,
      transition: 'all 500ms ease',
      overflow: 'hidden'
    }
    var tracks = release.tracklist.map((track, index) => {
      return <li key={index}>{track.title} ({track.duration})</li>
    })
    return (
      <div style={styles}>
        <div ref="container" style={{padding: 20}}>
          <h2 style={{margin: '0 0 10px 0'}}>{release.title}</h2>
          <div style={{WebkitColumnCount: 2}}>
            <ol style={{margin: 0}}>{tracks}</ol>
          </div>
        </div>
      </div>
    )
  }
})

module.exports = Album
