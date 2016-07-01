module ModepressClientPlugin {

    /**
     * A service for interacting with post data and the relevant modepress endpoints
     */
    export class PostService {

        private _http: ng.IHttpService;
        private _location: ng.ILocationService;
        private _url: string;
        private _q: ng.IQService;

        // The dependency injector
        public static $inject = ["$http", "$location", "$stateParams", "apiUrl", "$q" ];
        constructor($http: ng.IHttpService, $location: ng.ILocationService, apiUrl : string, $q: ng.IQService )
        {
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
        private getSingle( url : string ): ng.IPromise<Modepress.IPost>
        {
            var that = this;
            return new this._q<Modepress.IPost>(function( resolve, reject ) {

                that._http.get<Modepress.IGetPost>(url).then(function(response){
                    if ( response.data.error )
                        reject(new Error(response.data.message));

                    resolve(response.data.data);
                }).catch(function(err) {
                    reject(err);
                })
            });
        }

        /**
         * Gets a post by its unique slug
         * @param {string} slug The slug of the post
         * @returns {ng.IPromise<Modepress.IPost>}
         */
        bySlug(slug : string) : ng.IPromise<Modepress.IPost>
        {
            return this.getSingle(`${this._url}/api/posts/slug/${slug}`);
        }

        /**
         * Gets a post by its id
         * @param {string} slug The slug of the post
         * @returns {ng.IPromise<Modepress.IPost>}
         */
        byId(id : string) : ng.IPromise<Modepress.IPost>
        {
            return this.getSingle(`${this._url}/api/posts/${id}`);
        }
    }
}