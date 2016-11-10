const React = require("react");

// Selector for discoveries
const DiscoveriesSelector = React.createClass({
  getDefaultProps: function() {
    return {
      options: [],
      label: '',
      changeHandler: function() {},
      selected: []
    }
  },

  render: function() {
    const selected = this.props.selected;
    return(
      <div className="row">
        <div className="column column-50">
          {this.props.label}
          <select onChange={this.props.changeHandler}
            value={selected[1]}
          >
           <option></option>
            {this.props.options.map(function(option) {
              return (<option
                  value={option["discovery_name"]}
                  key={option["discovery_name"]}>
                {option["display_name"]}
              </option>)
            })}
          </select>
        </div>
        <div className="column column-50 discovery-label">
          {this.props.selectedLabel}
        </div>
      </div>
    )
  }
})

module.exports = DiscoveriesSelector;
