// src/components/datastructures/DoubleLinkedListVisualization.tsx
interface ListItem {
  id: number;
  date: string;
}

export default function DoubleLinkedListVisualization({ data }: { data: ListItem[] }) {
  if (!data || data.length === 0) return <div>No hay datos disponibles</div>;
  
  return (
    <div>
      <p className="mb-4">Una lista doblemente enlazada es una estructura donde cada nodo contiene un valor, una referencia al siguiente nodo y otra al nodo anterior.</p>
      <div className="flex flex-wrap items-center">
        {data.map((item, index) => (
          <div key={index} className="flex flex-col items-center mb-2">
            <div className="w-24 p-2 border-2 border-purple-500 rounded-md bg-purple-100 text-center relative">
              <span className="text-xs">ID: {item.id}</span>
              <div className="text-xs truncate">{item.date}</div>
              
              {index > 0 && (
                <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                  <span className="text-xs text-purple-500">↑</span>
                </div>
              )}
              
              {index < data.length - 1 && (
                <div className="absolute -bottom-3 left-1/2 transform -translate-x-1/2">
                  <span className="text-xs text-purple-500">↓</span>
                </div>
              )}
            </div>
            
            {index < data.length - 1 && (
              <div className="w-8 h-8 flex items-center justify-center">
                <span className="text-xl text-purple-500">⟷</span>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}