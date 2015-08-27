//==============================
//	Required modules
'use strict';

var React = require('react/addons');
var ReactBootstrap = require('react-bootstrap');
var Case = require('case');

//==============================
//	ReactBootstrap components
var Table = ReactBootstrap.Table;
var Input = ReactBootstrap.Input;
var Button = ReactBootstrap.Button;
var Modal = ReactBootstrap.Modal;
var Glyphicon = ReactBootstrap.Glyphicon;
var ReactCSSTransitionGroup = React.addons.CSSTransitionGroup;

/**
 * @class DynamicTable
 * @property {array.<object>} state.data The data to display.
 * @property {array.<object>} state.columns The columns to diplay and their info.
 * @property {string} state.columns.name The column name.
 * @property {string} state.columns.type One of String, Number, or Boolean.
 * @property {string} state.columns.subtype One of Date.
 * @property {DynamicTable#willSelectItem} props.willSelectItem Called when an item would be selected.
 * @property {DynamicTable#didSelectItem} props.didSelectItem Called when an item is selected.
 * @property {DynamicTable#willRemoveItem} props.willRemoveItem Called when an item would be removed.
 * @property {DynamicTable#didRemoveItem} props.didRemoveItem Called when an item is removed.
 * @property {DynamicTable#willStartCreatingItem} props.willStartCreatingItem Called when an item would be started to be created.
 * @property {DynamicTable#didStartCreatingItem} props.didStartCreatingItem Called when an item is started to be created.
 * 
 */
