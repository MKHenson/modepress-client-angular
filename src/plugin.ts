module ModepressClientPlugin {
  angular.module("modepress-client", ['ngSanitize'])
    .value('apiUrl', '')
	  .service("posts", PostService )
    .service("renders", RenderService )
    .service("categories", CategoryService )
    .service("comments", CommentService )
}