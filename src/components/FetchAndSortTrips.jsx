// src/utils/fetchAndSortTrips.js

import { config } from "../config.js";
import { parseShortMonthDate } from "../utils/dateUtils";

export async function fetchAndSortTrips() {
  const res = await fetch(config.tripDataUrl);
  const rawTrips = await res.json();

  const enrichedTrips = rawTrips.map((trip, tripIndex) => {
    const availableDepartures = trip.departures.filter(dep =>
      dep.categories.some(cat => cat.status === 'Available')
    );

    const earliestDepartureDate = availableDepartures
      .map(dep => parseShortMonthDate(dep.start_date))
      .filter(date => date !== null)
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
      return a.earliestDepartureDate - b.earliestDepartureDate;
    }
    return 0;
  });

  return enrichedTrips;
}
