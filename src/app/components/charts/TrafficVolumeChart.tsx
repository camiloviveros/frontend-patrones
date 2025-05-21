import { Bar } from 'recharts';
import { BarChart, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

interface ChartData {
  total?: Record<string, number>;
}

export default function TrafficVolumeChart({ data }: { data: ChartData }) {
  // Verificar si data existe y si data.total existe
  if (!data || !data.total || Object.keys(data.total).length === 0) {
    return <div className="flex justify-center items-center h-64 bg-gray-100 rounded-lg">
      <p className="text-gray-500">No hay datos disponibles</p>
    </div>;
  }
  
  const chartData = Object.entries(data.total).map(([type, count]) => ({
    name: type.charAt(0).toUpperCase() + type.slice(1),
    count
  }));

  return (
    <div className="h-80">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart
          data={chartData}
          margin={{
            top: 20,
            right: 30,
            left: 20,
            bottom: 5,
          }}
        >
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="name" />
          <YAxis />
          <Tooltip />
          <Legend />
          <Bar dataKey="count" fill="#4F46E5" name="Cantidad" />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}