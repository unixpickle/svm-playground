package main

import (
	"time"

	"github.com/gopherjs/gopherjs/js"
	"github.com/unixpickle/weakai/svm"
)

func main() {
	js.Global.Set("onmessage", js.MakeFunc(handleMessage))
}

func handleMessage(this *js.Object, dataArg []*js.Object) interface{} {
	if len(dataArg) != 1 {
		panic("expected one argument")
	}

	data := dataArg[0].Get("data")
	sampleCount := data.Index(0).Int()
	positiveCount := data.Index(1).Int()
	sampleProducts := data.Index(2)
	tradeoff := data.Index(3).Float()
	timeout := time.Millisecond * time.Duration(data.Index(4).Int())

	problem := svmProblem(sampleCount, positiveCount, func(i, j int) float64 {
		idx := i + j*sampleCount
		return sampleProducts.Index(idx).Float()
	})

	solver := &svm.GradientDescentSolver{Timeout: timeout, Tradeoff: tradeoff}
	solution := solver.Solve(problem)

	js.Global.Call("postMessage", solutionToJS(solution))
	js.Global.Call("close")
	return nil
}

func svmProblem(total, positive int, products func(i, j int) float64) *svm.Problem {
	var samples []svm.Sample
	for i := 0; i < total; i++ {
		sample := svm.Sample{UserInfo: i + 1, V: []float64{}}
		samples = append(samples, sample)
	}
	return &svm.Problem{
		Positives: samples[:positive],
		Negatives: samples[positive:],
		Kernel: func(s1, s2 svm.Sample) float64 {
			if s1.UserInfo == 0 || s2.UserInfo == 0 {
				panic("not one of the provided samples")
			}
			return products(s1.UserInfo-1, s2.UserInfo-1)
		},
	}
}

func solutionToJS(solution *svm.CombinationClassifier) interface{} {
	supportIndices := make([]int, len(solution.SupportVectors))
	supportCoeffs := make([]float64, len(solution.SupportVectors))
	for i, x := range solution.SupportVectors {
		supportIndices[i] = x.UserInfo - 1
		supportCoeffs[i] = solution.Coefficients[i]
	}
	res := js.Global.Get("Object").New()
	res.Set("indices", supportIndices)
	res.Set("coeffs", supportCoeffs)
	res.Set("threshold", solution.Threshold)
	return res
}
