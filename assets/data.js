(function() {

  window.app.coordinateNames = ['X', 'Y', 'X^2', 'Y^2', 'XY', 'sin(X)', 'sin(Y)'];

  function DataPoint(x, y, sign) {
    this._x = x;
    this._y = y;
    this._sign = sign;
  }

  DataPoint.prototype.vector = function(coordFlags) {
    var coords = [
      this._x,
      this._y,
      Math.pow(this._x, 2),
      Math.pow(this._y, 2),
      this._x * this._y,
      Math.sin(this._x),
      Math.sin(this._y),
    ];
    var output = [];
    for (var i = 0, len = coords.length; i < len; ++i) {
      if (coordFlags[i]) {
        output.push(coords[i]);
      }
    }
    return output;
  };

  DataPoint.prototype.sign = function() {
    return this._sign;
  };

  function DataSet(posGen, negGen) {
    this._posGen = posGen;
    this._negGen = negGen;
  }

  DataSet.prototype.generateData = function(count) {
    var posCount = Math.floor(count / 2);
    var res = [];
    for (var i = 0; i < count; ++i) {
      if (i < posCount) {
        res.push(this._posGen());
      } else {
        res.push(this._negGen());
      }
    }
  };

  window.app.dataSets = [
    new DataSet(function() {
      while (true) {
        var p = randomPoint();
        if (p[0]+p[1] > 0.1) {
          return new DataPoint(p[0], p[1], true);
        }
      }
    }, function() {
      while (true) {
        var p = randomPoint();
        if (p[0]+p[1] < -0.1) {
          return new DataPoint(p[0], p[1], false);
        }
      }
    })
  ];

  function randomPoint() {
    return [Math.random()*2-1, Math.random()*2-1];
  }

  function dotProduct(p1, p2) {
    return p1[0]*p2[0] + p1[1]*p2[1];
  }

})();
