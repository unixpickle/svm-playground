(function() {

  function linearKernel(v1, v2) {
    return v1[0]*v2[0] + v1[1]*v2[1];
  }

  function squareOneKernel(v1, v2) {
    return Math.pow(linearKernel(v1, v2)+1, 2);
  }

  function rbfKernel(param, v1, v2) {
    var diff1 = v1[0] - v2[0];
    var diff2 = v1[1] - v2[1];
    var diffMag = diff1*diff1 + diff2*diff2;
    return Math.exp(-param * diffMag);
  }

  window.app.kernelNames = ['Linear', '(xy+1)^2', 'RBF 0.1', 'RBF 1', 'RBF 0.01', 'RBF 3',
    'RBF 10'];
  window.app.kernels = [linearKernel, squareOneKernel, rbfKernel.bind(null, 0.1),
    rbfKernel.bind(null, 1), rbfKernel.bind(null, 0.01), rbfKernel.bind(null, 3),
    rbfKernel.bind(null, 10)];

})();
