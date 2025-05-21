"use client";

import { useState } from 'react';

export default function ApiTest() {
  const [testResults, setTestResults] = useState<{[key: string]: any}>({});
  const [isLoading, setIsLoading] = useState<{[key: string]: boolean}>({});
  const [error, setError] = useState<string | null>(null);

  // URL bases para probar
  const urlBases = [
    'http://localhost:8080/api',
    'http://127.0.0.1:8080/api',
    window.location.origin + '/api' // Base URL relativa
  ];
  
  // Endpoints a probar
  const endpoints = [
    '/detections/volume/total',
    '/detections/volume/by-lane',
    '/detections/lanes/speed',
    '/detections/temporal/evolution'
  ];

  const testEndpoint = async (baseUrl: string, endpoint: string) => {
    const testId = `${baseUrl}${endpoint}`;
    setIsLoading(prev => ({ ...prev, [testId]: true }));
    
    try {
      console.log(`Probando conexión a ${baseUrl}${endpoint}`);
      
      const response = await fetch(`${baseUrl}${endpoint}`, {
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        mode: 'cors'
      });
      
      if (response.ok) {
        const data = await response.json();
        setTestResults(prev => ({ ...prev, [testId]: { 
          success: true, 
          status: response.status,
          data: JSON.stringify(data).substring(0, 200) + '...' 
        }}));
      } else {
        setTestResults(prev => ({ ...prev, [testId]: { 
          success: false, 
          status: response.status,
          statusText: response.statusText
        }}));
      }
    } catch (err) {
      console.error(`Error probando ${testId}:`, err);
      setTestResults(prev => ({ ...prev, [testId]: { 
        success: false, 
        error: err instanceof Error ? err.message : 'Error desconocido'
      }}));
    } finally {
      setIsLoading(prev => ({ ...prev, [testId]: false }));
    }
  };

  const testAllEndpoints = () => {
    setError(null);
    
    urlBases.forEach(baseUrl => {
      endpoints.forEach(endpoint => {
        testEndpoint(baseUrl, endpoint);
      });
    });
  };

  // Verificar manualmente si el backend está en línea
  const checkBackendStatus = async () => {
    try {
      const response = await fetch('http://localhost:8080/api/detections/volume/total', {
        mode: 'cors',
        headers: { 'Accept': 'application/json' }
      });
      
      if (response.ok) {
        return `Backend en línea (status ${response.status})`;
      } else {
        return `Backend disponible pero responde con error (status ${response.status})`;
      }
    } catch (error) {
      return 'Backend no disponible';
    }
  };

  return (
    <div className="container mx-auto p-4">
      <div className="bg-white shadow-md rounded-lg p-6 mb-6">
        <h1 className="text-2xl font-bold mb-4">Prueba de Conexión API</h1>
        <p className="mb-4">Esta herramienta verifica la conexión con el backend desde diferentes URLs y muestra los resultados.</p>
        
        <button 
          className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded mb-6"
          onClick={testAllEndpoints}
        >
          Probar Todos los Endpoints
        </button>
        
        <div className="mb-8">
          <h2 className="text-xl font-semibold mb-2">Información de Red</h2>
          <p><strong>URL actual:</strong> {window.location.href}</p>
          <p><strong>Hostname:</strong> {window.location.hostname}</p>
          <p><strong>Backend esperado:</strong> http://localhost:8080</p>
          <p><strong>Estado backend:</strong> <span id="backend-status">Verificando...</span></p>
          <script dangerouslySetInnerHTML={{
            __html: `
              async function updateStatus() {
                try {
                  const response = await fetch('http://localhost:8080/api/detections/volume/total', {
                    mode: 'cors',
                    headers: { 'Accept': 'application/json' }
                  });
                  
                  if (response.ok) {
                    document.getElementById('backend-status').textContent = 'En línea';
                    document.getElementById('backend-status').className = 'text-green-600 font-bold';
                  } else {
                    document.getElementById('backend-status').textContent = 'Responde con error ' + response.status;
                    document.getElementById('backend-status').className = 'text-orange-600 font-bold';
                  }
                } catch (error) {
                  document.getElementById('backend-status').textContent = 'No disponible';
                  document.getElementById('backend-status').className = 'text-red-600 font-bold';
                }
              }
              updateStatus();
            `
          }} />
        </div>
        
        <div className="grid grid-cols-1 gap-4">
          {urlBases.map(baseUrl => (
            <div key={baseUrl} className="mb-6 border rounded-lg p-4">
              <h2 className="text-lg font-semibold mb-2">{baseUrl}</h2>
              <div className="space-y-4">
                {endpoints.map(endpoint => {
                  const testId = `${baseUrl}${endpoint}`;
                  const result = testResults[testId];
                  
                  return (
                    <div key={endpoint} className="border rounded p-3">
                      <p className="font-medium">{endpoint}</p>
                      
                      {isLoading[testId] ? (
                        <p className="text-gray-500">Probando...</p>
                      ) : result ? (
                        <div>
                          {result.success ? (
                            <div className="text-green-600">
                              <p>✅ Éxito (status {result.status})</p>
                              <p className="text-xs mt-1 text-gray-600 overflow-hidden overflow-ellipsis">
                                {result.data}
                              </p>
                            </div>
                          ) : (
                            <div className="text-red-600">
                              <p>❌ Error: {result.error || `HTTP ${result.status} ${result.statusText}`}</p>
                            </div>
                          )}
                        </div>
                      ) : (
                        <p className="text-gray-400">No probado</p>
                      )}
                      
                      <button 
                        className="mt-2 bg-gray-200 hover:bg-gray-300 text-gray-800 text-sm py-1 px-2 rounded"
                        onClick={() => testEndpoint(baseUrl, endpoint)}
                      >
                        Probar endpoint
                      </button>
                    </div>
                  );
                })}
              </div>
            </div>
          ))}
        </div>
      </div>
      
      <div className="bg-white shadow-md rounded-lg p-6">
        <h2 className="text-xl font-bold mb-4">Solución de problemas comunes</h2>
        <ul className="list-disc pl-5 space-y-2">
          <li>
            <strong>CORS no configurado:</strong> Si ves errores relacionados con CORS, asegúrate de que el backend tenga la configuración CORS correcta.
          </li>
          <li>
            <strong>Backend no disponible:</strong> Verifica que el servidor Spring Boot esté ejecutándose en http://localhost:8080.
          </li>
          <li>
            <strong>Problema de red:</strong> Asegúrate de que no haya restricciones de red que bloqueen las conexiones entre el frontend y el backend.
          </li>
          <li>
            <strong>Problemas de ruta:</strong> Confirma que las rutas de API sean correctas y que devuelvan datos JSON válidos.
          </li>
        </ul>
      </div>
    </div>
  );
}