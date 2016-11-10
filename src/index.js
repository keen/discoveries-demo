const readKey = APP_CONFIG.KEEN_READ_KEY;
const projectId = APP_CONFIG.KEEN_PROJECT_ID;

const React = require("react");
const ReactDOM = require("react-dom");
const KeenDataviz = require("keen-dataviz");
const request = require("superagent");
const Rx = require("rx")

const DiscoveriesSelector = require("./components/selector");
const Chart = require("./components/chart");

const DiscoveryExplorer = React.createClass({
  getInitialState: function() {
    return {
      discovery: { query: {}},
      discoveries: [],
      hours: 24,
      dimensions: [],
      selectedDimension: [],
      data: [],
      interval: "hours"
    }
  },

  _changeHours: function(e) {
    e.stopPropagation();
    this.setState({ hours: e.target.value })
    this._dimensionOnChange(this.state.selectedDimension);
  },

  _fetchDiscoveries: function(e) {
    const url = `https://api.keen.io/3.0/projects/${projectId}/discoveries?api_key=${readKey}`;
    const _this = this;

    request
      .get(url)
      .end(function(err, res) {
        const discoveries = JSON.parse(res.text).discoveries;
        _this.setState({ discoveries: discoveries });
      })
  },

  _fetchDiscovery: function(e) {
    const _this = this;
    const selectedDiscovery = e.target.value;
    const url = `https://api.keen.io/3.0/projects/${projectId}/discoveries/${selectedDiscovery}?api_key=${readKey}`;

    this.setState({ selectedDiscovery: selectedDiscovery });

    request
      .get(url)
      .end(function(err, res) {
        const data = JSON.parse(res.text);
        let interval = "hours";
        switch (data.query.interval) {
          case "hourly":
            interval = "hours";
            break;
          case "daily":
            interval = "days";
            break;
          case "weekly":
            interval = "weeks";
            break;
        }

        _this.setState({
          dimensionField: data.dimensions.join(" "),
          discovery: data,
          interval: interval
        });
        const selectedDiscovery = _this.state.selectedDiscovery;
      })
  },

  _dimensionOnChange: function(e) {
    const _this = this;
    let dimensions = ""
    if (e.target) {
      this.setState({
        selectedDimension: e.target.value,
        data: []
      });
      dimensions = e.target.value.split(",");
    }
    else {
      dimensions =  this.state.selectedDimension;
    }

    let data = [];

    this._fetchObservable(dimensions).subscribe(
      function(result) {
        const re = /dimension\=(\w+)/
        const dimension = re.exec(result.req.url)[1];
        data.push(result.body)
      },
      function(err) { console.error("There was an error making your request", err) },
      function() { _this.setState({ data: data }) }
    );
  },

  _fetchObservable: function(selectedDimensions) {
    const hours = this.state.hours;
    const selectedDiscovery = this.state.selectedDiscovery;
    const interval = this.state.interval;
    return Rx.Observable.from(selectedDimensions).concatMap(function(dimension) {
      const resultsUrl = `https://api.keen.io/3.0/projects/${projectId}/discoveries/${selectedDiscovery}/results?dimension=${dimension}&timeframe=last_${hours}_${interval}&api_key=${readKey}`;
      return request.get(resultsUrl); // return promise
    });
  },

  componentDidMount: function() {
    this._fetchDiscoveries();
  },

  render: function() {
    return(
      <div>
        <DiscoveriesSelector label="Discoveries Selector"
          options={this.state.discoveries}
          changeHandler={this._fetchDiscovery}
        />

        <div className="dimension-label">
          <b>Dimension to enter</b>: {this.state.dimensionField}
          <div className="project-id">
            <b>Project Id:</b> {this.state.discovery["project_id"]}
          </div>
          <div className="project-id">
            <b>Event Collection:</b> {this.state.discovery["query"]["event_collection"]}
          </div>
          <div className="last-schedule-date">
            <b>Last Schedule Run Date:</b> {this.state.discovery["last_scheduled_date"]}
          </div>
        </div>

        <input type="text" onBlur={this._dimensionOnChange} >
        </input>

        <div className="row">
          <h1>Discoveries API Explorer</h1>
        </div>

        <div className="row">
          <div className="column">

            <fieldset>
              <label htmlFor="rangefield">Number {this.state.interval}</label>
              <input type="range" min="2" max="48"
                id="fader" step="1"
                onChange={this._changeHours}
              />
              <output htmlFor="fader" id="hours">{this.state.hours}</output>
            </fieldset>

          </div>
        </div>

        <div className="row">
          {this.state.data.map(function(d, i) {
            return(<div className="column column-50" key={i}>
              <Chart chartData={d} dataviz={new KeenDataviz()} />
            </div>)
          })}
        </div>

      </div>
    );
  }
});

ReactDOM.render(
    <DiscoveryExplorer />,
    document.getElementById('discovery_selector')
);
