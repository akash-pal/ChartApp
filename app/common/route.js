
app.config(function ($routeProvider, $locationProvider) {
    
    $locationProvider.hashPrefix('');

    $routeProvider
        .when('/', {
            controller: firstPageController,
            templateUrl: 'module/firstPage/firstPage.html'
        })
        .otherwise({ redirectTo: '/' });
});