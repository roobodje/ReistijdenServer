import fetch from 'node-fetch';
import AdmZip from 'adm-zip';
import fs from 'fs/promises';
import path from 'path';

const GTFS_URL = 'http://gtfs.openov.nl/gtfs-rt/NL-OPENOV-20250714-gtfs.zip';
const GTFS_DIR = './gtfs-data';

export async function downloadAndExtractGtfs() {
  try {
    console.log('Downloading GTFS data...');
    const response = await fetch(GTFS_URL);
    if (!response.ok) {
      throw new Error(`Failed to download GTFS: ${response.statusText}`);
    }

    const buffer = await response.arrayBuffer();
    const zip = new AdmZip(Buffer.from(buffer));

    // Ensure gtfs-data directory exists
    await fs.mkdir(GTFS_DIR, { recursive: true });

    console.log('Extracting GTFS data...');
    zip.extractAllTo(GTFS_DIR, true);
    console.log('GTFS data extracted successfully');
  } catch (error) {
    console.error('Error downloading/extracting GTFS:', error);
    throw error;
  }
} 
