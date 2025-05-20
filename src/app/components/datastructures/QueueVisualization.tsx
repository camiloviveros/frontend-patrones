// src/components/datastructures/QueueVisualization.tsx
interface QueueItem {
  id: number;
  date: string;
}

export default function QueueVisualization({ data }: { data: QueueItem[] }) {
  if (!data || data.length === 0) return <div>No hay datos disponibles</div>;
  
  // Tomamos solo los primeros 5 elementos para visualizar
  const displayData = data.slice(0, 5);
  
  return (
    <div>
      <p className="mb-4">Una cola (queue) es una estructura de datos FIFO (First In, First Out) donde los elementos se insertan por un extremo y se eliminan por el otro.</p>
      <div className="flex flex-col items-center">
        <div className="flex items-center mb-6 relative">
          {displayData.map((item, index) => (
            <div 
              key={index} 
              className={`w-32 p-3 border-2 ${index === 0 ? 'border-blue-600 bg-blue-100' : index === displayData.length - 1 ? 'border-green-600 bg-green-100' : 'border-gray-300 bg-gray-50'} rounded-md text-center mx-1 relative`}
            >
              <span className="text-xs">ID: {item.id}</span>
              <div className="text-xs truncate">{item.date}</div>
              
              {index === 0 && (
                <div className="absolute -bottom-8 left-1/2 transform -translate-x-1/2 text-blue-600 font-bold">
                  FRONT
                </div>
              )}
              
              {index === displayData.length - 1 && (
                <div className="absolute -bottom-8 left-1/2 transform -translate-x-1/2 text-green-600 font-bold">
                  REAR
                </div>
              )}
            </div>
          ))}
        </div>
        
        {data.length > 5 && (
          <div className="text-center mt-2 text-gray-500">
            ... y {data.length - 5} elementos más
          </div>
        )}
        
        <div className="flex justify-between w-full mt-8">
          <div className="flex flex-col items-center">
            <div className="text-green-600 text-3xl">←</div>
            <div className="text-sm font-bold">ENQUEUE</div>
          </div>
          <div className="flex flex-col items-center">
            <div className="text-blue-600 text-3xl">→</div>
            <div className="text-sm font-bold">DEQUEUE</div>
          </div>
        </div>
      </div>
    </div>
  );
}