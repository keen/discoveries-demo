const React = require("react");

const Chart = React.createClass({
  componentDidMount: function() {
    this.props.dataviz.destroy()
    this.props.dataviz
      .data(this.props.chartData)
      .el(this.refs['keen-viz'])
      .height(300)
      .title(this.props.title)

    this.props.dataviz.render();
  },

  componentWillUnmount: function() {
    this.props.dataviz.destroy()
  },

  render: function() {
    return(
      <div ref="keen-viz">
      </div>
    )
  }
});

module.exports = Chart;
