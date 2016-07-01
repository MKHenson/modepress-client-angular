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
         * @returns {ng.IPromise<Modepress.IPost>}
         */
        PostService.prototype.getPost = function (url) {
            var that = this;
            return new this._q(function (resolve, reject) {
                that._http.get(url).then(function (response) {
                    if (response.data.error)
                        reject(new Error(response.data.message));
                    resolve(response.data.data);
                }).catch(function (err) {
                    reject(err);
                });
            });
        };
        /**
         * Gets a post by its unique slug
         * @param {string} slug The slug of the post
         * @returns {ng.IPromise<Modepress.IPost>}
         */
        PostService.prototype.postBySlug = function (slug) {
            return this.getPost(this._url + "/api/posts/slug/" + slug);
        };
        /**
         * Gets a post by its id
         * @param {string} slug The slug of the post
         * @returns {ng.IPromise<Modepress.IPost>}
         */
        PostService.prototype.postById = function (id) {
            return this.getPost(this._url + "/api/posts/" + id);
        };
        // The dependency injector
        PostService.$inject = ["$http", "$location", "$stateParams", "apiUrl", "$q"];
        return PostService;
    }());
    ModepressClientPlugin.PostService = PostService;
})(ModepressClientPlugin || (ModepressClientPlugin = {}));
var ModepressClientPlugin;
(function (ModepressClientPlugin) {
    angular.module("modepress-client", ['ngSanitize'])
        .value('apiUrl', '')
        .service("modepress", ModepressClientPlugin.PostService);
})(ModepressClientPlugin || (ModepressClientPlugin = {}));
