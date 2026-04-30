'use client';

import { NodeProps, Handle, Position } from 'reactflow';

export function SourceNode({ data }: NodeProps) {
  return (
    <div
      className="w-[160px] p-3 text-center"
      style={{
        background: 'var(--bg-surface)',
        border: '1px solid rgba(232, 228, 212, 0.07)',
        borderRadius: 0,
      }}
    >
      <span className="font-mono text-[10px] text-[#3d3c30] tracking-widest block mb-1">
        {data.badge}
      </span>
      <span className="font-mono text-sm font-bold text-[#e8e4d4] block mb-0.5">
        {data.label}
      </span>
      <span className="font-mono text-[11px] text-[#7a7560] block">
        {data.sublabel}
      </span>
      <Handle
        type="source"
        position={Position.Right}
        style={{ background: '#7a7560', width: 6, height: 6, border: 'none', borderRadius: 0 }}
      />
    </div>
  );
}
