import { AlertCircle, ChevronDown, ChevronUp, Lightbulb, FileText } from 'lucide-react';
import { TroubleshootingGuide } from '../lib/supabase';
import { useState } from 'react';

interface TroubleshootingCardProps {
  guide: TroubleshootingGuide;
}

export function TroubleshootingCard({ guide }: TroubleshootingCardProps) {
  const [isExpanded, setIsExpanded] = useState(false);

  const categoryColors: Record<string, string> = {
    'Dissolution': 'bg-blue-100 text-blue-800',
    'Processing': 'bg-green-100 text-green-800',
    'Stability': 'bg-red-100 text-red-800',
    'Bioequivalence': 'bg-purple-100 text-purple-800',
  };

  return (
    <div className="bg-white rounded-lg border border-gray-200 hover:shadow-md transition-shadow">
      <div className="p-6">
        <div className="flex items-start justify-between gap-4 mb-3">
          <div className="flex-1">
            <span className={`inline-block px-3 py-1 rounded-full text-xs font-medium mb-3 ${categoryColors[guide.category] || 'bg-gray-100 text-gray-800'}`}>
              {guide.category}
            </span>
            <h3 className="text-xl font-bold text-gray-900 mb-2">{guide.title}</h3>
            <p className="text-gray-600 leading-relaxed">{guide.problem_description}</p>
          </div>
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
              View Solutions
            </>
          )}
        </button>

        {isExpanded && (
          <div className="mt-4 pt-4 border-t border-gray-200 space-y-6">
            <div>
              <div className="flex items-center gap-2 mb-3">
                <AlertCircle className="w-5 h-5 text-red-600" />
                <h4 className="font-semibold text-gray-900">Root Causes</h4>
              </div>
              <div className="space-y-3">
                {guide.root_causes.map((cause, index) => (
                  <div key={index} className="bg-red-50 border border-red-100 rounded-lg p-3">
                    <p className="font-medium text-gray-900 mb-1">{cause.cause}</p>
                    <p className="text-sm text-gray-600">{cause.explanation}</p>
                  </div>
                ))}
              </div>
            </div>

            <div>
              <div className="flex items-center gap-2 mb-3">
                <Lightbulb className="w-5 h-5 text-green-600" />
                <h4 className="font-semibold text-gray-900">Solutions</h4>
              </div>
              <div className="space-y-3">
                {guide.solutions.map((solution, index) => (
                  <div key={index} className="bg-green-50 border border-green-100 rounded-lg p-3">
                    <p className="font-medium text-gray-900 mb-1">{solution.solution}</p>
                    {solution.implementation && (
                      <p className="text-sm text-gray-600">{solution.implementation}</p>
                    )}
                    {solution.details && (
                      <p className="text-sm text-gray-600">{solution.details}</p>
                    )}
                  </div>
                ))}
              </div>
            </div>

            {guide.case_studies && (
              <div>
                <div className="flex items-center gap-2 mb-3">
                  <FileText className="w-5 h-5 text-blue-600" />
                  <h4 className="font-semibold text-gray-900">Case Study</h4>
                </div>
                <div className="bg-blue-50 border border-blue-100 rounded-lg p-4">
                  <p className="text-sm text-gray-700">{guide.case_studies}</p>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
