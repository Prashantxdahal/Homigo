import { useState } from 'react';
import { 
  Palmtree, Home, Mountain, Building, Waves, Sailboat, 
  Tent, Trees, Warehouse, Castle, Snowflake, TowerControl 
} from 'lucide-react';

interface Category {
  id: string;
  name: string;
  icon: React.ReactNode;
}

const categories: Category[] = [
  { id: 'beachfront', name: 'Beachfront', icon: <Waves size={24} /> },
  { id: 'cabins', name: 'Cabins', icon: <Home size={24} /> },
  { id: 'tropical', name: 'Tropical', icon: <Palmtree size={24} /> },
  { id: 'mountains', name: 'Mountains', icon: <Mountain size={24} /> },
  { id: 'apartments', name: 'Apartments', icon: <Building size={24} /> },
  { id: 'boats', name: 'Boats', icon: <Sailboat size={24} /> },
  { id: 'camping', name: 'Camping', icon: <Tent size={24} /> },
  { id: 'countryside', name: 'Countryside', icon: <Trees size={24} /> },
  { id: 'mansions', name: 'Mansions', icon: <Warehouse size={24} /> },
  { id: 'castles', name: 'Castles', icon: <Castle size={24} /> },
  { id: 'skiing', name: 'Skiing', icon: <Snowflake size={24} /> },
  { id: 'towers', name: 'Towers', icon: <TowerControl size={24} /> },
];

interface CategoryFilterProps {
  onSelectCategory: (categoryId: string | null) => void;
}

const CategoryFilter = ({ onSelectCategory }: CategoryFilterProps) => {
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  
  const handleCategoryClick = (categoryId: string) => {
    if (selectedCategory === categoryId) {
      setSelectedCategory(null);
      onSelectCategory(null);
    } else {
      setSelectedCategory(categoryId);
      onSelectCategory(categoryId);
    }
  };
  
  return (
    <div className="border-b border-gray-200 py-4">
      <div className="container-custom">
        <div className="flex items-center overflow-x-auto pb-2 hide-scrollbar gap-8">
          {categories.map((category) => (
            <button
              key={category.id}
              onClick={() => handleCategoryClick(category.id)}
              className={`flex flex-col items-center min-w-[64px] transition-opacity ${
                selectedCategory && selectedCategory !== category.id
                  ? 'opacity-60'
                  : 'opacity-100'
              }`}
            >
              <div className={`p-2 rounded-full ${
                selectedCategory === category.id
                  ? 'text-primary-500'
                  : 'text-gray-500'
              }`}>
                {category.icon}
              </div>
              <span className={`text-xs mt-1 whitespace-nowrap ${
                selectedCategory === category.id
                  ? 'text-primary-500 font-medium'
                  : 'text-gray-600'
              }`}>
                {category.name}
              </span>
              {selectedCategory === category.id && (
                <div className="w-8 h-0.5 bg-primary-500 mt-1 rounded-full" />
              )}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default CategoryFilter;