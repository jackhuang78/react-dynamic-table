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



	render: function() {
		return (
			<div>
				<NotificationSystem ref="notificationSystem" />
				<Panel style={{margin: 30}}>
					<PageHeader>DynamicTable Demo</PageHeader>
					<Button bsStyle='danger' onClick={this.resetTable}>Reset Table</Button>
					<DynamicTable ref='table' onChange={this.save} 
						willSelectItem={(idx, item, cb) => {
							this.showMessage('info', `Will select item ${idx}`); 
							cb(idx, item); 
						}}
						didSelectItem={(idx, item) => {
							this.showMessage('info', `Did select item ${idx}`);
						}}
						willStartEditingItem={(idx, item, cb) => {
							this.showMessage('info', `Will start editing item ${idx}`);
							cb(idx, item);
						}}
						didStartEditingItem={(idx, item) => {
							this.showMessage('info', `Did start editing item ${idx}`);
						}}
						isEditingItem
						didEditItem
						willRemoveItem
						didRemoveItem
					/>
				</Panel>
			</div>
		);
	},

	getInitialState: function() {
		return {};
	},

	componentDidMount: function() {
		this.load();
	},

	showMessage: function(level, message, meta) {
		this.refs.notificationSystem.addNotification({
			message: message,
			level: level,
			autoDismiss: 5
		});
	},

	onSelectRow: function(idx) {
		console.log('onSelectRow', idx);
		this.refs.notificationSystem.addNotification({
			message: `Selected row ${idx}`,
			level: 'info',
			autoDismiss: 5,
		});
	},

	onEditRow: function(idx) {
		this.refs.notificationSystem.addNotification({
			message: `Edit row ${idx}`,
			level: 'info',
			autoDismiss: 5
		});
	},

	onUpdateRow: function(idx, col, value, item, cb) {
		this.refs.notificationSystem.addNotification({
			message: `Update row ${idx}: ${col}=${value}`,
			level: 'success',
			autoDismiss: 5
		});
		cb(null, value);

	},

	onAddRow: function(item, cb) {
		this.refs.notificationSystem.addNotification({
			message: `Add a row ${item}`,
			level: 'success',
			autoDismiss: 5,
		});
		cb(null, item);
	},

	onDeleteRow: function(idx, cb) {
		this.refs.notificationSystem.addNotification({
			message: `Delete row ${idx}`,
			level: 'error',
			autoDismiss: 5,
		});
		cb(null, idx);
	},

	resetTable: function() {
		delete localStorage.data;
		localStorage.data = JSON.stringify(sampleData);
		this.load();
		this.refs.notificationSystem.addNotification({
			message: 'Resetted the table',
			level: 'error',
			autoDismiss: 5,
		});
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

	dismissAlert: function() {
		this.setState({
			alertMessage: null
		});
	}
});

module.exports = Demo;