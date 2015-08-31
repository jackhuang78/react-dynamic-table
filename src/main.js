var React = require('react');
var Router = require('react-router');
//var Demo = require('./Demo');
var Component = require('./App');


if(Component.isRouter) {
	Router.run(Component.routes, function (Handler) {
  	React.render(<Handler/>, document.body);
  });
} else {
	React.render(<Component/>, document.body);
}


