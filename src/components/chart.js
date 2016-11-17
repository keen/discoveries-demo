// const Dataviz = require("keen-dataviz");
const React = require("react");

const Chart = React.createClass({

  _updateChartData: function(data){
    if (this.props.response.length > 0) {
      this.props.dataviz
        .data(this.props.response[0])
        .el(this.refs['keen-viz'])
        .render();
    }
  },

  componentDidMount: function() {
    // console.log('componentDidMount', this.props);
    this.props.dataviz
      .type('line')
      .height(300)
      .title(this.props.title);
    this._updateChartData();
  },

  shouldComponentUpdate: function() {
    // console.log('shouldComponentUpdate', this.props);
    this._updateChartData();
    return false;
  },

  componentWillUnmount: function() {
    // console.log('componentWillUnmount', this.props);
  },

  render: function() {
    return(
      <div ref="keen-viz"></div>
    )
  }
});

module.exports = Chart;
