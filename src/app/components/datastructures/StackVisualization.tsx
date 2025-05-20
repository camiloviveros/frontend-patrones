// src/components/datastructures/StackVisualization.tsx
interface StackItem {
  id: number;
  date: string;
}

export default function StackVisualization({ data }: { data: StackItem[] }) {
  if (!data || data.length === 0) return <div>No hay datos disponibles</div>;
  
  // Tomamos solo los primeros 5 elementos para visualizar
  const displayData = data.slice(0, 5);
  
  return (
    <div>
      <p className="mb-4">Una pila (stack) es una estructura de datos LIFO (Last In, First Out) donde los elementos se insertan y eliminan desde un mismo extremo llamado tope.</p>
      <div className="flex flex-col items-center">
        {displayData.map((item, index) => (
          <div 
            key={index} 
            className={`w-64 p-3 border-2 ${index === 0 ? 'border-red-600 bg-red-100' : 'border-red-400 bg-red-50'} rounded-md text-center mb-1 relative`}
          >
            <span className="text-xs">ID: {item.id}</span>
            <div className="text-xs truncate">{item.date}</div>
            
            {index === 0 && (
              <div className="absolute -right-24 top-1/2 transform -translate-y-1/2 text-red-600 font-bold">
                ← TOP
              </div>
            )}
          </div>
        ))}
        
        {data.length > 5 && (
          <div className="text-center mt-2 text-gray-500">
            ... y {data.length - 5} elementos más
          </div>
        )}
        
        <div className="mt-4 w-64 border-t-2 border-red-600"></div>
        
        <div className="flex justify-between w-64 mt-2">
          <div className="flex flex-col items-center">
            <div className="text-red-600 text-3xl">↑</div>
            <div className="text-sm font-bold">PUSH</div>
          </div>
          <div className="flex flex-col items-center">
            <div className="text-red-600 text-3xl">↓</div>
            <div className="text-sm font-bold">POP</div>
          </div>
        </div>
      </div>
    </div>
  );
}