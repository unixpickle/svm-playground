package main

import (
	"time"

	"github.com/gopherjs/gopherjs/js"
	"github.com/unixpickle/weakai/svm"
)

type Request struct {
	Tradeoff  float64
	Timeout   time.Duration
	Kernel    Kernel
	GridSize  int
	Positives []svm.Sample
	Negatives []svm.Sample
}

func NewRequest(dataArg []*js.Object) *Request {
	if len(dataArg) != 1 {
		panic("expected one argument")
	}
	data := dataArg[0].Get("data")
	positives := sampleArray(1, data.Index(4))
	return &Request{
		Tradeoff:  data.Index(0).Float(),
		Timeout:   time.Millisecond * time.Duration(data.Index(1).Int()),
		Kernel:    Kernels[data.Index(2).String()],
		GridSize:  data.Index(3).Int(),
		Positives: positives,
		Negatives: sampleArray(len(positives)+1, data.Index(5)),
	}
}

func sampleArray(startIdx int, j *js.Object) []svm.Sample {
	var res []svm.Sample
	for i := 0; i < j.Length(); i++ {
		obj := j.Index(i)
		v := []float64{obj.Index(0).Float(), obj.Index(1).Float()}
		res = append(res, svm.Sample{V: v, UserInfo: startIdx + i})
	}
	return res
}
