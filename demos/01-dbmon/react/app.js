/** @jsx React.DOM */
var start = Date.now();
var loadCount = 0;

function getData() {
  // generate some dummy data
  data = {
    start_at: new Date().getTime() / 1000,
    databases: {}
  };

  for (var i = 1; i <= ENV.rows; i++) {
    data.databases["cluster" + i] = {
      queries: []
    };

    data.databases["cluster" + i + "slave"] = {
      queries: []
    };
  }

  Object.keys(data.databases).forEach(function(dbname) {
    var info = data.databases[dbname];

    var r = Math.floor((Math.random() * 10) + 1);
    for (var i = 0; i < r; i++) {
      var q = {
        canvas_action: null,
        canvas_context_id: null,
        canvas_controller: null,
        canvas_hostname: null,
        canvas_job_tag: null,
        canvas_pid: null,
        elapsed: Math.random() * 15,
        query: "SELECT blah FROM something",
        waiting: Math.random() < 0.5
      };

      if (Math.random() < 0.2) {
        q.query = "<IDLE> in transaction";
      }

      if (Math.random() < 0.1) {
        q.query = "vacuum";
      }

      info.queries.push(q);
    }

    info.queries = info.queries.sort(function(a, b) {
      return b.elapsed - a.elapsed;
    });
  });

  return data;
}

var _base;

(_base = String.prototype).lpad || (_base.lpad = function(padding, toLength) {
  return padding.repeat((toLength - this.length) / padding.length).concat(this);
});

function formatElapsed(value) {
  str = parseFloat(value).toFixed(2);
  if (value > 60) {
    minutes = Math.floor(value / 60);
    comps = (value % 60).toFixed(2).split('.');
    seconds = comps[0].lpad('0', 2);
    ms = comps[1];
    str = minutes + ":" + seconds + "." + ms;
  }
  return str;
}

var Query = React.createClass({
  render: function() {
    var className = "elapsed short";
    if (this.props.elapsed >= 10.0) {
      className = "elapsed warn_long";
    }
    else if (this.props.elapsed >= 1.0) {
      className = "elapsed warn";
    }

    return (
      <td className={"Query " + className}>
        {this.props.elapsed ? formatElapsed(this.props.elapsed) : ''}
        <div className="popover left">
          <div className="popover-content">{this.props.query}</div>
          <div className="arrow"/>
        </div>
      </td>
    );
  }
})

var sample = function (queries, time) {
  var topFiveQueries = queries.slice(0, 5);
  while (topFiveQueries.length < 5) {
    topFiveQueries.push({ query: "" });
  }

  var _queries = [];
  topFiveQueries.forEach(function(query, index) {
    _queries.push(
      <Query
        key={index}
        query={query.query}
        elapsed={query.elapsed}
      />
    );
  });

  var countClassName = "label";
  if (queries.length >= 20) {
    countClassName += " label-important";
  }
  else if (queries.length >= 10) {
    countClassName += " label-warning";
  }
  else {
    countClassName += " label-success";
  }

  return [
    <td className="query-count">
      <span className={countClassName}>
        {queries.length}
      </span>
    </td>,
    _queries
  ];
};

var Database = React.createClass({
  render: function() {
    var lastSample = this.props.samples[this.props.samples.length - 1];

    return (
      <tr key={this.props.dbname}>
        <td className="dbname">
          {this.props.dbname}
        </td>
        {sample(lastSample.queries, lastSample.time)}
      </tr>
    );
  }
});

var DBMon = React.createClass({
  getInitialState: function() {
    return {
      databases: {}
    };
  },

  loadSamples: function () {
    loadCount++;
    var newData = getData();

    Object.keys(newData.databases).forEach(function(dbname) {
      var sampleInfo = newData.databases[dbname];

      if (!this.state.databases[dbname]) {
        this.state.databases[dbname] = {
          name: dbname,
          samples: []
        }
      }

      var samples = this.state.databases[dbname].samples;
      samples.push({
        time: newData.start_at,
        queries: sampleInfo.queries
      });
      if (samples.length > 5) {
        samples.splice(0, samples.length - 5);
      }
    }.bind(this));

    this.setState(this.state);
    setTimeout(this.loadSamples, ENV.timeout);
  },

  componentDidMount: function() {
    this.loadSamples();
  },

  render: function() {
    var databases = [];
    Object.keys(this.state.databases).forEach(function(dbname) {
      databases.push(
        <Database key={dbname}
          dbname={dbname}
          samples={this.state.databases[dbname].samples} />
      );
    }.bind(this));

    return (
      <div>
        <table className="table table-striped latest-data">
          <tbody>
            {databases}
          </tbody>
        </table>
      </div>
    );
  }
});

React.render(<DBMon />, document.getElementById('dbmon'), function() {
  console.log(Date.now() - start);
});
