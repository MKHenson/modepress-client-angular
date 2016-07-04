module ModepressClientPlugin {

    /**
     * A service for interacting with categories
     */
    export class CategoryService {

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
         * Removes a category by its ID
         * @param {string} id The id of the category
         * @returns {ng.IPromise<string>}
         */
        delete(id: string): ng.IPromise<string>
        {
            var that = this;
            return new this._q<string>(function( resolve, reject ) {
                var url : string = `${this._url}/api/categories/id`;
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
         * Creates a new category
         * @param {Modepress.ICategory} category The category data to create
         * @returns {ng.IPromise<string>}
         */
        create(category: Modepress.ICategory): ng.IPromise<string>
        {
            var that = this;
            return new this._q<string>(function( resolve, reject ) {
                var url : string = `${this._url}/api/categories`;
                that._http.post<Modepress.IResponse>(url, category).then(function(response) {
                    if ( response.data.error )
                        reject(new Error(response.data.message));

                    resolve(response.data.message);
                }).catch(function(err) {
                    reject(err);
                })
            });
        }

        /**
         * Gets all categories
         * @param {number} index The start index to fetch categories from
         * @param {number} limit The number of categories to return for this call
         * @returns {Modepress.IGetCategories}
         */
        all( index? : number, limit? : number ) : ng.IPromise<Modepress.IGetCategories>
        {
            var that = this;
            return new this._q<Modepress.IGetCategories>(function( resolve, reject ) {

                var url : string = `${this._url}/api/categories?`;

                if (index !== undefined)
                    url += `index=${index}&`;
                if (limit !== undefined)
                    url += `limit=${limit}&`;

                that._http.get<Modepress.IGetCategories>(url).then(function(response){
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