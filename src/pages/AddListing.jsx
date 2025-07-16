import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { listingsApi } from '../api/backendApi.jsx';
import { MapPin, DollarSign, Home, FileText, Image, Plus, X, Upload, Eye } from 'lucide-react';

const AddListing = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { id } = useParams(); // Get listing ID from URL for edit mode
  const isEditMode = Boolean(id);
  const [loading, setLoading] = useState(false);
  const [loadingListing, setLoadingListing] = useState(isEditMode);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    price: '',
    location: '',
    images: [{ file: null, preview: '', url: '' }],
    amenities: [''],
  });

  // Load existing listing data for edit mode
  useEffect(() => {
    if (isEditMode && id) {
      loadListingData();
    }
  }, [id, isEditMode]);

  const loadListingData = async () => {
    try {
      setLoadingListing(true);
      const listing = await listingsApi.getListing(id);
      
      // Check if user owns this listing
      if (listing.host_id !== parseInt(user.id)) {
        alert('You can only edit your own listings');
        navigate('/my-listings');
        return;
      }

      setFormData({
        title: listing.title || '',
        description: listing.description || '',
        price: listing.price?.toString() || '',
        location: listing.location || '',
        images: listing.images?.length > 0 
          ? listing.images.map(url => ({ file: null, preview: '', url }))
          : [{ file: null, preview: '', url: '' }],
        amenities: listing.amenities?.length > 0 ? listing.amenities : [''],
      });
    } catch (error) {
      console.error('Error loading listing:', error);
      alert('Error loading listing data');
      navigate('/my-listings');
    } finally {
      setLoadingListing(false);
    }
  };

  // Convert file to base64 for preview
  const convertToBase64 = (file) => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result);
      reader.onerror = error => reject(error);
    });
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleImageFileChange = async (index, file) => {
    if (!file) return;
    
    try {
      const preview = await convertToBase64(file);
      const newImages = [...formData.images];
      newImages[index] = { file, preview, url: '' };
      setFormData(prev => ({ ...prev, images: newImages }));
    } catch (error) {
      console.error('Error converting file to base64:', error);
      alert('Error processing image file');
    }
  };

  const addImageField = () => {
    setFormData(prev => ({ 
      ...prev, 
      images: [...prev.images, { file: null, preview: '', url: '' }]
    }));
  };

  const removeImageField = (index) => {
    if (formData.images.length > 1) {
      const newImages = formData.images.filter((_, i) => i !== index);
      setFormData(prev => ({ ...prev, images: newImages }));
    }
  };

  const handleAmenityChange = (index, value) => {
    const newAmenities = [...formData.amenities];
    newAmenities[index] = value;
    setFormData(prev => ({ ...prev, amenities: newAmenities }));
  };

  const addAmenityField = () => {
    setFormData(prev => ({ ...prev, amenities: [...prev.amenities, ''] }));
  };

  const removeAmenityField = (index) => {
    if (formData.amenities.length > 1) {
      const newAmenities = formData.amenities.filter((_, i) => i !== index);
      setFormData(prev => ({ ...prev, amenities: newAmenities }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!user) return;

    // Validate form
    const validImages = formData.images.filter(img => img.file !== null || img.url.trim() !== '');
    const validAmenities = formData.amenities.filter(amenity => amenity.trim() !== '');

    if (validImages.length === 0) {
      alert('Please upload at least one image');
      return;
    }

    if (validAmenities.length === 0) {
      alert('Please add at least one amenity');
      return;
    }

    setLoading(true);

    try {
      // Convert images to URLs (for now we'll use the preview data URLs)
      // In a real app, you'd upload files to a server and get URLs back
      const imageUrls = validImages.map(img => 
        img.file ? img.preview : img.url
      );

      // Ensure we have a valid user
      if (!user || !user.id) {
        throw new Error('User not authenticated');
      }

      const listingData = {
        title: formData.title,
        description: formData.description,
        price: parseInt(formData.price),
        location: formData.location,
        images: imageUrls,
        amenities: validAmenities,
        hostId: user.id,
        hostName: user.name,
        ...(isEditMode ? {} : { createdAt: new Date().toISOString() })
      };

      console.log(`${isEditMode ? 'Updating' : 'Creating'} listing with data:`, listingData);
      
      let response;
      if (isEditMode) {
        response = await listingsApi.updateListing(id, listingData);
        alert('Listing updated successfully!');
      } else {
        response = await listingsApi.addListing(listingData);
        alert('Listing created successfully!');
      }

      navigate('/my-listings');
    } catch (error) {
      console.error(`Error ${isEditMode ? 'updating' : 'creating'} listing:`, error);
      let errorMessage = `Failed to ${isEditMode ? 'update' : 'create'} listing. `;
      if (error.message.includes('User not authenticated')) {
        errorMessage += 'Please ensure you are logged in.';
      } else if (error.response) {
        errorMessage += error.response.data?.message || 'Please try again.';
      } else {
        errorMessage += 'Please check your connection and try again.';
      }
      alert(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  if (loadingListing) {
    return (
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <p className="text-gray-600">Loading listing data...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">
            {isEditMode ? 'Edit Listing' : 'Add New Listing'}
          </h1>
          <p className="text-gray-600 mt-2">
            {isEditMode 
              ? 'Update your property listing details' 
              : 'Create a new property listing for guests to discover'
            }
          </p>
        </div>

        <div className="bg-white rounded-lg shadow-md p-6">
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Title */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <Home className="inline h-4 w-4 mr-1" />
                Property Title
              </label>
              <input
                type="text"
                name="title"
                required
                value={formData.title}
                onChange={handleInputChange}
                placeholder="Enter a catchy title for your property"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#003580] focus:border-transparent"
              />
            </div>

            {/* Description */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <FileText className="inline h-4 w-4 mr-1" />
                Description
              </label>
              <textarea
                name="description"
                required
                rows={4}
                value={formData.description}
                onChange={handleInputChange}
                placeholder="Describe your property, its features, and what makes it special"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#003580] focus:border-transparent"
              />
            </div>

            {/* Price and Location */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  <DollarSign className="inline h-4 w-4 mr-1" />
                  Price per Night ($)
                </label>
                <input
                  type="number"
                  name="price"
                  required
                  min="1"
                  value={formData.price}
                  onChange={handleInputChange}
                  placeholder="Enter price per night"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#003580] focus:border-transparent"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  <MapPin className="inline h-4 w-4 mr-1" />
                  Location
                </label>
                <input
                  type="text"
                  name="location"
                  required
                  value={formData.location}
                  onChange={handleInputChange}
                  placeholder="City, State/Country"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#003580] focus:border-transparent"
                />
              </div>
            </div>

            {/* Images */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <Image className="inline h-4 w-4 mr-1" />
                Property Images
              </label>
              <div className="space-y-4">
                {formData.images.map((image, index) => (
                  <div key={index} className="border border-gray-300 rounded-lg p-4 bg-gray-50">
                    <div className="space-y-3">
                      {/* File Upload */}
                      <div>
                        <label className="block text-sm font-medium text-gray-600 mb-2">
                          Upload Image File
                        </label>
                        <div className="flex items-center justify-center w-full">
                          <label className="flex flex-col items-center justify-center w-full h-32 border-2 border-gray-300 border-dashed rounded-lg cursor-pointer bg-gray-50 hover:bg-gray-100">
                            <div className="flex flex-col items-center justify-center pt-5 pb-6">
                              <Upload className="w-8 h-8 mb-4 text-gray-500" />
                              <p className="mb-2 text-sm text-gray-500">
                                <span className="font-semibold">Click to upload</span> or drag and drop
                              </p>
                              <p className="text-xs text-gray-500">PNG, JPG, JPEG (MAX. 10MB)</p>
                            </div>
                            <input
                              type="file"
                              className="hidden"
                              accept="image/*"
                              onChange={(e) => {
                                const file = e.target.files?.[0];
                                if (file) {
                                  handleImageFileChange(index, file);
                                }
                              }}
                            />
                          </label>
                        </div>
                      </div>

                      {/* Image Preview */}
                      {image.preview && (
                        <div className="mt-3">
                          <label className="block text-sm font-medium text-gray-600 mb-2">
                            Image Preview
                          </label>
                          <div className="relative">
                            <img
                              src={image.preview}
                              alt={`Preview ${index + 1}`}
                              className="w-full h-48 object-cover rounded-lg border border-gray-300"
                            />
                            <div className="absolute top-2 right-2 flex space-x-2">
                              <button
                                type="button"
                                onClick={() => {
                                  // Open image in new tab for full view
                                  window.open(image.preview, '_blank');
                                }}
                                className="p-2 bg-white rounded-full shadow-md hover:bg-gray-100"
                              >
                                <Eye className="h-4 w-4 text-gray-600" />
                              </button>
                            </div>
                          </div>
                        </div>
                      )}

                      {/* Remove Button */}
                      {formData.images.length > 1 && (
                        <div className="flex justify-end">
                          <button
                            type="button"
                            onClick={() => removeImageField(index)}
                            className="flex items-center px-3 py-2 text-red-600 hover:text-red-800 hover:bg-red-50 rounded-md transition-colors"
                          >
                            <X className="h-4 w-4 mr-1" />
                            Remove Image
                          </button>
                        </div>
                      )}
                    </div>
                  </div>
                ))}
                
                <button
                  type="button"
                  onClick={addImageField}
                  className="flex items-center justify-center w-full p-4 border-2 border-dashed border-gray-300 rounded-lg text-[#003580] hover:text-[#0071c2] hover:border-[#003580] transition-colors"
                >
                  <Plus className="h-5 w-5 mr-2" />
                  Add Another Image
                </button>
              </div>
            </div>

            {/* Amenities */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Amenities
              </label>
              <div className="space-y-3">
                {formData.amenities.map((amenity, index) => (
                  <div key={index} className="flex items-center space-x-2">
                    <input
                      type="text"
                      value={amenity}
                      onChange={(e) => handleAmenityChange(index, e.target.value)}
                      placeholder="e.g., WiFi, Kitchen, Pool, Parking"
                      className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#003580] focus:border-transparent"
                    />
                    {formData.amenities.length > 1 && (
                      <button
                        type="button"
                        onClick={() => removeAmenityField(index)}
                        className="p-2 text-red-600 hover:text-red-800"
                      >
                        <X className="h-4 w-4" />
                      </button>
                    )}
                  </div>
                ))}
                <button
                  type="button"
                  onClick={addAmenityField}
                  className="flex items-center text-[#003580] hover:text-[#0071c2] font-medium"
                >
                  <Plus className="h-4 w-4 mr-1" />
                  Add Another Amenity
                </button>
              </div>
            </div>

            {/* Submit Button */}
            <div className="flex items-center justify-between pt-6 border-t border-gray-200">
              <button
                type="button"
                onClick={() => navigate('/my-listings')}
                className="px-6 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 transition-colors duration-200"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={loading}
                className="px-6 py-2 bg-[#003580] text-white rounded-md font-semibold hover:bg-[#0071c2] transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? 'Creating...' : 'Create Listing'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default AddListing;
