import fs from 'fs';
import path from 'path';

export type Status = 'OPERATIONAL' | 'DEGRADED_PERFORMANCE' | 'PARTIAL_OUTAGE' | 'MAJOR_OUTAGE' | 'MAINTENANCE';
export type IncidentStatus = 'INVESTIGATING' | 'IDENTIFIED' | 'MONITORING' | 'RESOLVED';
export type Impact = 'NONE' | 'MINOR' | 'MAJOR' | 'CRITICAL';

export interface Service {
  id: string;
  name: string;
  description?: string;
  status: Status;
  createdAt: string;
  updatedAt: string;
}

export interface Incident {
  id: string;
  title: string;
  description: string;
  status: IncidentStatus;
  impact: Impact;
  createdAt: string;
  updatedAt: string;
  resolvedAt?: string;
  serviceId: string;
}

export interface IncidentUpdate {
  id: string;
  message: string;
  status: IncidentStatus;
  createdAt: string;
  incidentId: string;
}

export interface StatusHistory {
  id: string;
  status: Status;
  createdAt: string;
  serviceId: string;
}

interface DB {
  services: Service[];
  incidents: Incident[];
  incidentUpdates: IncidentUpdate[];
  statusHistory: StatusHistory[];
}

const DB_PATH = path.join(process.cwd(), 'data', 'db.json');

// Ensure data directory exists
if (!fs.existsSync(path.dirname(DB_PATH))) {
  fs.mkdirSync(path.dirname(DB_PATH), { recursive: true });
}

// Initialize empty database if it doesn't exist
if (!fs.existsSync(DB_PATH)) {
  fs.writeFileSync(DB_PATH, JSON.stringify({
    services: [],
    incidents: [],
    incidentUpdates: [],
    statusHistory: []
  }, null, 2));
}

function readDB(): DB {
  return JSON.parse(fs.readFileSync(DB_PATH, 'utf-8'));
}

function writeDB(db: DB) {
  fs.writeFileSync(DB_PATH, JSON.stringify(db, null, 2));
}

export function generateId(): string {
  return Math.random().toString(36).substring(2) + Date.now().toString(36);
}

// Services
export async function findManyServices() {
  const db = readDB();
  return db.services;
}

export async function createService(data: Omit<Service, 'id' | 'createdAt' | 'updatedAt'>) {
  const db = readDB();
  const service: Service = {
    id: generateId(),
    ...data,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  };
  db.services.push(service);
  writeDB(db);
  return service;
}

export async function updateService(id: string, data: Partial<Service>) {
  const db = readDB();
  const index = db.services.findIndex(s => s.id === id);
  if (index === -1) throw new Error('Service not found');
  
  db.services[index] = {
    ...db.services[index],
    ...data,
    updatedAt: new Date().toISOString()
  };
  writeDB(db);
  return db.services[index];
}

// Incidents
export async function findManyIncidents() {
  const db = readDB();
  return db.incidents;
}

export async function createIncident(data: Omit<Incident, 'id' | 'createdAt' | 'updatedAt'>) {
  const db = readDB();
  const incident: Incident = {
    id: generateId(),
    ...data,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  };
  db.incidents.push(incident);
  writeDB(db);
  return incident;
}

// Status History
export async function createStatusHistory(data: Omit<StatusHistory, 'id' | 'createdAt'>) {
  const db = readDB();
  const statusHistory: StatusHistory = {
    id: generateId(),
    ...data,
    createdAt: new Date().toISOString()
  };
  db.statusHistory.push(statusHistory);
  writeDB(db);
  return statusHistory;
} 