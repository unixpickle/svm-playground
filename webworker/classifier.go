package main

import (
	"math"

	"github.com/unixpickle/weakai/svm"
)

const ZeroCutoff = 1e-8

type Classifier struct {
	Kernel    Kernel      `json:"-"`
	Vectors   [][]float64 `json:"vectors"`
	Coeffs    []float64   `json:"coeffs"`
	Indices   []int       `json:"indices"`
	Threshold float64     `json:"threshold"`
}

func NewClassifier(k Kernel, s *svm.CombinationClassifier) *Classifier {
	res := &Classifier{
		Kernel:    k,
		Vectors:   [][]float64{},
		Coeffs:    []float64{},
		Threshold: s.Threshold,
	}
	for i, coeff := range s.Coefficients {
		if math.Abs(coeff) > ZeroCutoff {
			sv := s.SupportVectors[i]
			vec := sv.V
			res.Vectors = append(res.Vectors, vec)
			res.Coeffs = append(res.Coeffs, coeff)
			res.Indices = append(res.Indices, sv.UserInfo-1)
		}
	}
	return res
}

func (c *Classifier) Classify(x, y float64) float64 {
	var sum float64
	for i, coeff := range c.Coeffs {
		vec := c.Vectors[i]
		sum += coeff * c.Kernel(x, y, vec[0], vec[1])
	}
	return sum + c.Threshold
}
