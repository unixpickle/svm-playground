(function() {

  var SAMPLE_COUNT = 100;

  var dataView;

  var currentDataSet;
  var currentKernel;
  var currentThreshold;

  function setupKernelPicker() {
    var picker = document.getElementById('kernel-picker');
    for (var i = 0, len = window.app.kernels.length; i < len; ++i) {
      var name = window.app.kernelNames[i];
      var option = document.createElement('option');
      option.value = i+'';
      option.textContent = name;
      picker.appendChild(option);
    }
    currentKernel = window.app.kernels[0];
    picker.addEventListener('change', function() {
      var kernelIdx = parseInt(picker.value);
      currentKernel = window.app.kernels[kernelIdx];
      trainClassifier();
    });
  }

  function setupDataPicker() {
    var picker = document.getElementById('data-picker');
    for (var i = 0, len = window.app.dataSets.length; i < len; ++i) {
      var name = window.app.dataSetNames[i];
      var option = document.createElement('option');
      option.value = i+'';
      option.textContent = name;
      picker.appendChild(option);
    }
    currentDataSet = window.app.dataSets[0];
    picker.addEventListener('change', function() {
      var dataIdx = parseInt(picker.value);
      currentDataSet = window.app.dataSets[dataIdx];
      dataView.setSamples(currentDataSet.generateData(SAMPLE_COUNT, SAMPLE_COUNT));
      trainClassifier();
    });
  }

  function setupThresholdPicker() {
    var thresholds = [0.0001, 0.001, 0.01];
    var picker = document.getElementById('threshold-picker');
    for (var i = 0, len = thresholds.length; i < len; ++i) {
      var name = ''+thresholds[i];
      var option = document.createElement('option');
      option.value = name;
      option.textContent = name;
      picker.appendChild(option);
    }
    currentThreshold = thresholds[0];
    picker.addEventListener('change', function() {
      currentThreshold = parseFloat(picker.value);
      trainClassifier();
    });
  }

  function setupSupportCheckbox() {
    var box = document.getElementById('support-only-checkbox');
    box.addEventListener('change', function() {
      dataView.setSupportOnly(box.checked);
    });
  }

  function setupDataView() {
    var dataCanvas = document.getElementById('data-canvas');
    dataView = new window.app.DataView(dataCanvas);
  }

  function trainClassifier() {
    dataView.setClassifier(null);
    var data = dataView.getSamples();
    window.app.makeClassifier(data, [true, true], currentThreshold, currentKernel,
      dataView.setClassifier.bind(dataView));
  }

  window.addEventListener('load', function() {
    setupKernelPicker();
    setupDataPicker();
    setupSupportCheckbox();
    setupThresholdPicker();
    setupDataView();

    var data = currentDataSet.generateData(SAMPLE_COUNT, SAMPLE_COUNT);
    dataView.setSamples(data);
    trainClassifier();
  });

})();
