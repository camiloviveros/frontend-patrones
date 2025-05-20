// src/components/datastructures/CircularDoubleLinkedListVisualization.tsx
interface DataItem {
  id: number;
  date: string;
}

export default function CircularDoubleLinkedListVisualization({ data }: { data: DataItem[] }) {
  if (!data || data.length === 0) return <div>No hay datos disponibles</div>;
  
  return (
    <div>
      <p className="mb-4">Una lista doblemente enlazada circular es similar a la doblemente enlazada, pero el último nodo apunta al primero y el primero apunta al último, formando un círculo.</p>
      <div className="relative w-64 h-64 mx-auto mb-8">
        {data.slice(0, 8).map((item, index, array) => {
          const angle = (index / array.length) * 2 * Math.PI;
          const radius = 110;
          const x = Math.cos(angle) * radius + 130;
          const y = Math.sin(angle) * radius + 130;
          
          return (
            <div 
              key={index} 
              className="absolute w-20 h-16 p-1 border-2 border-orange-500 rounded-md bg-orange-100 text-center transform -translate-x-1/2 -translate-y-1/2"
              style={{ left: x, top: y }}
            >
              <span className="text-xs">ID: {item.id}</span>
              <div className="text-xs truncate">{item.date}</div>
            </div>
          );
        })}
        
        <svg className="absolute inset-0 w-full h-full" style={{ zIndex: -1 }}>
          <circle 
            cx="130" 
            cy="130" 
            r="110" 
            fill="none" 
            stroke="#F97316" 
            strokeWidth="2"
            strokeDasharray="4,4"
          />
          
          {/* Flechas circulares */}
          <path
            d="M 130,20 A 110,110 0 0 1 130,240 A 110,110 0 0 1 130,20"
            fill="none"
            stroke="#F97316"
            strokeWidth="2"
            strokeDasharray="1,10"
            markerEnd="url(#arrowhead)"
          />
        </svg>
        
        <svg width="0" height="0">
          <defs>
            <marker 
              id="arrowhead" 
              markerWidth="10" 
              markerHeight="7" 
              refX="0" 
              refY="3.5" 
              orient="auto"
            >
              <polygon points="0 0, 10 3.5, 0 7" fill="#F97316" />
            </marker>
          </defs>
        </svg>
      </div>
    </div>
  );
}