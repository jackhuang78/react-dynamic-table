var React = require('react');
var ReactBootstrap = require('react-bootstrap');
var Button = ReactBootstrap.Button;
var PageHeader = ReactBootstrap.PageHeader;
var Panel = ReactBootstrap.Panel;
var Input = ReactBootstrap.Input;
var DynamicTable = require('./DynamicTable');
var cookie = require('react-cookie');

var sampleData = require('../public/demoData.json');


var Demo = React.createClass({
	render: function() {
		return (
			<div>
				<Panel style={{margin: 30}}>
					<PageHeader>DynamicTable Demo</PageHeader>
					<Button bsStyle='danger' onClick={this.resetTable}>Reset Table</Button>
					<DynamicTable ref='table' onChange={this.save} 
						onSelectRow={this.onSelectRow}
						onAddRow={this.onAddRow}
						onDeleteRow={this.onDeleteRow}
					/>
				</Panel>
			</div>
		);
	},

	componentDidMount: function() {
		this.load();
	},

	resetTable: function() {
		delete localStorage.data;
		localStorage.data = JSON.stringify(sampleData);
		this.load();
	},

	load: function() {
		var tableState = JSON.parse(localStorage.data);
		this.refs.table.setState({
			columns: tableState.columns,
			data: tableState.data
		});
	},

	save: function(data) {
		localStorage.data = JSON.stringify(data);
	},


});

module.exports = Demo;