import { useState, useEffect } from "react";

export default function TripViewer() {
  const [trips, setTrips] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const TRIP_JSON_URL = "https://mytripdata8675309.s3.us-west-2.amazonaws.com/trip_list.json";

  console.log("🚀 Component Rendered - useEffect should run");

  useEffect(() => {
    console.log("🔄 Inside useEffect - Fetching data from:", TRIP_JSON_URL);

    const fetchTrips = async () => {
      try {
        console.log("📡 Sending Fetch Request...");
        const response = await fetch(TRIP_JSON_URL);

        console.log("✅ Fetch Response Received:", response);

        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }

        const data = await response.json();
        console.log("✅ Fetch Success! JSON Data:", data);
        setTrips(data);
      } catch (err) {
        console.error("❌ Fetch Error:", err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchTrips();
  }, []);

  if (loading) return <p className="text-center text-gray-500">Loading trips...</p>;
  if (error) return <p className="text-center text-red-500">Error: {error}</p>;

  return (
    <div className="max-w-4xl mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Available Trips</h1>
      {trips.length === 0 ? (
        <p className="text-center text-gray-500">No trips available.</p>
      ) : (
        <div className="space-y-4">
          {trips.map((trip, index) => (
            <details key={index} className="border p-4 rounded-lg">
              <summary className="cursor-pointer text-lg font-semibold">
                {trip.trip_name}
              </summary>
              <div className="mt-2">
                <h3 className="font-semibold">Departure Dates:</h3>
                <ul className="list-disc list-inside">
                  {trip.departures.map((departure, depIndex) => (
                    <li key={depIndex}>
                      {departure.start_date} - {departure.end_date} ({departure.ship})
                    </li>
                  ))}
                </ul>
              </div>
            </details>
          ))}
        </div>
      )}
    </div>
  );
}
