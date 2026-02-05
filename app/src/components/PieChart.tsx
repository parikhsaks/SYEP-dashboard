import { Cell, Pie, ResponsiveContainer, Tooltip } from "recharts";
import { COLORS } from "./constants";

// Sample data
const sampleData = {
  totalResponses: { completed: 245, partial: 32, skipped: 18 },
  completionRates: [
    { section: 'Summer Job Experience', rate: 94 },
    { section: 'Work Habits', rate: 89 },
    { section: 'Communication Skills', rate: 91 },
    { section: 'Career Preparedness', rate: 87 },
    { section: 'Well-Being', rate: 85 }
  ],
  avgResponseTime: [
    { section: 'Section 1', time: 4.2 },
    { section: 'Section 2', time: 5.1 },
    { section: 'Section 3', time: 3.8 },
    { section: 'Section 4', time: 4.5 },
    { section: 'Section 5', time: 6.2 }
  ],
  demographicDistribution: [
    { demographic: 'Male', count: 118 },
    { demographic: 'Female', count: 122 },
    { demographic: 'Non-binary', count: 5 }
  ],
  mentorResponse: [
    { answer: 'Yes', count: 178 },
    { answer: 'No', count: 67 }
  ],
  industryInterest: [
    { industry: 'Healthcare', value: 45 },
    { industry: 'Technology', value: 62 },
    { industry: 'Education', value: 38 },
    { industry: 'Retail', value: 41 },
    { industry: 'Food Service', value: 34 },
    { industry: 'Other', value: 25 }
  ],
  jobRecommendByGender: [
    { group: 'Male', yes: 85, no: 33 },
    { group: 'Female', yes: 92, no: 30 },
    { group: 'Non-binary', yes: 3, no: 2 }
  ],
  skillMatch: [
    { category: 'Healthcare', avg: 4.2 },
    { category: 'Technology', avg: 4.5 },
    { category: 'Education', avg: 4.1 },
    { category: 'Retail', avg: 3.8 },
    { category: 'Food Service', avg: 3.6 }
  ],
  wellBeingScores: [
    { metric: 'Anxiety', never: 15, rarely: 45, sometimes: 98, often: 65, always: 22 },
    { metric: 'Depression', never: 28, rarely: 67, sometimes: 85, often: 48, always: 17 },
    { metric: 'Motivation', never: 8, rarely: 22, sometimes: 75, often: 102, always: 38 }
  ],
  correlationData: [
    { x: 3.2, y: 3.8, label: 'Student 1' },
    { x: 4.1, y: 4.3, label: 'Student 2' },
    { x: 2.8, y: 2.5, label: 'Student 3' },
    { x: 4.5, y: 4.7, label: 'Student 4' },
    { x: 3.7, y: 4.0, label: 'Student 5' },
    { x: 4.8, y: 4.9, label: 'Student 6' },
    { x: 3.3, y: 3.5, label: 'Student 7' },
    { x: 2.5, y: 2.8, label: 'Student 8' }
  ],
  radarData: [
    { skill: 'Work Habits', value: 4.2 },
    { skill: 'Communication', value: 4.5 },
    { skill: 'Problem Solving', value: 3.9 },
    { skill: 'Time Management', value: 4.1 },
    { skill: 'Teamwork', value: 4.4 }
  ],
  timeSeriesData: [
    { week: 'Week 1', responses: 12 },
    { week: 'Week 2', responses: 28 },
    { week: 'Week 3', responses: 45 },
    { week: 'Week 4', responses: 67 },
    { week: 'Week 5', responses: 89 },
    { week: 'Week 6', responses: 102 },
    { week: 'Week 7', responses: 115 },
    { week: 'Week 8', responses: 125 }
  ]
};

interface PieChartProps {
    
}

export default function PieChart(props: PieChartProps) {
    return (
        <div className="bg-white p-6 rounded-lg shadow">
              <h3 className="text-xl font-semibold mb-4 text-gray-800">Response Distribution by Demographics</h3>
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={sampleData.demographicDistribution}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={({ demographic, count }) => `${demographic}: ${count}`}
                    outerRadius={100}
                    fill="#8884d8"
                    dataKey="count"
                  >
                    {sampleData.demographicDistribution.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </div>
    );
}
