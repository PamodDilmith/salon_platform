import React, { useState, useEffect } from 'react';
import { api } from '../api';
import { Plus, Trash2, Edit3, Loader, MapPin, Tag } from 'lucide-react';

const Categories = () => {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filterType, setFilterType] = useState('all'); // 'all', 'service', 'location'

  // Form states
  const [name, setName] = useState('');
  const [type, setType] = useState('service');
  const [description, setDescription] = useState('');
  const [editingId, setEditingId] = useState(null);

  const fetchCategories = async () => {
    try {
      const data = await api.getCategories();
      setCategories(data || []);
    } catch (err) {
      console.error('Error fetching categories:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!name.trim()) return;

    try {
      if (editingId) {
        // Edit category
        const updated = await api.updateCategory(editingId, { name, type, description });
        setCategories(categories.map(c => c._id === editingId ? updated : c));
        setEditingId(null);
        alert('Item updated successfully!');
      } else {
        // Create category
        const created = await api.createCategory({ name, type, description });
        setCategories([...categories, created]);
        alert('Item created successfully!');
      }
      setName('');
      setDescription('');
      setType('service');
    } catch (err) {
      alert(`Operation failed: ${err.message}`);
    }
  };

  const handleEditClick = (category) => {
    setEditingId(category._id);
    setName(category.name);
    setType(category.type);
    setDescription(category.description || '');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleCancelEdit = () => {
    setEditingId(null);
    setName('');
    setDescription('');
    setType('service');
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this Category/Location? This might affect existing salon profiles.')) return;

    try {
      await api.deleteCategory(id);
      setCategories(categories.filter(c => c._id !== id));
      alert('Removed successfully.');
    } catch (err) {
      alert(`Deletion failed: ${err.message}`);
    }
  };

  const filteredCategories = categories.filter(c => {
    if (filterType === 'all') return true;
    return c.type === filterType;
  });

  return (
    <div>
      <div style={{ marginBottom: '2rem' }}>
        <h1 className="title-gradient" style={{ fontSize: '2rem', fontWeight: 800 }}>
          Category & Location Manager
        </h1>
        <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', marginTop: '0.25rem' }}>
          Define taxonomy categories for search tags (e.g., Massage, Bridal Makeup) and service delivery areas.
        </p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 2fr', gap: '2rem', alignItems: 'start' }}>
        
        {/* Form Column */}
        <div className="glass-card" style={{ border: editingId ? '1px solid var(--border-accent)' : '1px solid var(--border-color)' }}>
          <h3 style={{ fontSize: '1.2rem', marginBottom: '1.25rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            {editingId ? <Edit3 size={18} color="var(--accent)" /> : <Plus size={18} color="var(--accent)" />}
            <span>{editingId ? 'Edit Configuration' : 'Add New Category'}</span>
          </h3>

          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label className="form-label">Classification Type</label>
              <select
                className="form-input"
                value={type}
                onChange={(e) => setType(e.target.value)}
                style={{ backgroundColor: 'var(--bg-input)' }}
              >
                <option value="service">💆 Service (Category)</option>
                <option value="location">📍 Location (City/Town)</option>
              </select>
            </div>

            <div className="form-group">
              <label className="form-label">Name / Label</label>
              <input
                type="text"
                className="form-input"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder={type === 'service' ? 'E.g., Nail Extensions' : 'E.g., Negombo'}
                required
              />
            </div>

            <div className="form-group" style={{ marginBottom: '1.5rem' }}>
              <label className="form-label">Short Description</label>
              <textarea
                className="form-input"
                style={{ minHeight: '80px', resize: 'vertical' }}
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Briefly describe this category or location code..."
              />
            </div>

            <div style={{ display: 'flex', gap: '0.75rem' }}>
              <button type="submit" className="btn btn-primary btn-sm" style={{ flex: 1 }}>
                {editingId ? 'Save Changes' : 'Add Item'}
              </button>
              {editingId && (
                <button type="button" onClick={handleCancelEdit} className="btn btn-secondary btn-sm">
                  Cancel
                </button>
              )}
            </div>
          </form>
        </div>

        {/* List Column */}
        <div>
          {/* Filters */}
          <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '1.25rem' }}>
            <button
              onClick={() => setFilterType('all')}
              className={`btn btn-sm ${filterType === 'all' ? 'btn-primary' : 'btn-secondary'}`}
              style={{ padding: '0.35rem 0.75rem', fontSize: '0.8rem' }}
            >
              All Items ({categories.length})
            </button>
            <button
              onClick={() => setFilterType('service')}
              className={`btn btn-sm ${filterType === 'service' ? 'btn-primary' : 'btn-secondary'}`}
              style={{ padding: '0.35rem 0.75rem', fontSize: '0.8rem' }}
            >
              Services ({categories.filter(c => c.type === 'service').length})
            </button>
            <button
              onClick={() => setFilterType('location')}
              className={`btn btn-sm ${filterType === 'location' ? 'btn-primary' : 'btn-secondary'}`}
              style={{ padding: '0.35rem 0.75rem', fontSize: '0.8rem' }}
            >
              Locations ({categories.filter(c => c.type === 'location').length})
            </button>
          </div>

          {/* List Card */}
          <div className="glass-card" style={{ padding: '0' }}>
            {loading ? (
              <div style={{ display: 'flex', justifyContent: 'center', padding: '3rem' }}>
                <Loader className="animate-spin" size={24} color="var(--accent)" />
              </div>
            ) : filteredCategories.length === 0 ? (
              <div style={{ textAlign: 'center', padding: '3rem', color: 'var(--text-secondary)' }}>
                No items match this filter category.
              </div>
            ) : (
              <table className="custom-table" style={{ marginTop: '0' }}>
                <thead>
                  <tr>
                    <th>Type</th>
                    <th>Name</th>
                    <th>Description</th>
                    <th style={{ width: '100px', textAlign: 'center' }}>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredCategories.map(cat => (
                    <tr key={cat._id}>
                      <td>
                        <span style={{ display: 'inline-flex', alignItems: 'center', gap: '0.4rem', color: cat.type === 'service' ? 'var(--accent)' : 'var(--success)' }}>
                          {cat.type === 'service' ? <Tag size={14} /> : <MapPin size={14} />}
                          <span style={{ fontSize: '0.8rem', fontWeight: 600, textTransform: 'capitalize' }}>{cat.type}</span>
                        </span>
                      </td>
                      <td><strong style={{ fontSize: '0.95rem' }}>{cat.name}</strong></td>
                      <td style={{ color: 'var(--text-secondary)', fontSize: '0.85rem' }}>
                        {cat.description || <span style={{ color: 'var(--text-muted)' }}>No description</span>}
                      </td>
                      <td>
                        <div style={{ display: 'flex', justifyContent: 'center', gap: '0.5rem' }}>
                          <button
                            onClick={() => handleEditClick(cat)}
                            style={{ color: 'var(--text-secondary)', cursor: 'pointer', padding: '0.25rem' }}
                            title="Edit"
                          >
                            <Edit3 size={16} />
                          </button>
                          <button
                            onClick={() => handleDelete(cat._id)}
                            style={{ color: 'var(--error)', cursor: 'pointer', padding: '0.25rem' }}
                            title="Delete"
                          >
                            <Trash2 size={16} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        </div>

      </div>
    </div>
  );
};

export default Categories;
