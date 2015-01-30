var React = require('react')
var Colors = require('../utils/Colors')

var Arrow = React.createClass({
  render () {
    var styles = {
      width: 0,
      height: 0,
      borderLeft: '10px solid transparent',
      borderRight: '10px solid transparent',
      borderBottom: `10px solid ${Colors.get(this.props.id).bg}`,
      marginLeft: 40,
      position: 'absolute'
    }
    return <div style={styles}/>
  }
})

module.exports = Arrow
