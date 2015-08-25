var React = require('react/addons');
var ReactBootstrap = require('react-bootstrap');
var Table = ReactBootstrap.Table;
var Input = ReactBootstrap.Input;
var Button = ReactBootstrap.Button;
var Modal = ReactBootstrap.Modal;
var Glyphicon = ReactBootstrap.Glyphicon;
var ReactCSSTransitionGroup = React.addons.CSSTransitionGroup;

var Case = require('case');

/**
 * @class DynamicTable
 * @property {array.<object>} state.data The data to display.
 * @property {array.<object>} state.columns The columns to diplay and their info.
 * @property {string} state.columns.name The column name.
 * @property {string} state.columns.type One of String, Number, or Boolean.
 * @property {string} state.columns.subtype One of Date.
 * @property {DynamicTable#rowsAffected} props.onSelectRow Called when a row is selected.
 * @property {DynamicTable#rowsAffected} props.onUpdateRow Called when a row is updated.
 * @property {DynamicTable#rowsAffected} props.onAddRow Called when a row is added.
 * @property {DynamicTable#rowsAffected} props.onDeleteRow Called when a row is deleted.
 */
var DynamicTable = {

	/**
	 * @callback DynamicTable#rowsAffected
	 * @param {number} index The index of the row affected.
	 * @param {string} column The column of the row's field affected.
	 * @param {number|string|boolean} value The changed value.
	 * @param {object} item The old item.
	 * @param {DynamicTable#valueUpdate} cb Callback to provide the value to update.
	 */
	
	/**
	 * @callback DynamicTable#valueUpdate
	 * @param {number|string|boolean} value The value to update
	 */
	

	getInitialState: function() {
		return {
			columns: [],
			data: [],
			newItem: {},
			showConfirmDelete: false
		};
	},

	getDefaultProps: function() {
    return {
      willSelectItem: (idx, item, cb) => cb(idx, item),
      didSelectItem: (idx, item) => null,
      willStartEditingItem: (idx, item, cb) => cb(idx, item),
      didStartEditingItem: (idx, item, cb) => null,
      isEditingItem: (idx, item, field, value, cb) => cb(value),
      didEditItem: (idx, item, success, cb) => cb(idx, item, success)
    };
  },

	render: function() {
		console.log('render', this.state);

		if(!this.state) {
			return (<div>No Data</div>);
		}


		
		var header = this.state.columns.map(function(column) {
			var options = '';
			if(column.values) {
				options = column.values.map(function(value) {
					return (<option>{value}</option>);
				}.bind(this));
				options = (<datalist id={column.name + 'values'}>{options}</datalist>);
			}
			return (<th>{Case.title(column.name)}{options}</th>);
		}.bind(this));
		header.push(<th></th>);



		//console.log('this.props.widths', this.props.widths);

		var cellFor = function(item, idx, column, selected, edited) {
			var value = item[column.name];
			//console.log(item, idx, column, selected, edited);

			var tdStyle = {};
			if(this.props.widths) {
				tdStyle.width = this.props.widths[column.name];
				//console.log(tdStyle);
			}

			var inputStyle = {
				//'height': '100%',
				//'margin-left': -12,
				'padding-right': 0,
				//'padding-left': 0,
				//'margin-right': 0
			};


			//console.log(column);
			var inputType = 'text';
			if(column.subtype) {
				inputType = column.subtype;
			}

			//console.log('subtype', inputType);

			//var elem = {};
			if(edited) {



				switch(column.type) {
					case 'Number':

						return (<td style={tdStyle}><Input 
							standalone
							type='number' 
							style={inputStyle}
							value={value} 
							onChange={this.onInputChange} 
							data-idx={idx} 
							data-col={column.name} /></td>);

					case 'Boolean':
						return (<td style={tdStyle}><Input
							standalone
							type='checkbox'
							style={{'margin': 0}}
							checked={value}
							onChange={this.onInputChange} 
							data-idx={idx} 
							data-col={column.name} />	</td>);

					case 'String':
						if(inputType === 'select') {
							return (<td style={tdStyle}><Input 
								standalone
								type={'select'}
								style={inputStyle}
								value={value} 
								onChange={this.onInputChange} 
								data-idx={idx} 
								data-col={column.name}>
									{column.values.map(function(value) {
										return (<option value={value}>{value}</option>);
									})}
								</Input></td>);
						} else if(inputType === 'datalist') {
							return (<td style={tdStyle}><Input 
								standalone
								type={'text'}
								list={column.name + 'values'}
								value={value} 
								style={inputStyle}
								onChange={this.onInputChange} 
								data-idx={idx} 
								data-col={column.name}></Input></td>);
						}
						return (<td style={tdStyle}><Input 
							standalone
							type={inputType}
							value={value} 
							style={inputStyle}
							onChange={this.onInputChange} 
							data-idx={idx} 
							data-col={column.name} /></td>);
					default:
						return (<td style={tdStyle}>{value}</td>);
				
				}
			} else {
				switch(column.type) {
					case 'Boolean':
						return (<td style={tdStyle}>{value ? '√' : ''}</td>);
					default:
						return (<td style={tdStyle}>{value}</td>);
				}

				
			}
		}.bind(this);


		var actionCell = (idx) => {
			if(idx === this.state.editedRow) {
				return (
					<td>
						<Button bsSize='xsmall' bsStyle='success' onClick={this.listener(idx, this.onClickOk)}>
							<Glyphicon glyph='ok' />
						</Button>
						<span> </span>
						<Button bsSize='xsmall' bsStyle='danger' onClick={this.listener(idx, this.onClickCancel)}>
							<Glyphicon glyph='remove' />
						</Button>
					</td>
				);
				
			} else if(idx === this.state.data.length) {
				return (
					<td>
						<Button bsSize='xsmall' bsStyle='success' onClick={this.onClickAdd}>
							<Glyphicon glyph='plus' />
						</Button>
					</td>
				);
			} else {
				return (
					<td>
						<Button bsSize='xsmall' bsStyle='warning' onClick={this.listener(idx, this.onClickEdit)}>
							<Glyphicon glyph='edit' />
						</Button>
						<span> </span>
						<Button bsSize='xsmall' bsStyle='danger' onClick={this.listener(idx, this.onClickRemove)}>
							<Glyphicon glyph='trash' />
						</Button>
					</td>
				);	
			}
		};




		var rows = this.state.data.map(function(item, idx) {
			var row = this.state.columns.map(function(column) {
				return cellFor(item, idx, column, this.state.selectedRow === idx, this.state.editedRow === idx);
			}.bind(this));
			
			var checked = (idx === this.state.selectedRow);
			row.push(actionCell(idx));
			//row.push(<td><Button data-idx={idx} bsSize='xsmall' bsStyle='danger' onClick={this.onClickDelete}><Glyphicon glyph='remove' /></Button></td>);
			return (<tr className={checked ? 'info' : ''} data-idx={idx} onClick={this.listener(idx, this.onClickRow)}>{row}</tr>);
		}.bind(this));

		var newItemRow = this.state.columns.map(function(column) {
			return cellFor(this.state.newItem, null, column, this.state.selectedRow === this.state.data.length, this.state.editedRow === this.state.data.length);
		}.bind(this));
		//newItemRow.unshift(<td></td>);
		newItemRow.push(actionCell(this.state.data.length));
		rows.push(<tr className='warning' onClick={this.listener(this.state.data.length, this.onClickRow)} >{newItemRow}</tr>);

		//console.log('before rendor return');
		return (
			<div>
				<Table striped condensed hover>
					<thead>
						<tr ref='headerRow'>
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

	copyItem: function(idx) {
		//return Object.assign({}, this.state.data[idx]);
		return JSON.parse(JSON.stringify(this.state.data[idx]));
	},

	onClickRow: function(event, idx) {
		this.props.willSelectItem(idx, this.copyItem(idx), (idx, item) => {
			this.setState({
				selectedRow: idx
			}, () => {
				this.props.didSelectItem();
			});
		});
	},

	onClickEdit: function(event, idx) {
		this.props.willStartEditingItem(idx, this.copyItem(idx), (idx, item) => {
			this.setState({
				uneditedItem: item,
				editedRow: idx
			}, () => {
				this.props.disStartEditingItem();
			});	
		});

		
	},

	onClickRemove: function(event, idx) {
		this.setState({
			showConfirmDelete: true,
			itemToDelete: idx
		});
	},

	onClickOk: function(event, idx) {
		if(idx < this.state.data.length) {
			this.setState({
				editedRow: null
			});
			return;
		}

		this.props.onAddRow(this.state.newItem, (error, item) => {
			if(error) 
				return;

			this.state.data.push(item);
			this.setState({
				data: this.state.data,
				newItem: {},
				selectedRow: this.state.data.length - 1,
				editedRow: null
			});
			this.props.onChange(this.state);		
		});
		
	},

	onClickCancel: function(event, idx) {
		if(idx < this.state.data.length) {
			this.state.data[idx] = this.state.uneditedItem;
		}

		this.setState({
			editedRow: null
		});

	},

	onClickAdd: function(event) {
		this.setState({
			editedRow: this.state.data.length
		});	
	},

	onInputChange: function(event) {
		console.log('onInputChange', event.target.type, event.target.dataset.idx, event.target.dataset.col);
		
		var idx = event.target.dataset.idx;
		var col = event.target.dataset.col;

		var item = event.target.dataset.idx
			? this.state.data[idx]
			: this.state.newItem;

		var value = event.target.type === 'checkbox'
			? event.target.checked
			: event.target.value;

		this.props.onUpdateRow(idx, col, value, item, (error, value) => {
			if(error) 
				return;

			item[col] = value;
			this.setState({
				data: this.state.data,
				newItem: this.state.newItem
			});
			this.props.onChange(this.state);
		});
		
	},


	onClickAdd2: function(event) {
		console.log('add item', this.state.newItem);

		this.props.onAddRow(this.state.newItem, (error, item) => {
			if(error) 
				return;

			this.state.data.push(item);
			this.setState({
				data: this.state.data,
				newItem: {},
				selectedRow: this.state.data.length - 1,
				editedRow: null
			});
			this.props.onChange(this.state);		
		});

		
	},

	onConfirmDelete: function(event) {
		console.log('delete item', this.state.itemToDelete);

		this.props.onDeleteRow(this.state.itemToDelete, (error, idx) => {
			if(error) return;

			this.state.data.splice(idx, 1);
			this.setState({
				data: this.state.data
			});
			this.props.onChange(this.state);
			this.onCancelDelete(event);
			//this.props.onDeleteRow(event);
		});
	},



	onCancelDelete: function(event) {
		this.setState({
			showConfirmDelete: false
		});
	},

	closeDeleteConfirm: function(event) {
		this.setState({
			showConfirmDelete: false
		});
	},	

	

	onDoubleClickRow: function(event, idx) {
		if(this.state.editedRow === idx)
			return;

		this.props.onEditRow(idx);
		this.setState({
			editedRow: idx
		});
	},

};

DynamicTable = React.createClass(DynamicTable);

module.exports = DynamicTable;