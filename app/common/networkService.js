app.service('networkService',networkService);

function networkService($http,$q){

    this.getData = function(){
        
        var defer = $q.defer();

        $http.get('../resources/graph.json').then(function(success){
            defer.resolve(success);
        },function(error){
            defer.reject(error);
        });

        return defer.promise;
    }
}