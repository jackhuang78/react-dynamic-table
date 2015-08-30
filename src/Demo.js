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
var moment = require('moment');
var sampleData = require('../public/demoData.json');
//var Highlight = require('react-highlight');

var PrismCode = require('react-prism').PrismCode;

console.log(PrismCode);

//var exampleCode = require('../public/example-code.js');


var Demo = React.createClass({


	render: function() {
		return (
			<div>
				<NotificationSystem ref="notificationSystem" />
				<Panel style={{margin: 30}}>
					<PageHeader>DynamicTable Demo</PageHeader>
					<Button bsStyle='danger' onClick={this.resetTable}>Reset Table</Button>
					<span> </span>
					<Button bsStyle='info' href='https://github.com/jhuang78/react-dynamic-table/blob/master/src/Demo.js?ts=2'>See Usage</Button>


					<DynamicTable ref='table' onChange={this.save} 
						willSelectItem={(idx, item, cb) => {
							this.appendLog(`Will select item ${idx}`, item);
							cb(false); 
						}}
						didSelectItem={(idx, item) => {
							this.appendLog(`Did select item ${idx}`, item);
						}}
						willRemoveItem={(idx, item, cb) => {
							this.appendLog(`Will remove item ${idx}`, item);
							cb(false);
						}}
						didRemoveItem={(idx, item) => {
							this.appendLog(`Did remove item ${idx}; save data`, item);
							this.save(this.refs.table.state);
						}}
						willStartCreatingItem={(item, cb) => {
							this.appendLog(`Will start creating item`, item);
							cb(false, item);
						}}
						didStartCreatingItem={(item) => {
							this.appendLog(`Did start creating item`, item);
						}}
						willStartEditingItem={(idx, item, cb) => {
							this.appendLog(`Will start editing item ${idx}`, item);
							cb(false, item);
						}}
						didStartEditingItem={(idx, item) => {
							this.appendLog(`Did start editing item ${idx}`, item);
						}}
						willFinishEditingItem={(idx, item, cb) => {
							this.appendLog(`Will finish editing item ${idx}`, item);
							cb(false, item);
						}}
						didFinishEditingItem={(idx, item) => {
							this.appendLog(`Did finish editing item ${idx}; save data`, item);
							this.save(this.refs.table.state);
						}}
						willCancelEditingItem={(idx, item, cb) => {
							this.appendLog(`Will cancel editing item ${idx}`, item);
							cb(false, item);
						}}
						didCancelEditingItem={(idx, item) => {
							this.appendLog(`Did cancel editing item ${idx}`, item);
						}}
						willEditItem={(idx, item, col, value, cb) => {
							this.appendLog(`Will edit item ${idx} ${col}=${value}`, item);
							cb(false, value);
						}}
						didEditItem={(idx, item, col, value) => {
							this.appendLog(`Did edit item ${idx} ${col}=${value}`, item);
							//this.save(this.refs.table.state);
						}}
					/>


					<Input ref='logs' type='textarea' label='Logs' style={{height: 100}}value={this.state.logs} />
				</Panel>
				
			</div>
		);
	},

	getInitialState: function() {
		return {
			logs: 'Initialize table.'
		};
	},

	componentDidMount: function() {
		this.load();
	},


	appendLog: function(s, item) {
		s = util.format('%s: %s %j', moment().format('YYYY/MM/DD HH:mm:ss.SSS'), s, item);
		this.setState({
			logs: this.state.logs + '\n' + s
		});
	},

	showMessage: function(level, message, meta) {
		this.refs.notificationSystem.addNotification({
			message: message,
			level: level,
			autoDismiss: 5
		});
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