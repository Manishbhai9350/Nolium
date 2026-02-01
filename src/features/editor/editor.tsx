"use client";

import { useState, useCallback } from "react";
import {
  type NodeChange,
  type EdgeChange,
  ReactFlow,
  applyNodeChanges,
  applyEdgeChanges,
  addEdge,
  Connection,
  Background,
  MiniMap,
  Controls,
  Panel,
} from "@xyflow/react";
import "@xyflow/react/dist/style.css";
import { useSuspenseWorkflow } from "../workflows/hooks/useWorkflow";
import { nodeComponent } from "@/config/node-component";
import { AddNodeButton } from "@/components/custom/add-node-button";
import NodeSelector from "@/components/custom/add-node-sheet";
import { useSetAtom } from 'jotai';
import { editorAtom } from "./state/editor.atom";
import ManualExecutionWorkflowButton from "../executions/components/manual-execution-button";

// const initialNodes = [
//   { id: "n1", position: { x: 0, y: 0 }, data: { label: "Node 1" } },
//   { id: "n2", position: { x: 0, y: 100 }, data: { label: "Node 2" } },
// ];
// const initialEdges = [{ id: "n1-n2", source: "n1", target: "n2" }];

export default function Editor({ workflowId }:{workflowId:string}) {
  const workflow = useSuspenseWorkflow({ workflowId })

  const [sheetOpen, setSheetOpen] = useState(false)

  const [nodes, setNodes] = useState(workflow.data.nodes);
  const [edges, setEdges] = useState(workflow.data.edges);

  const setEditor = useSetAtom(editorAtom);


  const onNodesChange = useCallback(
    (changes:NodeChangeType[]) =>
      setNodes((nodesSnapshot) => applyNodeChanges(changes, nodesSnapshot)),
    [],
  );
  const onEdgesChange = useCallback(
    (changes:EdgeChangeType[]) =>
      setEdges((edgesSnapshot) => applyEdgeChanges(changes, edgesSnapshot)),
    [],
  );
  const onConnect = useCallback(
    (params:Connection) => setEdges((edgesSnapshot) => addEdge(params, edgesSnapshot)),
    [],
  );


  return (
    <div className="flex-1">
      <ReactFlow
        nodes={nodes}
        edges={edges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        onConnect={onConnect}
        nodeTypes={nodeComponent}
        fitView
        onInit={setEditor}
        proOptions={{
            hideAttribution:true
        }}
      >
        <Controls />
        <MiniMap />
        <Background />
        <Panel position="top-right" >
          <NodeSelector open={sheetOpen} onOpenChange={v => setSheetOpen(v)} />
            <AddNodeButton onClick={() => setSheetOpen(true)} />
        </Panel>
        <Panel position="top-center" >
          <ManualExecutionWorkflowButton workflowId={workflowId} />
        </Panel>
      </ReactFlow>
    </div>
  );
}
