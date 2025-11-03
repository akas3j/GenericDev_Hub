import { useState, useEffect } from 'react';
import { supabase, RegulatoryResource } from '../lib/supabase';
import { RegulatoryCard } from './RegulatoryCard';
import { SearchBar } from './SearchBar';
import { Loader2, Filter } from 'lucide-react';

export function RegulatoryResources() {
  const [resources, setResources] = useState<RegulatoryResource[]>([]);
  const [filteredResources, setFilteredResources] = useState<RegulatoryResource[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedRegion, setSelectedRegion] = useState('all');
  const [selectedType, setSelectedType] = useState('all');

  const regions = ['all', 'FDA', 'EMA', 'ICH', 'WHO'];
  const types = ['all', 'Guidance', 'Guideline', 'Policy', 'Q&A'];

  useEffect(() => {
    fetchResources();
  }, []);

  useEffect(() => {
    filterResources();
  }, [resources, searchQuery, selectedRegion, selectedType]);

  const fetchResources = async () => {
    try {
      const { data, error } = await supabase
        .from('regulatory_resources')
        .select('*')
        .order('effective_date', { ascending: false });

      if (error) throw error;
      setResources(data || []);
    } catch (error) {
      console.error('Error fetching resources:', error);
    } finally {
      setLoading(false);
    }
  };

  const filterResources = () => {
    let filtered = resources;

    if (selectedRegion !== 'all') {
      filtered = filtered.filter(r => r.region === selectedRegion);
    }

    if (selectedType !== 'all') {
      filtered = filtered.filter(r => r.document_type === selectedType);
    }

    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(r =>
        r.title.toLowerCase().includes(query) ||
        r.summary.toLowerCase().includes(query) ||
        r.region.toLowerCase().includes(query) ||
        r.document_type.toLowerCase().includes(query)
      );
    }

    setFilteredResources(filtered);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-bold text-gray-900 mb-2">Regulatory Resources</h2>
        <p className="text-gray-600">Essential regulatory guidelines and requirements for generic drug development</p>
      </div>

      <div className="bg-white rounded-lg border border-gray-200 p-6 space-y-4">
        <SearchBar
          value={searchQuery}
          onChange={setSearchQuery}
          placeholder="Search by title, summary, region, or document type..."
        />

        <div className="grid md:grid-cols-2 gap-4">
          <div>
            <div className="flex items-center gap-2 mb-3">
              <Filter className="w-4 h-4 text-gray-500" />
              <span className="text-sm font-medium text-gray-700">Region:</span>
            </div>
            <div className="flex flex-wrap gap-2">
              {regions.map((region) => (
                <button
                  key={region}
                  onClick={() => setSelectedRegion(region)}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                    selectedRegion === region
                      ? 'bg-blue-600 text-white'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  {region === 'all' ? 'All Regions' : region}
                </button>
              ))}
            </div>
          </div>

          <div>
            <div className="flex items-center gap-2 mb-3">
              <Filter className="w-4 h-4 text-gray-500" />
              <span className="text-sm font-medium text-gray-700">Document Type:</span>
            </div>
            <div className="flex flex-wrap gap-2">
              {types.map((type) => (
                <button
                  key={type}
                  onClick={() => setSelectedType(type)}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                    selectedType === type
                      ? 'bg-blue-600 text-white'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  {type === 'all' ? 'All Types' : type}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      {filteredResources.length === 0 ? (
        <div className="text-center py-12 bg-white rounded-lg border border-gray-200">
          <p className="text-gray-500">No regulatory resources found matching your criteria.</p>
        </div>
      ) : (
        <div className="grid gap-6">
          {filteredResources.map((resource) => (
            <RegulatoryCard key={resource.id} resource={resource} />
          ))}
        </div>
      )}
    </div>
  );
}