var DynamicTable = {

	getInitialState: function getInitialState() {
		return {
			columns: [],
			data: [],
			newItem: {},
			showConfirmDelete: false
		};
	},

	getDefaultProps: function getDefaultProps() {
		return {
			/**
    * @callback DynamicTable#willSelectItem
    * @param {number} index The index of the item to be selected.
    * @param {object} item A copy of the item to be selected.
    * @param {DynamicTable#willSelectItemCallback} cb Callback.
    */
			/**
    * @member asdf
    */
			willSelectItem: function willSelectItem(idx, item, cb) {
				return cb(false);
			},
			/**
    * @callback DynamicTable#didSelectItem
    * @param  {number} index The index of the selected item.
    * @param  {object} item A copy of the selected item.
    */
			didSelectItem: function didSelectItem(idx, item) {
				return null;
			},
			/**
    * @callback DynamicTable#willRemoveItem
    * @param {number} index The index of the item to be removed.
    * @param {object} item A copy of the item to be removed.
    * @param {DynamicTable#willRemoveItemCallback} cb Callback.
    */
			willRemoveItem: function willRemoveItem(idx, item, cb) {
				return cb(false);
			},
			/**
    * @callback DynamicTable#didRemoveItem
    * @param  {number} index The index of the removed item.
    * @param  {object} item A copy of the removed item.
    */
			didRemoveItem: function didRemoveItem(idx, item) {
				return null;
			},
			/**
    * @callback DynamicTable#willStartCreatingItem
    * @param {object} item A copy of the item to be started to be created.
    * @param {DynamicTable#willStartCreatingItemCallback} cb Callback.
    */
			willStartCreatingItem: function willStartCreatingItem(item, cb) {
				return cb(false, item);
			},
			/**
    * @callback DynamicTable#didStartCreatingItem
    * @param  {object} item A copy of the item starting to be created.
    */
			didStartCreatingItem: function didStartCreatingItem(item) {
				return null;
			},

			willStartEditingItem: function willStartEditingItem(idx, item, cb) {
				return cb(false, item);
			},
			didStartEditingItem: function didStartEditingItem(item) {
				return null;
			},

			willEditField: function willEditField(idx, item, field, value, cb) {
				return cb(false, value);
			},
			didEditField: function didEditField(idx, item, field, value) {
				return null;
			},

			willSaveEditing: function willSaveEditing(idx, item, cb) {
				return cb(false, item);
			},
			didSaveEditing: function didSaveEditing(idx, item) {
				return null;
			},

			willCancelEditing: function willCancelEditing(idx, item, cb) {
				return cb(false);
			},
			didCancelEditing: function didCancelEditing(idx, item) {
				return null;
			}
		};
	},

	render: function render() {
		var _this = this;

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

		var cellFor = (function (item, idx, column, selected, edited) {
			var value = item[column.name];
			//console.log(item, idx, column, selected, edited);

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

			//console.log(column);
			//'padding-left': 0,
			//'margin-right': 0
			var inputType = 'text';
			if (column.subtype) {
				inputType = column.subtype;
			}

			//console.log('subtype', inputType);

			//var elem = {};
			if (edited) {

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

		var actionCell = function actionCell(idx) {
			if (idx === _this.state.editedRow) {
				return React.createElement(
					'td',
					null,
					React.createElement(
						Button,
						{ bsSize: 'xsmall', bsStyle: 'success', onClick: _this.listener(idx, _this.onClickOk) },
						React.createElement(Glyphicon, { glyph: 'ok' })
					),
					React.createElement(
						'span',
						null,
						' '
					),
					React.createElement(
						Button,
						{ bsSize: 'xsmall', bsStyle: 'danger', onClick: _this.listener(idx, _this.onClickCancel) },
						React.createElement(Glyphicon, { glyph: 'remove' })
					)
				);
			} else if (idx === _this.state.data.length) {
				return React.createElement(
					'td',
					null,
					React.createElement(
						Button,
						{ bsSize: 'xsmall', bsStyle: 'success', onClick: _this.onClickAdd },
						React.createElement(Glyphicon, { glyph: 'plus' })
					)
				);
			} else {
				return React.createElement(
					'td',
					null,
					React.createElement(
						Button,
						{ bsSize: 'xsmall', bsStyle: 'warning', onClick: _this.listener(idx, _this.onClickEdit) },
						React.createElement(Glyphicon, { glyph: 'edit' })
					),
					React.createElement(
						'span',
						null,
						' '
					),
					React.createElement(
						Button,
						{ bsSize: 'xsmall', bsStyle: 'danger', onClick: _this.listener(idx, _this.onClickRemove) },
						React.createElement(Glyphicon, { glyph: 'trash' })
					)
				);
			}
		};

		var rows = this.state.data.map((function (item, idx) {
			var row = this.state.columns.map((function (column) {
				return cellFor(item, idx, column, this.state.selectedRow === idx, this.state.editedRow === idx);
			}).bind(this));

			var checked = idx === this.state.selectedRow;
			row.push(actionCell(idx));
			//row.push(<td><Button data-idx={idx} bsSize='xsmall' bsStyle='danger' onClick={this.onClickDelete}><Glyphicon glyph='remove' /></Button></td>);
			return React.createElement(
				'tr',
				{ className: checked ? 'info' : '', 'data-idx': idx, onClick: this.listener(idx, this.onClickRow) },
				row
			);
		}).bind(this));

		var newItemRow = this.state.columns.map((function (column) {
			return cellFor(this.state.newItem, null, column, this.state.selectedRow === this.state.data.length, this.state.editedRow === this.state.data.length);
		}).bind(this));
		//newItemRow.unshift(<td></td>);
		newItemRow.push(actionCell(this.state.data.length));
		rows.push(React.createElement(
			'tr',
			{ className: 'warning', onClick: this.listener(this.state.data.length, this.onClickRow) },
			newItemRow
		));

		//console.log('before rendor return');
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
					onHide: this.onCancelRemove,
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
						{ bsStyle: 'danger', onClick: this.onConfirmRemove },
						'Confirm'
					),
					React.createElement(
						Button,
						{ onClick: this.onCancelRemove },
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

	//==============================
	//	Helper functions
	listener: function listener(idx, f) {
		return function (event) {
			f(event, idx);
		};
	},

	copyItem: function copyItem(item) {
		return JSON.parse(JSON.stringify(item));
	},

	//==============================
	//	Event listeners
	onClickRow: function onClickRow(event, idx) {
		var _this2 = this;

		if (idx == this.state.data.length) return;
		var item = this.copyItem(this.state.data[idx]);
		this.props.willSelectItem(idx, item,
		/**
   * @callback DynamicTable#willSelectItemCallback
   * @param  {boolean} error Will not select the item if set.
   */
		function (error) {
			if (error) return;
			_this2.setState({ selectedRow: idx }, function () {
				_this2.props.didSelectItem(idx, item);
			});
		});
	},

	onClickRemove: function onClickRemove(event, idx) {
		this.setState({ showConfirmDelete: true, itemToDelete: idx });
	},

	onCancelRemove: function onCancelRemove(event) {
		this.setState({ showConfirmDelete: false });
	},

	onConfirmRemove: function onConfirmRemove(event) {
		var _this3 = this;

		var idx = this.state.itemToDelete;
		var item = this.copyItem(this.state.data[idx]);
		this.props.willRemoveItem(idx, item,
		/**
   * @callback DynamicTable#willRemoveItemCallback
   * @param  {boolean} error Will not remove the item if set.
   */
		function (error) {
			if (error) {
				_this3.onCancelRemove(event);
				return;
			}
			_this3.state.data.splice(idx, 1);
			_this3.setState({ data: _this3.state.data }, function () {
				_this3.props.onChange(_this3.state);
				_this3.onCancelRemove(event);
				_this3.props.didRemoveItem(idx, item);
			});
		});
	},

	onClickAdd: function onClickAdd(event) {
		var _this4 = this;

		var item = this.copyItem(this.state.newItem);
		this.props.willStartCreatingItem(item,
		/**
   * @callback DynamicTable#willStartCreatingItemCallback
   * @param  {boolean} error Will not start creating the item if set.
   * @param  {item} item The item to start creating.
   */
		function (error, item) {
			if (error) return;
			_this4.setState({ newItem: item, editedRow: _this4.state.data.length }, function () {
				_this4.props.didStartCreatingItem(item);
			});
		});
	},

	onClickEdit: function onClickEdit(event, idx) {
		var _this5 = this;

		this.props.willStartEditingItem(idx, this.copyItem(idx), function (idx, item) {
			_this5.setState({
				uneditedItem: item,
				editedRow: idx
			}, function () {
				_this5.props.disStartEditingItem();
			});
		});
	},

	onClickOk: function onClickOk(event, idx) {
		var _this6 = this;

		if (idx < this.state.data.length) {
			this.setState({
				editedRow: null
			});
			return;
		}

		this.props.onAddRow(this.state.newItem, function (error, item) {
			if (error) return;

			_this6.state.data.push(item);
			_this6.setState({
				data: _this6.state.data,
				newItem: {},
				selectedRow: _this6.state.data.length - 1,
				editedRow: null
			});
			_this6.props.onChange(_this6.state);
		});
	},

	onClickCancel: function onClickCancel(event, idx) {
		if (idx < this.state.data.length) {
			this.state.data[idx] = this.state.uneditedItem;
		}

		this.setState({
			editedRow: null
		});
	},

	onInputChange: function onInputChange(event) {
		var _this7 = this;

		console.log('onInputChange', event.target.type, event.target.dataset.idx, event.target.dataset.col);

		var idx = event.target.dataset.idx;
		var col = event.target.dataset.col;

		var item = event.target.dataset.idx ? this.state.data[idx] : this.state.newItem;

		var value = event.target.type === 'checkbox' ? event.target.checked : event.target.value;

		this.props.onUpdateRow(idx, col, value, item, function (error, value) {
			if (error) return;

			item[col] = value;
			_this7.setState({
				data: _this7.state.data,
				newItem: _this7.state.newItem
			});
			_this7.props.onChange(_this7.state);
		});
	},

	onClickAdd2: function onClickAdd2(event) {
		var _this8 = this;

		console.log('add item', this.state.newItem);

		this.props.onAddRow(this.state.newItem, function (error, item) {
			if (error) return;

			_this8.state.data.push(item);
			_this8.setState({
				data: _this8.state.data,
				newItem: {},
				selectedRow: _this8.state.data.length - 1,
				editedRow: null
			});
			_this8.props.onChange(_this8.state);
		});
	},

	closeDeleteConfirm: function closeDeleteConfirm(event) {
		this.setState({
			showConfirmDelete: false
		});
	},

	onDoubleClickRow: function onDoubleClickRow(event, idx) {
		if (this.state.editedRow === idx) return;

		this.props.onEditRow(idx);
		this.setState({
			editedRow: idx
		});
	}

};

DynamicTable = React.createClass(DynamicTable);

module.exports = DynamicTable;