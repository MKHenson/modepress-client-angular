var ModepressClientPlugin;
(function (ModepressClientPlugin) {
    /**
     * A service for communicating with a Modepress backend and its endpoints
     */
    var ModepressService = (function () {
        function ModepressService($http, $location, apiUrl) {
            this._http = $http;
            this._location = $location;
            this._url = apiUrl;
        }
        // The dependency injector
        ModepressService.$inject = ["$http", "$location", "$stateParams", "apiUrl"];
        return ModepressService;
    }());
    ModepressClientPlugin.ModepressService = ModepressService;
})(ModepressClientPlugin || (ModepressClientPlugin = {}));
var ModepressClientPlugin;
(function (ModepressClientPlugin) {
    angular.module("blacktip", ['ngSanitize'])
        .value('apiUrl', '')
        .service("modepress", ModepressClientPlugin.ModepressService);
})(ModepressClientPlugin || (ModepressClientPlugin = {}));
