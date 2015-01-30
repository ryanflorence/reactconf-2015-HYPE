var React = require('react');
var $ = require('jquery');
require('jquery-ui');

var Dialog = React.createClass({

  getDefaultProps () {
    return {
      title: '',
      onClose () {},
      isOpen: false
    }
  },

  render () {
    // open the portal by rendering nothing that will ever change
    return null;
  },

  componentDidMount () {
    // open the other side of the portal by creating an element
    // and dumping it in the document.body
    this.portal = document.createElement('div');
    document.body.appendChild(this.portal);
    this.dialog = $(this.portal).dialog({
      autoOpen: false,
      title: this.props.title,
      close: this.props.onClose
    }).data('ui-dialog');
    this.renderDialogContent(this.props);
  },

  renderDialogContent (props) {
    // enter the portal!@!!!!
    React.render(<div>{props.children}</div>, this.portal);
    if (props.isOpen)
      this.dialog.open();
    else
      this.dialog.close();
  },

  componentWillReceiveProps (newProps) {
    this.renderDialogContent(newProps);
  },

  componentWillUnmount () {
    React.unmountComponentAtNode(this.portal);
    this.dialog.destroy();
  }

});

var App = React.createClass({

  getInitialState () {
    return {
      taco: null,
      showForm: false
    };
  },

  handleTacoSubmission (event) {
    event.preventDefault();
    var taco = this.refs.favoriteTaco.getDOMNode().value;
    this.setState({
      taco: taco,
      showForm: false
    });
  },

  renderTaco () {
    return this.state.taco ?
      "Your favorite taco is: "+this.state.taco:
      "You don't have a favorite taco yet.";
  },

  showForm () {
    this.setState({showForm: true});
  },

  handleDialogClose () {
    if (!this.state.taco)
      alert("You don't have a favorite taco?");
  },

  render () {
    return (
      <div>
        <button
          className="ui-button ui-widget ui-state-default ui-corner-all ui-button-text-only"
          onClick={this.showForm}
        >
          <span className="ui-button-text">Tell me your favorite taco</span>
        </button>
        <p>{this.renderTaco()}</p>
        <Dialog
          title="Favorite Taco"
          isOpen={this.state.showForm}
          onClose={this.handleDialogClose}
        >
          <form onSubmit={this.handleTacoSubmission}>
            <p>Tacos are delicious. Which is your favorite?</p>
            <p>
              <input type="text" ref="favoriteTaco"/>
            </p>
            <p>
              <button className="ui-button ui-widget ui-state-default ui-corner-all ui-button-text-only" type="submit">
                <span className="ui-button-text">Submit</span>
              </button>
            </p>
          </form>
        </Dialog>
      </div>
    );
  }
});

React.render(<App/>, document.body);

