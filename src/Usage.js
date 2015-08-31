var React = require('react');

var ReactBootstrap = require('react-bootstrap');
var Panel = ReactBootstrap.Panel;
var Input = ReactBootstrap.Input;
var Row = ReactBootstrap.Row;
var Col = ReactBootstrap.Col;

var Highlight = require('react-highlight');

var fs = require('fs');
var exampleCode = fs.readFileSync('public/example-code.js', 'utf8').replace(/\t/g, '  ');
var exampleCallbacks = fs.readFileSync('public/example-callbacks.js', 'utf8').replace(/\t/g, '  ');
var exampleColumns = fs.readFileSync('public/example-column.json', 'utf8').replace(/\t/g, '  ');
var exampleData = fs.readFileSync('public/example-data.json', 'utf8').replace(/\t/g, '  ');

var Usage = React.createClass({
	render: function () {
		return (
			<div>
				<Row>
					<Col md={6}>
						<h3>data.json</h3>
						<Highlight className="json">
							{exampleData}
						</Highlight>
					</Col>
					<Col md={6}>
						<h3>columns.json</h3>
						<Highlight className="json">
							{exampleColumns}
						</Highlight>	
					</Col>
				</Row>
				<Row>
					<Col md={6}>
						<h3 >demo.js (basic)</h3>
						<Highlight className="javascript">
							{exampleCode}
						</Highlight>
					</Col>
					<Col md={6}>
						<h3>demo.js (with callbacks)</h3>
						<Highlight className="javascript">
							{exampleCallbacks}
						</Highlight>
					</Col>
				</Row>				
			</div>
		);
	}
});

module.exports = Usage;