module ModepressClientPlugin {

    /**
     * Describes the visibility of the post
     */
    export enum Visibility {
        /** Posts marked as public. Visible to both guest and admin users */
        public,
        /** Posts marked as private. Visible to only admin users and will not show for non-admin users */
        private,
        /** Visible to both guest and admin users */
        all
    }

    /**
     * Describes the order to fetch the posts
     */
    export enum SortOrder {
        /** Sorts from newest to oldest */
        desc,
        /** Sorts from oldest to newest */
        asc
    }

    /**
     * Describes how to filter the posts returned from a GET call.
     */
    export interface IPostOptions {
        /** Sort by last updated instead of date created */
        sortByUpdate?: boolean;
        /** Filter by public, private or both */
        visibility?: Visibility;
        /** Set the number of posts returned by the call */
        limit?: number;
        /** Set the starting index for fetching posts */
        index?: number;
        /** Filter by the post author */
        author? : string;
        /** Filter by a post title or content keyword */
        keyword?: string;
        /** If true, do not fetch the post's content */
        minimal?: boolean;
        /** Specify the sort order */
        sortOrder?: SortOrder;
        /** Filter post's by the categories provided */
        categories? : string[];
        /** Filter post's by the optional tags provided */
        tags?: string[];
        /** Filter post's by the required tags provided */
        rtags?: string[];
    }

    /**
     * A service for interacting with post data and the relevant modepress endpoints
     */
    export class PostService {

        private _http: ng.IHttpService;
        private _url: string;
        private _q: ng.IQService;

        // The dependency injector
        public static $inject = ["$http", "apiUrl", "$q" ];
        constructor($http: ng.IHttpService, apiUrl : string, $q: ng.IQService )
        {
            this._http = $http;
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

        /**
         * Removes a post by its ID
         * @param {string} id The id of the post
         * @returns {ng.IPromise<string>}
         */
        delete(id: string): ng.IPromise<string>
        {
            var that = this;
            return new this._q<string>(function( resolve, reject ) {
                var url : string = `${this._url}/api/posts/id`;
                that._http.delete<Modepress.IResponse>(url).then(function(response){
                    if ( response.data.error )
                        reject(new Error(response.data.message));

                    resolve(response.data.message);
                }).catch(function(err) {
                    reject(err);
                })
            });
        }

        /**
         * Edits a post by its ID
         * @param {string} id The id of the post
         * @param {Modepress.IPost} postData The post data to edit
         * @returns {ng.IPromise<string>}
         */
        edit(id: string, postData: Modepress.IPost): ng.IPromise<string>
        {
            var that = this;
            return new this._q<Modepress.IPost>(function( resolve, reject ) {
                var url : string = `${this._url}/api/posts/id`;
                that._http.put<Modepress.IResponse>(url, postData).then(function(response){
                    if ( response.data.error )
                        reject(new Error(response.data.message));

                    resolve(response.data.message);
                }).catch(function(err) {
                    reject(err);
                })
            });
        }

        /**
         * Creates a new post
         * @param {Modepress.IPost} postData The post data to create
         * @returns {ng.IPromise<string>}
         */
        create(postData: Modepress.IPost): ng.IPromise<string>
        {
            var that = this;
            return new this._q<string>(function( resolve, reject ) {
                var url : string = `${this._url}/api/posts`;
                that._http.post<Modepress.IResponse>(url, postData).then(function(response){
                    if ( response.data.error )
                        reject(new Error(response.data.message));

                    resolve(response.data.message);
                }).catch(function(err) {
                    reject(err);
                })
            });
        }

        /**
         * Gets all posts that match each of the parameter conditions
         * @param {Modepress.IPostOptions} options The filter options
         */
        all( options? : IPostOptions ) : ng.IPromise<Modepress.IGetPosts>
        {
            var that = this;
            return new this._q<Modepress.IGetPosts>(function( resolve, reject ) {

                options = options || <IPostOptions>{};
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

                var url : string = `${this._url}/api/posts?`;
                if (options.author !== undefined)
                    url += `author=${options.author}&`;
                if (options.visibility !== undefined)
                    url += `visibility=${Visibility[options.visibility]}&`;
                if (options.keyword !== undefined)
                    url += `keyword=${options.keyword}&`;
                if (options.sortByUpdate !== undefined)
                    url += `sort=${options.sortByUpdate}&`;
                if (options.sortOrder !== undefined)
                    url += `sortOrder=${SortOrder[options.sortOrder]}&`;
                if (options.minimal !== undefined)
                    url += `minimal=${options.minimal}&`;
                if (options.categories !== undefined)
                    url += `categories=${options.categories.join(',')}&`;
                if (options.tags !== undefined)
                    url += `tags=${options.tags.join(',')}&`;
                if (options.rtags !== undefined)
                    url += `rtags=${options.rtags.join(',')}&`;
                if (options.index !== undefined)
                    url += `index=${options.index}&`;
                if (options.limit !== undefined)
                    url += `limit=${options.limit}&`;

                that._http.get<Modepress.IGetPosts>(url).then(function(response){
                    if ( !response.data.error )
                        reject(new Error(response.data.message));

                    resolve(response.data);
                }).catch(function(err) {
                    reject(err);
                })
            });
        }
    }
}