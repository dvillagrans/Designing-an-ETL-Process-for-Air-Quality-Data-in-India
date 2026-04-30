'use client';

import { NodeProps, Handle, Position } from 'reactflow';

export function StageNode({ data, selected }: NodeProps) {
  return (
    <div
      className="relative w-[200px] transition-all duration-200"
      style={{
        background: 'var(--bg-surface)',
        border: `1px solid ${selected ? 'rgba(122, 173, 74, 0.2)' : 'rgba(232, 228, 212, 0.07)'}`,
        borderTop: `2px solid ${data.zoneColor}`,
        borderRadius: 0,
      }}
    >
      <Handle
        type="target"
        position={Position.Left}
        style={{ background: data.zoneColor, width: 6, height: 6, border: 'none', borderRadius: 0 }}
      />

      <div className="px-3 pt-2.5 pb-1.5">
        <span
          className="font-mono text-[9px] tracking-[0.2em] block"
          style={{ color: data.zoneColor }}
        >
          {data.zone}
        </span>
      </div>

      <div style={{ height: '1px', background: 'rgba(232, 228, 212, 0.07)' }} />

      <div className="p-3">
        <span className="font-mono text-sm font-bold text-[#e8e4d4] block mb-1">
          {data.label}
        </span>
        <span className="font-mono text-[10px] text-[#3d3c30] block mb-2">
          {data.sublabel}
        </span>
        <p className="font-ui font-light text-[11px] text-[#7a7560] leading-relaxed mb-2.5">
          {data.description}
        </p>
        <div className="flex gap-1.5 flex-wrap">
          {data.metrics.map((m: string) => (
            <span
              key={m}
              className="font-mono text-[9px] px-1.5 py-0.5"
              style={{
                color: data.zoneColor,
                background: `${data.zoneColor}10`,
                border: `1px solid ${data.zoneColor}25`,
                borderRadius: 0,
              }}
            >
              {m}
            </span>
          ))}
        </div>
      </div>

      <Handle
        type="source"
        position={Position.Right}
        style={{ background: data.zoneColor, width: 6, height: 6, border: 'none', borderRadius: 0 }}
      />
    </div>
  );
}
