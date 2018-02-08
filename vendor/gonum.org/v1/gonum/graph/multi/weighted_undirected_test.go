// Copyright ©2014 The Gonum Authors. All rights reserved.
// Use of this source code is governed by a BSD-style
// license that can be found in the LICENSE file.

package multi

import (
	"testing"

	"gonum.org/v1/gonum/graph"
)

func TestWeightedMaxID(t *testing.T) {
	g := NewWeightedUndirectedGraph()
	nodes := make(map[graph.Node]struct{})
	for i := Node(0); i < 3; i++ {
		g.AddNode(i)
		nodes[i] = struct{}{}
	}
	g.RemoveNode(Node(0))
	delete(nodes, Node(0))
	g.RemoveNode(Node(2))
	delete(nodes, Node(2))
	n := g.NewNode()
	g.AddNode(n)
	if !g.Has(n) {
		t.Error("added node does not exist in graph")
	}
	if _, exists := nodes[n]; exists {
		t.Errorf("Created already existing node id: %v", n.ID())
	}
}

// Test for issue #123 https://github.com/gonum/graph/issues/123
func TestIssue123WeightedUndirectedGraph(t *testing.T) {
	defer func() {
		if r := recover(); r != nil {
			t.Errorf("unexpected panic: %v", r)
		}
	}()
	g := NewWeightedUndirectedGraph()

	n0 := g.NewNode()
	g.AddNode(n0)

	n1 := g.NewNode()
	g.AddNode(n1)

	g.RemoveNode(n0)

	n2 := g.NewNode()
	g.AddNode(n2)
}
