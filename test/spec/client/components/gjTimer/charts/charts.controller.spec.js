(function() {

  'use strict';

  var $controller,
    $scope,
    $rootScope,
    ChartsController,
    ChartsService,
    results,
    result;

  describe('The charts controller', function() {

    beforeEach(module('gjTimer'));

    beforeEach(inject(function($injector) {

      $rootScope = $injector.get('$rootScope');
      $scope = $rootScope.$new();
      $controller = $injector.get('$controller');
      ChartsService = $injector.get('ChartsService');

      results = [ { rawTime: 6250 }, { rawTime: 6440 }, { rawTime: 8480 } ];
      result = { rawTime: 5580 };

      spyOn(ChartsService, 'setChartDefaults');
      spyOn(ChartsService, 'initLineChartData').and.returnValue({ series: [], labels: [], data: [] });
      spyOn(ChartsService, 'initBarChartData').and.returnValue({ labels: [], data: [] });
      spyOn(ChartsService, 'addLineChartData').and.returnValue({ series: [], labels: [], data: [] });
      spyOn(ChartsService, 'addBarChartData').and.returnValue({ labels: [], data: [] });

      ChartsController = $controller('ChartsController as ctrl', {
        $scope: $scope,
        ChartsService: ChartsService
      }, {
        results: results
      });

      $scope.$digest();

    }));

    it('should call the ChartsService to set the default Chart settings', function() {

      expect(ChartsService.setChartDefaults).toHaveBeenCalledWith();

    });

    it('should call the ChartsService to initialize the line chart data', function() {

      expect(ChartsService.initLineChartData).toHaveBeenCalledWith(results);

    });

    it('should call the ChartsService to initialize the bar chart data', function() {

      expect(ChartsService.initBarChartData).toHaveBeenCalledWith(results);

    });

    describe('new result event', function() {

      it('should call the ChartsService to add line chart data with the line chart and new result', function() {

        $rootScope.$broadcast('new result', result);
        expect(ChartsService.addLineChartData).toHaveBeenCalledWith({ series: [], labels: [], data: [] }, result);

      });

      it('should call the ChartsService to add bar chart data with the bar chart and new result', function() {

        $rootScope.$broadcast('new result', result);
        expect(ChartsService.addBarChartData).toHaveBeenCalledWith({ labels: [], data: [] }, result);

      });

    });

    describe('refresh charts event', function() {

      it('should call the ChartsService to initialize the line chart data', function() {

        $rootScope.$broadcast('refresh charts', result);
        expect(ChartsService.initLineChartData).toHaveBeenCalledWith(results);

      });

      it('should call the ChartsService to initialize the bar chart data', function() {

        $rootScope.$broadcast('refresh charts', result);
        expect(ChartsService.initBarChartData).toHaveBeenCalledWith(results);

      });

    });

  });

})();
