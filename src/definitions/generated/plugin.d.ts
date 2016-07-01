declare module ModepressClientPlugin {
    /**
     * A service for communicating with a Modepress backend and its endpoints
     */
    class ModepressService {
        private _http;
        private _location;
        private _url;
        static $inject: string[];
        constructor($http: ng.IHttpService, $location: ng.ILocationService, apiUrl: string);
    }
}
declare module ModepressClientPlugin {
}
