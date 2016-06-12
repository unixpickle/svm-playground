package main

import (
	"encoding/json"

	"github.com/gopherjs/gopherjs/js"
	"github.com/unixpickle/weakai/svm"
)

type Result struct {
	Classifier *Classifier `json:"classifier"`
	GridCache  string      `json:"gridCache"`
}

func main() {
	js.Global.Set("onmessage", js.MakeFunc(handleMessage))
}

func handleMessage(this *js.Object, dataArg []*js.Object) interface{} {
	req := NewRequest(dataArg)

	problem := &svm.Problem{
		Positives: req.Positives,
		Negatives: req.Negatives,
		Kernel: func(s1, s2 svm.Sample) float64 {
			x1, y1 := s1.V[0], s1.V[1]
			x2, y2 := s2.V[0], s2.V[1]
			return req.Kernel(x1, y1, x2, y2)
		},
	}
	solver := &svm.GradientDescentSolver{
		Timeout:  req.Timeout,
		Tradeoff: req.Tradeoff,
	}
	solution := solver.Solve(problem)

	classifier := NewClassifier(req.Kernel, solution)

	cache := make([]float64, req.GridSize*req.GridSize)
	cacheIdx := 0
	for y := 0; y < req.GridSize; y++ {
		for x := 0; x < req.GridSize; x++ {
			roughX := (float64(x)/float64(req.GridSize))*2 - 1
			roughY := (float64(y)/float64(req.GridSize))*2 - 1
			cache[cacheIdx] = classifier.Classify(roughX, roughY)
			cacheIdx++
		}
	}

	cacheStr := js.Global.Get("JSON").Call("stringify", cache).String()
	res := &Result{
		Classifier: classifier,
		GridCache:  cacheStr,
	}
	resData, _ := json.Marshal(res)

	js.Global.Call("postMessage", string(resData))
	js.Global.Call("close")
	return nil
}
