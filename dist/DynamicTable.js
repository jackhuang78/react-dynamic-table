'use strict';

var React = require('react');
var ReactBootstrap = require('react-bootstrap');
var Table = ReactBootstrap.Table;
var Input = ReactBootstrap.Input;
var Button = ReactBootstrap.Button;
var Modal = ReactBootstrap.Modal;

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
  * @return {null}
  */

	/**
  * @callback DynamicTable#valueUpdate
  * @param {number|string|boolean} value The value to update
  */

	getInitialState: function getInitialState() {
		return {
			columns: [],
			data: [],
			newItem: {},
			showConfirmDelete: false
		};
	},

	render: function render() {
		console.log('render', this.state);

		if (!this.state) {
			return React.createElement(
				'div',
				null,
				'No Data'
			);
		}

		var header = this.state.columns.map((function (column) {
			var options = '';
			if (column.values) {
				options = column.values.map((function (value) {
					return React.createElement(
						'option',
						null,
						value
					);
				}).bind(this));
				options = React.createElement(
					'datalist',
					{ id: column.name + 'values' },
					options
				);
			}
			return React.createElement(
				'th',
				null,
				Case.title(column.name),
				options
			);
		}).bind(this));
		header.push(React.createElement('th', null));

		//console.log('this.props.widths', this.props.widths);

		var cellFor = (function (item, idx, column, selected) {
			var value = item[column.name];
			console.log(item, idx, column, selected);

			var tdStyle = {};
			if (this.props.widths) {
				tdStyle.width = this.props.widths[column.name];
				//console.log(tdStyle);
			}

			var inputStyle = {
				//'height': '100%',
				//'margin-left': -12,
				'padding-right': 0
			};

			//'padding-left': 0,
			//'margin-right': 0
			console.log(column);
			var inputType = 'text';
			if (column.subtype) {
				inputType = column.subtype;
			}

			console.log('subtype', inputType);

			//var elem = {};
			if (selected) {

				switch (column.type) {
					case 'Number':

						return React.createElement(
							'td',
							{ style: tdStyle },
							React.createElement(Input, {
								standalone: true,
								type: 'number',
								style: inputStyle,
								value: value,
								onChange: this.onInputChange,
								'data-idx': idx,
								'data-col': column.name })
						);

					case 'Boolean':
						return React.createElement(
							'td',
							{ style: tdStyle },
							React.createElement(Input, {
								standalone: true,
								type: 'checkbox',
								style: { 'margin': 0 },
								checked: value,
								onChange: this.onInputChange,
								'data-idx': idx,
								'data-col': column.name }),
							' '
						);

					case 'String':
						if (inputType === 'select') {
							return React.createElement(
								'td',
								{ style: tdStyle },
								React.createElement(
									Input,
									{
										standalone: true,
										type: 'select',
										style: inputStyle,
										value: value,
										onChange: this.onInputChange,
										'data-idx': idx,
										'data-col': column.name },
									column.values.map(function (value) {
										return React.createElement(
											'option',
											{ value: value },
											value
										);
									})
								)
							);
						} else if (inputType === 'datalist') {
							return React.createElement(
								'td',
								{ style: tdStyle },
								React.createElement(Input, {
									standalone: true,
									type: 'text',
									list: column.name + 'values',
									value: value,
									style: inputStyle,
									onChange: this.onInputChange,
									'data-idx': idx,
									'data-col': column.name })
							);
						}
						return React.createElement(
							'td',
							{ style: tdStyle },
							React.createElement(Input, {
								standalone: true,
								type: inputType,
								value: value,
								style: inputStyle,
								onChange: this.onInputChange,
								'data-idx': idx,
								'data-col': column.name })
						);
					default:
						return React.createElement(
							'td',
							{ style: tdStyle },
							value
						);

				}
			} else {
				switch (column.type) {
					case 'Boolean':
						return React.createElement(
							'td',
							{ style: tdStyle },
							value ? '√' : ''
						);
					default:
						return React.createElement(
							'td',
							{ style: tdStyle },
							value
						);
				}
			}
		}).bind(this);

		var rows = this.state.data.map((function (item, idx) {
			var row = this.state.columns.map((function (column) {
				return cellFor(item, idx, column, this.state.selectedRow === idx);
			}).bind(this));

			var checked = idx === this.state.selectedRow;
			//console.log('ck', checked);
			//row.unshift(<td><Input data-idx={idx} type='radio' name='select' checked={checked} style={{margin: 0}} standalone /></td>);
			row.push(React.createElement(
				'td',
				null,
				React.createElement(
					Button,
					{ 'data-idx': idx, bsSize: 'xsmall', bsStyle: 'danger', onClick: this.onClickDelete },
					'x'
				)
			));
			return React.createElement(
				'tr',
				{ 'data-idx': idx, onDoubleClick: this.listener(idx, this.onClickRow) },
				row
			);
		}).bind(this));

		var newItemRow = this.state.columns.map((function (column) {
			return cellFor(this.state.newItem, null, column, this.state.selectedRow === this.state.data.length);
		}).bind(this));
		//newItemRow.unshift(<td></td>);
		newItemRow.push(React.createElement(
			'td',
			null,
			React.createElement(
				Button,
				{ bsSize: 'xsmall', bsStyle: 'success', onClick: this.onClickAdd },
				'+'
			)
		));
		rows.push(React.createElement(
			'tr',
			{ className: 'warning', onClick: this.listener(this.state.data.length, this.onClickRow) },
			newItemRow
		));

		console.log('before rendor return');
		return React.createElement(
			'div',
			null,
			React.createElement(
				Table,
				{ striped: true, condensed: true, hover: true },
				React.createElement(
					'thead',
					null,
					React.createElement(
						'tr',
						{ ref: 'headerRow' },
						header
					)
				),
				React.createElement(
					'tbody',
					null,
					rows
				)
			),
			React.createElement(
				Modal,
				{
					show: this.state.showConfirmDelete,
					onHide: this.onCancelDelete,
					container: this,
					'aria-labelledby': 'contained-modal-title' },
				React.createElement(
					Modal.Header,
					{ closeButton: true },
					React.createElement(
						Modal.Title,
						null,
						'Delete Confirmation'
					)
				),
				React.createElement(
					Modal.Body,
					null,
					'Are you sure about deleting item ',
					this.state.itemToDelete,
					'?'
				),
				React.createElement(
					Modal.Footer,
					null,
					React.createElement(
						Button,
						{ bsStyle: 'danger', onClick: this.onConfirmDelete },
						'Confirm'
					),
					React.createElement(
						Button,
						{ onClick: this.onCancelDelete },
						'Cancel'
					)
				)
			)
		);
	},

	componentDidUpdate: function componentDidUpdate(prevProps, prevState) {

		// get the column width to be use for the next render
		// to avoid input messing up column widht
		var ths = this.refs.headerRow.getDOMNode().children;
		this.props.widths = {};
		for (var i in ths) {
			if (this.state.columns[i]) this.props.widths[this.state.columns[i].name] = ths[i].offsetWidth;else this[i] = '';
		}
	},

	listener: function listener(idx, f) {
		return function (event) {
			f(event, idx);
		};
	},

	onInputChange: function onInputChange(event) {
		var _this = this;

		console.log('onInputChange', event.target.type, event.target.dataset.idx, event.target.dataset.col);

		var idx = event.target.dataset.idx;
		var col = event.target.dataset.col;

		var item = event.target.dataset.idx ? this.state.data[idx] : this.state.newItem;

		var value = event.target.type === 'checkbox' ? event.target.checked : event.target.value;

		this.props.onUpdateRow(idx, col, value, item, function (value) {
			item[col] = value;
			_this.setState({
				data: _this.state.data,
				newItem: _this.state.newItem
			});
			_this.props.onChange(_this.state);
		});
	},

	onClickAdd: function onClickAdd(event) {
		console.log('add item', this.state.newItem);
		this.state.data.push(this.state.newItem);
		this.setState({
			data: this.state.data,
			newItem: {}
		});
		this.props.onChange(this.state);
		this.props.onAddRow(event);
	},

	onClickDelete: function onClickDelete(event) {
		this.setState({
			showConfirmDelete: true,
			itemToDelete: event.target.dataset.idx
		});
	},

	onConfirmDelete: function onConfirmDelete(event) {
		console.log('delete item', this.state.itemToDelete);
		this.state.data.splice(this.state.itemToDelete, 1);
		this.setState({
			data: this.state.data
		});
		this.props.onChange(this.state);
		this.onCancelDelete(event);
		this.props.onDeleteRow(event);
	},

	onCancelDelete: function onCancelDelete(event) {
		this.setState({
			showConfirmDelete: false
		});
	},

	closeDeleteConfirm: function closeDeleteConfirm(event) {
		this.setState({
			showConfirmDelete: false
		});
	},

	onClickRow: function onClickRow(event, idx) {
		console.log('onClickRow', idx);
		this.props.onSelectRow(event);
		this.setState({
			selectedRow: idx
		});
	}

};

DynamicTable = React.createClass(DynamicTable);

module.exports = DynamicTable;