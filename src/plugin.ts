module ModepressClientPlugin {
  angular.module("modepress-client", ['ngSanitize'])
    .value('apiUrl', '')
	  .service("posts", PostService )
}