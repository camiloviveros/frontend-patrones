// src/components/datastructures/ArrayVisualization.tsx
import React from 'react';

export default function ArrayVisualization({ data }: { data: number[] }) {
  if (!data || data.length === 0) return <div>No hay datos disponibles</div>;
  
  return (
    <div>
      <p className="mb-4">Un array es una estructura de datos que almacena elementos en posiciones adyacentes de memoria, permitiendo acceso aleatorio mediante índices.</p>
      
      <div className="flex flex-wrap gap-2">
        {data.map((value, index) => (
          <div key={index} className="w-14 h-14 border-2 border-blue-500 rounded flex items-center justify-center bg-blue-100">
            <span className="font-mono">{value}</span>
          </div>
        ))}
      </div>
      
      <div className="flex flex-wrap gap-2 mt-1">
        {data.map((_, index) => (
          <div key={index} className="w-14 text-center text-xs text-gray-500">
            {index}
          </div>
        ))}
      </div>
      
      <div className="mt-6 bg-gray-50 p-4 rounded-md">
        <h3 className="text-sm font-bold mb-2">Características del Array:</h3>
        <ul className="list-disc pl-5 text-sm space-y-1">
          <li>Acceso directo a cualquier elemento mediante su índice: O(1)</li>
          <li>Tamaño fijo una vez inicializado (en arrays estáticos)</li>
          <li>Elementos almacenados contiguamente en memoria</li>
          <li>Búsqueda secuencial: O(n)</li>
          <li>Inserción y eliminación: O(n) porque requiere desplazar elementos</li>
        </ul>
      </div>
      
      <div className="mt-4 text-sm text-gray-600">
        <p>Los arrays son ideales para situaciones donde:</p>
        <ul className="list-disc pl-5 text-sm mt-2">
          <li>Necesitas acceso aleatorio rápido a los elementos</li>
          <li>Conoces el tamaño máximo de antemano</li>
          <li>No necesitas realizar muchas inserciones/eliminaciones en posiciones arbitrarias</li>
        </ul>
      </div>
    </div>
  );
}