// src/utils/fetchAndSortTrips.js

export async function fetchAndSortTrips() {
    const res = await fetch('https://da389rkfiajdk.cloudfront.net/trip_list.json');
    const rawTrips = await res.json();
  
    const enrichedTrips = rawTrips.map((trip, tripIndex) => {
      const availableDepartures = trip.departures.filter(dep =>
        dep.categories.some(cat => cat.status === 'Available')
      );
  
      const earliestDepartureDate = availableDepartures
        .map(dep => new Date(dep.start_date))
        .sort((a, b) => a - b)[0];
  
      return {
        ...trip,
        tripIndex,
        availableDepartureCount: availableDepartures.length,
        earliestDepartureDate,
      };
    }).sort((a, b) => {
      const aHasDepartures = a.availableDepartureCount > 0;
      const bHasDepartures = b.availableDepartureCount > 0;
  
      if (aHasDepartures !== bHasDepartures) {
        return aHasDepartures ? -1 : 1;
      }
  
      if (a.earliestDepartureDate && b.earliestDepartureDate) {
        return new Date(a.earliestDepartureDate) - new Date(b.earliestDepartureDate);
      }
      return 0;
    });
  
    return enrichedTrips;
  }
  