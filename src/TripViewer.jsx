import { useState, useEffect } from "react";

export default function TripViewer() {
  const [trips, setTrips] = useState([]);

  useEffect(() => {
    fetch("https://mytripdata8675309.s3.us-west-2.amazonaws.com/trip_list.json")
      .then((res) => res.json())
      .then((data) => setTrips(data))
      .catch(err => console.error("Error loading trips:", err));
  }, []);

  return (
    <div className="max-w-4xl mx-auto p-4">
      <h1 className="text-blue-500 text-2xl font-bold">Trips</h1>
      {trips.length === 0 ? (
        <p>Loading trips...</p>
      ) : (
        trips.map((trip, index) => (
          <div key={index} className="p-4 border-b">
            <h2 className="text-lg font-semibold">{trip.trip_name}</h2>
          </div>
        ))
      )}
    </div>
  );
}
