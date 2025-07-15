import express from 'express';
import { downloadAndExtractGtfs } from './gtfs-download.js';
import { loadGtfsData } from './utils/parseCsv.js';

const app = express();
const port = process.env.PORT || 3000;

// Store GTFS data in memory
let gtfsData = null;

// Initialize GTFS data
async function initializeGtfsData() {
  try {
    await downloadAndExtractGtfs();
    gtfsData = await loadGtfsData();
    console.log('GTFS data loaded successfully');
  } catch (error) {
    console.error('Failed to initialize GTFS data:', error);
    process.exit(1);
  }
}

// API Endpoints
app.get('/haltes', (req, res) => {
  if (!gtfsData) {
    return res.status(503).json({ error: 'GTFS data not yet loaded' });
  }
  res.json(gtfsData.stops);
});

app.get('/vertrektijden', (req, res) => {
  if (!gtfsData) {
    return res.status(503).json({ error: 'GTFS data not yet loaded' });
  }

  const halteId = req.query.halte_id;
  if (!halteId) {
    return res.status(400).json({ error: 'halte_id parameter is required' });
  }

  // Filter stop_times for the given stop_id
  const stopTimes = gtfsData.stopTimes
    .filter(st => st.stop_id === halteId)
    .map(st => {
      // Find corresponding trip
      const trip = gtfsData.trips.find(t => t.trip_id === st.trip_id);
      return {
        trip_id: st.trip_id,
        vertrek_tijd: st.departure_time,
        route_id: trip ? trip.route_id : null
      };
    });

  res.json(stopTimes);
});

// Start server
app.listen(port, async () => {
  console.log(`Server starting on port ${port}`);
  await initializeGtfsData();
  console.log(`Server running on port ${port}`);
}); 