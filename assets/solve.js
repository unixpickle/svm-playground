(function() {

  var currentWorker = null;
  var ZERO_CUTOFF = 1e-8;

  window.app.solve = function(positives, negatives, tradeoff, timeout, kernel, cb) {
    if (currentWorker !== null) {
      currentWorker.terminate();
    }

    var sampleDots = [];
    var samples = positives.concat(negatives);
    for (var i = 0, len = samples.length; i < len; ++i) {
      for (var j = 0; j < len; ++j) {
        var dotProduct = kernel(samples[i], samples[j]);
        sampleDots[i+len*j] = dotProduct;
      }
    }
    currentWorker = new Worker('assets/webworker.js');
    currentWorker.onmessage = function(e) {
      currentWorker = null;
      var solution = e.data;
      removeNearZero(solution);
      cb(solution);
    };
    currentWorker.postMessage([samples.length, positives.length, sampleDots,
      tradeoff, timeout]);
  };

  function removeNearZero(solution) {
    var coeffs = [];
    var indices = [];
    for (var i = 0, len = solution.coeffs.length; i < len; ++i) {
      var coeff = solution.coeffs[i];
      if (Math.abs(coeff) > ZERO_CUTOFF) {
        coeffs.push(coeff);
        indices.push(solution.indices[i]);
      }
    }
    solution.coeffs = coeffs;
    solution.indices = indices;
  }

})();
