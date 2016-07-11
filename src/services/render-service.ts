module ModepressClientPlugin {

    /**
     * Describes how to filter the renders returned from a GET call.
     */
    export interface IRenderOptions {
        /** Set the number of renders returned by the call */
        limit?: number;
        /** Set the starting index for fetching renders */
        index?: number;
        /** Filter by a render by a keyword in its url */
        keyword?: string;
        /** If true, do not fetch the render's content */
        minimal?: boolean;
        /** Specify the sort order */
        sortOrder?: SortOrder;
    }

    /**
     * A service for interacting with page renders and the relevant modepress endpoints
     */
    export class RenderService {

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
         * Gets a render by its id
         * @param {string} id The id of the render to fetch
         * @returns {ng.IPromise<string>} Returns the preview in HTML
         */
        preview( id : string ) : ng.IPromise<string>
        {
            var that = this;
            return new this._q<string>(function( resolve, reject ) {
                var url : string = `${that._url}/api/renders/preview/${id}`;
                that._http.get<string>(url).then(function(response) {
                    resolve(response.data);
                }).catch(function(err) {
                    reject(err);
                })
            });
        }

        /**
         * Removes a render by its ID
         * @param {string} id The id of the render
         * @returns {ng.IPromise<string>} Returns the ID of the removed render
         */
        delete(id: string): ng.IPromise<string>
        {
            var that = this;
            return new this._q<string>(function( resolve, reject ) {
                var url : string = `${that._url}/api/renders/${id}`;
                that._http.delete<Modepress.IResponse>(url).then(function(response){
                    if ( response.data.error )
                        reject(new Error(response.data.message));

                    resolve(id);
                }).catch(function(err) {
                    reject(err);
                })
            });
        }

        /**
         * Removes all renders
         */
        clear(id: string): ng.IPromise<void>
        {
            var that = this;
            return new this._q<void>(function( resolve, reject ) {
                var url : string = `${that._url}/api/renders/clear`;
                that._http.delete<Modepress.IResponse>(url).then(function(response) {
                    if ( response.data.error )
                        reject(new Error(response.data.message));

                    resolve();
                }).catch(function(err) {
                    reject(err);
                })
            });
        }

        /**
         * Gets all renders
         * @param {IRenderOptions} options
         * @returns {ng.IPromise<Modepress.IGetRenders>}
         */
        all( options: IRenderOptions ) : ng.IPromise<Modepress.IGetRenders>
        {
            var that = this;
            return new this._q<Modepress.IGetRenders>(function( resolve, reject ) {

                options = options || <IRenderOptions>{};
                options.limit = options.limit || undefined;
                options.index = options.index || undefined;
                options.keyword = options.keyword || undefined;
                options.sortOrder = options.sortOrder || undefined;
                options.minimal = options.minimal || undefined;

                var url : string = `${that._url}/api/renders?`;

                if (options.keyword !== undefined)
                    url += `search=${options.keyword}&`;
                if (options.sortOrder !== undefined)
                    url += `sortOrder=${SortOrder[options.sortOrder]}&`;
                if (options.minimal !== undefined)
                    url += `minimal=${options.minimal}&`;
                if (options.index !== undefined)
                    url += `index=${options.index}&`;
                if (options.limit !== undefined)
                    url += `limit=${options.limit}&`;

                that._http.get<Modepress.IGetRenders>(url).then(function(response){
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