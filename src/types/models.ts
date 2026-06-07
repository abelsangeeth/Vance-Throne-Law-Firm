export interface User {
  id: string;
  email: string;
  passwordHash: string;
  name: string;
  role: 'admin' | 'attorney' | 'client';
  createdAt: Date;
  updatedAt: Date;
}

export interface Attorney {
  id: string;
  name: string;
  title: string;
  specialties: string[];
  biography: string;
  rating: number;
  availability: string[]; // e.g., ['Monday AM', 'Wednesday PM']
  imageUrl: string;
}

export interface Consultation {
  id: string;
  clientId: string;
  attorneyId: string;
  datetime: string; // ISO string
  topic: string;
  status: 'pending' | 'confirmed' | 'cancelled';
  notes?: string;
  createdAt: Date;
}

export interface Case {
  id: string;
  clientId: string;
  attorneyId: string;
  title: string;
  status: 'active' | 'resolved' | 'pending';
  fileNumber: string;
  description: string;
  updatedAt: Date;
}

export interface JWTPayload {
  id: string;
  email: string;
  role: 'admin' | 'attorney' | 'client';
}
