import { useState, useEffect } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, BarChart, Bar } from 'recharts';
import { DatePicker, Select, Spin, Alert } from 'antd';
import api from "../../constants/api/api";
import secureStorage from 'react-secure-storage';
import dayjs from 'dayjs';

const { RangePicker } = DatePicker;
const { Option } = Select;

export function Statistiques() {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [dateRange, setDateRange] = useState([dayjs().subtract(1, 'month'), dayjs()]);
  const [groupBy, setGroupBy] = useState('day');
  const [chartType, setChartType] = useState('line');

  const fetchStatistics = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const token = secureStorage.getItem('token');
      if (!token) throw new Error('Token non trouvé');
      
      const [startDate, endDate] = dateRange;
      const params = {
        startDate: startDate.format('YYYY-MM-DD'),
        endDate: endDate.format('YYYY-MM-DD'),
        groupBy
      };

      const response = await api.get('/admin/stats/period', {
        params,
        headers: {
          Authorization: `Bearer ${token}`
        }
      });

      setData(response.data.data.data);
    } catch (err) {
      console.error("Erreur:", err);
      setError(err.response?.data?.msg || err.message || "Erreur lors du chargement des données");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStatistics();
  }, [dateRange, groupBy]);

  const handleDateChange = (dates) => {
    if (dates && dates.length === 2) {
      setDateRange(dates);
    }
  };

  const renderChart = () => {
    if (chartType === 'line') {
      return (
        <LineChart data={data}>
          <CartesianGrid strokeDasharray="3 3" stroke="#2D3748" />
          <XAxis 
            dataKey="date" 
            tick={{ fill: '#A0AEC0' }}
            tickFormatter={(value) => dayjs(value).format(groupBy === 'month' ? 'MMM YYYY' : 'MMM DD')}
          />
          <YAxis tick={{ fill: '#A0AEC0' }} />
          <Tooltip 
            contentStyle={{ backgroundColor: '#2D3748', borderColor: '#4A5568' }}
            labelFormatter={(value) => dayjs(value).format('ddd, MMM D, YYYY')}
          />
          <Legend />
          <Line 
            type="monotone" 
            dataKey="newUsers" 
            name="Nouveaux utilisateurs" 
            stroke="#4299E1" 
            strokeWidth={2}
            dot={{ r: 4 }}
            activeDot={{ r: 6 }}
          />
          <Line 
            type="monotone" 
            dataKey="newGarages" 
            name="Nouveaux garages" 
            stroke="#48BB78" 
            strokeWidth={2}
            dot={{ r: 4 }}
            activeDot={{ r: 6 }}
          />
          <Line 
            type="monotone" 
            dataKey="newServiceRequests" 
            name="Nouvelles demandes" 
            stroke="#F6AD55" 
            strokeWidth={2}
            dot={{ r: 4 }}
            activeDot={{ r: 6 }}
          />
          <Line 
            type="monotone" 
            dataKey="newChecklists" 
            name="Nouvelles checklists" 
            stroke="#9F7AEA" 
            strokeWidth={2}
            dot={{ r: 4 }}
            activeDot={{ r: 6 }}
          />
        </LineChart>
      );
    } else {
      return (
        <BarChart data={data}>
          <CartesianGrid strokeDasharray="3 3" stroke="#2D3748" />
          <XAxis 
            dataKey="date" 
            tick={{ fill: '#A0AEC0' }}
            tickFormatter={(value) => dayjs(value).format(groupBy === 'month' ? 'MMM YYYY' : 'MMM DD')}
          />
          <YAxis tick={{ fill: '#A0AEC0' }} />
          <Tooltip 
            contentStyle={{ backgroundColor: '#2D3748', borderColor: '#4A5568' }}
            labelFormatter={(value) => dayjs(value).format('ddd, MMM D, YYYY')}
          />
          <Legend />
          <Bar 
            dataKey="newUsers" 
            name="Nouveaux utilisateurs" 
            fill="#4299E1" 
            radius={[4, 4, 0, 0]}
          />
          <Bar 
            dataKey="newGarages" 
            name="Nouveaux garages" 
            fill="#48BB78" 
            radius={[4, 4, 0, 0]}
          />
          <Bar 
            dataKey="newServiceRequests" 
            name="Nouvelles demandes" 
            fill="#F6AD55" 
            radius={[4, 4, 0, 0]}
          />
          <Bar 
            dataKey="newChecklists" 
            name="Nouvelles checklists" 
            fill="#9F7AEA" 
            radius={[4, 4, 0, 0]}
          />
        </BarChart>
      );
    }
  };

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-white">Statistiques</h1>
        
        <div className="flex space-x-4">
          <RangePicker
            value={dateRange}
            onChange={handleDateChange}
            format="YYYY-MM-DD"
            className="bg-slate-700 border-slate-600"
            disabledDate={(current) => current && current > dayjs().endOf('day')}
          />
          
          <Select
            value={groupBy}
            onChange={setGroupBy}
            className="w-32"
          >
            <Option value="day">Par jour</Option>
            <Option value="week">Par semaine</Option>
            <Option value="month">Par mois</Option>
          </Select>
          
          <Select
            value={chartType}
            onChange={setChartType}
            className="w-32"
          >
            <Option value="line">Ligne</Option>
            <Option value="bar">Barres</Option>
          </Select>
        </div>
      </div>

      {error && (
        <Alert
          message="Erreur"
          description={error}
          type="error"
          showIcon
          closable
          className="mb-6"
        />
      )}

      <div className="bg-slate-800/50 p-6 rounded-xl border border-slate-700">
        {loading ? (
          <div className="flex justify-center items-center h-64">
            <Spin size="large" />
          </div>
        ) : (
          <div className="h-[500px]">
            <ResponsiveContainer width="100%" height="100%">
              {renderChart()}
            </ResponsiveContainer>
          </div>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mt-6">
        <div className="bg-slate-800/50 p-4 rounded-lg border border-slate-700">
          <h3 className="text-sm font-medium text-slate-400 mb-1">Total utilisateurs</h3>
          <p className="text-2xl font-bold text-blue-400">
            {data.reduce((sum, item) => sum + item.newUsers, 0)}
          </p>
        </div>
        
        <div className="bg-slate-800/50 p-4 rounded-lg border border-slate-700">
          <h3 className="text-sm font-medium text-slate-400 mb-1">Total garages</h3>
          <p className="text-2xl font-bold text-green-400">
            {data.reduce((sum, item) => sum + item.newGarages, 0)}
          </p>
        </div>
        
        <div className="bg-slate-800/50 p-4 rounded-lg border border-slate-700">
          <h3 className="text-sm font-medium text-slate-400 mb-1">Total demandes</h3>
          <p className="text-2xl font-bold text-orange-400">
            {data.reduce((sum, item) => sum + item.newServiceRequests, 0)}
          </p>
        </div>
        
        <div className="bg-slate-800/50 p-4 rounded-lg border border-slate-700">
          <h3 className="text-sm font-medium text-slate-400 mb-1">Total checklists</h3>
          <p className="text-2xl font-bold text-purple-400">
            {data.reduce((sum, item) => sum + item.newChecklists, 0)}
          </p>
        </div>
      </div>
    </div>
  );
}