var React = require('react');
var ReactBootstrap = require('react-bootstrap');
var Table = ReactBootstrap.Table;
var Input = ReactBootstrap.Input;
var Button = ReactBootstrap.Button;
var Modal = ReactBootstrap.Modal;

var Case = require('case');

/**
 * @class DynamicTable
 */
var DynamicTable = {

	/**
	 * get the initial state
	 * @return {object} the initial state
	 */
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
			return (React.createElement("div", null, "No Data"));
		}

		var header = this.state.columns.map(function(column) {
			return (React.createElement("th", null, Case.title(column.name)));
		}.bind(this));
		//header.unshift(<th></th>);
		header.push(React.createElement("th", null));

		//console.log('this.props.widths', this.props.widths);

		var cellFor = function(item, idx, column, selected) {
			var value = item[column.name];
			//console.log(item, idx, column, selected);

			var tdStyle = {};
			if(this.props.widths) {
				tdStyle.width = this.props.widths[column.name];
				//console.log(tdStyle);
			}

			//var elem = {};
			if(selected) {


				switch(column.type) {
					case 'Number':

						return (React.createElement("td", {style: tdStyle}, React.createElement(Input, {
							standalone: true, 
							type: "number", 
							value: value, 
							onChange: this.onInputChange, 
							"data-idx": idx, 
							"data-col": column.name})));

					case 'Boolean':
						return (React.createElement("td", {style: tdStyle}, React.createElement(Input, {
							standalone: true, 
							type: "checkbox", 
							style: {'margin': 0, display: 'table-cell'}, 
							checked: value, 
							onChange: this.onInputChange, 
							"data-idx": idx, 
							"data-col": column.name}), " "));

					case 'String':
						return (React.createElement("td", {style: tdStyle}, React.createElement(Input, {
							standalone: true, 
							type: "text", 
							value: value, 
							style: {
								display: 'table-cell'
							}, 
							onChange: this.onInputChange, 
							"data-idx": idx, 
							"data-col": column.name})));
					default:
						return (React.createElement("td", {style: tdStyle}, value));
				
				}
			} else {
				switch(column.type) {
					case 'Boolean':
						return (React.createElement("td", {style: tdStyle}, value ? '√' : ''));
					default:
						return (React.createElement("td", {style: tdStyle}, value));
				}

				
			}
		}.bind(this);

		var rows = this.state.data.map(function(item, idx) {
			var row = this.state.columns.map(function(column) {
				return cellFor(item, idx, column, this.state.selectedRow === idx);
			}.bind(this));
			
			var checked = (idx === this.state.selectedRow);
			//console.log('ck', checked);
			//row.unshift(<td><Input data-idx={idx} type='radio' name='select' checked={checked} style={{margin: 0}} standalone /></td>);
			row.push(React.createElement("td", null, React.createElement(Button, {"data-idx": idx, bsSize: "xsmall", bsStyle: "danger", onClick: this.onClickDelete}, "x")));
			return (React.createElement("tr", {"data-idx": idx, onClick: this.listener(idx, this.onClickRow)}, row));
		}.bind(this));

		var newItemRow = this.state.columns.map(function(column) {
			return cellFor(this.state.newItem, null, column, this.state.selectedRow === this.state.data.length);
		}.bind(this));
		//newItemRow.unshift(<td></td>);
		newItemRow.push(React.createElement("td", null, React.createElement(Button, {bsSize: "xsmall", bsStyle: "success", onClick: this.onClickAdd}, "+")));
		rows.push(React.createElement("tr", {className: "warning", onClick: this.listener(this.state.data.length, this.onClickRow)}, newItemRow));

		console.log('before rendor return');
		return (
			React.createElement("div", null, 
				React.createElement(Table, {striped: true, condensed: true, hover: true}, 
					React.createElement("thead", null, 
						React.createElement("tr", {ref: "headerRow"}, 
							header
						)
					), 
					React.createElement("tbody", null, 
						rows
					)
				), 
				React.createElement(Modal, {
					show: this.state.showConfirmDelete, 
					onHide: this.onCancelDelete, 
					container: this, 
					"aria-labelledby": "contained-modal-title"}, 
					React.createElement(Modal.Header, {closeButton: true}, 
						React.createElement(Modal.Title, null, "Delete Confirmation")
					), 
					React.createElement(Modal.Body, null, 
						"Are you sure about deleting item ", this.state.itemToDelete, "?"
					), 
					React.createElement(Modal.Footer, null, 
						React.createElement(Button, {bsStyle: "danger", onClick: this.onConfirmDelete}, "Confirm"), 
						React.createElement(Button, {onClick: this.onCancelDelete}, "Cancel")
					)
				)
			)
		);
	},

	componentDidUpdate: function(prevProps, prevState) {

		// get the column width to be use for the next render
		// to avoid input messing up column widht
		var ths = this.refs.headerRow.getDOMNode().children;
		this.props.widths = {};
		for(var i in ths) {
			if(this.state.columns[i])
				this.props.widths[this.state.columns[i].name] = ths[i].offsetWidth;
			else
				this[i] = '';
		}
		
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
			//console.log(event.target.checked);
			item[event.target.dataset.col] = event.target.checked;	
		} else {
			//console.log(event.target.value);
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
		//var tag = event.target.tagName;
		//if(tag === 'TD' || tag === 'DIV' || event.target.type === 'radio')
		console.log('onClickRow', idx);
		this.setState({
			selectedRow: idx
		});
	},

};

DynamicTable = React.createClass(DynamicTable);

module.exports = DynamicTable;