import csv from 'csv-parser';
import fs from 'fs';
import path from 'path';

export function parseCsvFile(filePath) {
  return new Promise((resolve, reject) => {
    const results = [];

    fs.createReadStream(filePath)
      .pipe(csv())
      .on('data', (data) => results.push(data))
      .on('end', () => resolve(results))
      .on('error', (error) => reject(error));
  });
}

export async function loadGtfsData() {
  const gtfsDir = './gtfs-data';
  
  try {
    const stops = await parseCsvFile(path.join(gtfsDir, 'stops.txt'));
    const stopTimes = await parseCsvFile(path.join(gtfsDir, 'stop_times.txt'));
    const trips = await parseCsvFile(path.join(gtfsDir, 'trips.txt'));

    return {
      stops,
      stopTimes,
      trips
    };
  } catch (error) {
    console.error('Error loading GTFS data:', error);
    throw error;
  }
} 
