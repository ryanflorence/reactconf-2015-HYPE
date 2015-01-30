var React = require('react');
var Modal = require('react-modal');

var appElement = document.getElementById('app');

Modal.setAppElement(appElement);
Modal.injectCSS();

var DumbModal = React.createClass({
  contentStyles: {
    position: 'absolute',
    padding: 20,
    margin: 50,
    left: 0,
    right: 0,
    top: 0,
    bottom: 0,
    border: '1px solid #ccc',
    borderRadius: 6,
    background: '#fff'
  },

  overlayStyles: {
    background: 'hsla(0, 100%, 100%, 0.5)',
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    top: 0
  },

  render () {
    if (!this.props.isOpen)
      return null;
    return (
      <div style={this.overlayStyles}>
        <div style={this.contentStyles}>
          {this.props.children}
        </div>
      </div>
    )
  }
});

var App = React.createClass({

  getInitialState () {
    return {
      modalIsOpen: false,
      dumbModalIsOpen: false,
      useNewStyles: false
    };
  },

  openDumbModal () {
    this.setState({dumbModalIsOpen: true});
  },

  closeDumbModal () {
    this.setState({ dumbModalIsOpen: false });
  },

  toggleNewStyles () {
    this.setState({
      useNewStyles: !this.state.useNewStyles
    });
  },

  openModal () {
    this.setState({modalIsOpen: true});
  },

  closeModal () {
    this.setState({modalIsOpen: false});
  },

  handleModalCloseRequest () {
    // opportunity to validate something and keep the modal open even if it
    // requested to be closed
    this.setState({modalIsOpen: false});
  },

  handleInputChange () {
    this.setState({foo: 'bar'});
  },

  newDesignStyles: {
    width: 800,
    position: 'relative'
  },

  render () {
    return (
      <div className="App" style={this.state.useNewStyles ? this.newDesignStyles : {}}>

        <button onClick={this.openDumbModal}>Open Dumb Modal</button>
        <DumbModal isOpen={this.state.dumbModalIsOpen}>
          <p>I am rendered in context</p>
          <p>
            Cascading Style Sheets own me.
          </p>
          <button onClick={this.toggleNewStyles}>Toggle New Styles</button>
          <button onClick={this.closeDumbModal}>Close</button>
        </DumbModal>

        <button onClick={this.openModal}>Open Portal Modal</button>
        <Modal
          isOpen={this.state.modalIsOpen}
          onRequestClose={this.handleModalCloseRequest}
        >
          <h1>I am rendered in a portal</h1>
          <p>
            Cascading Style Sheets cannot constrain me!
          </p>
          <button onClick={this.toggleNewStyles}>Toggle New Styles</button>
          <button onClick={this.closeModal}>Close</button>
        </Modal>

      </div>
    );
  }
});

React.renderComponent(<App/>, appElement);
