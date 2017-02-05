(function(){
'use strict';

angular.module('NarrowItDownApp',[])
.controller('NarrowItDownController',NarrowItDownController)
.service('MenuSearchService',MenuSearchService)
.constant('ApiBasePath', "https://davids-restaurant.herokuapp.com")
.directive('foundItems', FoundItemsDirective);

function FoundItemsDirective() {
  var ddo = {
    templateUrl: 'shoppingList.html',
    scope: {
      foundItems1: '<',
      onRemove:'&'
    },
    controller: FoundItemsDirectiveController,
    controllerAs: 'list',
    bindToController: true
  };

  return ddo;
}

  NarrowItDownController.$inject = ['MenuSearchService'];
  function NarrowItDownController(MenuSearchService){
    var list = this;
    list.itemName="";
    list.foundElements = function(){
      MenuSearchService.getMatchedMenuItems(list.itemName)
        .then(function (data){
              list.found = data;
        });
    }

    list.removeItem = function (itemIndex) {
        MenuSearchService.removeItem(itemIndex);
        list.itemName="";
    };
  }

  function FoundItemsDirectiveController(){
      var list = this;
  }

  MenuSearchService.$inject = ['$http', 'ApiBasePath'];
  function MenuSearchService($http, ApiBasePath){
    var service=this;
    service.getMatchedMenuItems = function(searchTerm) {
       return $http({
       method: 'GET',
       url: (ApiBasePath + "/menu_items.json"),
         }).then(function (result) {
           var foundItems=[];
           if(searchTerm.trim()!=""){
              var menu_items=result.data.menu_items;
              for(var i=0;i<menu_items.length;i++){
                if(menu_items[i].description.indexOf(searchTerm) !== -1){
                  foundItems.push(menu_items[i]);
                }
              }
            }
            return foundItems;
        });
    }

    service.removeItem = function (itemIndex) {
      foundItems.splice(itemIndex, 1);
    };
  }

})();
