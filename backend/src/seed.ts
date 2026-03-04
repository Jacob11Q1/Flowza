/**
 * Seed script — populates the DB with a demo user + sample data
 * Usage: npm run seed
 */
import 'dotenv/config';
import mongoose from 'mongoose';
import connectDB from './config/db';
import User from './models/User';
import Client from './models/Client';
import Project from './models/Project';
import Invoice from './models/Invoice';

const seed = async () => {
  await connectDB();

  console.log('🌱 Seeding database...');

  // Wipe existing data
  await Promise.all([
    User.deleteMany({}),
    Client.deleteMany({}),
    Project.deleteMany({}),
    Invoice.deleteMany({}),
  ]);

  // Create demo user
  const user = await User.create({
    name: 'Alex Johnson',
    email: 'demo@flowza.app',
    password: 'password123',
  });

  console.log('✅ Created user:', user.email);

  // Create clients
  const clients = await Client.insertMany([
    {
      user: user._id,
      name: 'Sarah Mitchell',
      email: 'sarah@techcorp.io',
      phone: '+1 (555) 234-5678',
      company: 'TechCorp Inc.',
      notes: 'Prefers communication via email. Budget-conscious but pays on time.',
    },
    {
      user: user._id,
      name: 'James Rivera',
      email: 'james@rivadesign.com',
      phone: '+1 (555) 345-6789',
      company: 'Riva Design Studio',
      notes: 'Needs weekly progress updates. High-value long-term client.',
    },
    {
      user: user._id,
      name: 'Emily Chen',
      email: 'emily@bloom.co',
      phone: '+1 (555) 456-7890',
      company: 'Bloom Co.',
      notes: 'Fast decision-maker. Usually approves designs on first pass.',
    },
    {
      user: user._id,
      name: 'Marcus Thompson',
      email: 'marcus@nexgen.dev',
      phone: '+1 (555) 567-8901',
      company: 'NexGen Dev',
      notes: 'Technical background. Likes detailed documentation.',
    },
  ]);

  console.log('✅ Created', clients.length, 'clients');

  // Create projects
  const pastDate = (days: number) => {
    const d = new Date();
    d.setDate(d.getDate() - days);
    return d;
  };
  const futureDate = (days: number) => {
    const d = new Date();
    d.setDate(d.getDate() + days);
    return d;
  };

  const projects = await Project.insertMany([
    {
      user: user._id,
      client: clients[0]._id,
      name: 'TechCorp Website Redesign',
      description: 'Complete overhaul of the corporate website with new branding.',
      status: 'active',
      deadline: futureDate(30),
      budget: 8500,
    },
    {
      user: user._id,
      client: clients[1]._id,
      name: 'Brand Identity System',
      description: 'Logo, typography, color palette, and brand guidelines.',
      status: 'completed',
      deadline: pastDate(10),
      budget: 4200,
    },
    {
      user: user._id,
      client: clients[2]._id,
      name: 'E-Commerce Platform',
      description: 'Custom Shopify store with bespoke product configurator.',
      status: 'active',
      deadline: futureDate(60),
      budget: 12000,
    },
    {
      user: user._id,
      client: clients[3]._id,
      name: 'Mobile App MVP',
      description: 'React Native app for inventory management.',
      status: 'on_hold',
      deadline: futureDate(90),
      budget: 18000,
    },
    {
      user: user._id,
      client: clients[0]._id,
      name: 'SEO & Analytics Setup',
      description: 'Google Analytics 4, Search Console, and technical SEO audit.',
      status: 'completed',
      deadline: pastDate(20),
      budget: 1800,
    },
  ]);

  console.log('✅ Created', projects.length, 'projects');

  // Create invoices
  await Invoice.insertMany([
    {
      user: user._id,
      client: clients[0]._id,
      project: projects[0]._id,
      amount: 4250,
      status: 'paid',
      dueDate: pastDate(15),
      notes: 'Deposit — 50% upfront',
    },
    {
      user: user._id,
      client: clients[1]._id,
      project: projects[1]._id,
      amount: 4200,
      status: 'paid',
      dueDate: pastDate(5),
      notes: 'Final payment',
    },
    {
      user: user._id,
      client: clients[2]._id,
      project: projects[2]._id,
      amount: 6000,
      status: 'unpaid',
      dueDate: futureDate(14),
      notes: 'Milestone 1 — design phase',
    },
    {
      user: user._id,
      client: clients[3]._id,
      project: projects[3]._id,
      amount: 9000,
      status: 'unpaid',
      dueDate: pastDate(7), // Overdue!
      notes: 'Project kickoff deposit',
    },
    {
      user: user._id,
      client: clients[0]._id,
      project: projects[4]._id,
      amount: 1800,
      status: 'unpaid',
      dueDate: pastDate(3), // Overdue!
      notes: 'SEO audit complete',
    },
  ]);

  console.log('✅ Created 5 invoices');
  console.log('\n🎉 Seed complete!');
  console.log('   Login with: demo@flowza.app / password123\n');

  await mongoose.connection.close();
};

seed().catch((err) => {
  console.error('Seed failed:', err);
  process.exit(1);
});
