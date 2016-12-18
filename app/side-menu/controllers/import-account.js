/* global angular, console, StellarSdk */

angular.module('app')
.controller('ImportAccountCtrl', function ($location, $routeParams, $scope, $translate, Keychain, Wallet) {
	'use strict';

	$scope.advanced = false;

	var data;
	if ($routeParams.data) {
		data = JSON.parse(window.atob($routeParams.data));
		$scope.encrypted = (typeof data.key === 'object');
		$scope.scanned = true;
	}

	var numAccounts = Object.keys(Wallet.accounts).length;
	$scope.account = {
		alias: $translate.instant('account.defaultname', {number: numAccounts + 1})
	};

	$scope.import = function () {

		var accountId;
		var seed;
		var name = $scope.account.alias;
		var network;
		var keyStore;

		if ($scope.scanned) {

			if ($scope.encrypted) {
				seed = Keychain.decrypt(data.key, $scope.account.password);
			} else {
				seed = data.key;
			}
			network = data.account.network;
			keyStore = data.key;
		} else {
			seed = $scope.account.seed;
			network = $scope.account.network;
			keyStore = seed;
		}

		accountId = StellarSdk.Keypair.fromSeed(seed).accountId();
		Wallet.importAccount(accountId, keyStore, name, network);
		$location.path('/');
	};
});
