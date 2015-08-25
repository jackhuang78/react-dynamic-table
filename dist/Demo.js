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
					onSelectRow: this.onSelectRow,
					onUpdateRow: this.onUpdateRow,
					onAddRow: this.onAddRow,
					onDeleteRow: this.onDeleteRow
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

	onSelectRow: function onSelectRow(event) {
		this.refs.notificationSystem.addNotification({
			message: 'Selected a row',
			level: 'info',
			autoDismiss: 5
		});
	},

	onUpdateRow: function onUpdateRow(idx, col, value, item, cb) {
		this.refs.notificationSystem.addNotification({
			message: util.format('Updating a row: data[%d].%s=%s', idx, col, value),
			level: 'success',
			autoDismiss: 5
		});
		cb(value);
	},

	onAddRow: function onAddRow(event) {
		this.refs.notificationSystem.addNotification({
			message: 'Added a row',
			level: 'success',
			autoDismiss: 5
		});
	},

	onDeleteRow: function onDeleteRow(event) {
		this.refs.notificationSystem.addNotification({
			message: 'Deleted a row',
			level: 'error',
			autoDismiss: 5
		});
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