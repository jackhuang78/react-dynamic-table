var $ = require('jquery');
global.jQuery = $;
var moment = require('moment');
var React = require('react');
var ReactBootstrap = require('react-bootstrap');
var cookie = require('react-cookie');
var Table = ReactBootstrap.Table;
var Input = ReactBootstrap.Input;
var Button = ReactBootstrap.Button;

var DatePicker = require('./DatePicker');
var NumberEditor = require('react-number-editor');
var InputText = require('./InputText');

var sampleData = require('./sampleData.json');

var DynamicTable = React.createClass({

	getValidType: function(col) {
		for(var i in this.state.columns) {
			if(this.state.columns[i].name === col)
				return this.state.columns[i].type;
		}
		return 'string';
	},

	isValid: function(idx, col) {
		var typ = this.getValidType(col);
		var val = this.state.data[idx][col];
		var validVal = this.state.validData[idx][col];
		//console.log('before parsing val=',val);
		switch(typ) {
			case 'number':
				val = Number(val);	break;
		}

		//console.log('isValid? ', val, validVal, idx, col);
		return (val === validVal);
		
	},

	setDataValue: function(idx, col, val, valid) {
		console.log('valid', valid);
		if(valid) {
			var validType = this.getValidType(col);
			var validValue = null;
			switch(validType) {
				case 'number': 
					validValue = Number(val); break;
			}

			console.log(val, typeof(val), validType, col);

			this.state.validData[idx][col] = validValue;
		}

		this.state.data[idx][col] = val;
		

		this.persist();

		this.setState({
			data: this.state.data
		});
	},



	onInputChange: function(event) {
		var dataset = event.target.dataset;
		var idx = dataset.idx;
		var col = dataset.col;
		var regex = dataset.regex;
		var value = event.target.value;

		var valid = (!regex || (value.match(regex) !== null));
		console.log('value', value, 'is valid', valid);
		this.setDataValue(idx, col, value, valid);
		
	},

	onDateChange: function(dataset, date) {
		this.setDataValue(dataset['data-idx'], dataset['data-col'], date, true);
	},

	
	onClick: function(event) {
		//console.log('clicke');
		delete localStorage.data;
		this.setState(this.getInitialState());
		//console.log(this.state);
	},

	render: function() {

		// save data to browser's local storage
		//localStorage.data = JSON.stringify(this.state);


		var columns = [];

		var header = this.state.columns.map(function(column) {
			return (<th>{column.name}</th>);
		}.bind(this));

		var rows = this.state.data.map(function(item, idx) {
			var row = this.state.columns.map(function(column) {
				var value = item[column.name];
				//var style = (value === this.state.validData[idx][column.name]) ? '' : 'error';
				var style = this.isValid(idx, column.name) ? '' : 'error';
				//console.log(style);


				if(!column.type) {
					return (<td><Input type='text' value={value} onChange={this.onInputChange} 
						data-idx={idx} data-col={column.name} /></td>)

				} else if(column.type === 'number') {
					return (<td><Input type='text' value={value} onChange={this.onInputChange} bsStyle={style} hasFeedback 
						data-idx={idx} data-col={column.name} data-regex={'^\\d*\\.?\\d*$'} /></td>)

				} else if(column.type === 'date') {
					return (<td><Input type='text' value={value} onChange={this.onInputChange} bsStyle={style} hasFeedback 
						data-idx={idx} data-col={column.name} data-regex={'^\\d{1,2}\\.?\\d*$'} /></td>)


					//return (<td><DatePicker data-idx={idx} data-col={column.name} date={value} onChange={this.onDateChange} /></td>);
				} else {
					return (<td>{value}</td>);	
				}
				
			}.bind(this));
			return (<tr>{row}</tr>);
		}.bind(this));

		return (<div>
			<Button bsStyle='danger' onClick={this.onClick}>Reset Table</Button>
			<Table striped hover>
				<thead>
					<tr>
						{header}
					</tr>
				</thead>
				<tbody>
					{rows}
				</tbody>
			</Table>
			
			<InputText bsStyle='error' value='Hey you!' validator={function(value) {
				return {
					style: value.match(/^\d*\.?\d*?$/) ? '' : 'error',
					help: value.match(/^\d*\.?\d*?$/) ? 'good' : 'bad'
				}}} onBlur={function(event) {
					console.log('onBlur', event.target.value);
				}} 
			/>
			
		</div>);	
	},

	getInitialState: function() {
		var state = this.load();

		console.log('Initial State:', state);
		return state;
	},

	persist: function() {
		localStorage.data = JSON.stringify(this.state);
	},

	load: function() {
		var state = (localStorage.data)
			? JSON.parse(localStorage.data)
			: sampleData;

		if(!state.validData)
			state.validData = JSON.parse(JSON.stringify(state.data));

		return state;
	},


});


module.exports = DynamicTable;