function formatResponse(data) {
    return eval('(' + data.substr(0, data.length - 10) + ')');
}

pagingAndSortingModule.factory('$pagingAndSorting', function ($rootScope, $http) {
    var scope = $rootScope.$new(true);

    scope.page = {
        contents: [],
        total: 0,
        pageable: {
            page_number: 1,
            page_size: 10
        }
    };

    function update_data() {
        if (!scope.url)
            return;

        var data = angular.extend(scope.data, { pageable: scope.page.pageable });
        $http.post(scope.url, data, { transformResponse: formatResponse }).success(function (data) {
            scope.cb(data);
            scope.page = data;
        });
    }

    return {
        options: scope,

        q: function (url, data, cb) {
            scope.url = url;
            scope.data = data;
            scope.cb = cb;

            update_data();
        },
        update_data: update_data
    };
});

pagingAndSortingModule.directive('sortColumn', function factory($pagingAndSorting) {
    return {
        restrict: 'A',
        scope: { property: '=sortColumn' },
        link: function (scope, iEle, iAttrs) {
            scope.moduleScope = $pagingAndSorting.options;

            function update() {
                angular.element(iEle).parent().find('i').remove();

                if (!scope.moduleScope.page.pageable.sort || scope.moduleScope.page.pageable.sort.property != scope.property) {
                    scope.moduleScope.pageable.sort = {
                        property: scope.property,
                        direction: 'ASC'
                    };
                } else {
                    if (scope.moduleScope.page.pageable.sort.direction == 'ASC')
                        scope.moduleScope.page.pageable.sort.direction = 'DESC';
                    else
                        scope.moduleScope.page.pageable.sort.direction = 'ASC';
                }

                if (scope.moduleScope.page.pageable.sort.direction == 'ASC') {
                    angular.element(iEle).prepend('<i class="icon-arrow-up"></i>');
                } else {
                    angular.element(iEle).prepend('<i class="icon-arrow-down"></i>');
                }

                $pagingAndSorting.update_data();
            }

            angular.element(iEle).click(function () {
                update();
            });
        }
    };
});

pagingAndSortingModule.directive('pages', function factory($pagingAndSorting) {
    return {
        template: '<div class="btn-group"></div>',
        replace: true,
        restrict: 'E',
        scope: {},
        link: function (scope, iEle, iAttrs) {
            scope.moduleScope = $pagingAndSorting.options;
            function update_buttons() {
                angular.element(iEle).html('');
                for (var i = 0; i < Math.ceil(scope.moduleScope.page.total / scope.moduleScope.page.pageable.page_size); i++) {
                    var button = angular.element('<button type="button" class="btn"></button>');
                    angular.element(button).text(i + 1).attr('data-page', i + 1);

                    if ((i + 1) == scope.moduleScope.page.pageable.page_number)
                        angular.element(button).addClass('active').attr('disabled', 'disabled');
                    angular.element(iEle).append(button);
                };

                angular.element(iEle).find('button').click(function () {
                    scope.moduleScope.page.pageable.page_number = angular.element(this).attr('data-page');
                    $pagingAndSorting.update_data();
                });
            }
            scope.$watch('moduleScope.page', function (newValue) {
                if (!newValue) return;
                update_buttons();
            });
        }
    };
});

pagingAndSortingModule.directive('pageSize', function factory($pagingAndSorting, $compile) {
    return {
        template: '<div class="btn-group"><select ng-model="page_size" style="width: 70px;"><option ng-repeat="i in [10, 25, 50]">{{i}}</option></select></div>',
        replace: true,
        restrict: 'E',
        scope: {},
        link: function (scope, iEle, iAttrs) {
            scope.moduleScope = $pagingAndSorting.options;
            $compile(iEle);

            scope.$watch('page_size', function (newValue) {
                if (!newValue) {
                    scope.page_size = 10;
                }
                $pagingAndSorting.options.page.pageable.page_size = newValue;
                $pagingAndSorting.update_data();
            });
        }
    };
});