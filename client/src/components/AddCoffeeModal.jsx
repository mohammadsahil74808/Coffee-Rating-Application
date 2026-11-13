import React, { useState } from 'react';
import { X, Plus, Sparkles, Image as ImageIcon } from 'lucide-react';
import { playSuccessSound } from '../utils/sound';

const IMAGE_PRESETS = [
  { label: 'Pour Over', url: 'https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?q=80&w=800&auto=format&fit=crop' },
  { label: 'Espresso Crema', url: 'https://images.unsplash.com/photo-1511920170033-f8396924c348?q=80&w=800&auto=format&fit=crop' },
  { label: 'Coffee Beans', url: 'https://images.unsplash.com/photo-1447933601403-0c6688de566e?q=80&w=800&auto=format&fit=crop' },
  { label: 'Latte Art Cup', url: 'https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?q=80&w=800&auto=format&fit=crop' },
  { label: 'Dark Roast Mug', url: 'https://images.unsplash.com/photo-1517256064527-09c73fc73e38?q=80&w=800&auto=format&fit=crop' }
];

export default function AddCoffeeModal({
  isOpen,
  onClose,
  onSubmit
}) {
  const [formData, setFormData] = useState({
    name: '',
    roaster: '',
    origin: '',
    roast_level: 'Medium',
    cupping_score: 90.0,
    acidity: 8,
    sweetness: 8,
    body: 7,
    aroma: 9,
    flavor_notes: '',
    process: 'Washed',
    altitude: '1,900m MASL',
    image_url: IMAGE_PRESETS[0].url,
    description: ''
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');

  if (!isOpen) return null;

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.name.trim() || !formData.roaster.trim() || !formData.origin.trim()) {
      setError('Please provide Coffee Name, Roaster, and Origin Country.');
      return;
    }

    setIsSubmitting(true);
    setError('');
    try {
      await onSubmit(formData);
      playSuccessSound();
      onClose();
    } catch (err) {
      setError(err.message || 'Failed to submit coffee to database.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
      <div className="relative w-full max-w-xl max-h-[90vh] overflow-y-auto rounded-3xl bg-[#18120e] border border-[#35251b] shadow-2xl shadow-black text-white p-6 sm:p-8">
        
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-5 right-5 p-2 rounded-full bg-[#241a14] hover:bg-[#35251b] text-[#a8988a] hover:text-white transition-all cursor-pointer"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Title */}
        <div className="mb-6">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#c8965a]/15 text-[#e8ba7a] border border-[#c8965a]/30 text-xs font-semibold mb-2">
            <Sparkles className="w-3.5 h-3.5 text-[#c8965a]" />
            <span>Database Insertion</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-white font-editorial tracking-tight">
            Submit New Specialty Coffee
          </h2>
          <p className="text-xs text-[#a8988a] mt-1">
            Add a new harvest or micro-lot to the live database for community rating.
          </p>
        </div>

        {error && (
          <div className="p-3 mb-5 rounded-xl bg-red-950/60 border border-red-700/50 text-xs text-red-300">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          
          {/* Name & Roaster */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-[#b8a798] mb-1">
                Coffee Lot / Name *
              </label>
              <input
                type="text"
                name="name"
                required
                value={formData.name}
                onChange={handleChange}
                placeholder="e.g. Rwanda Huye Mountain"
                className="w-full px-3.5 py-2.5 rounded-xl bg-[#201712] border border-[#35251b] focus:border-[#c8965a] text-sm text-white outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-[#b8a798] mb-1">
                Roastery / Brand *
              </label>
              <input
                type="text"
                name="roaster"
                required
                value={formData.roaster}
                onChange={handleChange}
                placeholder="e.g. Thousand Hills Roasters"
                className="w-full px-3.5 py-2.5 rounded-xl bg-[#201712] border border-[#35251b] focus:border-[#c8965a] text-sm text-white outline-none"
              />
            </div>
          </div>

          {/* Origin & Roast Level */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-[#b8a798] mb-1">
                Origin & Region *
              </label>
              <input
                type="text"
                name="origin"
                required
                value={formData.origin}
                onChange={handleChange}
                placeholder="e.g. Huye District, Rwanda"
                className="w-full px-3.5 py-2.5 rounded-xl bg-[#201712] border border-[#35251b] focus:border-[#c8965a] text-sm text-white outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-[#b8a798] mb-1">
                Roast Profile
              </label>
              <select
                name="roast_level"
                value={formData.roast_level}
                onChange={handleChange}
                className="w-full px-3.5 py-2.5 rounded-xl bg-[#201712] border border-[#35251b] focus:border-[#c8965a] text-sm text-white outline-none cursor-pointer"
              >
                <option value="Light">Light Roast (Bright & Floral)</option>
                <option value="Medium">Medium Roast (Balanced & Sweet)</option>
                <option value="Dark">Dark Roast (Bold & Smoky)</option>
              </select>
            </div>
          </div>

          {/* Cupping Score & Process */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div>
              <label className="block text-xs font-semibold text-[#b8a798] mb-1">
                Cupping Score (pts)
              </label>
              <input
                type="number"
                step="0.1"
                min="80"
                max="99"
                name="cupping_score"
                value={formData.cupping_score}
                onChange={handleChange}
                className="w-full px-3.5 py-2.5 rounded-xl bg-[#201712] border border-[#35251b] focus:border-[#c8965a] text-sm text-white outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-[#b8a798] mb-1">
                Processing Method
              </label>
              <select
                name="process"
                value={formData.process}
                onChange={handleChange}
                className="w-full px-3.5 py-2.5 rounded-xl bg-[#201712] border border-[#35251b] focus:border-[#c8965a] text-sm text-white outline-none cursor-pointer"
              >
                <option value="Washed">Washed (Clean)</option>
                <option value="Natural">Natural (Fruity)</option>
                <option value="Honey">Honey Process (Sweet)</option>
                <option value="Anaerobic">Anaerobic Ferment</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-[#b8a798] mb-1">
                Elevation (MASL)
              </label>
              <input
                type="text"
                name="altitude"
                value={formData.altitude}
                onChange={handleChange}
                placeholder="e.g. 2,100m MASL"
                className="w-full px-3.5 py-2.5 rounded-xl bg-[#201712] border border-[#35251b] focus:border-[#c8965a] text-sm text-white outline-none"
              />
            </div>
          </div>

          {/* Flavor Notes */}
          <div>
            <label className="block text-xs font-semibold text-[#b8a798] mb-1">
              Flavor Notes (comma-separated)
            </label>
            <input
              type="text"
              name="flavor_notes"
              value={formData.flavor_notes}
              onChange={handleChange}
              placeholder="e.g. Red Currant, Black Tea, Orange Zest, Raw Honey"
              className="w-full px-3.5 py-2.5 rounded-xl bg-[#201712] border border-[#35251b] focus:border-[#c8965a] text-sm text-white outline-none"
            />
          </div>

          {/* Description */}
          <div>
            <label className="block text-xs font-semibold text-[#b8a798] mb-1">
              Cupping Description
            </label>
            <textarea
              name="description"
              rows="2"
              value={formData.description}
              onChange={handleChange}
              placeholder="Short sensory description of the cup profile, terroir, and finish..."
              className="w-full px-3.5 py-2.5 rounded-xl bg-[#201712] border border-[#35251b] focus:border-[#c8965a] text-sm text-white outline-none resize-none"
            />
          </div>

          {/* Image Presets */}
          <div>
            <label className="block text-xs font-semibold text-[#b8a798] mb-1.5 flex items-center gap-1.5">
              <ImageIcon className="w-3.5 h-3.5 text-[#c8965a]" /> Select Cover Photography
            </label>
            <div className="grid grid-cols-5 gap-2">
              {IMAGE_PRESETS.map((preset, idx) => (
                <button
                  type="button"
                  key={idx}
                  onClick={() => setFormData(p => ({ ...p, image_url: preset.url }))}
                  className={`relative h-14 rounded-xl overflow-hidden border-2 transition-all cursor-pointer ${
                    formData.image_url === preset.url
                      ? 'border-[#c8965a] ring-2 ring-[#c8965a]/50 scale-105'
                      : 'border-[#35251b] opacity-60 hover:opacity-100'
                  }`}
                >
                  <img src={preset.url} alt={preset.label} className="w-full h-full object-cover" />
                  <span className="absolute bottom-0 inset-x-0 bg-black/70 text-[9px] text-center text-white py-0.5 truncate">
                    {preset.label}
                  </span>
                </button>
              ))}
            </div>
          </div>

          {/* Buttons */}
          <div className="pt-4 flex items-center justify-end gap-3 border-t border-[#2e2119]">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2.5 rounded-xl bg-[#201712] hover:bg-[#2b1f18] text-[#a8988a] text-sm font-semibold transition-all cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-[#c8965a] to-[#a8743a] hover:from-[#d8a66a] hover:to-[#b8844a] text-[#120e0b] font-bold text-sm shadow-lg shadow-[#c8965a]/30 active:scale-95 transition-all cursor-pointer"
            >
              {isSubmitting ? 'Inserting...' : 'Add to Database'}
            </button>
          </div>

        </form>

      </div>
    </div>
  );
}

