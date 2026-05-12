import React from 'react';
import { useState } from 'react';
import { Upload, X, Image as ImageIcon, Package, DollarSign, Tag, FileText } from 'lucide-react';

export function CreateListingPage() {
  const [dragActive, setDragActive] = useState(false);
  const [uploadedImages, setUploadedImages] = useState<string[]>([]);
  const [formData, setFormData] = useState({
    title: '',
    price: '',
    category: '',
    condition: '',
    description: '',
  });

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFiles(e.dataTransfer.files);
    }
  };

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      handleFiles(e.target.files);
    }
  };

  const handleFiles = (files: FileList) => {
    const newImages = Array.from(files).map(file => URL.createObjectURL(file));
    setUploadedImages(prev => [...prev, ...newImages]);
  };

  const removeImage = (index: number) => {
    setUploadedImages(prev => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.warn('Publishing listing:', { ...formData, images: uploadedImages });
    // Handle form submission
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-[#0A2647] mb-2">Create New Listing</h1>
          <p className="text-gray-600">List your item and reach verified students across your campus</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Image Upload Section */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <label className="block text-gray-900 font-medium mb-4">Product Images</label>

            {/* Drag and Drop Area */}
            <div
              onDragEnter={handleDrag}
              onDragLeave={handleDrag}
              onDragOver={handleDrag}
              onDrop={handleDrop}
              className={`border-2 border-dashed rounded-xl p-8 text-center transition-colors ${
                dragActive ? 'border-[#FF6B35] bg-orange-50' : 'border-gray-300 bg-gray-50 hover:border-[#FF6B35] hover:bg-orange-50/50'
              }`}
            >
              <div className="flex flex-col items-center justify-center gap-4">
                <div className="w-16 h-16 bg-[#FF6B35]/10 rounded-full flex items-center justify-center">
                  <Upload className="w-8 h-8 text-[#FF6B35]" />
                </div>
                <div>
                  <p className="text-gray-900 font-medium mb-1">Drag & drop your images here</p>
                  <p className="text-sm text-gray-500">or click to browse</p>
                </div>
                <input type="file" id="fileInput" multiple accept="image/*" onChange={handleFileInput} className="hidden" />
                <label
                  htmlFor="fileInput"
                  className="px-6 py-2 bg-[#0A2647] hover:bg-[#144272] text-white rounded-lg font-medium cursor-pointer transition-colors"
                >
                  Select Files
                </label>
                <p className="text-xs text-gray-500">PNG, JPG up to 10MB each (max 5 images)</p>
              </div>
            </div>

            {/* Uploaded Images Preview */}
            {uploadedImages.length > 0 && (
              <div className="mt-6 grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-4">
                {uploadedImages.map((image, index) => (
                  <div key={index} className="relative group">
                    <img src={image} alt={`Upload ${index + 1}`} className="w-full h-32 object-cover rounded-lg border border-gray-200" />
                    <button
                      type="button"
                      onClick={() => removeImage(index)}
                      className="absolute -top-2 -right-2 w-6 h-6 bg-red-500 hover:bg-red-600 text-white rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                      <X className="w-4 h-4" />
                    </button>
                    {index === 0 && <div className="absolute top-2 left-2 bg-[#FF6B35] text-white text-xs px-2 py-1 rounded">Primary</div>}
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Product Details Section */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 space-y-5">
            <h2 className="text-lg font-medium text-[#0A2647] mb-4">Product Details</h2>

            {/* Product Title */}
            <div>
              <label className="block text-gray-900 font-medium mb-2">
                <div className="flex items-center gap-2">
                  <Package className="w-4 h-4 text-[#FF6B35]" />
                  Product Title
                </div>
              </label>
              <input
                type="text"
                value={formData.title}
                onChange={e => setFormData({ ...formData, title: e.target.value })}
                placeholder="e.g., Calculus Textbook 8th Edition"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#FF6B35] focus:border-transparent"
                required
              />
            </div>

            {/* Price and Category Row */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              {/* Price */}
              <div>
                <label className="block text-gray-900 font-medium mb-2">
                  <div className="flex items-center gap-2">
                    <DollarSign className="w-4 h-4 text-[#FF6B35]" />
                    Price (USD)
                  </div>
                </label>
                <input
                  type="number"
                  step="0.01"
                  value={formData.price}
                  onChange={e => setFormData({ ...formData, price: e.target.value })}
                  placeholder="0.00"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#FF6B35] focus:border-transparent"
                  required
                />
              </div>

              {/* Category */}
              <div>
                <label className="block text-gray-900 font-medium mb-2">
                  <div className="flex items-center gap-2">
                    <ImageIcon className="w-4 h-4 text-[#FF6B35]" />
                    Category
                  </div>
                </label>
                <select
                  value={formData.category}
                  onChange={e => setFormData({ ...formData, category: e.target.value })}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#FF6B35] focus:border-transparent"
                  required
                >
                  <option value="">Select a category</option>
                  <option value="textbooks">Textbooks</option>
                  <option value="electronics">Electronics</option>
                  <option value="dorm">Dorm Essentials</option>
                  <option value="vehicles">Vehicles</option>
                  <option value="furniture">Furniture</option>
                  <option value="clothing">Clothing</option>
                  <option value="other">Other</option>
                </select>
              </div>
            </div>

            {/* Condition */}
            <div>
              <label className="block text-gray-900 font-medium mb-2">
                <div className="flex items-center gap-2">
                  <Tag className="w-4 h-4 text-[#FF6B35]" />
                  Condition
                </div>
              </label>
              <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
                {['Brand New', 'Like New', 'Excellent', 'Good', 'Fair'].map(condition => (
                  <button
                    key={condition}
                    type="button"
                    onClick={() => setFormData({ ...formData, condition })}
                    className={`px-4 py-3 rounded-lg font-medium text-sm transition-all ${
                      formData.condition === condition ? 'bg-[#FF6B35] text-white shadow-md' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    }`}
                  >
                    {condition}
                  </button>
                ))}
              </div>
            </div>

            {/* Description */}
            <div>
              <label className="block text-gray-900 font-medium mb-2">
                <div className="flex items-center gap-2">
                  <FileText className="w-4 h-4 text-[#FF6B35]" />
                  Description
                </div>
              </label>
              <textarea
                value={formData.description}
                onChange={e => setFormData({ ...formData, description: e.target.value })}
                placeholder="Provide detailed information about your item (condition, features, reason for selling, etc.)"
                rows={6}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#FF6B35] focus:border-transparent resize-none"
                required
              />
              <p className="mt-2 text-sm text-gray-500">{formData.description.length}/500 characters</p>
            </div>
          </div>

          {/* Publish Button */}
          <div className="flex items-center justify-between bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <div className="flex items-start gap-3">
              <div className="w-10 h-10 bg-blue-50 rounded-lg flex items-center justify-center flex-shrink-0">
                <Package className="w-5 h-5 text-[#0A2647]" />
              </div>
              <div>
                <h3 className="font-medium text-gray-900 mb-1">Ready to publish?</h3>
                <p className="text-sm text-gray-600">Your listing will be visible to all verified students on your campus</p>
              </div>
            </div>
            <button
              type="submit"
              className="px-8 py-3 bg-[#FF6B35] hover:bg-[#FF5722] text-white rounded-lg font-medium transition-colors shadow-md whitespace-nowrap"
            >
              Publish Listing
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
