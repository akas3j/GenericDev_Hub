import { useState, useEffect } from 'react';
import { supabase, TroubleshootingGuide } from '../lib/supabase';
import { TroubleshootingCard } from './TroubleshootingCard';
import { SearchBar } from './SearchBar';
import { Loader2, Filter } from 'lucide-react';

export function TroubleshootingGuides() {
  const [guides, setGuides] = useState<TroubleshootingGuide[]>([]);
  const [filteredGuides, setFilteredGuides] = useState<TroubleshootingGuide[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');

  const categories = ['all', 'Dissolution', 'Processing', 'Stability', 'Bioequivalence'];

  useEffect(() => {
    fetchGuides();
  }, []);

  useEffect(() => {
    filterGuides();
  }, [guides, searchQuery, selectedCategory]);

  const fetchGuides = async () => {
    try {
      const { data, error } = await supabase
        .from('troubleshooting_guides')
        .select('*')
        .order('created_at', { ascending: true });

      if (error) throw error;
      setGuides(data || []);
    } catch (error) {
      console.error('Error fetching guides:', error);
    } finally {
      setLoading(false);
    }
  };

  const filterGuides = () => {
    let filtered = guides;

    if (selectedCategory !== 'all') {
      filtered = filtered.filter(g => g.category === selectedCategory);
    }

    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(g =>
        g.title.toLowerCase().includes(query) ||
        g.problem_description.toLowerCase().includes(query) ||
        g.category.toLowerCase().includes(query)
      );
    }

    setFilteredGuides(filtered);
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
        <h2 className="text-3xl font-bold text-gray-900 mb-2">Formulation Troubleshooting</h2>
        <p className="text-gray-600">Expert solutions for common formulation challenges in generic drug development</p>
      </div>

      <div className="bg-white rounded-lg border border-gray-200 p-6 space-y-4">
        <SearchBar
          value={searchQuery}
          onChange={setSearchQuery}
          placeholder="Search by problem, solution, or category..."
        />

        <div>
          <div className="flex items-center gap-2 mb-3">
            <Filter className="w-4 h-4 text-gray-500" />
            <span className="text-sm font-medium text-gray-700">Filter by Category:</span>
          </div>
          <div className="flex flex-wrap gap-2">
            {categories.map((category) => (
              <button
                key={category}
                onClick={() => setSelectedCategory(category)}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                  selectedCategory === category
                    ? 'bg-blue-600 text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                {category === 'all' ? 'All Categories' : category}
              </button>
            ))}
          </div>
        </div>
      </div>

      {filteredGuides.length === 0 ? (
        <div className="text-center py-12 bg-white rounded-lg border border-gray-200">
          <p className="text-gray-500">No troubleshooting guides found matching your criteria.</p>
        </div>
      ) : (
        <div className="grid gap-6">
          {filteredGuides.map((guide) => (
            <TroubleshootingCard key={guide.id} guide={guide} />
          ))}
        </div>
      )}
    </div>
  );
}
