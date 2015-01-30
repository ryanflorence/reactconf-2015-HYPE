var React = require('react');
var installA11y = require('react-a11y');
installA11y();

var close = () => console.log(Date.now());

React.render((
  <div>
    <button style={{border: 'none', background: 'none'}} onClick={close}>
      <img alt="close" src="close.png"/>
    </button>
  </div>
), document.body);
