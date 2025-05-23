import './globals.css';
import { Inter } from 'next/font/google';
import NavBar from './components/NavBar';
import type { Metadata, Viewport } from 'next';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'Sistema de Análisis de Tráfico Vehicular | Plataforma Profesional',
  description: 'Plataforma empresarial de análisis y visualización de patrones de tráfico vehicular en tiempo real. Monitoreo avanzado con estructuras de datos optimizadas y análisis predictivo.',
  keywords: 'tráfico, análisis, monitoreo, vehículos, dashboard, profesional, tiempo real, estructuras de datos, análisis predictivo',
  authors: [{ name: 'Equipo de Desarrollo' }],
  creator: 'Sistema de Análisis de Tráfico',
  publisher: 'Plataforma de Monitoreo Vehicular',
  robots: 'index, follow',
  openGraph: {
    title: 'Sistema de Análisis de Tráfico Vehicular',
    description: 'Plataforma profesional de monitoreo de tráfico en tiempo real',
    type: 'website',
    locale: 'es_ES',
  },
};

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
  themeColor: '#334155',
  colorScheme: 'light'
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="es" className="scroll-smooth">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
      </head>
      <body className={`${inter.className} antialiased`}>
        <div className="min-h-screen bg-gradient-to-br from-slate-50 via-gray-50 to-zinc-50">
          <NavBar />
          
          <main className="transition-all duration-500 ease-in-out">
            <div className="animate-fade-in">
              {children}
            </div>
          </main>
          
          <footer className="bg-white/80 backdrop-blur-md py-12 border-t border-gray-200/50 mt-20">
            <div className="container mx-auto px-4">
              {/* Logo y descripción principal */}
              <div className="text-center mb-8">
                <div className="flex items-center justify-center mb-4">
                  <div className="w-12 h-12 bg-gradient-to-br from-slate-700 to-gray-800 rounded-xl flex items-center justify-center mr-4 shadow-lg">
                    <span className="text-white text-xl">🚦</span>
                  </div>
                  <h3 className="text-2xl font-bold text-gradient">
                    Sistema de Análisis de Tráfico
                  </h3>
                </div>
                <p className="text-gray-600 max-w-2xl mx-auto">
                  Plataforma profesional de monitoreo y análisis de tráfico vehicular en tiempo real.
                  Optimizado para el análisis de patrones y la toma de decisiones basada en datos.
                </p>
              </div>

              {/* Secciones del footer */}
              <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
                {/* Tecnologías */}
                <div>
                  <h4 className="font-semibold text-gray-800 mb-4">Tecnologías</h4>
                  <ul className="space-y-2 text-sm text-gray-600">
                    <li className="flex items-center">
                      <span className="w-2 h-2 bg-blue-500 rounded-full mr-2"></span>
                      Next.js 15
                    </li>
                    <li className="flex items-center">
                      <span className="w-2 h-2 bg-emerald-500 rounded-full mr-2"></span>
                      Spring Boot 3.4
                    </li>
                    <li className="flex items-center">
                      <span className="w-2 h-2 bg-violet-500 rounded-full mr-2"></span>
                      TypeScript
                    </li>
                    <li className="flex items-center">
                      <span className="w-2 h-2 bg-cyan-500 rounded-full mr-2"></span>
                      TailwindCSS
                    </li>
                  </ul>
                </div>

                {/* Características */}
                <div>
                  <h4 className="font-semibold text-gray-800 mb-4">Características</h4>
                  <ul className="space-y-2 text-sm text-gray-600">
                    <li>🔄 Monitoreo en Tiempo Real</li>
                    <li>📊 Análisis Predictivo</li>
                    <li>🛣️ Gestión de Carriles</li>
                    <li>⚡ Detección de Velocidad</li>
                  </ul>
                </div>

                {/* Estructuras de Datos */}
                <div>
                  <h4 className="font-semibold text-gray-800 mb-4">Estructuras de Datos</h4>
                  <ul className="space-y-2 text-sm text-gray-600">
                    <li>📋 Arrays Optimizados</li>
                    <li>📚 Pilas (Stack)</li>
                    <li>📄 Colas (Queue)</li>
                    <li>🌳 Árboles de Decisión</li>
                  </ul>
                </div>

                {/* Estado del Sistema */}
                <div>
                  <h4 className="font-semibold text-gray-800 mb-4">Estado del Sistema</h4>
                  <div className="space-y-3">
                    <div className="flex items-center">
                      <div className="w-3 h-3 bg-emerald-500 rounded-full mr-2 animate-pulse"></div>
                      <span className="text-sm text-gray-600">Sistema Operativo</span>
                    </div>
                    <div className="bg-gray-50 p-3 rounded-lg">
                      <p className="text-xs text-gray-500">Última actualización</p>
                      <p className="text-sm font-medium text-gray-700">
                        {new Date().toLocaleString('es-ES')}
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Separador */}
              <div className="border-t border-gray-200 pt-8">
                <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
                  {/* Copyright */}
                  <div className="text-center md:text-left">
                    <p className="text-gray-600 text-sm">
                      © {new Date().getFullYear()} Sistema de Análisis de Tráfico. Todos los derechos reservados.
                    </p>
                    <p className="text-gray-500 text-xs mt-1">
                      Plataforma desarrollada con tecnologías modernas para análisis profesional
                    </p>
                  </div>

                  {/* Enlaces rápidos */}
                  <div className="flex items-center space-x-6">
                    <a 
                      href="/api-test" 
                      className="text-sm text-gray-600 hover:text-gray-800 transition-colors duration-200"
                    >
                      Diagnóstico del Sistema
                    </a>
                    <div className="w-px h-4 bg-gray-300"></div>
                    <div className="flex items-center space-x-2">
                      <span className="text-xs text-gray-500">Versión</span>
                      <span className="text-sm font-mono bg-gray-100 px-2 py-1 rounded text-gray-700">
                        v2.0.0
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Indicadores técnicos */}
              <div className="mt-6 pt-6 border-t border-gray-200">
                <div className="flex flex-wrap justify-center items-center gap-6 text-xs text-gray-500">
                  <div className="flex items-center">
                    <span className="w-2 h-2 bg-green-400 rounded-full mr-2"></span>
                    Frontend: Operativo
                  </div>
                  <div className="flex items-center">
                    <span className="w-2 h-2 bg-blue-400 rounded-full mr-2"></span>
                    API: REST/HTTP
                  </div>
                  <div className="flex items-center">
                    <span className="w-2 h-2 bg-purple-400 rounded-full mr-2"></span>
                    Base de Datos: MySQL
                  </div>
                  <div className="flex items-center">
                    <span className="w-2 h-2 bg-orange-400 rounded-full mr-2"></span>
                    Detección: Python/YOLO
                  </div>
                </div>
              </div>
            </div>
          </footer>
        </div>
      </body>
    </html>
  );
}