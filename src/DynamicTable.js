var React = require('react');
var ReactBootstrap = require('react-bootstrap');
var Table = ReactBootstrap.Table;
var Input = ReactBootstrap.Input;
var Button = ReactBootstrap.Button;

var DynamicTable = React.createClass({

	getInitialState: function() {
		return {
			columns: [],
			data: [],
			newItem: {}
		};
	},

	render: function() {
		console.log('render');

		if(!this.state) {
			return (<div>No Data</div>);
		}

		var header = this.state.columns.map(function(column) {
			return (<th>{column.name}</th>);
		}.bind(this));
		header.push(<th>Operation</th>);

		var cellFor = function(item, idx, column) {
			var value = item[column.name];



			switch(column.type) {
				case 'Number':
					return (<td><Input 
						standalone
						type='number' 
						value={value} 
						onChange={this.onInputChange} 
						data-idx={idx} 
						data-col={column.name} /></td>);

				case 'Boolean':
					return (<td><Input
						standalone
						type='checkbox'
						wrapperClassName='col-xs-offset-2 col-xs-10'
						checked={value}
						onChange={this.onInputChange} 
						data-idx={idx} 
						data-col={column.name} />	</td>);

				case 'String':
					return (<td><Input 
						standalone
						type='text' 
						value={value} 
						onChange={this.onInputChange} 
						data-idx={idx} 
						data-col={column.name} /></td>);
				default:
					return (<td>{value}</td>);
			}
		}.bind(this);

		var rows = this.state.data.map(function(item, idx) {
			var row = this.state.columns.map(function(column) {
				return cellFor(item, idx, column);
			}.bind(this));
			row.push(<td><Button data-idx={idx} bsSize='xsmall' bsStyle='danger' onClick={this.onClickDelete}>X</Button></td>);
			return (<tr>{row}</tr>);
		}.bind(this));

		var newItemRow = this.state.columns.map(function(column) {
			return cellFor(this.state.newItem, null, column);
		}.bind(this));
		newItemRow.push(<td><Button bsSize='xsmall' bsStyle='success' onClick={this.onClickAdd}>+</Button></td>);
		rows.push(<tr>{newItemRow}</tr>);


		return (
			
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
		);
	},

	onInputChange: function(event) {
		//console.log(event.target.type);
		console.log('onInputChange', event.target.type, event.target.dataset.idx, event.target.dataset.col);
		var item = event.target.dataset.idx
			? this.state.data[event.target.dataset.idx]
			: this.state.newItem;



		if(event.target.type === 'checkbox') {
			console.log(event.target.checked);
			item[event.target.dataset.col] = event.target.checked;	
		} else {
			console.log(event.target.value);
			item[event.target.dataset.col] = event.target.value;
		}

		if(event.target.dataset.idx) {
			this.setState({
				data: this.state.data,
				newItem: this.state.newItem
			});	
		}
		
		this.props.onChange(this.state);
	},

	onClickAdd: function(event) {
		console.log('add item', this.state.newItem);
		this.state.data.push(this.state.newItem);
		this.setState({
			data: this.state.data,
			newItem: {}
		});
		this.props.onChange(this.state);
	},

	onClickDelete: function(event) {
		console.log('delete item', event.target.dataset.idx);

		this.state.data.splice(event.target.dataset.idx, 1);
		this.setState({
			data: this.state.data
		});
		this.props.onChange(this.state);
	}


});

module.exports = DynamicTable;