import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { ArrowLeft, Cpu, MemoryStick, HardDrive, Smartphone, Battery, Calendar } from 'lucide-react';
import { fetchGadgetById, fetchGadgets } from '../lib/api';
import Card from '../components/ui/Card';
import Badge from '../components/ui/Badge';
import Skeleton from '../components/ui/Skeleton';

const Details = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [gadget, setGadget] = useState(null);
  const [related, setRelated] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const loadGadget = async () => {
      setLoading(true);
      setError(null);
      try {
        const data = await fetchGadgetById(id);
        setGadget(data);
        
        // Fetch related by category
        if (data.category) {
          const relatedData = await fetchGadgets({ category: data.category, limit: 5 });
          // filter out current
          setRelated(relatedData.gadgets.filter(g => g._id !== id).slice(0, 4));
        }
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    loadGadget();
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [id]);

  if (loading) {
    return (
      <div className="space-y-8">
        <Skeleton className="h-8 w-32" />
        <div className="grid md:grid-cols-2 gap-8">
          <Skeleton className="h-[400px] w-full rounded-3xl" />
          <div className="space-y-4">
            <Skeleton className="h-10 w-3/4" />
            <Skeleton className="h-6 w-1/4" />
            <Skeleton className="h-32 w-full" />
          </div>
        </div>
      </div>
    );
  }

  if (error || !gadget) {
    return (
      <div className="text-center py-20">
        <h2 className="text-2xl font-bold text-red-600 mb-4">Error loading gadget</h2>
        <p className="text-gray-600 dark:text-gray-400 mb-6">{error || 'Gadget not found'}</p>
        <button onClick={() => navigate(-1)} className="text-primary-600 hover:underline">Go Back</button>
      </div>
    );
  }

  return (
    <div className="space-y-12 pb-12">
      {/* Back Button */}
      <button 
        onClick={() => navigate(-1)} 
        className="inline-flex items-center text-sm font-medium text-gray-500 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white transition-colors"
      >
        <ArrowLeft size={16} className="mr-2" /> Back to results
      </button>

      {/* Main Details */}
      <div className="grid md:grid-cols-2 gap-10">
        <div className="bg-white dark:bg-gray-800 rounded-3xl p-8 border border-gray-100 dark:border-gray-700 shadow-sm flex items-center justify-center">
          <img src={gadget.image} alt={gadget.productName} className="w-full max-w-md object-contain" />
        </div>

        <div className="space-y-6">
          <div>
            <div className="flex items-center gap-2 mb-3">
              <Badge variant="primary">{gadget.category}</Badge>
              <Badge variant={gadget.availability === 'In Stock' ? 'success' : 'default'}>{gadget.availability}</Badge>
            </div>
            <h1 className="text-3xl md:text-4xl font-extrabold text-gray-900 dark:text-white leading-tight">
              {gadget.productName}
            </h1>
            <p className="text-xl text-gray-500 mt-2 font-medium">{gadget.brand}</p>
          </div>

          <div className="flex items-center justify-between py-4 border-y border-gray-100 dark:border-gray-800">
            <div className="text-3xl font-black text-primary-600 dark:text-primary-400">
              ${gadget.price}
            </div>
            <div className="flex items-center text-yellow-500 font-bold bg-yellow-50 dark:bg-yellow-900/20 px-3 py-1 rounded-lg">
              ★ {gadget.rating}/5
            </div>
          </div>

          <p className="text-gray-600 dark:text-gray-300 leading-relaxed text-lg">
            {gadget.description}
          </p>

          <div className="pt-6">
            <h3 className="text-lg font-bold mb-4">Key Specifications</h3>
            <div className="grid grid-cols-2 gap-4">
              {gadget.processor && (
                <div className="flex items-center gap-3 bg-gray-50 dark:bg-gray-800 p-3 rounded-xl border border-gray-100 dark:border-gray-700">
                  <Cpu className="text-gray-400" size={20} />
                  <div>
                    <div className="text-xs text-gray-500 uppercase font-semibold">Processor</div>
                    <div className="text-sm font-medium text-gray-900 dark:text-gray-100">{gadget.processor}</div>
                  </div>
                </div>
              )}
              {gadget.ram && (
                <div className="flex items-center gap-3 bg-gray-50 dark:bg-gray-800 p-3 rounded-xl border border-gray-100 dark:border-gray-700">
                  <MemoryStick className="text-gray-400" size={20} />
                  <div>
                    <div className="text-xs text-gray-500 uppercase font-semibold">Memory (RAM)</div>
                    <div className="text-sm font-medium text-gray-900 dark:text-gray-100">{gadget.ram}</div>
                  </div>
                </div>
              )}
              {gadget.storage && (
                <div className="flex items-center gap-3 bg-gray-50 dark:bg-gray-800 p-3 rounded-xl border border-gray-100 dark:border-gray-700">
                  <HardDrive className="text-gray-400" size={20} />
                  <div>
                    <div className="text-xs text-gray-500 uppercase font-semibold">Storage</div>
                    <div className="text-sm font-medium text-gray-900 dark:text-gray-100">{gadget.storage}</div>
                  </div>
                </div>
              )}
              {gadget.screenSize && (
                <div className="flex items-center gap-3 bg-gray-50 dark:bg-gray-800 p-3 rounded-xl border border-gray-100 dark:border-gray-700">
                  <Smartphone className="text-gray-400" size={20} />
                  <div>
                    <div className="text-xs text-gray-500 uppercase font-semibold">Display</div>
                    <div className="text-sm font-medium text-gray-900 dark:text-gray-100">{gadget.screenSize} {gadget.displayType}</div>
                  </div>
                </div>
              )}
              {gadget.battery && (
                <div className="flex items-center gap-3 bg-gray-50 dark:bg-gray-800 p-3 rounded-xl border border-gray-100 dark:border-gray-700">
                  <Battery className="text-gray-400" size={20} />
                  <div>
                    <div className="text-xs text-gray-500 uppercase font-semibold">Battery</div>
                    <div className="text-sm font-medium text-gray-900 dark:text-gray-100">{gadget.battery}</div>
                  </div>
                </div>
              )}
              {gadget.releaseYear && (
                <div className="flex items-center gap-3 bg-gray-50 dark:bg-gray-800 p-3 rounded-xl border border-gray-100 dark:border-gray-700">
                  <Calendar className="text-gray-400" size={20} />
                  <div>
                    <div className="text-xs text-gray-500 uppercase font-semibold">Released</div>
                    <div className="text-sm font-medium text-gray-900 dark:text-gray-100">{gadget.releaseYear}</div>
                  </div>
                </div>
              )}
            </div>
          </div>

          <div className="pt-4">
            <h4 className="text-sm font-bold text-gray-900 dark:text-white mb-2">Search Tags (Keywords)</h4>
            <div className="flex flex-wrap gap-2">
              {gadget.keywords?.map(kw => (
                <Link key={kw} to={`/browse?q=${encodeURIComponent(kw)}`}>
                  <Badge className="cursor-pointer hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors">{kw}</Badge>
                </Link>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Related Gadgets */}
      {related.length > 0 && (
        <section className="pt-12 border-t border-gray-200 dark:border-gray-800">
          <h2 className="text-2xl font-bold mb-6">Similar Gadgets</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {related.map(item => (
              <Link key={item._id} to={`/gadgets/${item._id}`}>
                <Card className="p-4 hover:shadow-lg transition-all group h-full">
                  <div className="aspect-video bg-gray-100 dark:bg-gray-700 rounded-lg mb-4 overflow-hidden relative">
                    <img src={item.image} alt={item.productName} className="w-full h-full object-cover group-hover:scale-105 transition-transform" />
                  </div>
                  <h4 className="font-bold text-gray-900 dark:text-white line-clamp-1 group-hover:text-primary-600 transition-colors">{item.productName}</h4>
                  <div className="text-primary-600 font-medium mt-1">${item.price}</div>
                </Card>
              </Link>
            ))}
          </div>
        </section>
      )}
    </div>
  );
};

export default Details;
