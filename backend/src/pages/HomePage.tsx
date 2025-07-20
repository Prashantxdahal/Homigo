import { useState } from 'react';
import Hero from '../components/Hero';
import CategoryFilter from '../components/CategoryFilter';
import PropertyCard from '../components/PropertyCard';
import { properties } from '../data/properties';

const HomePage = () => {
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  
  const filteredProperties = selectedCategory
    ? properties.filter(property => property.category === selectedCategory)
    : properties;
    
  return (
    <div>
      <Hero />
      
      <CategoryFilter onSelectCategory={setSelectedCategory} />
      
      <div className="container-custom py-8">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {filteredProperties.map((property) => (
            <PropertyCard
              key={property.id}
              id={property.id}
              title={property.title}
              location={property.location}
              price={property.price}
              rating={property.rating}
              reviewCount={property.reviewCount}
              images={property.images}
              distance={property.distance}
              dates={property.dates}
            />
          ))}
        </div>
        
        {filteredProperties.length === 0 && (
          <div className="text-center py-16">
            <h3 className="text-xl font-medium mb-2">No properties found</h3>
            <p className="text-gray-600">Try changing your search criteria</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default HomePage;