import React from 'react';
import { Link } from "react-router-dom";
import { Search, Star, Users, Shield, Home as HomeIcon } from "lucide-react";

const Home = () => {
  return (
    <div className="min-h-screen bg-[#f6f8fa] flex flex-col">
      {/* Header */}
      <header className="w-full bg-[#003580] py-4 px-8 flex items-center justify-between sticky top-0 z-30 shadow-lg backdrop-blur-md bg-opacity-95">
        <div className="flex items-center gap-2">
          <HomeIcon className="h-8 w-8 text-white drop-shadow-lg" />
          <span className="text-2xl font-bold text-white tracking-wide">Homigo</span>
        </div>
        <nav className="flex gap-8 font-medium">
          <Link to="/listings" className="text-white hover:text-[#00bcd4] transition-colors duration-200">Listings</Link>
          <Link to="/register" className="text-white hover:text-[#00bcd4] transition-colors duration-200">Become a Host</Link>
          <Link to="/login" className="text-white hover:text-[#00bcd4] transition-colors duration-200">Login</Link>
        </nav>
      </header>

      {/* Hero Section */}
      <section className="relative flex flex-col items-center justify-center bg-gradient-to-br from-[#003580] to-[#0071c2] h-[500px] w-full overflow-hidden">
        <div className="relative z-20 w-full max-w-2xl mx-auto text-center px-4 flex flex-col items-center justify-center">
          <h1 className="text-4xl md:text-6xl font-extrabold text-white mb-3 drop-shadow-2xl">Find your perfect stay at Homigo</h1>
          <p className="text-lg md:text-xl text-blue-100 mb-8 font-medium">Discover unique accommodations around Nepal and beyond</p>

          {/* Search Bar */}
          <div className="flex flex-col md:flex-row items-center justify-center gap-2 bg-white/95 backdrop-blur-lg rounded-2xl shadow-2xl px-4 py-3 w-full max-w-2xl mx-auto">
            <input type="text" placeholder="Location" className="flex-1 px-4 py-2 rounded-md border focus:outline-none" />
            <input type="text" placeholder="Property Type" className="flex-1 px-4 py-2 rounded-md border focus:outline-none" />
            <input type="text" placeholder="Max Price (NRS)" className="flex-1 px-4 py-2 rounded-md border focus:outline-none" />
            <button className="bg-[#003580] text-white px-6 py-2 rounded-md font-semibold flex items-center gap-2 hover:bg-[#0071c2] transition-transform transform hover:scale-105 shadow-md">
              <Search className="h-5 w-5" />
              Search
            </button>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-gradient-to-b from-gray-50 to-white">
        <div className="max-w-6xl mx-auto px-4 grid grid-cols-1 md:grid-cols-3 gap-12">
          <div className="bg-white rounded-2xl shadow-lg p-10 flex flex-col items-center text-center border-t-4 border-[#003580]/40">
            <Star className="h-12 w-12 text-[#003580]" />
            <h3 className="text-xl font-bold mt-4 mb-2">Premium Quality</h3>
            <p className="text-gray-500">All our listings are verified and meet our high standards for quality and comfort.</p>
          </div>
          <div className="bg-white rounded-2xl shadow-lg p-10 flex flex-col items-center text-center border-t-4 border-[#003580]/40">
            <Users className="h-12 w-12 text-[#0071c2]" />
            <h3 className="text-xl font-bold mt-4 mb-2">Trusted Community</h3>
            <p className="text-gray-500">Join thousands of happy guests and hosts in our growing community.</p>
          </div>
          <div className="bg-white rounded-2xl shadow-lg p-10 flex flex-col items-center text-center border-t-4 border-[#003580]/40">
            <Shield className="h-12 w-12 text-[#00bcd4]" />
            <h3 className="text-xl font-bold mt-4 mb-2">Secure Booking</h3>
            <p className="text-gray-500">Your payments and personal information are protected with industry-leading security.</p>
          </div>
        </div>
      </section>

      {/* Featured Listings */}
      <section className="py-20 bg-gray-100">
        <div className="max-w-6xl mx-auto px-4">
          <div className="flex items-center justify-between mb-10">
            <h2 className="text-3xl font-extrabold text-gray-900">Featured Listings</h2>
            <Link to="/listings" className="text-[#003580] hover:text-[#0071c2] font-semibold">View All Listings →</Link>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <div className="bg-white rounded-xl shadow-md p-6">
              <h3 className="text-xl font-bold text-[#003580]">Cozy Apartment</h3>
              <p className="text-gray-600">Near city center</p>
              <span className="text-[#0071c2] font-semibold">NRS 2000</span>
            </div>
            <div className="bg-white rounded-xl shadow-md p-6">
              <h3 className="text-xl font-bold text-[#003580]">Modern Villa</h3>
              <p className="text-gray-600">With swimming pool</p>
              <span className="text-[#0071c2] font-semibold">NRS 5000</span>
            </div>
            <div className="bg-white rounded-xl shadow-md p-6">
              <h3 className="text-xl font-bold text-[#003580]">Mountain Retreat</h3>
              <p className="text-gray-600">Peaceful and quiet</p>
              <span className="text-[#0071c2] font-semibold">NRS 3500</span>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-gradient-to-br from-[#003580] to-[#0071c2] text-white py-20 relative overflow-hidden">
        <div className="max-w-6xl mx-auto px-4 text-center relative z-10">
          <h2 className="text-4xl font-extrabold mb-6">Ready to start your journey?</h2>
          <p className="text-lg mb-10 text-blue-100 font-medium">Join millions of travelers who trust Homigo for their perfect stay</p>
          <div className="flex flex-col sm:flex-row gap-6 justify-center">
            <Link to="/listings" className="bg-white text-[#003580] px-10 py-4 rounded-md font-semibold hover:bg-gray-100 transition-all duration-300 shadow-xl transform hover:scale-105">
              Find a Place
            </Link>
            <Link to="/register" className="bg-transparent border-2 border-white text-white px-10 py-4 rounded-md font-semibold hover:bg-white hover:text-[#003580] transition-all duration-300 transform hover:scale-105">
              Become a Host
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-[#003580] border-t py-10 mt-auto">
        <div className="max-w-6xl mx-auto px-4 flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <HomeIcon className="h-6 w-6 text-white drop-shadow-lg" />
            <span className="text-lg font-bold text-white tracking-wide">Homigo</span>
          </div>
          <nav className="flex gap-8 font-medium">
            <Link to="/listings" className="text-white text-sm hover:text-[#00bcd4] transition-colors duration-200">Listings</Link>
            <Link to="/register" className="text-white text-sm hover:text-[#00bcd4] transition-colors duration-200">Become a Host</Link>
            <Link to="/login" className="text-white text-sm hover:text-[#00bcd4] transition-colors duration-200">Login</Link>
          </nav>
          <span className="text-blue-200 text-xs">© {new Date().getFullYear()} Homigo. All rights reserved.</span>
        </div>
      </footer>
    </div>
  );
};

export default Home;

  useEffect(() => {
    const fetchFeaturedListings = async () => {
      try {
        const listings = await getListings();
        if (Array.isArray(listings)) {
          setFeaturedListings(listings.slice(0, 3));
        } else {
          console.error("Listings API did not return an array:", listings);
        }
      } catch (error) {
        console.error('Error fetching featured listings:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchFeaturedListings();
  }, []);

  return (
    <div className="min-h-screen bg-[#f6f8fa] flex flex-col">
      {/* Header */}
      <header className="w-full bg-[#003580] py-4 px-8 flex items-center justify-between sticky top-0 z-30 shadow-lg backdrop-blur-md bg-opacity-95">
        <Logo />
        <NavLinks linkClass="text-white hover:text-[#00bcd4] transition-colors duration-200" />
      </header>

      {/* Hero Section with 3D Globe */}
      <section className="relative flex flex-col items-center justify-center bg-gradient-to-br from-[#003580] to-[#0071c2] h-[500px] w-full overflow-hidden">
        {/* 3D Globe */}
        <div className="absolute inset-0 z-0">
          <FloatingSphere />
        </div>

        {/* Overlay */}
        <div className="absolute inset-0 bg-gradient-to-br from-[#003580]/90 to-[#0071c2]/80 z-10" />
        <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 1 }} className="relative z-20 w-full max-w-2xl mx-auto text-center px-4 flex flex-col items-center justify-center">
          <h1 className="text-4xl md:text-6xl font-extrabold text-white mb-3 drop-shadow-2xl">Find your perfect stay at Homigo</h1>
          <p className="text-lg md:text-xl text-blue-100 mb-8 font-medium">Discover unique accommodations around Nepal and beyond</p>
          {/* Search Bar */}
          <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} transition={{ duration: 0.8 }} className="flex flex-col md:flex-row items-center justify-center gap-2 bg-white/95 backdrop-blur-lg rounded-2xl shadow-2xl px-4 py-3 w-full max-w-2xl mx-auto">
            <input type="text" placeholder="Location" className="flex-1 px-4 py-2 rounded-md border focus:outline-none" />
            <input type="text" placeholder="Property Type" className="flex-1 px-4 py-2 rounded-md border focus:outline-none" />
            <input type="text" placeholder="Max Price (NRS)" className="flex-1 px-4 py-2 rounded-md border focus:outline-none" />
            <button className="bg-[#003580] text-white px-6 py-2 rounded-md font-semibold flex items-center gap-2 hover:bg-[#0071c2] transition-transform transform hover:scale-105 shadow-md">
              <Search className="h-5 w-5" />
              Search
            </button>
          </motion.div>
        </motion.div>
      </section>

      {/* Achievements/Stats Section */}
      <section className="w-full py-12 bg-white shadow-md relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-tr from-[#f6f8fa] via-white to-[#f6f8fa]" />
        <div className="max-w-6xl mx-auto flex flex-wrap justify-center gap-16 mt-2 relative z-10">
          {[
            { icon: <Trophy className="h-10 w-10 text-[#003580]" />, number: "2000+", label: "Bookings" },
            { icon: <Building2 className="h-10 w-10 text-[#003580]" />, number: "300+", label: "Listings" },
            { icon: <UserCheck className="h-10 w-10 text-[#003580]" />, number: "2000+", label: "Happy Users" },
          ].map((stat, i) => (
            <motion.div key={i} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.2, duration: 0.6 }} className="flex flex-col items-center bg-white p-6 rounded-xl shadow-md hover:shadow-xl transition-all duration-300">
              {stat.icon}
              <span className="text-2xl font-bold text-[#003580] mt-2">{stat.number}</span>
              <span className="text-gray-600">{stat.label}</span>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-gradient-to-b from-gray-50 to-white">
        <div className="max-w-6xl mx-auto px-4 grid grid-cols-1 md:grid-cols-3 gap-12">
          {[
            { icon: <Star className="h-12 w-12 text-[#003580]" />, title: "Premium Quality", desc: "All our listings are verified and meet our high standards for quality and comfort." },
            { icon: <Users className="h-12 w-12 text-[#0071c2]" />, title: "Trusted Community", desc: "Join thousands of happy guests and hosts in our growing community." },
            { icon: <Shield className="h-12 w-12 text-[#00bcd4]" />, title: "Secure Booking", desc: "Your payments and personal information are protected with industry-leading security." },
          ].map((f, i) => (
            <motion.div key={i} whileHover={{ scale: 1.05, rotate: [0, 2, -2, 0] }} transition={{ duration: 0.4 }} className="bg-white rounded-2xl shadow-lg p-10 flex flex-col items-center text-center border-t-4 border-[#003580]/40">
              {f.icon}
              <h3 className="text-xl font-bold mt-4 mb-2">{f.title}</h3>
              <p className="text-gray-500">{f.desc}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Featured Listings */}
      <section className="py-20 bg-gray-100">
        <div className="max-w-6xl mx-auto px-4">
          <div className="flex items-center justify-between mb-10">
            <h2 className="text-3xl font-extrabold text-gray-900">Featured Listings</h2>
            <Link to="/listings" className="text-[#003580] hover:text-[#0071c2] font-semibold">View All Listings →</Link>
          </div>
          {loading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {[1, 2, 3].map((i) => (
                <motion.div key={i} animate={{ opacity: [0.5, 1, 0.5] }} transition={{ repeat: Infinity, duration: 2 }} className="bg-gray-200 rounded-xl h-80"></motion.div>
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {featuredListings.map((listing) => (
                <motion.div key={listing.id || listing._id} whileHover={{ scale: 1.05, rotateY: 5 }} transition={{ type: "spring", stiffness: 200 }}>
                  <ListingCard listing={listing} />
                </motion.div>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-gradient-to-br from-[#003580] to-[#0071c2] text-white py-20 relative overflow-hidden">
        <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-10 animate-pulse" />
        <div className="max-w-6xl mx-auto px-4 text-center relative z-10">
          <h2 className="text-4xl font-extrabold mb-6">Ready to start your journey?</h2>
          <p className="text-lg mb-10 text-blue-100 font-medium">Join millions of travelers who trust Homigo for their perfect stay</p>
          <div className="flex flex-col sm:flex-row gap-6 justify-center">
            <Link to="/listings" className="bg-white text-[#003580] px-10 py-4 rounded-md font-semibold hover:bg-gray-100 transition-all duration-300 shadow-xl transform hover:scale-105">
              Find a Place
            </Link>
            <Link to="/register" className="bg-transparent border-2 border-white text-white px-10 py-4 rounded-md font-semibold hover:bg-white hover:text-[#003580] transition-all duration-300 transform hover:scale-105">
              Become a Host
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-[#003580] border-t py-10 mt-auto">
        <div className="max-w-6xl mx-auto px-4 flex flex-col md:flex-row items-center justify-between gap-4">
          <Logo size="h-6 w-6" textSize="text-lg" />
          <NavLinks linkClass="text-white text-sm hover:text-[#00bcd4] transition-colors duration-200" />
          <span className="text-blue-200 text-xs">© {new Date().getFullYear()} Homigo. All rights reserved.</span>
        </div>
      </footer>
    </div>
  );
};

export default Home;
