// Mock restaurant data structure
export const initialRestaurants = [
  {
    id: 1,
    name: "Bella Napoli",
    address: "123 Main St, New York, NY",
    cuisine: "Italian",
    location: {
      lat: 40.7580,
      lng: -73.9855
    },
    reviews: [
      {
        id: 1,
        author: "Sarah",
        rating: 5,
        text: "Amazing pizza! Best I've had in the city.",
        date: "2024-10-15"
      },
      {
        id: 2,
        author: "Mike",
        rating: 4,
        text: "Great atmosphere and friendly service.",
        date: "2024-10-10"
      }
    ]
  },
  {
    id: 2,
    name: "Sushi Palace",
    address: "456 Park Ave, New York, NY",
    cuisine: "Japanese",
    location: {
      lat: 40.7614,
      lng: -73.9776
    },
    reviews: [
      {
        id: 1,
        author: "Sarah",
        rating: 5,
        text: "Fresh fish, creative rolls. Highly recommend!",
        date: "2024-10-12"
      }
    ]
  }
];

// Calculate average rating for a restaurant
export const getAverageRating = (reviews) => {
  if (!reviews || reviews.length === 0) return 0;
  const sum = reviews.reduce((acc, review) => acc + review.rating, 0);
  return (sum / reviews.length).toFixed(1);
};
