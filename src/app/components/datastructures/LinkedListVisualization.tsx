// src/components/datastructures/LinkedListVisualization.tsx
interface ListItem {
  id: number;
  date: string;
}

export default function LinkedListVisualization({ data }: { data: ListItem[] }) {
  if (!data || data.length === 0) return <div>No hay datos disponibles</div>;
  
  return (
    <div>
      <p className="mb-4">Una lista enlazada simple es una estructura donde cada nodo contiene un valor y una referencia al siguiente nodo.</p>
      <div className="flex flex-wrap items-center">
        {data.map((item, index) => (
          <div key={index} className="flex items-center mb-2">
            <div className="w-24 p-2 border-2 border-green-500 rounded-md bg-green-100 text-center">
              <span className="text-xs">ID: {item.id}</span>
              <div className="text-xs truncate">{item.date}</div>
            </div>
            {index < data.length - 1 && (
              <div className="w-8 text-center">
                <span className="text-2xl text-green-500">→</span>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}