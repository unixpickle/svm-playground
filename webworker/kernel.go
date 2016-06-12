package main

import "math"

type Kernel func(x1, y1, x2, y2 float64) float64

var Kernels = map[string]Kernel{
	"Linear":         linearKernel,
	"(xy+1)^2":       squareOneKernel,
	"exp(-.1*|x-y|)": makeRBFKernel(0.1),
	"exp(-1*|x-y|)":  makeRBFKernel(1),
	"exp(-3*|x-y|)":  makeRBFKernel(3),
	"exp(-10*|x-y|)": makeRBFKernel(10),
	"tanh(xy-1)":     makeTanhKernel(1, -1),
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

func makeTanhKernel(coeff, bias float64) Kernel {
	return func(x1, y1, x2, y2 float64) float64 {
		return math.Tanh(coeff*linearKernel(x1, y1, x2, y2) + bias)
	}
}
