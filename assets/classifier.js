(function() {

  var TIMEOUT = 3000;

  function Classifier(samples, solution, kernel) {
    this._samples = samples;
    this._solution = solution;
    this._kernel = kernel;

    this._sampleVecs = [];
    for (var i = 0, len = this._samples.length; i < len; ++i) {
      this._sampleVecs[i] = samples[i].vector();
    }
  }

  Classifier.prototype.samples = function() {
    return this._samples;
  };

  Classifier.prototype.supportVectors = function() {
    var vecs = [];
    var indices = this._solution.indices;
    for (var i = 0, len = indices.length; i < len; ++i) {
      vecs.push(this._samples[indices[i]]);
    }
    return vecs;
  };

  Classifier.prototype.classify = function(x, y) {
    var sampleVec = [x, y];
    var indices = this._solution.indices;
    var coeffs = this._solution.coeffs;

    var sum = 0;
    for (var i = 0, len = indices.length; i < len; ++i) {
      var supportVec = this._sampleVecs[indices[i]];
      var product = this._kernel(sampleVec, supportVec);
      var coeff = coeffs[i];
      sum += coeff * product;
    }

    return sum + this._solution.threshold;
  };

  window.app.makeClassifier = function(samples, tradeoff, kernel, cb) {
    samples = samples.slice();

    var posVecs = [];
    var negVecs = [];
    for (var i = 0, len = samples.length; i < len; ++i) {
      var vec = samples[i].vector();
      if (samples[i].positive()) {
        posVecs.push(vec);
      } else {
        negVecs.push(vec);
      }
    }

    var outputElement = document.getElementById('output');
    outputElement.className = 'loading';
    window.app.solve(posVecs, negVecs, tradeoff, TIMEOUT, kernel, function(s) {
      outputElement.className = '';
      cb(new Classifier(samples, s, kernel));
    });
  };

})();
