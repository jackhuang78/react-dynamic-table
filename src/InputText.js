var React = require('react');
var ReactBootstrap = require('react-bootstrap');
var Input = ReactBootstrap.Input;

/**
 * An <ReactBootstrap.Input type="text"> wrapper to provide validating function.
 * @type {[type]}
 */
var InputText = React.createClass({

	render: function() {
		//console.log('render InputText', this.props);
		this.props.value = this.state.value;
		this.props.bsStyle = this.state.style;
		this.props.help = this.state.help;
		this.props.type = 'number';


		return (
			<Input {...this.props} 
				ref='input' 
				onChange={this.onChange} 
				onKeyPress={this.onKeyPress} />
		);
	},

	getInitialState: function() {
		return {
			value: '',
			style: '',
			help: ''
		};
	},

	onChange: function(event) {
		console.log('onChange', event.target.value);

		var value = event.target.value;
		var style = this.state.style;
		var help = this.state.help;

		if(this.props.validator) {
			var res = this.props.validator(value);
			style = res.style;
			help = res.help
		}

		this.setState({
			value: event.target.value,
			style: style,
			help: help
		});
	},

	onKeyPress: function(event) {
		if(event.charCode === 13)
				event.target.blur();
	}
});

module.exports = InputText;