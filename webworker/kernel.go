package main

import "math"

type Kernel func(x1, y1, x2, y2 float64) float64

var Kernels = map[string]Kernel{
	"Linear":   linearKernel,
	"(xy+1)^2": squareOneKernel,
	"RBF 0.1":  makeRBFKernel(0.1),
	"RBF 1":    makeRBFKernel(1),
	"RBF 3":    makeRBFKernel(3),
	"RBF 10":   makeRBFKernel(10),
}

func linearKernel(x1, y1, x2, y2 float64) float64 {
	return x1*x2 + y1*y2
}

func squareOneKernel(x1, y1, x2, y2 float64) float64 {
	x := linearKernel(x1, y1, x2, y2) + 1
	return x * x
}

func makeRBFKernel(param float64) Kernel {
	return func(x1, y1, x2, y2 float64) float64 {
		xDiff := x1 - x2
		yDiff := y1 - y2
		diffMag := xDiff*xDiff + yDiff*yDiff
		return math.Exp(-param * diffMag)
	}
}
