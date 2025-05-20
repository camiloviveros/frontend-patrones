// src/components/Dashboard.tsx
import TrafficVolumeChart from './charts/TrafficVolumeChart';
import LaneDistributionChart from './charts/LaneDistributionChart';
import TimePatternChart from './charts/TimePatternChart';
import SpeedComparisonChart from './charts/SpeedComparisonChart';
import BottleneckChart from './charts/BottleneckChart';
import TrafficEvolutionChart from './charts/TrafficEvolutionChart';
import SpeedEvolutionChart from './charts/SpeedEvolutionChart';
import VehicleTypeChart from './charts/VehicleTypeChart';

// Interfaces para los diferentes tipos de datos
interface TotalVolumeData {
  hourly: Record<string, number>;
  daily: Record<string, number>;
  total: Record<string, number>;
}

interface VehicleCounts {
  [vehicleType: string]: number;
}

interface LaneVehicleData {
  [lane: string]: VehicleCounts;
}

interface HourlyPatternsData {
  [hour: string]: number;
}

interface SpeedByLaneData {
  [lane: string]: number;
}

interface BottleneckItem {
  lane: string;
  avgSpeed: number;
  totalVehicles: number;
  heavyVehicles: number;
}

interface TrafficEvolutionData {
  timestamps: string[];
  car: number[];
  bus: number[];
  truck: number[];
}

interface SpeedEvolutionData {
  timestamps: string[];
  lane_1: number[];
  lane_2: number[];
  lane_3: number[];
}

interface VehicleTypeDominanceData {
  [vehicleType: string]: number;
}

// Interfaz para el objeto data completo
interface DashboardData {
  totalVolume: TotalVolumeData;
  volumeByLane: LaneVehicleData;
  hourlyPatterns: HourlyPatternsData;
  avgSpeedByLane: SpeedByLaneData;
  bottlenecks: BottleneckItem[];
  trafficEvolution: TrafficEvolutionData;
  speedEvolution: SpeedEvolutionData;
  vehicleTypeDominance: VehicleTypeDominanceData;
}

// Interfaz para las props del componente
interface DashboardProps {
  data: DashboardData;
}

export default function Dashboard({ data }: DashboardProps) {
  const { 
    totalVolume, 
    volumeByLane, 
    hourlyPatterns, 
    avgSpeedByLane, 
    bottlenecks,
    trafficEvolution, 
    speedEvolution, 
    vehicleTypeDominance 
  } = data;

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      <div className="bg-white p-6 rounded-lg shadow-md">
        <h2 className="text-xl font-bold mb-4 text-blue-700">Volumen Total de Vehículos</h2>
        <TrafficVolumeChart data={totalVolume} />
      </div>
      
      <div className="bg-white p-6 rounded-lg shadow-md">
        <h2 className="text-xl font-bold mb-4 text-blue-700">Distribución por Carril</h2>
        <LaneDistributionChart data={volumeByLane} />
      </div>
      
      <div className="bg-white p-6 rounded-lg shadow-md">
        <h2 className="text-xl font-bold mb-4 text-blue-700">Patrones Horarios de Tráfico</h2>
        <TimePatternChart data={hourlyPatterns} />
      </div>
      
      <div className="bg-white p-6 rounded-lg shadow-md">
        <h2 className="text-xl font-bold mb-4 text-blue-700">Comparación de Velocidad por Carril</h2>
        <SpeedComparisonChart data={avgSpeedByLane} />
      </div>
      
      <div className="bg-white p-6 rounded-lg shadow-md">
        <h2 className="text-xl font-bold mb-4 text-blue-700">Cuellos de Botella Identificados</h2>
        <BottleneckChart data={bottlenecks} />
      </div>
      
      <div className="bg-white p-6 rounded-lg shadow-md">
        <h2 className="text-xl font-bold mb-4 text-blue-700">Evolución del Tráfico</h2>
        <TrafficEvolutionChart data={trafficEvolution} />
      </div>
      
      <div className="bg-white p-6 rounded-lg shadow-md">
        <h2 className="text-xl font-bold mb-4 text-blue-700">Evolución de la Velocidad</h2>
        <SpeedEvolutionChart data={speedEvolution} />
      </div>
      
      <div className="bg-white p-6 rounded-lg shadow-md">
        <h2 className="text-xl font-bold mb-4 text-blue-700">Dominancia por Tipo de Vehículo</h2>
        <VehicleTypeChart data={vehicleTypeDominance} />
      </div>
    </div>
  );
}