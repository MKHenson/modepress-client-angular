declare module ModepressClientPlugin {
    /**
     * A service for interacting with post data and the relevant modepress endpoints
     */
    class PostService {
        private _http;
        private _location;
        private _url;
        private _q;
        static $inject: string[];
        constructor($http: ng.IHttpService, $location: ng.ILocationService, apiUrl: string, $q: ng.IQService);
        /**
         * Gets a post by its unique slug
         * @param {string} slug The slug of the post
         * @returns {ng.IPromise<Modepress.IPost>}
         */
        private getPost(url);
        /**
         * Gets a post by its unique slug
         * @param {string} slug The slug of the post
         * @returns {ng.IPromise<Modepress.IPost>}
         */
        postBySlug(slug: string): ng.IPromise<Modepress.IPost>;
        /**
         * Gets a post by its id
         * @param {string} slug The slug of the post
         * @returns {ng.IPromise<Modepress.IPost>}
         */
        postById(id: string): ng.IPromise<Modepress.IPost>;
    }
}
declare module ModepressClientPlugin {
}
