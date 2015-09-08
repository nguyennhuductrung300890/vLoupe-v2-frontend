(function() {
	'use strict';

	angular
		.module('vLoupeApp')
		.controller('NavbarController', NavbarController);

	NavbarController.$inject = [];

	function NavbarController() {
		var navbarController = this;

		navbarController.alert = function(text) {
			alert(text);
		}
	}
})();