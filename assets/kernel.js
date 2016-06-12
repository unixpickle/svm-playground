(function() {

  function linearKernel(v1, v2) {
    var sum = 0;
    for (var i = 0, len = v1.length; i < len; ++i) {
      sum += v1[i]*v2[i];
    }
    return sum;
  }

  function squareOneKernel(v1, v2) {
    return Math.pow(linearKernel(v1, v2)+1, 2);
  }

  function rbfKernel(param, v1, v2) {
    var diff = 0;
    for (var i = 0, len = v1.length; i < len; ++i) {
      diff += Math.pow(v2[i]-v1[i], 2);
    }
    return Math.exp(-param * diff);
  }

  window.app.kernelNames = ['Linear', '(xy+1)^2', 'RBF 0.1', 'RBF 1', 'RBF 0.01', 'RBF 3',
    'RBF 10'];
  window.app.kernels = [linearKernel, squareOneKernel, rbfKernel.bind(null, 0.1),
    rbfKernel.bind(null, 1), rbfKernel.bind(null, 0.01), rbfKernel.bind(null, 3),
    rbfKernel.bind(null, 10)];

})();
