var ModepressClientPlugin;
(function (ModepressClientPlugin) {
    /**
     * A service for interacting with post data and the relevant modepress endpoints
     */
    var PostService = (function () {
        function PostService($http, $location, apiUrl, $q) {
            this._http = $http;
            this._location = $location;
            this._q = $q;
            this._url = apiUrl;
        }
        /**
         * Gets a post by its unique slug
         * @param {string} slug The slug of the post
         */
        PostService.prototype.postBySlug = function (slug) {
            var that = this;
            return new this._q(function (resolve, reject) {
                that._http.get(that._url + "/posts/" + slug).then(function (response) {
                    if (response.data.error)
                        reject(new Error(response.data.message));
                    resolve(response.data.data);
                }).catch(function (err) {
                    reject(err);
                });
            });
        };
        // The dependency injector
        PostService.$inject = ["$http", "$location", "$stateParams", "apiUrl", "$q"];
        return PostService;
    }());
    ModepressClientPlugin.PostService = PostService;
})(ModepressClientPlugin || (ModepressClientPlugin = {}));
var ModepressClientPlugin;
(function (ModepressClientPlugin) {
    angular.module("blacktip", ['ngSanitize'])
        .value('apiUrl', '')
        .service("modepress", ModepressClientPlugin.PostService);
})(ModepressClientPlugin || (ModepressClientPlugin = {}));
