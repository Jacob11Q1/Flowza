'use client';

import { useEffect, useState, useCallback } from 'react';
import {
  Plus,
  Search,
  Pencil,
  Trash2,
  FileText,
  Calendar,
  DollarSign,
  CheckCircle2,
} from 'lucide-react';
import { Modal, ConfirmModal } from '@/components/ui/Modal';
import { InvoiceForm } from '@/components/forms/InvoiceForm';
import { InvoiceStatusBadge } from '@/components/ui/Badge';
import { EmptyState } from '@/components/ui/EmptyState';
import { LoadingSpinner } from '@/components/ui/LoadingSpinner';
import { Button } from '@/components/ui/Button';
import { Select } from '@/components/ui/Input';
import api from '@/lib/api';
import { formatCurrency, formatDate, isOverdue } from '@/lib/utils';
import type { Invoice, InvoiceFormData, Client, InvoiceStatus } from '@/types';

export default function InvoicesPage() {
  const [invoices, setInvoices] = useState<Invoice[]>([]);
  const [clients, setClients] = useState<Client[]>([]);
  const [filtered, setFiltered] = useState<Invoice[]>([]);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState<'' | InvoiceStatus>('');
  const [isLoading, setIsLoading] = useState(true);

  const [addOpen, setAddOpen] = useState(false);
  const [editInvoice, setEditInvoice] = useState<Invoice | null>(null);
  const [deleteInvoice, setDeleteInvoice] = useState<Invoice | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const fetchData = useCallback(async () => {
    try {
      const [invRes, clientRes] = await Promise.all([
        api.get<{ data: Invoice[] }>('/invoices'),
        api.get<{ data: Client[] }>('/clients'),
      ]);
      setInvoices(invRes.data.data || []);
      setClients(clientRes.data.data || []);
    } catch (err) {
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => { fetchData(); }, [fetchData]);

  useEffect(() => {
    let list = invoices;
    if (statusFilter) list = list.filter((i) => i.status === statusFilter);
    if (search) {
      const q = search.toLowerCase();
      list = list.filter(
        (i) =>
          i.invoiceNumber.toLowerCase().includes(q) ||
          (typeof i.client === 'object' && i.client.name.toLowerCase().includes(q)) ||
          (typeof i.project === 'object' && (i.project as { name: string }).name.toLowerCase().includes(q))
      );
    }
    setFiltered(list);
  }, [invoices, search, statusFilter]);

  // Summary stats
  const totalPaid = invoices
    .filter((i) => i.status === 'paid')
    .reduce((s, i) => s + i.amount, 0);
  const totalUnpaid = invoices
    .filter((i) => i.status !== 'paid')
    .reduce((s, i) => s + i.amount, 0);

  const handleAdd = async (data: InvoiceFormData) => {
    await api.post('/invoices', data);
    setAddOpen(false);
    fetchData();
  };

  const handleEdit = async (data: InvoiceFormData) => {
    await api.put(`/invoices/${editInvoice!._id}`, data);
    setEditInvoice(null);
    fetchData();
  };

  const handleDelete = async () => {
    if (!deleteInvoice) return;
    setIsDeleting(true);
    try {
      await api.delete(`/invoices/${deleteInvoice._id}`);
      setDeleteInvoice(null);
      fetchData();
    } finally {
      setIsDeleting(false);
    }
  };

  // Quick mark as paid
  const markAsPaid = async (invoice: Invoice) => {
    await api.put(`/invoices/${invoice._id}`, { status: 'paid' });
    fetchData();
  };

  return (
    <div className="space-y-6 animate-fade-in">
      {/* ── Header ───────────────────────────────────────── */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-navy-50">Invoices</h2>
          <p className="text-sm text-navy-400 mt-0.5">
            {invoices.length} invoice{invoices.length !== 1 ? 's' : ''} total
          </p>
        </div>
        <Button leftIcon={<Plus size={16} />} onClick={() => setAddOpen(true)}>
          Create Invoice
        </Button>
      </div>

      {/* ── Summary cards ────────────────────────────────── */}
      {invoices.length > 0 && (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="card p-4 flex items-center gap-4">
            <div className="p-2.5 rounded-lg bg-secondary/10">
              <DollarSign className="h-5 w-5 text-secondary" />
            </div>
            <div>
              <p className="text-xl font-bold text-navy-50">{formatCurrency(totalPaid)}</p>
              <p className="text-xs text-navy-500">Total collected</p>
            </div>
          </div>
          <div className="card p-4 flex items-center gap-4">
            <div className="p-2.5 rounded-lg bg-amber-500/10">
              <FileText className="h-5 w-5 text-amber-400" />
            </div>
            <div>
              <p className="text-xl font-bold text-navy-50">{formatCurrency(totalUnpaid)}</p>
              <p className="text-xs text-navy-500">Outstanding</p>
            </div>
          </div>
        </div>
      )}

      {/* ── Filters ──────────────────────────────────────── */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-navy-500 pointer-events-none" />
          <input
            type="text"
            placeholder="Search invoices, clients, or projects..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="input-base pl-9"
          />
        </div>
        <Select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value as '' | InvoiceStatus)}
          options={[
            { value: '', label: 'All statuses' },
            { value: 'unpaid', label: 'Unpaid' },
            { value: 'paid', label: 'Paid' },
            { value: 'overdue', label: 'Overdue' },
          ]}
          className="sm:w-44"
        />
      </div>

      {/* ── Content ──────────────────────────────────────── */}
      {isLoading ? (
        <div className="flex justify-center py-16">
          <LoadingSpinner size="lg" />
        </div>
      ) : filtered.length === 0 ? (
        <EmptyState
          icon={FileText}
          title={search || statusFilter ? 'No invoices found' : 'No invoices yet'}
          description={
            search || statusFilter
              ? 'Try adjusting your filters'
              : 'Create your first invoice to start tracking payments'
          }
          action={
            !search && !statusFilter ? (
              <Button leftIcon={<Plus size={16} />} onClick={() => setAddOpen(true)}>
                Create Invoice
              </Button>
            ) : undefined
          }
        />
      ) : (
        <div className="space-y-3">
          {filtered.map((invoice) => {
            const client = typeof invoice.client === 'object' ? invoice.client : null;
            const project = typeof invoice.project === 'object' ? invoice.project as { _id: string; name: string } : null;
            const overdue = invoice.status === 'unpaid' && isOverdue(invoice.dueDate);

            return (
              <div
                key={invoice._id}
                className={`card-hover p-5 group ${overdue ? 'border-amber-500/30' : ''}`}
              >
                <div className="flex flex-col sm:flex-row sm:items-center gap-4">
                  {/* Invoice number + icon */}
                  <div className="h-10 w-10 rounded-lg bg-navy-700 flex items-center justify-center flex-shrink-0">
                    <FileText className="h-4 w-4 text-navy-400" />
                  </div>

                  {/* Info */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-3 flex-wrap">
                      <span className="text-sm font-mono font-semibold text-navy-100">
                        {invoice.invoiceNumber}
                      </span>
                      <InvoiceStatusBadge status={overdue ? 'overdue' : invoice.status} />
                      {overdue && (
                        <span className="text-xs text-amber-400">Overdue!</span>
                      )}
                    </div>
                    <div className="flex items-center gap-3 mt-0.5">
                      {client && (
                        <p className="text-xs text-navy-500">{client.name}</p>
                      )}
                      {project && (
                        <p className="text-xs text-navy-600">· {project.name}</p>
                      )}
                    </div>
                  </div>

                  {/* Amount + date */}
                  <div className="flex items-center gap-5 text-xs text-navy-500 flex-shrink-0">
                    <span className="text-base font-bold text-navy-100">
                      {formatCurrency(invoice.amount)}
                    </span>
                    <span className="flex items-center gap-1">
                      <Calendar size={12} />
                      Due {formatDate(invoice.dueDate)}
                    </span>
                  </div>

                  {/* Actions */}
                  <div className="flex gap-1 sm:opacity-0 sm:group-hover:opacity-100 transition-opacity">
                    {invoice.status !== 'paid' && (
                      <button
                        onClick={() => markAsPaid(invoice)}
                        title="Mark as paid"
                        className="p-1.5 rounded-lg text-navy-500 hover:text-secondary hover:bg-secondary/10 transition-colors"
                      >
                        <CheckCircle2 size={14} />
                      </button>
                    )}
                    <button
                      onClick={() => setEditInvoice(invoice)}
                      className="p-1.5 rounded-lg text-navy-500 hover:text-primary-400 hover:bg-primary/10 transition-colors"
                    >
                      <Pencil size={14} />
                    </button>
                    <button
                      onClick={() => setDeleteInvoice(invoice)}
                      className="p-1.5 rounded-lg text-navy-500 hover:text-red-400 hover:bg-red-500/10 transition-colors"
                    >
                      <Trash2 size={14} />
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* ── Modals ───────────────────────────────────────── */}
      <Modal isOpen={addOpen} onClose={() => setAddOpen(false)} title="Create Invoice" size="lg">
        <InvoiceForm clients={clients} onSubmit={handleAdd} onCancel={() => setAddOpen(false)} />
      </Modal>

      <Modal
        isOpen={!!editInvoice}
        onClose={() => setEditInvoice(null)}
        title="Edit Invoice"
        size="lg"
      >
        {editInvoice && (
          <InvoiceForm
            initial={editInvoice}
            clients={clients}
            onSubmit={handleEdit}
            onCancel={() => setEditInvoice(null)}
          />
        )}
      </Modal>

      <ConfirmModal
        isOpen={!!deleteInvoice}
        onClose={() => setDeleteInvoice(null)}
        onConfirm={handleDelete}
        title="Delete Invoice"
        description={`Delete invoice ${deleteInvoice?.invoiceNumber}? This action cannot be undone.`}
        isLoading={isDeleting}
      />
    </div>
  );
}
