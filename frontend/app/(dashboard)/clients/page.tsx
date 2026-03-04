'use client';

import { useEffect, useState, useCallback } from 'react';
import { Plus, Search, Pencil, Trash2, Users, Mail, Phone, Building2 } from 'lucide-react';
import { Modal, ConfirmModal } from '@/components/ui/Modal';
import { ClientForm } from '@/components/forms/ClientForm';
import { EmptyState } from '@/components/ui/EmptyState';
import { LoadingSpinner } from '@/components/ui/LoadingSpinner';
import { Button } from '@/components/ui/Button';
import api from '@/lib/api';
import { getInitials, timeAgo } from '@/lib/utils';
import type { Client, ClientFormData } from '@/types';

export default function ClientsPage() {
  const [clients, setClients] = useState<Client[]>([]);
  const [filtered, setFiltered] = useState<Client[]>([]);
  const [search, setSearch] = useState('');
  const [isLoading, setIsLoading] = useState(true);

  // Modal state
  const [addOpen, setAddOpen] = useState(false);
  const [editClient, setEditClient] = useState<Client | null>(null);
  const [deleteClient, setDeleteClient] = useState<Client | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const fetchClients = useCallback(async () => {
    try {
      const res = await api.get<{ data: Client[] }>('/clients');
      setClients(res.data.data || []);
    } catch (err) {
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => { fetchClients(); }, [fetchClients]);

  // Filter on search
  useEffect(() => {
    const q = search.toLowerCase();
    setFiltered(
      clients.filter(
        (c) =>
          c.name.toLowerCase().includes(q) ||
          c.email.toLowerCase().includes(q) ||
          (c.company || '').toLowerCase().includes(q)
      )
    );
  }, [clients, search]);

  const handleAdd = async (data: ClientFormData) => {
    await api.post('/clients', data);
    setAddOpen(false);
    fetchClients();
  };

  const handleEdit = async (data: ClientFormData) => {
    await api.put(`/clients/${editClient!._id}`, data);
    setEditClient(null);
    fetchClients();
  };

  const handleDelete = async () => {
    if (!deleteClient) return;
    setIsDeleting(true);
    try {
      await api.delete(`/clients/${deleteClient._id}`);
      setDeleteClient(null);
      fetchClients();
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <div className="space-y-6 animate-fade-in">
      {/* ── Header ───────────────────────────────────────── */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-navy-50">Clients</h2>
          <p className="text-sm text-navy-400 mt-0.5">
            {clients.length} client{clients.length !== 1 ? 's' : ''} total
          </p>
        </div>
        <Button leftIcon={<Plus size={16} />} onClick={() => setAddOpen(true)}>
          Add Client
        </Button>
      </div>

      {/* ── Search ───────────────────────────────────────── */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-navy-500 pointer-events-none" />
        <input
          type="text"
          placeholder="Search clients..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="input-base pl-9"
        />
      </div>

      {/* ── Content ──────────────────────────────────────── */}
      {isLoading ? (
        <div className="flex justify-center py-16">
          <LoadingSpinner size="lg" />
        </div>
      ) : filtered.length === 0 ? (
        <EmptyState
          icon={Users}
          title={search ? 'No clients found' : 'No clients yet'}
          description={
            search
              ? 'Try a different search term'
              : 'Add your first client to start managing your business'
          }
          action={
            !search ? (
              <Button leftIcon={<Plus size={16} />} onClick={() => setAddOpen(true)}>
                Add Client
              </Button>
            ) : undefined
          }
        />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
          {filtered.map((client) => (
            <div key={client._id} className="card-hover p-5 group">
              {/* Avatar + name */}
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                    <span className="text-sm font-bold text-primary-300">
                      {getInitials(client.name)}
                    </span>
                  </div>
                  <div>
                    <h3 className="text-sm font-semibold text-navy-100">{client.name}</h3>
                    {client.company && (
                      <p className="text-xs text-navy-500">{client.company}</p>
                    )}
                  </div>
                </div>
                {/* Action buttons */}
                <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                  <button
                    onClick={() => setEditClient(client)}
                    className="p-1.5 rounded-lg text-navy-500 hover:text-primary-400 hover:bg-primary/10 transition-colors"
                    title="Edit"
                  >
                    <Pencil size={14} />
                  </button>
                  <button
                    onClick={() => setDeleteClient(client)}
                    className="p-1.5 rounded-lg text-navy-500 hover:text-red-400 hover:bg-red-500/10 transition-colors"
                    title="Delete"
                  >
                    <Trash2 size={14} />
                  </button>
                </div>
              </div>

              {/* Details */}
              <div className="space-y-2">
                <div className="flex items-center gap-2 text-xs text-navy-400">
                  <Mail size={12} className="flex-shrink-0" />
                  <span className="truncate">{client.email}</span>
                </div>
                {client.phone && (
                  <div className="flex items-center gap-2 text-xs text-navy-400">
                    <Phone size={12} className="flex-shrink-0" />
                    <span>{client.phone}</span>
                  </div>
                )}
                {client.company && (
                  <div className="flex items-center gap-2 text-xs text-navy-400">
                    <Building2 size={12} className="flex-shrink-0" />
                    <span className="truncate">{client.company}</span>
                  </div>
                )}
              </div>

              {/* Footer */}
              <div className="mt-4 pt-3 border-t border-navy-700 text-xs text-navy-600">
                Added {timeAgo(client.createdAt)}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* ── Modals ───────────────────────────────────────── */}
      <Modal isOpen={addOpen} onClose={() => setAddOpen(false)} title="Add New Client">
        <ClientForm onSubmit={handleAdd} onCancel={() => setAddOpen(false)} />
      </Modal>

      <Modal
        isOpen={!!editClient}
        onClose={() => setEditClient(null)}
        title="Edit Client"
      >
        {editClient && (
          <ClientForm
            initial={editClient}
            onSubmit={handleEdit}
            onCancel={() => setEditClient(null)}
          />
        )}
      </Modal>

      <ConfirmModal
        isOpen={!!deleteClient}
        onClose={() => setDeleteClient(null)}
        onConfirm={handleDelete}
        title="Delete Client"
        description={`Are you sure you want to delete ${deleteClient?.name}? This action cannot be undone.`}
        isLoading={isDeleting}
      />
    </div>
  );
}
