import { ExternalLink, Calendar, FileCheck } from 'lucide-react';
import { RegulatoryResource } from '../lib/supabase';

interface RegulatoryCardProps {
  resource: RegulatoryResource;
}

export function RegulatoryCard({ resource }: RegulatoryCardProps) {
  const regionColors: Record<string, string> = {
    'FDA': 'bg-blue-100 text-blue-800',
    'EMA': 'bg-green-100 text-green-800',
    'ICH': 'bg-purple-100 text-purple-800',
    'WHO': 'bg-orange-100 text-orange-800',
  };

  const typeColors: Record<string, string> = {
    'Guidance': 'bg-indigo-100 text-indigo-800',
    'Guideline': 'bg-cyan-100 text-cyan-800',
    'Policy': 'bg-pink-100 text-pink-800',
    'Q&A': 'bg-teal-100 text-teal-800',
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  return (
    <div className="bg-white rounded-lg border border-gray-200 hover:shadow-md transition-shadow">
      <div className="p-6">
        <div className="flex items-start justify-between gap-4 mb-3">
          <div className="flex-1">
            <div className="flex gap-2 mb-3 flex-wrap">
              <span className={`inline-block px-3 py-1 rounded-full text-xs font-medium ${regionColors[resource.region] || 'bg-gray-100 text-gray-800'}`}>
                {resource.region}
              </span>
              <span className={`inline-block px-3 py-1 rounded-full text-xs font-medium ${typeColors[resource.document_type] || 'bg-gray-100 text-gray-800'}`}>
                {resource.document_type}
              </span>
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-2">{resource.title}</h3>
            <p className="text-gray-600 leading-relaxed mb-4">{resource.summary}</p>
          </div>
        </div>

        {resource.effective_date && (
          <div className="flex items-center gap-2 text-sm text-gray-500 mb-4">
            <Calendar className="w-4 h-4" />
            <span>Effective: {formatDate(resource.effective_date)}</span>
          </div>
        )}

        <div className="bg-gray-50 rounded-lg p-4 mb-4">
          <div className="flex items-center gap-2 mb-3">
            <FileCheck className="w-5 h-5 text-gray-700" />
            <h4 className="font-semibold text-gray-900">Key Points</h4>
          </div>
          <ul className="space-y-2">
            {resource.key_points.map((point, index) => (
              <li key={index} className="flex gap-3 text-sm text-gray-700">
                <span className="text-blue-600 font-bold mt-0.5">•</span>
                <span>{point}</span>
              </li>
            ))}
          </ul>
        </div>

        {resource.url && (
          <a
            href={resource.url}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 text-blue-600 hover:text-blue-700 font-medium text-sm"
          >
            <ExternalLink className="w-4 h-4" />
            View Official Document
          </a>
        )}
      </div>
    </div>
  );
}
