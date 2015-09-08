(function() {
	'use strict';

	angular
		.module('vLoupeApp', [
			'ui.router',
			'satellizer'
		])
		.config(configure);

	configure.$inject = ['$stateProvider', '$urlRouterProvider', '$locationProvider', '$authProvider'];

	function configure($stateProvider, $urlRouterProvider, $locationProvider, $authProvider) {
		$locationProvider.html5Mode({
			enabled: true,
			requireBase: false
		});

		$stateProvider
			.state('home', {
				url: '/',
				controller: 'HomeController',
				controllerAs: 'homeController',
				templateUrl: 'modules/home/views/home.tpl.html'
			})
			.state('profile', {
				url: '/profile',
				controller: 'ProfileController',
				controllerAs: 'profileController',
				templateUrl: 'modules/profile/views/profile.tpl.html'
			})
			.state('event.detail', {
				url: "/events/:eventId",
				controller: 'EventController',
				controllerAs: 'eventController',
				templateUrl: 'modules/event/views/event.tpl.html'
			});

		$urlRouterProvider.otherwise('/');
	}
})();