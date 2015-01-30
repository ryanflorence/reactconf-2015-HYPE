var React = require('react');
var Router = require('react-router');
var { Route, DefaultRoute, RouteHandler, Link } = Router;

var months = {
  jan: { gas: 200, entertainment: 150, arbys: 300 },
  feb: { gas: 100, entertainment: 120, arbys: 350 },
  mar: { gas: 175, entertainment: 200, arbys: 100 }
};

var App = React.createClass({
  render () {
    return (
      <div>
        <h1>Monthly Spending</h1>
        <p>
          <Link to="/spending/jan">Januaray</Link> {' '}
          <Link to="/spending/feb">February</Link> {' '}
          <Link to="/spending/mar">March</Link>
        </p>
        <RouteHandler {...this.props}/>
      </div>
    );
  }
});

var Spending = React.createClass({
  render () {
    var month = this.props.params.month;
    var bars = Object.keys(months[month]).map((key) => {
      var spending = months[month][key];
      var styles = {
        width: spending,
        background: 'hsl(10, 70%, 55%)',
        height: 40,
        margin: '0 0 10px 0',
        transition: 'all 500ms ease'
      };
      return (
        <div key={key}>
          <div>{key}</div>
          <div style={styles}/>
        </div>
      );
    });
    return <div>{bars}</div>;
  }
});

var RedirectToJanuaray = React.createClass({
  statics: {
    willTransitionTo (transition) {
      transition.redirect('/spending/jan');
    }
  },
  render () {}
});

var routes = (
  <Route name="app" path="/" handler={App}>
    <DefaultRoute handler={RedirectToJanuaray}/>
    <Route name="spending" path="spending/:month" handler={Spending}/>
  </Route>
);

Router.run(routes, (Handler, state) => {
  React.render(<Handler {...state}/>, document.body);
});

