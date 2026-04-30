'use client';

import { useCallback, useEffect } from 'react';
import ReactFlow, {
  Node,
  Edge,
  Background,
  BackgroundVariant,
  Controls,
  useNodesState,
  useEdgesState,
  MarkerType,
  Position,
} from 'reactflow';
import 'reactflow/dist/style.css';
import { StageNode } from './flow/StageNode';
import { SourceNode } from './flow/SourceNode';
import { OutputNode } from './flow/OutputNode';

const ZONE_COLORS = {
  landing: '#7aad4a',
  refined: '#c4832a',
  analytics: '#e8e4d4',
};

const initialNodes: Node[] = [
  {
    id: 'kaggle',
    type: 'sourceNode',
    position: { x: 0, y: 120 },
    data: {
      label: 'Kaggle Dataset',
      sublabel: '5 CSV files · Air Quality India',
      badge: 'SOURCE',
      badgeColor: '#7a7560',
    },
  },
  {
    id: 'extract',
    type: 'stageNode',
    position: { x: 220, y: 60 },
    data: {
      label: 'Extract',
      sublabel: 'scripts/extract.py',
      description: 'Descarga CSVs, validacion de esquema, ingesta inicial',
      zone: 'LANDING ZONE',
      zoneColor: ZONE_COLORS.landing,
      metrics: ['5 datasets', '26 ciudades'],
      step: '01',
    },
  },
  {
    id: 'transform',
    type: 'stageNode',
    position: { x: 500, y: 60 },
    data: {
      label: 'Transform',
      sublabel: 'PySpark + Pandas',
      description: 'Limpieza, encoding AQI Bucket → numerico, Parquet',
      zone: 'REFINED ZONE',
      zoneColor: ZONE_COLORS.refined,
      metrics: ['1M+ registros', 'Parquet format'],
      step: '02',
    },
  },
  {
    id: 'load',
    type: 'stageNode',
    position: { x: 780, y: 60 },
    data: {
      label: 'Load',
      sublabel: 'ydata_profiling + Spark',
      description: 'Analisis estadistico, perfilado, visualizacion',
      zone: 'ANALYTICS',
      zoneColor: ZONE_COLORS.analytics,
      metrics: ['6 años datos', 'Dashboard'],
      step: '03',
    },
  },
  {
    id: 'dashboard',
    type: 'outputNode',
    position: { x: 680, y: 280 },
    data: { label: 'Dashboard AQI', icon: '📊', href: '/dashboard' },
  },
  {
    id: 'reports',
    type: 'outputNode',
    position: { x: 840, y: 280 },
    data: { label: 'Informes', icon: '📄', href: '/reports' },
  },
  {
    id: 'docs',
    type: 'outputNode',
    position: { x: 1000, y: 280 },
    data: { label: 'Docs', icon: '📚', href: '/docs' },
  },
];

const initialEdges: Edge[] = [
  {
    id: 'kaggle-extract',
    source: 'kaggle',
    target: 'extract',
    type: 'smoothstep',
    animated: true,
    style: { stroke: ZONE_COLORS.landing, strokeWidth: 1.5 },
    markerEnd: { type: MarkerType.ArrowClosed, color: ZONE_COLORS.landing },
  },
  {
    id: 'extract-transform',
    source: 'extract',
    target: 'transform',
    type: 'smoothstep',
    animated: true,
    style: { stroke: ZONE_COLORS.refined, strokeWidth: 1.5 },
    markerEnd: { type: MarkerType.ArrowClosed, color: ZONE_COLORS.refined },
    label: 'CSV → Parquet',
    labelStyle: {
      fill: '#7a7560',
      fontFamily: 'Space Mono',
      fontSize: 10,
    },
    labelBgStyle: { fill: '#0a0b08', fillOpacity: 0.9 },
  },
  {
    id: 'transform-load',
    source: 'transform',
    target: 'load',
    type: 'smoothstep',
    animated: true,
    style: { stroke: ZONE_COLORS.analytics, strokeWidth: 1.5 },
    markerEnd: { type: MarkerType.ArrowClosed, color: ZONE_COLORS.analytics },
    label: 'Refined → Analytics',
    labelStyle: {
      fill: '#7a7560',
      fontFamily: 'Space Mono',
      fontSize: 10,
    },
    labelBgStyle: { fill: '#0a0b08', fillOpacity: 0.9 },
  },
  {
    id: 'load-dashboard',
    source: 'load',
    target: 'dashboard',
    type: 'smoothstep',
    style: { stroke: ZONE_COLORS.analytics, strokeWidth: 1, strokeDasharray: '4 2' },
  },
  {
    id: 'load-reports',
    source: 'load',
    target: 'reports',
    type: 'smoothstep',
    style: { stroke: ZONE_COLORS.analytics, strokeWidth: 1, strokeDasharray: '4 2' },
  },
  {
    id: 'load-docs',
    source: 'load',
    target: 'docs',
    type: 'smoothstep',
    style: { stroke: ZONE_COLORS.analytics, strokeWidth: 1, strokeDasharray: '4 2' },
  },
];

const nodeTypes = {
  stageNode: StageNode,
  sourceNode: SourceNode,
  outputNode: OutputNode,
};

export function ETLPipelineFlow() {
  const [nodes, , onNodesChange] = useNodesState(initialNodes);
  const [edges, , onEdgesChange] = useEdgesState(initialEdges);

  return (
    <div
      className="w-full overflow-hidden"
      style={{ height: '420px', background: 'var(--bg-base)' }}
    >
      <ReactFlow
        nodes={nodes}
        edges={edges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        nodeTypes={nodeTypes}
        fitView
        fitViewOptions={{ padding: 0.2 }}
        nodesDraggable={false}
        nodesConnectable={false}
        elementsSelectable={true}
        panOnDrag={true}
        zoomOnScroll={false}
        proOptions={{ hideAttribution: true }}
      >
        <Background
          variant={BackgroundVariant.Dots}
          gap={20}
          size={1}
          color="rgba(122, 173, 74, 0.08)"
        />
        <Controls
          showInteractive={false}
          className="!bg-[#0f1009] !border-[rgba(232,228,212,0.07)] !rounded-none"
        />
      </ReactFlow>
    </div>
  );
}
