module ModepressClientPlugin {
  angular.module("blacktip", ['ngSanitize'])
    .value('apiUrl', '')
	  .service("modepress", PostService )
}