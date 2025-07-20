import { Search } from 'lucide-react';

const Hero = () => {
  return (
    <div className="relative h-[70vh] min-h-[500px] bg-gradient-to-r from-gray-900 to-gray-800">
      {/* Background image with overlay */}
      <div 
        className="absolute inset-0 bg-cover bg-center" 
        style={{ 
          backgroundImage: "url('https://images.pexels.com/photos/2351649/pexels-photo-2351649.jpeg?auto=compress&cs=tinysrgb&w=1800')",
          backgroundPosition: "center 20%"
        }}
      >
        <div className="absolute inset-0 bg-black/40"></div>
      </div>
      
      {/* Hero content */}
      <div className="relative h-full container-custom flex flex-col items-center justify-center text-center text-white z-10">
        <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-4 max-w-4xl">
          Find your perfect getaway
        </h1>
        <p className="text-xl md:text-2xl mb-8 max-w-2xl">
          Discover unique stays around the world with HomigoSpot
        </p>
        
        {/* Search bar */}
        <div className="bg-white rounded-full p-2 shadow-lg w-full max-w-4xl text-left">
          <div className="grid grid-cols-1 md:grid-cols-3 divide-y md:divide-y-0 md:divide-x divide-gray-200">
            <div className="p-3 md:p-4">
              <div className="font-medium text-gray-800">Where</div>
              <input 
                type="text" 
                placeholder="Search destinations" 
                className="w-full mt-1 bg-transparent border-none p-0 focus:ring-0 text-gray-600 placeholder-gray-400" 
              />
            </div>
            
            <div className="p-3 md:p-4">
              <div className="font-medium text-gray-800">When</div>
              <div className="mt-1 text-gray-600">Add dates</div>
            </div>
            
            <div className="relative p-3 md:p-4 flex items-center">
              <div>
                <div className="font-medium text-gray-800">Who</div>
                <div className="mt-1 text-gray-600">Add guests</div>
              </div>
              
              <button className="absolute right-4 bg-primary-500 text-white p-3 rounded-full ml-auto hover:bg-primary-600 transition-colors">
                <Search size={20} />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Hero;