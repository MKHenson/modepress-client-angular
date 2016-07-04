var ModepressClientPlugin;
(function (ModepressClientPlugin) {
    /**
     * Describes the visibility of the post
     */
    (function (Visibility) {
        /** Posts marked as public. Visible to both guest and admin users */
        Visibility[Visibility["public"] = 0] = "public";
        /** Posts marked as private. Visible to only admin users and will not show for non-admin users */
        Visibility[Visibility["private"] = 1] = "private";
        /** Visible to both guest and admin users */
        Visibility[Visibility["all"] = 2] = "all";
    })(ModepressClientPlugin.Visibility || (ModepressClientPlugin.Visibility = {}));
    var Visibility = ModepressClientPlugin.Visibility;
    /**
     * Describes the order to fetch the posts
     */
    (function (SortOrder) {
        /** Sorts from newest to oldest */
        SortOrder[SortOrder["desc"] = 0] = "desc";
        /** Sorts from oldest to newest */
        SortOrder[SortOrder["asc"] = 1] = "asc";
    })(ModepressClientPlugin.SortOrder || (ModepressClientPlugin.SortOrder = {}));
    var SortOrder = ModepressClientPlugin.SortOrder;
    /**
     * A service for interacting with post data and the relevant modepress endpoints
     */
    var PostService = (function () {
        function PostService($http, apiUrl, $q) {
            this._http = $http;
            this._q = $q;
            this._url = apiUrl;
        }
        /**
         * Gets a post by its unique slug
         * @param {string} slug The slug of the post
         * @returns {ng.IPromise<Modepress.IPost>}
         */
        PostService.prototype.getSingle = function (url) {
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
        PostService.prototype.bySlug = function (slug) {
            return this.getSingle(this._url + "/api/posts/slug/" + slug);
        };
        /**
         * Gets a post by its id
         * @param {string} slug The slug of the post
         * @returns {ng.IPromise<Modepress.IPost>}
         */
        PostService.prototype.byId = function (id) {
            return this.getSingle(this._url + "/api/posts/" + id);
        };
        /**
         * Removes a post by its ID
         * @param {string} id The id of the post
         * @returns {ng.IPromise<string>}
         */
        PostService.prototype.delete = function (id) {
            var that = this;
            return new this._q(function (resolve, reject) {
                var url = this._url + "/api/posts/id";
                that._http.delete(url).then(function (response) {
                    if (response.data.error)
                        reject(new Error(response.data.message));
                    resolve(response.data.message);
                }).catch(function (err) {
                    reject(err);
                });
            });
        };
        /**
         * Edits a post by its ID
         * @param {string} id The id of the post
         * @param {Modepress.IPost} postData The post data to edit
         * @returns {ng.IPromise<string>}
         */
        PostService.prototype.edit = function (id, postData) {
            var that = this;
            return new this._q(function (resolve, reject) {
                var url = this._url + "/api/posts/id";
                that._http.put(url, postData).then(function (response) {
                    if (response.data.error)
                        reject(new Error(response.data.message));
                    resolve(response.data.message);
                }).catch(function (err) {
                    reject(err);
                });
            });
        };
        /**
         * Creates a new post
         * @param {Modepress.IPost} postData The post data to create
         * @returns {ng.IPromise<string>}
         */
        PostService.prototype.create = function (postData) {
            var that = this;
            return new this._q(function (resolve, reject) {
                var url = this._url + "/api/posts";
                that._http.post(url, postData).then(function (response) {
                    if (response.data.error)
                        reject(new Error(response.data.message));
                    resolve(response.data.message);
                }).catch(function (err) {
                    reject(err);
                });
            });
        };
        /**
         * Gets all posts that match each of the parameter conditions
         * @param {Modepress.IPostOptions} options The filter options
         */
        PostService.prototype.all = function (options) {
            var that = this;
            return new this._q(function (resolve, reject) {
                options = options || {};
                options.author = options.author || undefined;
                options.categories = options.categories || undefined;
                options.tags = options.tags || undefined;
                options.rtags = options.rtags || undefined;
                options.limit = options.limit || undefined;
                options.index = options.index || undefined;
                options.keyword = options.keyword || undefined;
                options.sortOrder = options.sortOrder || undefined;
                options.minimal = options.minimal || undefined;
                options.visibility = options.visibility || undefined;
                options.sortByUpdate = options.sortByUpdate || undefined;
                var url = this._url + "/api/posts?";
                if (options.author !== undefined)
                    url += "author=" + options.author + "&";
                if (options.visibility !== undefined)
                    url += "visibility=" + Visibility[options.visibility] + "&";
                if (options.keyword !== undefined)
                    url += "keyword=" + options.keyword + "&";
                if (options.sortByUpdate !== undefined)
                    url += "sort=" + options.sortByUpdate + "&";
                if (options.sortOrder !== undefined)
                    url += "sortOrder=" + SortOrder[options.sortOrder] + "&";
                if (options.minimal !== undefined)
                    url += "minimal=" + options.minimal + "&";
                if (options.categories !== undefined)
                    url += "categories=" + options.categories.join(',') + "&";
                if (options.tags !== undefined)
                    url += "tags=" + options.tags.join(',') + "&";
                if (options.rtags !== undefined)
                    url += "rtags=" + options.rtags.join(',') + "&";
                if (options.index !== undefined)
                    url += "index=" + options.index + "&";
                if (options.limit !== undefined)
                    url += "limit=" + options.limit + "&";
                that._http.get(url).then(function (response) {
                    if (response.data.error)
                        reject(new Error(response.data.message));
                    resolve(response.data);
                }).catch(function (err) {
                    reject(err);
                });
            });
        };
        // The dependency injector
        PostService.$inject = ["$http", "apiUrl", "$q"];
        return PostService;
    }());
    ModepressClientPlugin.PostService = PostService;
})(ModepressClientPlugin || (ModepressClientPlugin = {}));
var ModepressClientPlugin;
(function (ModepressClientPlugin) {
    /**
     * A service for interacting with categories
     */
    var CategoryService = (function () {
        function CategoryService($http, apiUrl, $q) {
            this._http = $http;
            this._q = $q;
            this._url = apiUrl;
        }
        /**
         * Removes a category by its ID
         * @param {string} id The id of the category
         * @returns {ng.IPromise<string>}
         */
        CategoryService.prototype.delete = function (id) {
            var that = this;
            return new this._q(function (resolve, reject) {
                var url = this._url + "/api/categories/id";
                that._http.delete(url).then(function (response) {
                    if (response.data.error)
                        reject(new Error(response.data.message));
                    resolve(response.data.message);
                }).catch(function (err) {
                    reject(err);
                });
            });
        };
        /**
         * Creates a new category
         * @param {Modepress.ICategory} category The category data to create
         * @returns {ng.IPromise<string>}
         */
        CategoryService.prototype.create = function (category) {
            var that = this;
            return new this._q(function (resolve, reject) {
                var url = this._url + "/api/categories";
                that._http.post(url, category).then(function (response) {
                    if (response.data.error)
                        reject(new Error(response.data.message));
                    resolve(response.data.message);
                }).catch(function (err) {
                    reject(err);
                });
            });
        };
        /**
         * Gets all categories
         * @param {number} index The start index to fetch categories from
         * @param {number} limit The number of categories to return for this call
         * @returns {Modepress.IGetCategories}
         */
        CategoryService.prototype.all = function (index, limit) {
            var that = this;
            return new this._q(function (resolve, reject) {
                var url = this._url + "/api/categories?";
                if (index !== undefined)
                    url += "index=" + index + "&";
                if (limit !== undefined)
                    url += "limit=" + limit + "&";
                that._http.get(url).then(function (response) {
                    if (response.data.error)
                        reject(new Error(response.data.message));
                    resolve(response.data);
                }).catch(function (err) {
                    reject(err);
                });
            });
        };
        // The dependency injector
        CategoryService.$inject = ["$http", "apiUrl", "$q"];
        return CategoryService;
    }());
    ModepressClientPlugin.CategoryService = CategoryService;
})(ModepressClientPlugin || (ModepressClientPlugin = {}));
var ModepressClientPlugin;
(function (ModepressClientPlugin) {
    angular.module("modepress-client", ['ngSanitize'])
        .value('apiUrl', '')
        .service("posts", ModepressClientPlugin.PostService)
        .service("categories", ModepressClientPlugin.CategoryService);
})(ModepressClientPlugin || (ModepressClientPlugin = {}));
