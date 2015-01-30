var React = require('react');
var MagicMove = require('react-magic-move');

var buddies = [
  { name: 'Michelle' },
  { name: 'Ethan' },
  { name: 'David' },
  { name: 'Shawn' },
  { name: 'Sara' }
];

var getBuddies = () => {
  return buddies.map((buddy) => {
    buddy.online = Math.random() > 0.5;
    return buddy;
  });
};

var App = React.createClass({
  getInitialState: function() {
    return { buddies: getBuddies() };
  },

  componentDidMount: function () {
    setInterval(() => {
      this.setState({ buddies: getBuddies() });
    }, 3000);
  },

  addBuddy (event) {
    event.preventDefault();
    var name = event.target.elements[0].value;
    buddies.push({ name, online: true });
    event.target.reset();
    this.setState({ buddies });
  },

  renderBuddy (buddy) {
    var status = buddy.online ? 'online' : 'offline';
    return (
      <div className="Buddy" key={buddy.name}>
        <span className={"status "+status}/>
        {buddy.name}
      </div>
    );
  },

  renderOnline () {
    return sortBy('name', this.state.buddies.filter((buddy) => {
      return buddy.online;
    })).map(this.renderBuddy);
  },

  renderOffline () {
    return sortBy('name', this.state.buddies.filter((buddy) => {
      return !buddy.online;
    })).map(this.renderBuddy);
  },

  render: function () {
    return (
      <div>
        <h1>Magic Move</h1>
        <MagicMove>
          {this.renderOnline()}
          <hr key="hr"/>
          {this.renderOffline()}
        </MagicMove>
      </div>
    );
  }
});

function sortBy(key, arr) {
  return arr.slice(0).sort((a, b) => {
    return (a[key] < b[key]) ? -1 : (a[key] > b[key]) ? 1 : 0;
  });
}

React.render(<App/>, document.body);


