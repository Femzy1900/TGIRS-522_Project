import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Search, Laptop, Smartphone, Monitor, Watch, Gamepad, Headphones } from 'lucide-react';
import { fetchGadgets } from '../lib/api';
import Card from '../components/ui/Card';
import Badge from '../components/ui/Badge';
import Skeleton from '../components/ui/Skeleton';

const categoryIcons = {
  'Laptop': <Laptop size={24} />,
  'Smartphone': <Smartphone size={24} />,
  'Tablet': <Monitor size={24} />,
  'Smartwatch': <Watch size={24} />,
  'Gaming Console': <Gamepad size={24} />,
  'Accessories': <Headphones size={24} />
};

const Home = () => {
  const [query, setQuery] = useState('');
  const [featured, setFeatured] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const loadFeatured = async () => {
      try {
        const data = await fetchGadgets({ limit: 4, sortBy: 'highestRated' });
        setFeatured(data.gadgets);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    loadFeatured();
  }, []);

  const handleSearch = (e) => {
    e.preventDefault();
    if (query.trim()) {
      navigate(`/browse?q=${encodeURIComponent(query)}`);
    } else {
      navigate('/browse');
    }
  };

  return (
    <div className="space-y-16 pb-12">
      {/* Hero Section */}
      <section className="relative rounded-3xl overflow-hidden bg-gradient-to-br from-primary-900 to-primary-700 text-white p-10 sm:p-16 text-center shadow-xl">
        <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-10"></div>
        <div className="relative z-10 max-w-3xl mx-auto space-y-8">
          <h1 className="text-4xl sm:text-5xl md:text-6xl font-extrabold tracking-tight">
            Discover Your Next <span className="text-primary-300">Tech</span> Obsession
          </h1>
          <p className="text-lg sm:text-xl text-primary-100 max-w-2xl mx-auto">
            Search across thousands of gadgets, laptops, smartphones and accessories with blazing fast relevance scoring.
          </p>
          
          <form onSubmit={handleSearch} className="max-w-2xl mx-auto mt-8 relative">
            <div className="relative flex items-center">
              <Search className="absolute left-4 text-gray-400" size={24} />
              <input
                type="text"
                className="w-full pl-12 pr-4 py-4 rounded-full text-gray-900 bg-white border-none shadow-lg focus:ring-4 focus:ring-primary-500/50 outline-none text-lg transition-all"
                placeholder="Search for 'MacBook Pro', '16GB RAM', or 'Gaming'..."
                value={query}
                onChange={(e) => setQuery(e.target.value)}
              />
              <button 
                type="submit" 
                className="absolute right-2 px-6 py-2 bg-primary-600 hover:bg-primary-500 text-white font-semibold rounded-full transition-colors"
              >
                Search
              </button>
            </div>
          </form>
        </div>
      </section>

      {/* Stats Section */}
      <section className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          { label: 'Total Gadgets', value: '50+' },
          { label: 'Top Brands', value: '12' },
          { label: 'Categories', value: '6' },
          { label: 'Search Speed', value: '<50ms' },
        ].map((stat) => (
          <div key={stat.label} className="bg-white dark:bg-gray-800 p-6 rounded-2xl text-center shadow-sm border border-gray-100 dark:border-gray-700">
            <div className="text-3xl font-bold text-primary-600 dark:text-primary-400">{stat.value}</div>
            <div className="text-sm text-gray-500 dark:text-gray-400 mt-1">{stat.label}</div>
          </div>
        ))}
      </section>

      {/* Categories */}
      <section className="space-y-6">
        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Popular Categories</h2>
          <Link to="/browse" className="text-primary-600 hover:text-primary-700 dark:text-primary-400 font-medium">View all &rarr;</Link>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
          {Object.entries(categoryIcons).map(([name, icon]) => (
            <Link key={name} to={`/browse?category=${encodeURIComponent(name)}`}>
              <Card className="p-6 text-center hover:shadow-md transition-shadow group cursor-pointer border-transparent hover:border-primary-100 dark:hover:border-primary-900">
                <div className="mx-auto w-12 h-12 flex items-center justify-center bg-gray-50 dark:bg-gray-700 rounded-full text-primary-600 dark:text-primary-400 group-hover:scale-110 transition-transform">
                  {icon}
                </div>
                <h3 className="mt-4 font-medium text-gray-900 dark:text-gray-100">{name}</h3>
              </Card>
            </Link>
          ))}
        </div>
      </section>

      {/* Featured Gadgets */}
      <section className="space-y-6">
        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Highest Rated Gadgets</h2>
        </div>
        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {[1,2,3,4].map(i => <Skeleton key={i} className="h-64 w-full" />)}
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {featured.map(gadget => (
              <Link key={gadget._id} to={`/gadgets/${gadget._id}`}>
                <Card className="h-full hover:shadow-lg transition-all group flex flex-col">
                  <div className="aspect-video w-full overflow-hidden bg-gray-100 dark:bg-gray-700 relative">
                    <img 
                      src={gadget.image} 
                      alt={gadget.productName}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      loading="lazy"
                    />
                    <div className="absolute top-2 right-2">
                      <Badge variant="primary">{gadget.category}</Badge>
                    </div>
                  </div>
                  <div className="p-4 flex-1 flex flex-col">
                    <div className="text-xs text-gray-500 mb-1">{gadget.brand}</div>
                    <h3 className="font-semibold text-gray-900 dark:text-white line-clamp-1">{gadget.productName}</h3>
                    <div className="mt-auto pt-4 flex items-center justify-between">
                      <span className="font-bold text-lg text-primary-600">${gadget.price}</span>
                      <div className="flex items-center text-sm text-yellow-500">
                        ★ {gadget.rating}
                      </div>
                    </div>
                  </div>
                </Card>
              </Link>
            ))}
          </div>
        )}
      </section>
    </div>
  );
};

export default Home;
