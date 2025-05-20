// src/app/page.tsx
"use client";

import { useEffect, useState } from 'react';
import Dashboard from './components/Dashboard';
import { fetchTotalVehicleVolume, fetchVehicleVolumeByLane, fetchHourlyPatterns, 
         fetchAvgSpeedByLane, fetchBottlenecks, fetchTrafficEvolution, 
         fetchSpeedEvolution, fetchVehicleTypeDominance } from '../lib/api';

export default function Home() {
  const [isLoading, setIsLoading] = useState(true);
  const [dashboardData, setDashboardData] = useState({
    totalVolume: {},
    volumeByLane: {},
    hourlyPatterns: {},
    avgSpeedByLane: {},
    bottlenecks: [],
    trafficEvolution: {},
    speedEvolution: {},
    vehicleTypeDominance: {}
  });

  useEffect(() => {
    const fetchDashboardData = async () => {
      setIsLoading(true);
      try {
        const [
          totalVolume,
          volumeByLane,
          hourlyPatterns,
          avgSpeedByLane,
          bottlenecks,
          trafficEvolution,
          speedEvolution,
          vehicleTypeDominance
        ] = await Promise.all([
          fetchTotalVehicleVolume(),
          fetchVehicleVolumeByLane(),
          fetchHourlyPatterns(),
          fetchAvgSpeedByLane(),
          fetchBottlenecks(),
          fetchTrafficEvolution(),
          fetchSpeedEvolution(),
          fetchVehicleTypeDominance()
        ]);

        setDashboardData({
          totalVolume,
          volumeByLane,
          hourlyPatterns,
          avgSpeedByLane,
          bottlenecks,
          trafficEvolution,
          speedEvolution,
          vehicleTypeDominance
        });
      } catch (error) {
        console.error('Error fetching dashboard data:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-700"></div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8 text-center text-blue-800">
        Sistema de Análisis de Tráfico
      </h1>
      <Dashboard data={dashboardData} />
    </div>
  );
}