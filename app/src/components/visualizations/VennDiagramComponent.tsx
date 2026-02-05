import type { VennData } from "./types";

interface ColorScheme {
  question1: string;
  question2: string;
  positive: string;
  negative: string;
}

const COLORS: ColorScheme = {
  question1: '#3b82f6',
  question2: '#10b981',
  positive: '#10b981',
  negative: '#ef4444'
};

interface VennDiagramProps {
  data: VennData;
}

const VennDiagramComponent: React.FC<VennDiagramProps> = ({ data }) => {
  const totalRespondents = data.question1Only + data.question2Only + data.both + data.neither;

  return (
    <div>
      <h2 className="text-xl font-semibold mb-4 text-gray-800">
        Response Overlap (Positive Responses)
      </h2>
      <div className="flex flex-col items-center justify-center" style={{ height: '400px' }}>
        <svg width="500" height="350" viewBox="0 0 500 350">
          {/* Left Circle (Question 1) */}
          <circle
            cx="180"
            cy="175"
            r="120"
            fill={COLORS.question1}
            fillOpacity="0.3"
            stroke={COLORS.question1}
            strokeWidth="3"
          />
          
          {/* Right Circle (Question 2) */}
          <circle
            cx="320"
            cy="175"
            r="120"
            fill={COLORS.question2}
            fillOpacity="0.3"
            stroke={COLORS.question2}
            strokeWidth="3"
          />

          {/* Labels */}
          <text x="120" y="175" textAnchor="middle" className="font-bold" fill="#1e40af" fontSize="32">
            {data.question1Only}
          </text>
          <text x="120" y="200" textAnchor="middle" fill="#1e40af" fontSize="12">
            Q1 Only
          </text>

          <text x="250" y="175" textAnchor="middle" className="font-bold" fill="#6b21a8" fontSize="32">
            {data.both}
          </text>
          <text x="250" y="200" textAnchor="middle" fill="#6b21a8" fontSize="12">
            Both
          </text>

          <text x="380" y="175" textAnchor="middle" className="font-bold" fill="#047857" fontSize="32">
            {data.question2Only}
          </text>
          <text x="380" y="200" textAnchor="middle" fill="#047857" fontSize="12">
            Q2 Only
          </text>

          {/* Circle Labels */}
          <text x="180" y="70" textAnchor="middle" className="font-semibold" fill="#1e40af" fontSize="14">
            Question 1
          </text>
          <text x="320" y="70" textAnchor="middle" className="font-semibold" fill="#047857" fontSize="14">
            Question 2
          </text>
        </svg>

        <div className="mt-6 grid grid-cols-2 gap-4 w-full max-w-md">
          <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200">
            <div className="text-2xl font-bold text-gray-900">{data.both}</div>
            <div className="text-sm text-gray-600">Agreed on Both</div>
            <div className="text-xs text-gray-500 mt-1">
              {((data.both / totalRespondents) * 100).toFixed(1)}% of total
            </div>
          </div>
          <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200">
            <div className="text-2xl font-bold text-gray-900">{data.neither}</div>
            <div className="text-sm text-gray-600">Neither</div>
            <div className="text-xs text-gray-500 mt-1">
              {((data.neither / totalRespondents) * 100).toFixed(1)}% of total
            </div>
          </div>
        </div>
      </div>
      <p className="text-sm text-gray-600 mt-4 text-center">
        Overlap of respondents giving positive responses to both questions
      </p>
    </div>
  );
};

export default VennDiagramComponent;
