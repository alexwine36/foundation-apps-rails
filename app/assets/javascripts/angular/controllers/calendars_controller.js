app.controller('CalendarsController', ['$rootScope', '$scope', 'restApi', '$state', 'FoundationApi', '$filter', '$sce', function($rootScope, $scope, restApi, $state, foundationApi, $filter, $sce) {
  $scope.api = new restApi('calendars');
  $scope.params = $state.params;

  var filterCalendars = function() {
    $scope.filteredCalendars = $scope.calendars;
    if ( $scope.params.id ) {
      $scope.filteredCalendars = $filter('filter')($scope.calendars, {id: $scope.params.id});
      $scope.calendar = $scope.filteredCalendars[0];
    }
  }

  $scope.api.getIndex().then(function() {
    $scope.calendars = $scope.api.data;
    filterCalendars();
  });

  $rootScope.$on('$stateChangeSuccess',
    function(event, toState, toParams, fromState, fromParams) {
      $scope.params = toParams;
      filterCalendars();
  });

  $scope.new = function() {
    $scope.calendar = {title: "", content: ""};
    foundationApi.publish('new-calendars', 'open');
  }

  $scope.edit = function(id) {
    $scope.calendar = $filter('filter')($scope.calendars, {id: id})[0];
    foundationApi.publish('edit-calendars', 'open');
  }

  $scope.update = function() {
    $scope.api.putUpdate({
      id: $scope.calendar.id,
      calendar: {
        title: $scope.calendar.title,
        content: $scope.calendar.content
      }
    }).then(function() {
      $scope.data = $scope.api.data;
      if ( $scope.data.errors ) {
        handleErrors($scope.data.errors);
      } else {
        filterCalendars();
        foundationApi.publish('main-notifications', {title: "Calendar Updated", color: "success", position: "bottom left"});
        foundationApi.publish('edit-calendars', 'close');
      }
    });
  }

  $scope.create = function() {
    $scope.api.postCreate({
      calendar: {
        title: $scope.calendar.title || '',
        content: $scope.calendar.content || ''
      }
    }).then(function() {
      $scope.data = $scope.api.data;
      if ( $scope.data.errors ) {
        handleErrors($scope.data.errors);
      } else {
        $scope.calendar = $scope.api.data;
        $scope.calendars.push($scope.calendar);
        filterCalendars();
        $state.go('calendars');
        foundationApi.publish('main-notifications', {title: "Calendar Created", color: "success", position: "bottom left"});
        foundationApi.publish('new-calendars', 'close');
      }
    });
  }

  $scope.destroy = function(calendar) {
    $scope.calendar = calendar;
    foundationApi.publish('delete-calendars', 'open');
  }

  $scope.destroyConfirm = function(calendar) {
    $scope.api.deleteDestroy({id: calendar.id}).then(function() {
      $scope.data = $scope.api.data;
      if ( $scope.data.errors ) {
        handleErrors($scope.data.errors);
      } else {
        var index = $scope.calendars.indexOf(calendar)
        $scope.calendars.splice(index, 1);
        filterCalendars();
        $state.go('calendars');
        foundationApi.publish('main-notifications', {title: "Calendar Deleted", color: "warning", position: "bottom left"});
      }
    });
  }

  $scope.deliberatelyTrustDangerousSnippet = function(content) {
   return $sce.trustAsHtml(content);
  };

  var handleErrors = function(errors) {
    var content = '';
    for (var key in errors) {
      for (var error in errors[key]) {
        if ( error > 0 || key > 0 ) {
          content += ", ";
        }
        content += key.toUpperCase()[0] + key.slice(1) + ' ' + errors[key][error];
      }
    }
    foundationApi.publish('main-notifications', {title: "Error", content: content, color: "alert", position: "bottom left"});
  }

}]);
