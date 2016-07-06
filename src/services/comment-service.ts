module ModepressClientPlugin {

    /**
     * Describes how to filter the posts returned from a GET call.
     */
    export interface ICommentOptions {
        /** Sort by last updated instead of date created */
        sortByUpdate?: boolean;
        /** Filter by public, private or both */
        visibility?: Visibility;
        /** Set the number of posts returned by the call */
        limit?: number;
        /** Set the starting index for fetching posts */
        index?: number;
        /** Filter by a post title or content keyword */
        keyword?: string;
        /** Specify the sort order */
        sortOrder?: SortOrder;
        /** Filter by a given user */
        user?: string;
        /** Filter by parent comment */
        parentId?: string;
        /** If true, the comments will be returned as in an expanded JSON format. I.e. children comments are returned as child comment objects.
         * Reltaed to depth.
         */
        expanded? : boolean;
        /** Only relevant if expanded is true. Defines how deep the comment traversal must go. A value of 1 means a comment and its children are
         * returned. A value of 2, means a comment, its children, and their children are returned.
         */
        depth?: number;
    }

    /**
     * A service for interacting with comment data and the relevant modepress endpoints
     */
    export class CommentService {

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
         * Gets a comment based on the url provided
         * @param {string} slug The slug of the comment
         * @returns {ng.IPromise<Modepress.IComment>}
         */
        private getSingle( url : string ): ng.IPromise<Modepress.IComment>
        {
            var that = this;
            return new this._q<Modepress.IComment>(function( resolve, reject ) {

                that._http.get<Modepress.IGetComment>(url).then(function(response) {
                    if ( response.data.error )
                        reject(new Error(response.data.message));

                    resolve(response.data.data);
                }).catch(function(err) {
                    reject(err);
                })
            });
        }

        /**
         * Gets a comment by its id
         * @param {string} slug The slug of the comment
         * @returns {ng.IPromise<Modepress.IComment>}
         */
        byId(id : string) : ng.IPromise<Modepress.IComment>
        {
            return this.getSingle(`${this._url}/api/comments/${id}`);
        }

        /**
         * Removes a comment by its ID
         * @param {string} user The parent user of the comment
         * @param {string} id The id of the comment
         * @returns {ng.IPromise<string>}
         */
        delete(user: string, id: string): ng.IPromise<string>
        {
            var that = this;
            return new this._q<string>(function( resolve, reject ) {
                var url : string = `${that._url}/api/users/${user}/comments/${id}`;
                that._http.delete<Modepress.IResponse>(url).then(function(response) {
                    if ( response.data.error )
                        reject(new Error(response.data.message));

                    resolve(response.data.message);
                }).catch(function(err) {
                    reject(err);
                })
            });
        }

        /**
         * Edits a comment by its ID
         * @param {string} user The parent user of the comment
         * @param {string} id The id of the comment
         * @param {Modepress.IComment} commentData The comment data to edit
         * @returns {ng.IPromise<string>}
         */
        edit(user: string, id: string, commentData: Modepress.IComment): ng.IPromise<string>
        {
            var that = this;
            return new this._q<Modepress.IComment>(function( resolve, reject ) {
                var url : string = `${that._url}/api/users/${user}/comments/${id}`;
                that._http.put<Modepress.IResponse>(url, commentData).then(function(response){
                    if ( response.data.error )
                        reject(new Error(response.data.message));

                    resolve(response.data.message);
                }).catch(function(err) {
                    reject(err);
                })
            });
        }

        /**
         * Creates a new comment
         * @param {string} postId The post we are commenting on
         * @param {Modepress.IComment} commentData The comment data to create
         * @param {string} [Optional] parentId The parent comment we are commenting on
         * @returns {ng.IPromise<string>}
         */
        create(postId: string, commentData: Modepress.IComment, parentId?: string): ng.IPromise<string>
        {
            var that = this;
            return new this._q<string>(function( resolve, reject ) {
                var url : string = `${that._url}/api/posts/${postId}/comments/${parentId}`;
                that._http.post<Modepress.IResponse>(url, commentData).then(function(response){
                    if ( response.data.error )
                        reject(new Error(response.data.message));

                    resolve(response.data.message);
                }).catch(function(err) {
                    reject(err);
                })
            });
        }

        /**
         * Gets all comments that are children of a given parent
         * @param {string} parentId The parent comment ID
         * @param {Modepress.ICommentOptions} options The filter options
         * @returns {ng.IPromise<Modepress.IGetComments>}
         */
        allByParent( parentId: string, options? : ICommentOptions ) : ng.IPromise<Modepress.IGetComments>
        {
            return this.all(`${this._url}/api/nested-comments/${parentId}`, options);
        }

         /**
         * Gets all comments of a user
         * @param {string} user The username  of the user
         * @param {Modepress.ICommentOptions} options The filter options
         * @returns {ng.IPromise<Modepress.IGetComments>}
         */
        allByUser( user: string, options? : ICommentOptions ) : ng.IPromise<Modepress.IGetComments>
        {
            return this.all(`${this._url}/api/users/${user}/comments`, options);
        }

        /**
         * Gets all comments that match each of the parameter conditions
         * @param {Modepress.ICommentOptions} options The filter options
         * @returns {ng.IPromise<Modepress.IGetComments>}
         */
        all( url: string = `${this._url}/api/comments?`, options? : ICommentOptions ) : ng.IPromise<Modepress.IGetComments>
        {
            var that = this;
            return new this._q<Modepress.IGetComments>(function( resolve, reject ) {

                options = options || <ICommentOptions>{};
                options.user = options.user || undefined;
                options.depth = options.depth || undefined;
                options.expanded = options.expanded || undefined;
                options.parentId = options.parentId || undefined;
                options.limit = options.limit || undefined;
                options.index = options.index || undefined;
                options.keyword = options.keyword || undefined;
                options.sortOrder = options.sortOrder || undefined;
                options.visibility = options.visibility || undefined;
                options.sortByUpdate = options.sortByUpdate || undefined;

                if (options.user !== undefined)
                    url += `user=${options.user}&`;
                if (options.visibility !== undefined)
                    url += `visibility=${Visibility[options.visibility]}&`;
                if (options.keyword !== undefined)
                    url += `keyword=${options.keyword}&`;
                if (options.sortByUpdate !== undefined)
                    url += `sort=${options.sortByUpdate}&`;
                if (options.sortOrder !== undefined)
                    url += `sortOrder=${SortOrder[options.sortOrder]}&`;
                if (options.depth !== undefined)
                    url += `depth=${options.depth}&`;
                if (options.expanded !== undefined)
                    url += `expanded=${options.expanded}&`;
                if (options.parentId !== undefined)
                    url += `parentId=${options.parentId}&`;
                if (options.index !== undefined)
                    url += `index=${options.index}&`;
                if (options.limit !== undefined)
                    url += `limit=${options.limit}&`;

                that._http.get<Modepress.IGetComments>(url).then(function(response){
                    if ( response.data.error )
                        reject(new Error(response.data.message));

                    resolve(response.data);
                }).catch(function(err) {
                    reject(err);
                })
            });
        }
    }
}