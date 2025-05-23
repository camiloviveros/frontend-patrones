"use client";

import Link from 'next/link';
import { useState, useEffect } from 'react';
import { usePathname } from 'next/navigation';

export default function NavBar() {
  const [isOpen, setIsOpen] = useState(false);
  const [apiStatus, setApiStatus] = useState<'loading' | 'online' | 'offline'>('loading');
  const pathname = usePathname();

  useEffect(() => {
    const checkApiStatus = async () => {
      try {
        setApiStatus('loading');
        const response = await fetch('http://localhost:8080/api/detections/analysis/summary', {
          method: 'GET',
          headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
          },
          mode: 'cors'
        });
        
        setApiStatus(response.ok ? 'online' : 'offline');
      } catch {
        setApiStatus('offline');
      }
    };

    checkApiStatus();
    const interval = setInterval(checkApiStatus, 60000);
    return () => clearInterval(interval);
  }, []);

  const menuItems = [
    {
      href: '/',
      label: 'Dashboard Principal',
      icon: '📊',
      gradient: 'from-slate-100 to-gray-100',
      textColor: 'text-slate-700',
      hoverColor: 'hover:text-slate-900'
    },
    {
      href: '/volume',
      label: 'Volumen de Tráfico',
      icon: '📈',
      gradient: 'from-blue-100 to-indigo-100',
      textColor: 'text-blue-700',
      hoverColor: 'hover:text-blue-900'
    },
    {
      href: '/lanes',
      label: 'Análisis de Carriles',
      icon: '🛣️',
      gradient: 'from-emerald-100 to-green-100',
      textColor: 'text-emerald-700',
      hoverColor: 'hover:text-emerald-900'
    },
    {
      href: '/temporal',
      label: 'Tendencias Temporales',
      icon: '📉',
      gradient: 'from-violet-100 to-purple-100',
      textColor: 'text-violet-700',
      hoverColor: 'hover:text-violet-900'
    },
    {
      href: '/vehicle-types',
      label: 'Tipos de Vehículos',
      icon: '🚗',
      gradient: 'from-orange-100 to-amber-100',
      textColor: 'text-orange-700',
      hoverColor: 'hover:text-orange-900'
    },
    {
      href: '/test-api',
      label: 'Test API',
      icon: '🔧',
      gradient: 'from-cyan-100 to-teal-100',
      textColor: 'text-cyan-700',
      hoverColor: 'hover:text-cyan-900'
    }
  ];

  const isActive = (href: string) => pathname === href;

  return (
    <nav className="bg-white/90 backdrop-blur-md shadow-lg border-b border-gray-200/50">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center py-4">
          {/* Logo y título */}
          <div className="flex items-center space-x-4">
            <div className="w-12 h-12 bg-gradient-to-br from-slate-700 to-gray-800 rounded-xl flex items-center justify-center shadow-lg transform hover:scale-105 transition-all duration-300">
              <span className="text-white text-xl font-bold">🚦</span>
            </div>
            <div>
              <h1 className="text-xl font-bold text-gradient">
                Sistema de Análisis de Tráfico
              </h1>
              {/* Estado de conexión */}
              <div className="flex items-center mt-1">
                {apiStatus === 'loading' && (
                  <div className="flex items-center">
                    <div className="w-2 h-2 bg-amber-400 rounded-full animate-pulse mr-2"></div>
                    <span className="text-xs text-amber-600 font-medium">Verificando conexión...</span>
                  </div>
                )}
                {apiStatus === 'online' && (
                  <div className="flex items-center">
                    <div className="w-2 h-2 bg-emerald-500 rounded-full mr-2 shadow-sm"></div>
                    <span className="text-xs text-emerald-700 font-medium">Backend conectado</span>
                  </div>
                )}
                {apiStatus === 'offline' && (
                  <div className="flex items-center">
                    <div className="w-2 h-2 bg-red-500 rounded-full mr-2 shadow-sm"></div>
                    <span className="text-xs text-red-700 font-medium">Backend desconectado</span>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Menú desktop */}
          <div className="hidden lg:flex space-x-1">
            {menuItems.map((item, index) => (
              <Link
                key={item.href}
                href={item.href}
                className={`
                  group relative px-4 py-2 rounded-lg transition-all duration-300 font-medium
                  ${isActive(item.href) 
                    ? `bg-gradient-to-r ${item.gradient} ${item.textColor} shadow-md border border-white/50` 
                    : `text-gray-600 ${item.hoverColor} hover:bg-gray-50/50`
                  }
                `}
                style={{
                  animationDelay: `${index * 50}ms`
                }}
              >
                <div className="flex items-center space-x-2">
                  <span className="text-base transform group-hover:scale-110 transition-transform duration-200">
                    {item.icon}
                  </span>
                  <span className="text-sm font-semibold">{item.label}</span>
                </div>
                
                {/* Efecto hover sutil */}
                {!isActive(item.href) && (
                  <div className={`
                    absolute inset-0 bg-gradient-to-r ${item.gradient} rounded-lg opacity-0 
                    group-hover:opacity-20 transition-opacity duration-300 -z-10
                  `}></div>
                )}
              </Link>
            ))}
          </div>

          {/* Botón menú móvil */}
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="lg:hidden p-2 rounded-lg bg-gradient-to-r from-gray-100 to-slate-100 text-gray-700 hover:shadow-md transition-all duration-300"
          >
            <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              {isOpen ? (
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
              ) : (
                <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />
              )}
            </svg>
          </button>
        </div>

        {/* Menú móvil */}
        <div className={`lg:hidden transition-all duration-500 ease-in-out overflow-hidden ${
          isOpen ? 'max-h-96 opacity-100 pb-4' : 'max-h-0 opacity-0'
        }`}>
          <div className="bg-white/80 backdrop-blur-sm rounded-xl p-4 space-y-2 shadow-lg border border-gray-200/50">
            {menuItems.map((item, index) => (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setIsOpen(false)}
                className={`
                  block px-4 py-3 rounded-lg transition-all duration-300 font-medium
                  ${isActive(item.href)
                    ? `bg-gradient-to-r ${item.gradient} ${item.textColor} shadow-md`
                    : `text-gray-600 ${item.hoverColor} hover:bg-gray-50/70`
                  }
                `}
                style={{
                  animationDelay: `${index * 30}ms`,
                  transform: isOpen ? 'translateY(0)' : 'translateY(-10px)'
                }}
              >
                <div className="flex items-center space-x-3">
                  <span className="text-lg">{item.icon}</span>
                  <span className="text-sm font-semibold">{item.label}</span>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </nav>
  );
}