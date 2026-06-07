import bcrypt from 'bcryptjs';
import { User, Attorney, Consultation, Case } from '../types/models';

export let mockUsers: User[] = [];
export let mockAttorneys: Attorney[] = [];
export let mockConsultations: Consultation[] = [];
export let mockCases: Case[] = [];

let isInitialized = false;

export function initMockDb() {
  if (isInitialized) return;

  const saltRounds = 1; // Fast startup for mock db
  const adminPassword = bcrypt.hashSync('admin123', saltRounds);
  const attorneyPassword = bcrypt.hashSync('vance123', saltRounds);
  const clientPassword = bcrypt.hashSync('sterling123', saltRounds);

  mockUsers = [
    {
      id: 'usr-admin',
      email: 'admin@lawfirm.com',
      passwordHash: adminPassword,
      name: 'Aurelius Stone',
      role: 'admin',
      createdAt: new Date(),
      updatedAt: new Date(),
    },
    {
      id: 'usr-attorney',
      email: 'vance@lawfirm.com',
      passwordHash: attorneyPassword,
      name: 'Seraphina Vance',
      role: 'attorney',
      createdAt: new Date(),
      updatedAt: new Date(),
    },
    {
      id: 'usr-client',
      email: 'sterling@lawfirm.com',
      passwordHash: clientPassword,
      name: 'Julian Sterling',
      role: 'client',
      createdAt: new Date(),
      updatedAt: new Date(),
    },
  ];

  mockAttorneys = [
    {
      id: 'att-1',
      name: 'Seraphina Vance',
      title: 'Senior Partner, Corporate Mergers',
      specialties: ['Corporate M&A', 'Venture Capital', 'Cross-Border Transactions'],
      biography: 'Seraphina has over 15 years of experience advising Fortune 500 conglomerates, high-growth technology startups, and venture funds on structuring complex cross-border acquisitions and IPO readiness.',
      rating: 4.9,
      availability: ['Monday AM', 'Tuesday PM', 'Thursday AM'],
      imageUrl: '/assets/vance.png',
    },
    {
      id: 'att-2',
      name: 'Marcus Thorne',
      title: 'Partner, Intellectual Property & Tech Patents',
      specialties: ['Patent Strategy', 'Software Copyright', 'Trade Secrets Litigation'],
      biography: 'Marcus represents elite software institutions and AI labs. He handles complex software patent portfolios, open-source compliance frameworks, and trade secret protection systems.',
      rating: 4.8,
      availability: ['Wednesday AM', 'Thursday PM', 'Friday PM'],
      imageUrl: '/assets/thorne.png',
    },
    {
      id: 'att-3',
      name: 'Diana Sterling',
      title: 'Senior Associate, Estate Planning & Assets',
      specialties: ['High-Net-Worth Trust Structuring', 'Asset Protection', 'Offshore Compliance'],
      biography: 'Diana designs multi-generational wealth preservation strategies, private family trust frameworks, and offshore entity setups to shield clients from capital vulnerabilities.',
      rating: 5.0,
      availability: ['Tuesday AM', 'Wednesday PM', 'Friday AM'],
      imageUrl: '/assets/sterling.png',
    },
  ];

  mockCases = [
    {
      id: 'cas-1',
      clientId: 'usr-client',
      attorneyId: 'att-1',
      title: 'Project Zenith Merger Acquisition',
      status: 'active',
      fileNumber: 'LF-2026-8921',
      description: 'Lead representation on the $45 Million cash-and-stock consolidation transaction representing Zenith Inc.',
      updatedAt: new Date(),
    },
    {
      id: 'cas-2',
      clientId: 'usr-client',
      attorneyId: 'att-2',
      title: 'AlphaTech Cloud Patents Infringement Appeal',
      status: 'resolved',
      fileNumber: 'LF-2025-4410',
      description: 'Defended cloud infrastructure microservices patents against adversarial IP assertions. Reached complete summary dismissal.',
      updatedAt: new Date(),
    },
  ];

  mockConsultations = [
    {
      id: 'con-1',
      clientId: 'usr-client',
      attorneyId: 'att-1',
      datetime: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(), // Tomorrow
      topic: 'Pre-Audit Strategy Consultation',
      status: 'confirmed',
      notes: 'Review tax structural alignment before filing corporate consolidation assets.',
      createdAt: new Date(),
    },
  ];

  isInitialized = true;
}
