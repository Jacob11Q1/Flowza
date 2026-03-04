// ─── Auth ─────────────────────────────────────────────────────────────────────
export interface User {
  id: string;
  name: string;
  email: string;
}

export interface AuthState {
  user: User | null;
  token: string | null;
  isLoading: boolean;
}

// ─── Client ───────────────────────────────────────────────────────────────────
export interface Client {
  _id: string;
  name: string;
  email: string;
  phone?: string;
  company?: string;
  notes?: string;
  createdAt: string;
  updatedAt: string;
}

export type ClientFormData = Omit<Client, '_id' | 'createdAt' | 'updatedAt'>;

// ─── Project ──────────────────────────────────────────────────────────────────
export type ProjectStatus = 'active' | 'completed' | 'on_hold';

export interface Project {
  _id: string;
  client: Client | string;
  name: string;
  description?: string;
  status: ProjectStatus;
  deadline?: string;
  budget?: number;
  createdAt: string;
  updatedAt: string;
}

export type ProjectFormData = {
  client: string;
  name: string;
  description?: string;
  status: ProjectStatus;
  deadline?: string;
  budget?: number;
};

// ─── Invoice ──────────────────────────────────────────────────────────────────
export type InvoiceStatus = 'paid' | 'unpaid' | 'overdue';

export interface Invoice {
  _id: string;
  client: Client | string;
  project: Project | string;
  invoiceNumber: string;
  amount: number;
  status: InvoiceStatus;
  dueDate: string;
  notes?: string;
  createdAt: string;
  updatedAt: string;
}

export type InvoiceFormData = {
  client: string;
  project: string;
  amount: number;
  status: InvoiceStatus;
  dueDate: string;
  notes?: string;
};

// ─── Dashboard ────────────────────────────────────────────────────────────────
export interface DashboardStats {
  totalClients: number;
  activeProjects: number;
  pendingInvoices: number;
  totalRevenue: number;
  pendingRevenue: number;
}

export interface DashboardNotification {
  id: string;
  type: 'overdue_invoice';
  message: string;
  invoiceNumber: string;
  amount: number;
  dueDate: string;
  client: Client | string;
  project: Project | string;
}

export interface DashboardData {
  stats: DashboardStats;
  recentClients: Client[];
  recentProjects: Project[];
  notifications: DashboardNotification[];
}

// ─── API ──────────────────────────────────────────────────────────────────────
export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  message?: string;
  count?: number;
}
