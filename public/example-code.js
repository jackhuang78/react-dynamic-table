var DynamicTable = require('react-dynamic-table');  
var columns = require('columns.json');  
var data = require('data.json');  
var App = React.createClass({  
 
	componentDidMount: function() { 
		this.refs.table.setState({ 
			columns: columns, 
			data: data 
		}); 
	}, 

	getData: function() {
		data = this.refs.table.state.data;
	},

	setData: function(data) {
		this.refs.table.setState({data: data});
	},
 
 	render: function() { 
		return ( 
			<DynamicTable ref='table' /> 
		); 
	} 
});