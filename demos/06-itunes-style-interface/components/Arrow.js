var React = require('react')
var Colors = require('../utils/Colors')

var Arrow = React.createClass({
  render () {
    var { size, left } = this.props
    left -= size
    var styles = {
      width: 0,
      height: 0,
      borderLeft: `${size}px solid transparent`,
      borderRight: `${size}px solid transparent`,
      borderBottom: `${size}px solid ${Colors.get(this.props.id).bg}`,
      marginTop: -size,
      marginLeft: left,
      position: 'absolute',
      transition: 'all 350ms ease'
    }
    return <div style={styles}/>
  }
})

module.exports = Arrow
