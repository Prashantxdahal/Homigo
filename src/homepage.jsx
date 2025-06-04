import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Search, MapPin } from "lucide-react";

const homes = [
  {
    id: 1,
    title: "Cozy Mountain Cabin",
    location: "Pokhara, Nepal",
    price: "$75/night",
    image: "https://source.unsplash.com/400x300/?cabin,mountain",
  },
  {
    id: 2,
    title: "Beachside Bungalow",
    location: "Goa, India",
    price: "$120/night",
    image: "https://source.unsplash.com/400x300/?beach,house",
  },
  {
    id: 3,
    title: "Urban Loft",
    location: "Kathmandu, Nepal",
    price: "$90/night",
    image: "https://source.unsplash.com/400x300/?apartment,city",
  },
];

export default function VacationRentalHome() {
  return (
    <div className="p-6 space-y-8">
      <header className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">StayEasy</h1>
        <Button variant="outline">Login</Button>
      </header>

      <div className="flex items-center space-x-4 bg-gray-100 p-4 rounded-xl">
        <MapPin className="text-gray-500" />
        <input
          type="text"
          placeholder="Search destinations..."
          className="flex-1 p-2 rounded-md border border-gray-300"
        />
        <Button>
          <Search className="mr-2" /> Search
        </Button>
      </div>

      <h2 className="text-2xl font-semibold">Top Picks for You</h2>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {homes.map((home) => (
          <Card key={home.id} className="overflow-hidden shadow-md">
            <img src={home.image} alt={home.title} className="h-48 w-full object-cover" />
            <CardContent className="p-4 space-y-2">
              <h3 className="text-xl font-semibold">{home.title}</h3>
              <p className="text-gray-600">{home.location}</p>
              <p className="text-primary font-bold">{home.price}</p>
              <Button variant="outline" className="w-full">Book Now</Button>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
