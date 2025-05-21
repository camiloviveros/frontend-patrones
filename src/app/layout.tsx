// src/app/layout.tsx
import './globals.css';
import { Inter } from 'next/font/google';
import NavBar from './components/NavBar';
import type { Metadata, Viewport } from 'next';

const inter = Inter({ subsets: ['latin'] });

// Configuración de metadatos
export const metadata: Metadata = {
  title: 'Sistema de Análisis de Tráfico Vehicular',
  description: 'Plataforma de análisis y visualización de patrones de tráfico vehicular en tiempo real',
  keywords: 'tráfico, visualización, análisis, patrones, vehículos, dashboard',
  authors: [{ name: 'Equipo de Desarrollo' }],
};

// Configuración de viewport (separada de metadata en Next.js 15)
export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  themeColor: '#1e40af'
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="es" className="scroll-smooth">
      <body className={inter.className}>
        <NavBar />
        <main className="container mx-auto px-4 py-8 min-h-screen">
          {children}
        </main>
        
        <footer className="bg-gray-100 dark:bg-gray-800 py-6 border-t border-gray-200 dark:border-gray-700">
          <div className="container mx-auto px-4 text-center">
            <p className="text-gray-600 dark:text-gray-300">Sistema de Análisis de Tráfico © {new Date().getFullYear()}</p>
            <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">Desarrollado con Next.js, TailwindCSS y Spring Boot</p>
          </div>
        </footer>
      </body>
    </html>
  );
}