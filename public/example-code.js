var DynamicTable = require('react-dynamic-table');  
var columns = require('columns.json');  
var data = require('data.json');  
var App = React.createClass({  
 
	componentDidMount: function() { 
		this.refs.table.setState({ 
			columns: columns, 
			data: data 
		}); 
	}, 
 
	load: function() { 
		this.refs.table.setData({ 
			data: data 
		}); 
	}, 
 
	save: function() { 
		data = this.refs.table.state.data; 
	}, 
 
	render: function() { 
		return ( 
			<DynamicTable ref='table' 

				willSelectItem={(idx, item, cb) => { 
					console.log(`Will select item ${idx}`, item); 
					cb(false);
				}} 
				didSelectItem={(idx, item) => { 
					console.log(`Did select item ${idx}`, item); 
				}} 
				willRemoveItem={(idx, item, cb) => { 
					console.log(`Will remove item ${idx}`, item); 
					cb(false); 
				}} 
				didRemoveItem={(idx, item) => { 
					console.log(`Did remove item ${idx}; save data`, item); 
					this.save(); 
				}} 
				willStartCreatingItem={(item, cb) => { 
					console.log(`Will start creating item`, item); 
					cb(false, item); 
				}} 
				didStartCreatingItem={(item) => { 
					console.log(`Did start creating item`, item); 
				}} 
				willStartEditingItem={(idx, item, cb) => { 
					console.log(`Will start editing item ${idx}`, item); 
					cb(false, item); 
				}} 
				didStartEditingItem={(idx, item) => { 
					console.log(`Did start editing item ${idx}`, item); 
				}} 
				willFinishEditingItem={(idx, item, cb) => { 
					console.log(`Will finish editing item ${idx}`, item); 
					cb(false, item); 
				}} 
				didFinishEditingItem={(idx, item) => { 
					console.log(`Did finish editing item ${idx}; save data`, item); 
					this.save(); 
				}} 
				willCancelEditingItem={(idx, item, cb) => { 
					console.log(`Will cancel editing item ${idx}`, item); 
					cb(false, item); 
				}} 
				didCancelEditingItem={(idx, item) => { 
					console.log(`Did cancel editing item ${idx}`, item); 
				}} 
				willEditItem={(idx, item, col, value, cb) => { 
					console.log(`Will edit item ${idx} ${col}=${value}`, item); 
					cb(false, value); 
				}} 
				didEditItem={(idx, item, col, value) => { 
					console.log(`Did edit item ${idx} ${col}=${value}`, item); 
					this.save(); 
				}} 
			/> 
		); 
	} 
});