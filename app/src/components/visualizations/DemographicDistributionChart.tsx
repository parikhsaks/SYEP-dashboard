import React, { useState } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import type { DemographicDistribution, DemographicType } from './types';

interface DemographicDistributionChartProps {
  data: DemographicDistribution[];
  title?: string;
  defaultView?: DemographicType;
  showFilter?: boolean;
}

const DemographicDistributionChart: React.FC<DemographicDistributionChartProps> = ({ 
  data,
  title = 'Response Distribution by Demographics',
  defaultView = 'gender',
  showFilter = true
}) => {
  const [selectedDemographic, setSelectedDemographic] = useState<DemographicType>(defaultView);

  return (
    <div>
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-semibold text-gray-900">{title}</h2>
        
        {showFilter && (
          <div className="flex gap-2">
            <button
              onClick={() => setSelectedDemographic('gender')}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                selectedDemographic === 'gender' 
                  ? 'bg-blue-600 text-white' 
                  : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
              }`}
            >
              Gender
            </button>
            <button
              onClick={() => setSelectedDemographic('race')}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                selectedDemographic === 'race' 
                  ? 'bg-blue-600 text-white' 
                  : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
              }`}
            >
              Race
            </button>
            <button
              onClick={() => setSelectedDemographic('guardian')}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                selectedDemographic === 'guardian' 
                  ? 'bg-blue-600 text-white' 
                  : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
              }`}
            >
              Guardian Type
            </button>
          </div>
        )}
      </div>
      
      <ResponsiveContainer width="100%" height={350}>
        <BarChart data={data} margin={{ top: 20, right: 30, left: 20, bottom: 20 }}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="category" />
          <YAxis label={{ value: 'Number of Responses', angle: -90, position: 'insideLeft' }} />
          <Tooltip contentStyle={{ backgroundColor: 'white', border: '1px solid #ccc' }} />
          <Legend />
          <Bar dataKey="male" stackId="a" fill="#3b82f6" name="Male" />
          <Bar dataKey="female" stackId="a" fill="#ec4899" name="Female" />
          <Bar dataKey="nonBinary" stackId="a" fill="#8b5cf6" name="Non-Binary" />
          <Bar dataKey="preferNotToSay" stackId="a" fill="#6b7280" name="Prefer Not to Say" />
        </BarChart>
      </ResponsiveContainer>

      <div className="mt-4 p-4 bg-blue-50 rounded-lg">
        <p className="text-sm text-gray-700">
          <span className="font-semibold">Note:</span> This chart shows {selectedDemographic} distribution across age groups. 
          {showFilter && ' Use the buttons above to switch between different demographic breakdowns.'}
        </p>
      </div>
    </div>
  );
};

export default DemographicDistributionChart;
