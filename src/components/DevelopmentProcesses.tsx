import { useState, useEffect } from 'react';
import { supabase, DevelopmentProcess } from '../lib/supabase';
import { ProcessCard } from './ProcessCard';
import { SearchBar } from './SearchBar';
import { Loader2, Filter } from 'lucide-react';

export function DevelopmentProcesses() {
  const [processes, setProcesses] = useState<DevelopmentProcess[]>([]);
  const [filteredProcesses, setFilteredProcesses] = useState<DevelopmentProcess[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedPhase, setSelectedPhase] = useState('all');

  const phases = ['all', 'Pre-formulation', 'Formulation Development', 'Clinical Development', 'Scale-up & Tech Transfer'];

  useEffect(() => {
    fetchProcesses();
  }, []);

  useEffect(() => {
    filterProcesses();
  }, [processes, searchQuery, selectedPhase]);

  const fetchProcesses = async () => {
    try {
      const { data, error } = await supabase
        .from('development_processes')
        .select('*')
        .order('created_at', { ascending: true });

      if (error) throw error;
      setProcesses(data || []);
    } catch (error) {
      console.error('Error fetching processes:', error);
    } finally {
      setLoading(false);
    }
  };

  const filterProcesses = () => {
    let filtered = processes;

    if (selectedPhase !== 'all') {
      filtered = filtered.filter(p => p.phase === selectedPhase);
    }

    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(p =>
        p.title.toLowerCase().includes(query) ||
        p.description.toLowerCase().includes(query) ||
        p.phase.toLowerCase().includes(query)
      );
    }

    setFilteredProcesses(filtered);
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
        <h2 className="text-3xl font-bold text-gray-900 mb-2">Development Processes</h2>
        <p className="text-gray-600">Comprehensive guides for each stage of generic drug development</p>
      </div>

      <div className="bg-white rounded-lg border border-gray-200 p-6 space-y-4">
        <SearchBar
          value={searchQuery}
          onChange={setSearchQuery}
          placeholder="Search processes by title, description, or phase..."
        />

        <div>
          <div className="flex items-center gap-2 mb-3">
            <Filter className="w-4 h-4 text-gray-500" />
            <span className="text-sm font-medium text-gray-700">Filter by Phase:</span>
          </div>
          <div className="flex flex-wrap gap-2">
            {phases.map((phase) => (
              <button
                key={phase}
                onClick={() => setSelectedPhase(phase)}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                  selectedPhase === phase
                    ? 'bg-blue-600 text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                {phase === 'all' ? 'All Phases' : phase}
              </button>
            ))}
          </div>
        </div>
      </div>

      {filteredProcesses.length === 0 ? (
        <div className="text-center py-12 bg-white rounded-lg border border-gray-200">
          <p className="text-gray-500">No processes found matching your criteria.</p>
        </div>
      ) : (
        <div className="grid gap-6">
          {filteredProcesses.map((process) => (
            <ProcessCard key={process.id} process={process} />
          ))}
        </div>
      )}
    </div>
  );
}
