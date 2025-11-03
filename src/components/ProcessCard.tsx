import { Clock, ChevronDown, ChevronUp } from 'lucide-react';
import { DevelopmentProcess } from '../lib/supabase';
import { useState } from 'react';

interface ProcessCardProps {
  process: DevelopmentProcess;
}

export function ProcessCard({ process }: ProcessCardProps) {
  const [isExpanded, setIsExpanded] = useState(false);

  const phaseColors: Record<string, string> = {
    'Pre-formulation': 'bg-purple-100 text-purple-800',
    'Formulation Development': 'bg-blue-100 text-blue-800',
    'Clinical Development': 'bg-green-100 text-green-800',
    'Scale-up & Tech Transfer': 'bg-orange-100 text-orange-800',
  };

  return (
    <div className="bg-white rounded-lg border border-gray-200 hover:shadow-md transition-shadow">
      <div className="p-6">
        <div className="flex items-start justify-between gap-4 mb-3">
          <div className="flex-1">
            <span className={`inline-block px-3 py-1 rounded-full text-xs font-medium mb-3 ${phaseColors[process.phase] || 'bg-gray-100 text-gray-800'}`}>
              {process.phase}
            </span>
            <h3 className="text-xl font-bold text-gray-900 mb-2">{process.title}</h3>
            <p className="text-gray-600 leading-relaxed">{process.description}</p>
          </div>
        </div>

        <div className="flex items-center gap-2 text-sm text-gray-500 mb-4">
          <Clock className="w-4 h-4" />
          <span>Timeline: {process.timeline}</span>
        </div>

        <button
          onClick={() => setIsExpanded(!isExpanded)}
          className="flex items-center gap-2 text-blue-600 hover:text-blue-700 font-medium text-sm"
        >
          {isExpanded ? (
            <>
              <ChevronUp className="w-4 h-4" />
              Show Less
            </>
          ) : (
            <>
              <ChevronDown className="w-4 h-4" />
              View Details
            </>
          )}
        </button>

        {isExpanded && (
          <div className="mt-4 pt-4 border-t border-gray-200 space-y-4">
            <div>
              <h4 className="font-semibold text-gray-900 mb-3">Process Steps</h4>
              <div className="space-y-3">
                {process.steps.map((step, index) => (
                  <div key={index} className="flex gap-3">
                    <div className="flex-shrink-0 w-6 h-6 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center text-sm font-semibold">
                      {index + 1}
                    </div>
                    <div className="flex-1">
                      <p className="font-medium text-gray-900">{step.step}</p>
                      <p className="text-sm text-gray-600 mt-1">{step.details}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {process.key_considerations && (
              <div className="bg-amber-50 border border-amber-200 rounded-lg p-4">
                <h4 className="font-semibold text-amber-900 mb-2">Key Considerations</h4>
                <p className="text-sm text-amber-800">{process.key_considerations}</p>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
