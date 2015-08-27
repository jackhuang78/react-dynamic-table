'use strict';

var React = require('react');
var ReactBootstrap = require('react-bootstrap');
var Button = ReactBootstrap.Button;
var PageHeader = ReactBootstrap.PageHeader;
var Panel = ReactBootstrap.Panel;
var Input = ReactBootstrap.Input;
var Alert = ReactBootstrap.Alert;
var NotificationSystem = require('react-notification-system');
var DynamicTable = require('./DynamicTable');
var cookie = require('react-cookie');
var util = require('util');
var sampleData = require('../public/demoData.json');

var Demo = React.createClass({
	displayName: 'Demo',

	render: function render() {
		var _this = this;

		return React.createElement(
			'div',
			null,
			React.createElement(NotificationSystem, { ref: 'notificationSystem' }),
			React.createElement(
				Panel,
				{ style: { margin: 30 } },
				React.createElement(
					PageHeader,
					null,
					'DynamicTable Demo'
				),
				React.createElement(
					Button,
					{ bsStyle: 'danger', onClick: this.resetTable },
					'Reset Table'
				),
				React.createElement(DynamicTable, { ref: 'table', onChange: this.save,
					willSelectItem: function (idx, item, cb) {
						_this.showMessage('info', 'Will select item ' + idx);
						cb(false);
					},
					didSelectItem: function (idx, item) {
						_this.showMessage('info', 'Did select item ' + idx);
					},
					willRemoveItem: function (idx, item, cb) {
						_this.showMessage('error', 'Will remove item ' + idx);
						cb(false);
					},
					didRemoveItem: function (idx, item) {
						_this.showMessage('error', 'Did remove item ' + idx);
					},
					willStartCreatingItem: function (item, cb) {
						_this.showMessage('warning', 'Will start creating item');
						cb(false, item);
					},
					didStartCreatingItem: function (item) {
						_this.showMessage('warning', 'Did start creating item');
					}

				})
			)
		);
	},

	getInitialState: function getInitialState() {
		return {};
	},

	componentDidMount: function componentDidMount() {
		this.load();
	},

	showMessage: function showMessage(level, message, meta) {
		this.refs.notificationSystem.addNotification({
			message: message,
			level: level,
			autoDismiss: 5
		});
	},

	onSelectRow: function onSelectRow(idx) {
		console.log('onSelectRow', idx);
		this.refs.notificationSystem.addNotification({
			message: 'Selected row ' + idx,
			level: 'info',
			autoDismiss: 5
		});
	},

	onEditRow: function onEditRow(idx) {
		this.refs.notificationSystem.addNotification({
			message: 'Edit row ' + idx,
			level: 'info',
			autoDismiss: 5
		});
	},

	onUpdateRow: function onUpdateRow(idx, col, value, item, cb) {
		this.refs.notificationSystem.addNotification({
			message: 'Update row ' + idx + ': ' + col + '=' + value,
			level: 'success',
			autoDismiss: 5
		});
		cb(null, value);
	},

	onAddRow: function onAddRow(item, cb) {
		this.refs.notificationSystem.addNotification({
			message: 'Add a row ' + item,
			level: 'success',
			autoDismiss: 5
		});
		cb(null, item);
	},

	onDeleteRow: function onDeleteRow(idx, cb) {
		this.refs.notificationSystem.addNotification({
			message: 'Delete row ' + idx,
			level: 'error',
			autoDismiss: 5
		});
		cb(null, idx);
	},

	resetTable: function resetTable() {
		delete localStorage.data;
		localStorage.data = JSON.stringify(sampleData);
		this.load();
		this.refs.notificationSystem.addNotification({
			message: 'Resetted the table',
			level: 'error',
			autoDismiss: 5
		});
	},

	load: function load() {
		var tableState = JSON.parse(localStorage.data);
		this.refs.table.setState({
			columns: tableState.columns,
			data: tableState.data
		});
	},

	save: function save(data) {
		localStorage.data = JSON.stringify(data);
	},

	dismissAlert: function dismissAlert() {
		this.setState({
			alertMessage: null
		});
	}
});

module.exports = Demo;