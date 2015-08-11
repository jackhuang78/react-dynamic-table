var React = require('react');
var DatePicker = require('react-datepicker');
var moment = require('moment');


var DatePickerWrapper = React.createClass({
	render: function() {
		return (
			<div>
				<DatePicker selected={moment(this.props.date)} onChange={this.datePickerChanged} />
			</div>
		);
	},

	datePickerChanged: function(date) {
		this.props.onChange(this.props, date.format());
	}

});


module.exports = DatePickerWrapper;