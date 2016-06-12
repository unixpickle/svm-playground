(function() {

  var TIMEOUT = 3000;

  function Classifier(samples, solution, coordFlags, kernel) {
    this._samples = samples;
    this._solution = solution;
    this._coordFlags = coordFlags;
    this._kernel = kernel;
  }

  Classifier.prototype.samples = function() {
    return this._samples;
  };

  Classifier.prototype.classify = function(sample) {
    var sampleVec = sample.vector(this._coordFlags);
    var indices = this._solution.indices;
    var coeffs = this._solution.coeffs;

    var sum = 0;
    for (var i = 0, len = indices.length; i < len; ++i) {
      var supportVec = this._samples[indices[i]];
      var product = this._kernel(sampleVec, supportVec.vector(this._coordFlags));
      var coeff = coeffs[i];
      sum += coeff * product;
    }

    return sum + this._solution.threshold;
  };

  window.app.makeClassifier = function(samples, coordFlags, tradeoff, kernel, cb) {
    coordFlags = coordFlags.slice();
    samples = samples.slice();

    var posVecs = [];
    var negVecs = [];
    for (var i = 0, len = samples.length; i < len; ++i) {
      var vec = samples[i].vector(coordFlags);
      if (samples[i].positive()) {
        posVecs.push(vec);
      } else {
        negVecs.push(vec);
      }
    }

    window.app.solve(posVecs, negVecs, tradeoff, TIMEOUT, kernel, function(s) {
      cb(new Classifier(samples, s, coordFlags, kernel));
    });
  };

})();
