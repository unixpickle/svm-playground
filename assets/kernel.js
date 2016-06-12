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

  window.app.kernelNames = ['Linear', '(xy+1)^2'];
  window.app.kernels = [linearKernel, squareOneKernel];

})();
