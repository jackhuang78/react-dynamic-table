var React = require('react');
var ReactBootstrap = require('react-bootstrap');
var Table = ReactBootstrap.Table;
var Input = ReactBootstrap.Input;
var Button = ReactBootstrap.Button;
var Modal = ReactBootstrap.Modal;

var Case = require('case');

var DynamicTable = React.createClass({

	getInitialState: function() {
		return {
			columns: [],
			data: [],
			newItem: {},
			showConfirmDelete: false
		};
	},

	render: function() {
		console.log('render', this.state);

		if(!this.state) {
			return (<div>No Data</div>);
		}

		var header = this.state.columns.map(function(column) {
			return (<th>{Case.title(column.name)}</th>);
		}.bind(this));
		header.unshift(<th></th>);
		header.push(<th></th>);

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
			
			var checked = (idx === this.state.selectedRow);
			//console.log('ck', checked);
			row.unshift(<td><Input data-idx={idx} type='radio' name='select' checked={checked} wrapperClassName='col-xs-offset-2 col-xs-10' standalone/></td>);
			row.push(<td><Button data-idx={idx} bsSize='xsmall' bsStyle='danger' onClick={this.onClickDelete}>x</Button></td>);
			return (<tr data-idx={idx} onClick={this.listener(idx, this.onClickRow)}>{row}</tr>);
		}.bind(this));

		var newItemRow = this.state.columns.map(function(column) {
			return cellFor(this.state.newItem, null, column);
		}.bind(this));
		newItemRow.unshift(<td></td>);
		newItemRow.push(<td><Button bsSize='xsmall' bsStyle='success' onClick={this.onClickAdd}>+</Button></td>);
		rows.push(<tr>{newItemRow}</tr>);


		return (
			<div>
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
				<Modal
					show={this.state.showConfirmDelete}
					onHide={this.onCancelDelete}
					container={this}
					aria-labelledby='contained-modal-title'>
					<Modal.Header closeButton>
						<Modal.Title>Delete Confirmation</Modal.Title>
					</Modal.Header>
					<Modal.Body>
						Are you sure about deleting item {this.state.itemToDelete}?
					</Modal.Body>
					<Modal.Footer>
						<Button bsStyle='danger' onClick={this.onConfirmDelete}>Confirm</Button>
						<Button onClick={this.onCancelDelete}>Cancel</Button>
					</Modal.Footer>
				</Modal>
			</div>
		);
	},

	listener: function(idx, f) {
		return function(event) {
			f(event, idx);
		};
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
		this.setState({
			showConfirmDelete: true,
			itemToDelete: event.target.dataset.idx
		});
	},

	onConfirmDelete: function(event) {
		console.log('delete item', this.state.itemToDelete);

		this.state.data.splice(this.state.itemToDelete, 1);
		this.setState({
			data: this.state.data
		});
		this.props.onChange(this.state);
		this.onCancelDelete(event);
	},

	onCancelDelete: function(event) {
		this.setState({
			showConfirmDelete: false
		});
	},

	onSelectRow: function(event) {
		console.log('select row', event.target.dataset.idx);
		this.setState({
			selectedRow: event.target.dataset.idx
		});
	},

	closeDeleteConfirm: function(event) {
		this.setState({
			showConfirmDelete: false
		});
	},	

	onClickRow: function(event, idx) {
		//console.log(event.target.type, idx);
		//console.log('row clicked', event.target.type, event.target);
		var tag = event.target.tagName;
		if(tag === 'TD' || tag === 'DIV' || event.target.type === 'radio')
		this.setState({
				selectedRow: idx
			});
	},

});

module.exports = DynamicTable;