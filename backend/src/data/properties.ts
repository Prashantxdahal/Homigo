export interface Property {
  id: string;
  title: string;
  location: string;
  price: number;
  rating: number;
  reviewCount: number;
  images: string[];
  distance?: string;
  dates?: string;
  category: string;
}

export const properties: Property[] = [
  {
    id: '1',
    title: 'Luxury Beach Villa',
    location: 'Malibu, California',
    price: 350,
    rating: 4.98,
    reviewCount: 124,
    category: 'beachfront',
    distance: '20 miles away',
    dates: 'Nov 12-18',
    images: [
      'https://images.pexels.com/photos/1396122/pexels-photo-1396122.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1',
      'https://images.pexels.com/photos/4577703/pexels-photo-4577703.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1',
      'https://images.pexels.com/photos/2507010/pexels-photo-2507010.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1'
    ]
  },
  {
    id: '2',
    title: 'Mountain Retreat',
    location: 'Aspen, Colorado',
    price: 275,
    rating: 4.85,
    reviewCount: 92,
    category: 'mountains',
    distance: '35 miles away',
    dates: 'Dec 10-15',
    images: [
      'https://images.pexels.com/photos/2351649/pexels-photo-2351649.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1',
      'https://images.pexels.com/photos/2440024/pexels-photo-2440024.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1',
      'https://images.pexels.com/photos/4947397/pexels-photo-4947397.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1'
    ]
  },
  {
    id: '3',
    title: 'Downtown Loft',
    location: 'New York City, New York',
    price: 200,
    rating: 4.75,
    reviewCount: 156,
    category: 'apartments',
    distance: '5 miles away',
    dates: 'Jan 5-10',
    images: [
      'https://images.pexels.com/photos/1571460/pexels-photo-1571460.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1',
      'https://images.pexels.com/photos/1571468/pexels-photo-1571468.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1',
      'https://images.pexels.com/photos/1571463/pexels-photo-1571463.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1'
    ]
  },
  {
    id: '4',
    title: 'Lakefront Cabin',
    location: 'Lake Tahoe, Nevada',
    price: 180,
    rating: 4.9,
    reviewCount: 78,
    category: 'cabins',
    distance: '15 miles away',
    dates: 'Feb 2-8',
    images: [
      'https://images.pexels.com/photos/147411/italy-mountains-dawn-daybreak-147411.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1',
      'https://images.pexels.com/photos/928237/pexels-photo-928237.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1',
      'https://images.pexels.com/photos/1973293/pexels-photo-1973293.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1'
    ]
  },
  {
    id: '5',
    title: 'Tropical Paradise',
    location: 'Maui, Hawaii',
    price: 420,
    rating: 4.95,
    reviewCount: 112,
    category: 'tropical',
    distance: '40 miles away',
    dates: 'Mar 15-22',
    images: [
      'https://images.pexels.com/photos/338504/pexels-photo-338504.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1',
      'https://images.pexels.com/photos/221457/pexels-photo-221457.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1',
      'https://images.pexels.com/photos/1450353/pexels-photo-1450353.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1'
    ]
  },
  {
    id: '6',
    title: 'Historic Townhouse',
    location: 'Charleston, South Carolina',
    price: 195,
    rating: 4.8,
    reviewCount: 87,
    category: 'mansions',
    distance: '25 miles away',
    dates: 'Apr 8-14',
    images: [
      'https://images.pexels.com/photos/2581922/pexels-photo-2581922.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1',
      'https://images.pexels.com/photos/534151/pexels-photo-534151.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1',
      'https://images.pexels.com/photos/1643383/pexels-photo-1643383.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1'
    ]
  },
  {
    id: '7',
    title: 'Desert Oasis',
    location: 'Scottsdale, Arizona',
    price: 230,
    rating: 4.82,
    reviewCount: 65,
    category: 'countryside',
    distance: '30 miles away',
    dates: 'May 20-26',
    images: [
      'https://images.pexels.com/photos/347141/pexels-photo-347141.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1',
      'https://images.pexels.com/photos/1268871/pexels-photo-1268871.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1',
      'https://images.pexels.com/photos/633269/pexels-photo-633269.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1'
    ]
  },
  {
    id: '8',
    title: 'Countryside Farmhouse',
    location: 'Tuscany, Italy',
    price: 315,
    rating: 4.97,
    reviewCount: 104,
    category: 'countryside',
    distance: '45 miles away',
    dates: 'Jun 12-19',
    images: [
      'https://images.pexels.com/photos/2261165/pexels-photo-2261165.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1',
      'https://images.pexels.com/photos/632522/pexels-photo-632522.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1',
      'https://images.pexels.com/photos/33109/fall-autumn-red-season.jpg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1'
    ]
  }
];