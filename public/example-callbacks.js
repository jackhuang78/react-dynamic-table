var DynamicTable = require('react-dynamic-table');  
var App = React.createClass({  

	//...
 
	render: function() { 
		return ( 
			<DynamicTable ref='table' 

				willSelectItem={(idx, item, cb) => { 
					// do something with item
					cb(false);
				}} 
				didSelectItem={(idx, item) => { 
					// do something with item
				}} 
				willRemoveItem={(idx, item, cb) => { 
					// do something with item
					cb(false); 
				}} 
				didRemoveItem={(idx, item) => { 
					// do something with item
					this.save(); 
				}} 
				willStartCreatingItem={(item, cb) => { 
					// do something with item
					cb(false, item); 
				}} 
				didStartCreatingItem={(item) => { 
					// do something with item
				}} 
				willStartEditingItem={(idx, item, cb) => { 
					// do something with item
					cb(false, item); 
				}} 
				didStartEditingItem={(idx, item) => { 
					// do something with item
				}} 
				willFinishEditingItem={(idx, item, cb) => { 
					// do something with item
					cb(false, item); 
				}} 
				didFinishEditingItem={(idx, item) => { 
					// do something with item
					this.save(); 
				}} 
				willCancelEditingItem={(idx, item, cb) => { 
					// do something with item
					cb(false, item); 
				}} 
				didCancelEditingItem={(idx, item) => { 
					// do something with item
				}} 
				willEditItem={(idx, item, col, value, cb) => { 
					// do something with item
					cb(false, value); 
				}} 
				didEditItem={(idx, item, col, value) => { 
					// do something with item
					this.save(); 
				}} 
			/> 
		); 
	} 
});