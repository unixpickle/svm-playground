(function() {

  var dataView;

  window.addEventListener('load', function() {
    var dataCanvas = document.getElementById('data-canvas');
    dataView = new window.app.DataView(dataCanvas);

    var dataSet = window.app.dataSets[0];
    var data = dataSet.generateData(50, 50);
    dataView.setSamples(data);

    window.app.makeClassifier(data, [true, true], 0.0001, window.app.kernels[0], function(c) {
      console.log('c is', c);
      dataView.setClassifier(c);
    });
  });

})();
