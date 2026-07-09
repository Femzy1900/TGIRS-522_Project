import React, { useState, useEffect, useMemo } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { Search, Filter, X, ChevronLeft, ChevronRight, SlidersHorizontal } from 'lucide-react';
import { searchGadgets, fetchBrands, fetchCategories } from '../lib/api';
import useDebounce from '../hooks/useDebounce';
import Card from '../components/ui/Card';
import Badge from '../components/ui/Badge';
import Button from '../components/ui/Button';
import Input from '../components/ui/Input';
import Skeleton from '../components/ui/Skeleton';

// Helper to highlight matching text
const Highlight = ({ text = '', highlight = '' }) => {
  if (!highlight.trim()) return <span>{text}</span>;
  const regex = new RegExp(`(${highlight})`, 'gi');
  const parts = text.split(regex);
  return (
    <span>
      {parts.map((part, i) => 
        regex.test(part) ? <mark key={i} className="bg-yellow-200 dark:bg-yellow-900/50 text-inherit">{part}</mark> : <span key={i}>{part}</span>
      )}
    </span>
  );
};

const Browse = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const initialQuery = searchParams.get('q') || '';
  
  const [queryInput, setQueryInput] = useState(initialQuery);
  const debouncedQuery = useDebounce(queryInput, 400);

  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(true);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(Number(searchParams.get('page')) || 1);
  const [totalPages, setTotalPages] = useState(1);

  // Filter Data
  const [brands, setBrands] = useState([]);
  const [categories, setCategories] = useState([]);
  const [isFilterOpen, setIsFilterOpen] = useState(false);

  useEffect(() => {
    Promise.all([fetchBrands(), fetchCategories()]).then(([b, c]) => {
      setBrands(b);
      setCategories(c);
    });
  }, []);

  // Update URL on query change (debounced)
  useEffect(() => {
    if (debouncedQuery !== (searchParams.get('q') || '')) {
      const newParams = new URLSearchParams(searchParams);
      if (debouncedQuery) {
        newParams.set('q', debouncedQuery);
      } else {
        newParams.delete('q');
      }
      newParams.set('page', '1');
      setSearchParams(newParams, { replace: true });
    }
  }, [debouncedQuery, searchParams, setSearchParams]);

  // Fetch results when searchParams change
  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      try {
        const paramsObj = Object.fromEntries(searchParams.entries());
        const data = await searchGadgets(paramsObj);
        setResults(data.gadgets);
        setTotal(data.total);
        setTotalPages(data.pages);
        setPage(data.page);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };
    loadData();
  }, [searchParams]);

  const handleFilterChange = (key, value) => {
    const newParams = new URLSearchParams(searchParams);
    if (value) {
      newParams.set(key, value);
    } else {
      newParams.delete(key);
    }
    newParams.set('page', '1');
    setSearchParams(newParams);
  };

  const clearFilters = () => {
    const newParams = new URLSearchParams();
    if (searchParams.get('q')) newParams.set('q', searchParams.get('q'));
    setSearchParams(newParams);
  };

  const handlePageChange = (newPage) => {
    if (newPage >= 1 && newPage <= totalPages) {
      const newParams = new URLSearchParams(searchParams);
      newParams.set('page', newPage.toString());
      setSearchParams(newParams);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const activeFiltersCount = Array.from(searchParams.keys()).filter(k => !['q', 'page', 'sortBy'].includes(k)).length;

  return (
    <div className="flex flex-col md:flex-row gap-8">
      {/* Mobile filter toggle */}
      <div className="md:hidden flex items-center justify-between">
        <Input 
          placeholder="Search gadgets..."
          value={queryInput}
          onChange={(e) => setQueryInput(e.target.value)}
          className="max-w-[70%]"
        />
        <Button variant="outline" onClick={() => setIsFilterOpen(!isFilterOpen)}>
          <SlidersHorizontal size={20} className="mr-2" /> Filters
        </Button>
      </div>

      {/* Sidebar Filters */}
      <aside className={`w-full md:w-64 flex-shrink-0 ${isFilterOpen ? 'block' : 'hidden'} md:block space-y-6 bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 h-fit sticky top-24`}>
        <div className="flex items-center justify-between mb-2">
          <h2 className="text-lg font-semibold flex items-center gap-2">
            <Filter size={18} /> Filters {activeFiltersCount > 0 && <Badge variant="primary">{activeFiltersCount}</Badge>}
          </h2>
          {activeFiltersCount > 0 && (
            <button onClick={clearFilters} className="text-xs text-red-500 hover:text-red-700">Clear</button>
          )}
        </div>

        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-1">Sort By</label>
            <select 
              className="w-full p-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-sm"
              value={searchParams.get('sortBy') || 'newest'}
              onChange={(e) => handleFilterChange('sortBy', e.target.value)}
            >
              <option value="newest">Newest First</option>
              <option value="priceLowHigh">Price: Low to High</option>
              <option value="priceHighLow">Price: High to Low</option>
              <option value="highestRated">Highest Rated</option>
              <option value="alphabetical">Alphabetical</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Category</label>
            <select 
              className="w-full p-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-sm"
              value={searchParams.get('category') || ''}
              onChange={(e) => handleFilterChange('category', e.target.value)}
            >
              <option value="">All Categories</option>
              {categories.map(c => <option key={c} value={c}>{c}</option>)}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Brand</label>
            <select 
              className="w-full p-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-sm"
              value={searchParams.get('brand') || ''}
              onChange={(e) => handleFilterChange('brand', e.target.value)}
            >
              <option value="">All Brands</option>
              {brands.map(b => <option key={b} value={b}>{b}</option>)}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Max Price ($)</label>
            <input 
              type="range" 
              min="0" max="3000" step="100"
              className="w-full accent-primary-600"
              value={searchParams.get('maxPrice') || '3000'}
              onChange={(e) => handleFilterChange('maxPrice', e.target.value)}
            />
            <div className="text-right text-xs text-gray-500">Up to ${searchParams.get('maxPrice') || '3000'}</div>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <div className="flex-1 space-y-6">
        <div className="hidden md:block relative">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
          <input
            type="text"
            className="w-full pl-12 pr-4 py-3 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 focus:ring-2 focus:ring-primary-500 outline-none transition-shadow shadow-sm"
            placeholder="Search catalog... (e.g., 'Android Tablet', '16GB', 'Gaming')"
            value={queryInput}
            onChange={(e) => setQueryInput(e.target.value)}
          />
        </div>

        <div className="flex items-center justify-between">
          <p className="text-gray-600 dark:text-gray-400 text-sm">
            {loading ? 'Searching...' : `Found ${total} result${total !== 1 ? 's' : ''}`}
            {debouncedQuery && !loading && <span> for "<span className="font-semibold text-gray-900 dark:text-white">{debouncedQuery}</span>"</span>}
          </p>
        </div>

        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1,2,3,4,5,6].map(i => <Skeleton key={i} className="h-72 w-full" />)}
          </div>
        ) : results.length === 0 ? (
          <div className="bg-white dark:bg-gray-800 rounded-3xl p-12 text-center border border-gray-100 dark:border-gray-700">
            <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-gray-50 dark:bg-gray-700 mb-6">
              <Search className="text-gray-400" size={32} />
            </div>
            <h3 className="text-xl font-bold mb-2">No results found</h3>
            <p className="text-gray-500 max-w-sm mx-auto mb-6">
              {debouncedQuery 
                ? "We couldn't find any gadgets matching your search query. Try adjusting your keywords or clearing filters."
                : "Your current filter combination didn't yield any results. Try broadening your criteria."}
            </p>
            <Button onClick={clearFilters}>Clear all filters</Button>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {results.map(gadget => (
              <Card key={gadget._id} className="flex flex-col h-full hover:shadow-lg transition-shadow group">
                <Link to={`/gadgets/${gadget._id}`} className="aspect-video relative overflow-hidden bg-gray-100 dark:bg-gray-700 block">
                  <img src={gadget.image} alt={gadget.productName} className="w-full h-full object-cover group-hover:scale-105 transition-transform" loading="lazy" />
                  <div className="absolute top-2 left-2 flex gap-1">
                    <Badge variant={gadget.availability === 'In Stock' ? 'success' : 'default'}>{gadget.availability}</Badge>
                  </div>
                  {gadget._relevanceScore && (
                    <div className="absolute top-2 right-2">
                      <Badge variant="primary">Score: {gadget._relevanceScore}</Badge>
                    </div>
                  )}
                </Link>
                <div className="p-4 flex flex-col flex-1">
                  <div className="flex justify-between items-start mb-2">
                    <span className="text-xs font-semibold text-primary-600 dark:text-primary-400 uppercase tracking-wider">{gadget.brand}</span>
                    <span className="text-xs text-gray-500">{gadget.category}</span>
                  </div>
                  <h3 className="text-lg font-bold mb-1 line-clamp-1 group-hover:text-primary-600 transition-colors">
                    <Highlight text={gadget.productName} highlight={debouncedQuery} />
                  </h3>
                  <div className="text-sm text-gray-500 mb-4 flex flex-wrap gap-x-3 gap-y-1">
                    {gadget.ram && <span>{gadget.ram} RAM</span>}
                    {gadget.storage && <span>{gadget.storage}</span>}
                  </div>
                  
                  <div className="mt-auto flex items-center justify-between pt-4 border-t border-gray-100 dark:border-gray-700">
                    <span className="text-xl font-extrabold text-gray-900 dark:text-white">${gadget.price}</span>
                    <Link to={`/gadgets/${gadget._id}`}>
                      <Button variant="outline" className="text-sm py-1.5 px-3">View</Button>
                    </Link>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        )}

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex items-center justify-center gap-2 pt-8">
            <Button variant="ghost" onClick={() => handlePageChange(page - 1)} disabled={page === 1} className="px-2">
              <ChevronLeft size={20} />
            </Button>
            <div className="flex gap-1">
              {Array.from({ length: totalPages }, (_, i) => i + 1).map(p => (
                <button
                  key={p}
                  onClick={() => handlePageChange(p)}
                  className={`w-10 h-10 rounded-lg text-sm font-medium transition-colors ${
                    page === p 
                      ? 'bg-primary-600 text-white' 
                      : 'bg-white dark:bg-gray-800 text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
                  }`}
                >
                  {p}
                </button>
              ))}
            </div>
            <Button variant="ghost" onClick={() => handlePageChange(page + 1)} disabled={page === totalPages} className="px-2">
              <ChevronRight size={20} />
            </Button>
          </div>
        )}
      </div>
    </div>
  );
};

export default Browse;
