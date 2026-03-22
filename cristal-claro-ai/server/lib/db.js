/**
 * MongoDB when MONGODB_URI is set; otherwise JSON file fallback (dev-friendly).
 */
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import mongoose from 'mongoose';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const DATA_DIR = path.join(__dirname, '..', 'data');
const LEADS_FILE = path.join(DATA_DIR, 'leads.json');
const BOOKINGS_FILE = path.join(DATA_DIR, 'bookings.json');

function ensureDataDir() {
  if (!fs.existsSync(DATA_DIR)) {
    fs.mkdirSync(DATA_DIR, { recursive: true });
  }
}

function readJson(file, fallback) {
  ensureDataDir();
  try {
    if (!fs.existsSync(file)) return fallback;
    return JSON.parse(fs.readFileSync(file, 'utf8'));
  } catch {
    return fallback;
  }
}

function writeJson(file, data) {
  ensureDataDir();
  fs.writeFileSync(file, JSON.stringify(data, null, 2), 'utf8');
}

// —— Mongoose schemas (only used when connected) ——
const leadSchema = new mongoose.Schema(
  {
    name: String,
    phone: { type: String, required: true },
    email: String,
    windows: Number,
    propertyType: String,
    heightCategory: String,
    needsPole: Boolean,
    location: String,
    dateNeeded: String,
    priceEstimate: Number,
    priceBreakdown: String,
    status: { type: String, enum: ['new', 'contacted', 'booked'], default: 'new' },
    source: { type: String, default: 'chat' },
    createdAt: { type: Date, default: Date.now },
  },
  { collection: 'leads' }
);

const bookingSchema = new mongoose.Schema(
  {
    name: String,
    phone: { type: String, required: true },
    email: String,
    date: { type: String, required: true },
    time: String,
    notes: String,
    status: { type: String, enum: ['requested', 'confirmed', 'cancelled'], default: 'requested' },
    createdAt: { type: Date, default: Date.now },
  },
  { collection: 'bookings' }
);

let LeadModel = null;
let BookingModel = null;
let useMongo = false;

export async function connectDb() {
  const uri = process.env.MONGODB_URI;
  if (!uri) {
    console.log('[db] MONGODB_URI not set — using JSON file storage in ./data');
    return;
  }
  await mongoose.connect(uri);
  useMongo = true;
  LeadModel = mongoose.models.Lead || mongoose.model('Lead', leadSchema);
  BookingModel = mongoose.models.Booking || mongoose.model('Booking', bookingSchema);
  console.log('[db] Connected to MongoDB');
}

export function isMongo() {
  return useMongo;
}

// —— Leads ——
export async function createLead(doc) {
  if (useMongo && LeadModel) {
    const row = await LeadModel.create(doc);
    return row.toObject();
  }
  const leads = readJson(LEADS_FILE, []);
  const id = `lead_${Date.now()}_${Math.random().toString(36).slice(2, 9)}`;
  const row = { _id: id, ...doc, createdAt: new Date().toISOString() };
  leads.unshift(row);
  writeJson(LEADS_FILE, leads);
  return row;
}

export async function listLeads() {
  if (useMongo && LeadModel) {
    return LeadModel.find().sort({ createdAt: -1 }).lean();
  }
  return readJson(LEADS_FILE, []);
}

export async function updateLeadStatus(id, status) {
  if (useMongo && LeadModel) {
    return LeadModel.findByIdAndUpdate(id, { status }, { new: true }).lean();
  }
  const leads = readJson(LEADS_FILE, []);
  const i = leads.findIndex((l) => l._id === id);
  if (i === -1) return null;
  leads[i].status = status;
  writeJson(LEADS_FILE, leads);
  return leads[i];
}

// —— Bookings ——
export async function createBooking(doc) {
  if (useMongo && BookingModel) {
    const row = await BookingModel.create(doc);
    return row.toObject();
  }
  const list = readJson(BOOKINGS_FILE, []);
  const id = `book_${Date.now()}_${Math.random().toString(36).slice(2, 9)}`;
  const row = { _id: id, ...doc, createdAt: new Date().toISOString() };
  list.unshift(row);
  writeJson(BOOKINGS_FILE, list);
  return row;
}

export async function listBookings() {
  if (useMongo && BookingModel) {
    return BookingModel.find().sort({ createdAt: -1 }).lean();
  }
  return readJson(BOOKINGS_FILE, []);
}

export async function updateBookingStatus(id, status) {
  if (useMongo && BookingModel) {
    return BookingModel.findByIdAndUpdate(id, { status }, { new: true }).lean();
  }
  const list = readJson(BOOKINGS_FILE, []);
  const i = list.findIndex((b) => b._id === id);
  if (i === -1) return null;
  list[i].status = status;
  writeJson(BOOKINGS_FILE, list);
  return list[i];
}

/** Leads grouped by calendar day (YYYY-MM-DD) for simple analytics */
export async function leadsPerDay() {
  const leads = await listLeads();
  const map = {};
  for (const l of leads) {
    const d = new Date(l.createdAt);
    const key = d.toISOString().slice(0, 10);
    map[key] = (map[key] || 0) + 1;
  }
  return Object.entries(map)
    .sort(([a], [b]) => b.localeCompare(a))
    .map(([date, count]) => ({ date, count }));
}
