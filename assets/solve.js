(function() {

  var currentWorker = null;

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
      cb(e.data);
    };
    currentWorker.postMessage([samples.length, positives.length, sampleDots,
      tradeoff, timeout]);
  };

})();
