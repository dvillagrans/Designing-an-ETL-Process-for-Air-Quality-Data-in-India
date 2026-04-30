'use client';

import { NodeProps, Handle, Position } from 'reactflow';

export function OutputNode({ data }: NodeProps) {
  return (
    <a
      href={data.href}
      className="block w-[130px] p-2.5 text-center cursor-pointer transition-colors"
      style={{
        background: 'var(--bg-surface)',
        border: '1px solid rgba(232, 228, 212, 0.07)',
        borderRadius: 0,
      }}
      onMouseEnter={(e) => {
        (e.currentTarget as HTMLElement).style.borderColor = 'rgba(122, 173, 74, 0.25)';
      }}
      onMouseLeave={(e) => {
        (e.currentTarget as HTMLElement).style.borderColor = 'rgba(232, 228, 212, 0.07)';
      }}
    >
      <span className="font-mono text-[10px] text-[#7aad4a] block mb-1 tracking-widest">{data.icon}</span>
      <span className="font-mono text-[11px] text-[#7a7560] block">{data.label}</span>
      <Handle
        type="target"
        position={Position.Top}
        style={{ background: '#7aad4a', width: 6, height: 6, border: 'none', borderRadius: 0 }}
      />
    </a>
  );
}
