var React = require('react');
var Router = require('react-router');
var DefaultRoute = Router.DefaultRoute;
var Route = Router.Route;
var RouteHandler = Router.RouteHandler;
var ReactBootstrap = require('react-bootstrap');
var PageHeader = ReactBootstrap.PageHeader;
var Panel = ReactBootstrap.Panel;
var Nav = ReactBootstrap.Nav;
var NavItem = ReactBootstrap.NavItem;

var Demo = require('./Demo');
var Usage = require('./Usage');


var App = React.createClass({
	mixins: [ Router.State ],

	render: function() {
		var path = this.getPathname();
		var subHeader = {'/demo': 'Demo', '/usage': 'Usage'}[path];
		return (
			<Panel style={{margin: 30}}>
				<PageHeader>React Dynamic Table <small>{subHeader}</small></PageHeader>
				<Nav bsStyle='tabs' activeKey={path}>
					<NavItem eventKey={'/demo'} href='#demo'>Demo</NavItem>
					<NavItem eventKey={'/usage'} href='#usage'>Usage</NavItem>
				</Nav>
				<br />
				<RouteHandler/>
			</Panel>
		);
	}
});

//<DefaultRoute handler={Demo} />
var routes = (
	<Route handler={App} path="/">
		
		<Route name="demo" handler={Demo} />
		<Route name="usage" handler={Usage} />
	</Route>
);

module.exports = {
	isRouter: true,
	routes: routes
};
