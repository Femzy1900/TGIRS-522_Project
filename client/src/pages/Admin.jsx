import React, { useState, useEffect } from 'react';
import { fetchGadgets, deleteGadget, createGadget, updateGadget, verifyAdminPin, changeAdminPin } from '../lib/api';
import { Plus, Edit2, Trash2, Search, Lock, KeyRound, X } from 'lucide-react';
import Button from '../components/ui/Button';
import Input from '../components/ui/Input';
import Card from '../components/ui/Card';
import Modal from '../components/ui/Modal';
import Badge from '../components/ui/Badge';
import PinEntry from '../components/ui/PinEntry';

const Admin = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [pinError, setPinError] = useState('');

  const [gadgets, setGadgets] = useState([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [search, setSearch] = useState('');
  
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isPinModalOpen, setIsPinModalOpen] = useState(false);
  const [pinFormData, setPinFormData] = useState({ oldPin: '', newPin: '' });
  
  const [editingGadget, setEditingGadget] = useState(null);
  const [formData, setFormData] = useState({
    productName: '', brand: '', category: '', price: '', 
    releaseYear: '', description: '', image: '', availability: 'In Stock'
  });

  const loadGadgets = async (p = 1, q = '') => {
    try {
      const params = { page: p, limit: 10 };
      let data;
      if (q) {
        const { searchGadgets } = await import('../lib/api');
        data = await searchGadgets({ ...params, q });
      } else {
        data = await fetchGadgets(params);
      }
      setGadgets(data.gadgets);
      setTotal(data.total);
      setTotalPages(data.pages);
      setPage(data.page);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    if (isAuthenticated) {
      loadGadgets(1, search);
    }
  }, [search, isAuthenticated]);

  const handleVerifyPin = async (pin) => {
    try {
      setPinError('');
      await verifyAdminPin(pin);
      setIsAuthenticated(true);
    } catch (err) {
      setPinError(err.message);
    }
  };

  const handleChangePinSubmit = async (e) => {
    e.preventDefault();
    try {
      await changeAdminPin(pinFormData.oldPin, pinFormData.newPin);
      setIsPinModalOpen(false);
      setPinFormData({ oldPin: '', newPin: '' });
      alert('PIN changed successfully!');
    } catch (err) {
      alert(err.message);
    }
  };

  if (!isAuthenticated) {
    return <PinEntry onVerify={handleVerifyPin} error={pinError} />;
  }

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this gadget?')) {
      try {
        await deleteGadget(id);
        loadGadgets(page, search);
      } catch (err) {
        alert(err.message);
      }
    }
  };

  const openModal = (gadget = null) => {
    if (gadget) {
      setEditingGadget(gadget);
      setFormData({
        productName: gadget.productName,
        brand: gadget.brand,
        category: gadget.category,
        price: gadget.price,
        releaseYear: gadget.releaseYear || '',
        description: gadget.description || '',
        image: gadget.image || '',
        availability: gadget.availability || 'In Stock'
      });
    } else {
      setEditingGadget(null);
      setFormData({
        productName: '', brand: '', category: '', price: '', 
        releaseYear: '', description: '', image: '', availability: 'In Stock'
      });
    }
    setIsModalOpen(true);
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingGadget) {
        await updateGadget(editingGadget._id, formData);
      } else {
        await createGadget(formData);
      }
      setIsModalOpen(false);
      loadGadgets(page, search);
    } catch (err) {
      alert(err.message);
    }
  };

  return (
    <div className="space-y-8">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
            Admin Dashboard <Lock size={20} className="text-gray-400" />
          </h1>
          <p className="text-gray-500">Manage your catalog of {total} gadgets.</p>
        </div>
        <div className="flex gap-3">
          <Button variant="outline" onClick={() => setIsPinModalOpen(true)}>
            <KeyRound size={18} className="mr-2" /> Change PIN
          </Button>
          <Button onClick={() => openModal()}>
            <Plus size={18} className="mr-2" /> Add Gadget
          </Button>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="p-6">
          <div className="text-sm text-gray-500 font-medium">Total Items in Catalog</div>
          <div className="text-3xl font-bold text-gray-900 dark:text-white mt-2">{total}</div>
        </Card>
        <Card className="p-6">
          <div className="text-sm text-gray-500 font-medium">System Health</div>
          <div className="text-3xl font-bold text-green-500 mt-2">Operational</div>
        </Card>
      </div>

      {/* Table Section */}
      <Card className="overflow-hidden">
        <div className="p-4 border-b border-gray-100 dark:border-gray-700 flex justify-between items-center bg-gray-50 dark:bg-gray-800">
          <div className="relative w-72">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
            <Input 
              placeholder="Search admin table..." 
              value={search} 
              onChange={(e) => setSearch(e.target.value)}
              className="pl-9 py-1.5 text-sm"
            />
          </div>
        </div>
        
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm whitespace-nowrap">
            <thead className="bg-gray-50 dark:bg-gray-800 text-gray-500">
              <tr>
                <th className="px-6 py-3 font-medium">Product Name</th>
                <th className="px-6 py-3 font-medium">Brand</th>
                <th className="px-6 py-3 font-medium">Category</th>
                <th className="px-6 py-3 font-medium">Price</th>
                <th className="px-6 py-3 font-medium">Status</th>
                <th className="px-6 py-3 font-medium text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 dark:divide-gray-700">
              {gadgets.map(g => (
                <tr key={g._id} className="hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors">
                  <td className="px-6 py-4 font-medium text-gray-900 dark:text-white flex items-center gap-3">
                    <img src={g.image} alt="" className="w-8 h-8 rounded-md object-cover bg-gray-100" />
                    <span className="truncate max-w-[200px]">{g.productName}</span>
                  </td>
                  <td className="px-6 py-4">{g.brand}</td>
                  <td className="px-6 py-4">{g.category}</td>
                  <td className="px-6 py-4 font-semibold">${g.price}</td>
                  <td className="px-6 py-4">
                    <Badge variant={g.availability === 'In Stock' ? 'success' : 'default'}>{g.availability}</Badge>
                  </td>
                  <td className="px-6 py-4 text-right space-x-2">
                    <button onClick={() => openModal(g)} className="text-blue-500 hover:text-blue-700 p-1">
                      <Edit2 size={16} />
                    </button>
                    <button onClick={() => handleDelete(g._id)} className="text-red-500 hover:text-red-700 p-1">
                      <Trash2 size={16} />
                    </button>
                  </td>
                </tr>
              ))}
              {gadgets.length === 0 && (
                <tr><td colSpan="6" className="px-6 py-8 text-center text-gray-500">No gadgets found.</td></tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="p-4 border-t border-gray-100 dark:border-gray-700 flex items-center justify-between bg-gray-50 dark:bg-gray-800">
            <span className="text-sm text-gray-500">Page {page} of {totalPages}</span>
            <div className="flex gap-2">
              <Button variant="outline" onClick={() => loadGadgets(page - 1, search)} disabled={page === 1} className="py-1 px-3 text-sm">Previous</Button>
              <Button variant="outline" onClick={() => loadGadgets(page + 1, search)} disabled={page === totalPages} className="py-1 px-3 text-sm">Next</Button>
            </div>
          </div>
        )}
      </Card>

      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title={editingGadget ? "Edit Gadget" : "Add New Gadget"}>
        <form onSubmit={handleFormSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-1">Product Name *</label>
              <Input required value={formData.productName} onChange={e => setFormData({...formData, productName: e.target.value})} />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Brand *</label>
              <Input required value={formData.brand} onChange={e => setFormData({...formData, brand: e.target.value})} />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Category *</label>
              <Input required value={formData.category} onChange={e => setFormData({...formData, category: e.target.value})} />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Price ($) *</label>
              <Input required type="number" min="0" value={formData.price} onChange={e => setFormData({...formData, price: e.target.value})} />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Release Year</label>
              <Input type="number" value={formData.releaseYear} onChange={e => setFormData({...formData, releaseYear: e.target.value})} />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Availability</label>
              <select 
                className="w-full rounded-lg border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm dark:bg-gray-800 dark:border-gray-700 px-3 py-2 border"
                value={formData.availability} 
                onChange={e => setFormData({...formData, availability: e.target.value})}
              >
                <option value="In Stock">In Stock</option>
                <option value="Out of Stock">Out of Stock</option>
                <option value="Pre-order">Pre-order</option>
              </select>
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Image URL</label>
            <Input type="url" value={formData.image} onChange={e => setFormData({...formData, image: e.target.value})} />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Description</label>
            <textarea 
              className="w-full rounded-lg border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm dark:bg-gray-800 dark:border-gray-700 px-3 py-2 border"
              rows="3"
              value={formData.description} 
              onChange={e => setFormData({...formData, description: e.target.value})} 
            />
          </div>
          <div className="flex justify-end gap-2 pt-4">
            <Button type="button" variant="ghost" onClick={() => setIsModalOpen(false)}>Cancel</Button>
            <Button type="submit">{editingGadget ? 'Save Changes' : 'Create Gadget'}</Button>
          </div>
        </form>
      </Modal>

      <Modal isOpen={isPinModalOpen} onClose={() => setIsPinModalOpen(false)} title="Change Admin PIN">
        <form onSubmit={handleChangePinSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-1">Current PIN *</label>
            <Input 
              type="password" 
              inputMode="numeric" 
              maxLength={4}
              required 
              value={pinFormData.oldPin} 
              onChange={e => setPinFormData({...pinFormData, oldPin: e.target.value})} 
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">New 4-Digit PIN *</label>
            <Input 
              type="password" 
              inputMode="numeric"
              maxLength={4} 
              required 
              value={pinFormData.newPin} 
              onChange={e => setPinFormData({...pinFormData, newPin: e.target.value})} 
            />
          </div>
          <div className="flex justify-end gap-2 pt-4">
            <Button type="button" variant="ghost" onClick={() => setIsPinModalOpen(false)}>Cancel</Button>
            <Button type="submit" disabled={pinFormData.newPin.length !== 4 || pinFormData.oldPin.length !== 4}>Change PIN</Button>
          </div>
        </form>
      </Modal>
    </div>
  );
};

export default Admin;
