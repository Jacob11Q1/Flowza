'use client';

import { useState, useEffect } from 'react';
import { Input, Textarea, Select } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';
import api from '@/lib/api';
import type { Invoice, InvoiceFormData, Client, Project } from '@/types';

interface InvoiceFormProps {
  initial?: Partial<Invoice>;
  clients: Client[];
  onSubmit: (data: InvoiceFormData) => Promise<void>;
  onCancel: () => void;
}

export function InvoiceForm({ initial, clients, onSubmit, onCancel }: InvoiceFormProps) {
  const initialClient =
    initial?.client && typeof initial.client === 'object' ? initial.client._id : initial?.client ?? '';
  const initialProject =
    initial?.project && typeof initial.project === 'object' ? initial.project._id : initial?.project ?? '';

  const [form, setForm] = useState<InvoiceFormData>({
    client: initialClient as string,
    project: initialProject as string,
    amount: initial?.amount ?? 0,
    status: initial?.status ?? 'unpaid',
    dueDate: initial?.dueDate ? initial.dueDate.slice(0, 10) : '',
    notes: initial?.notes ?? '',
  });
  const [errors, setErrors] = useState<Partial<Record<keyof InvoiceFormData, string>>>({});
  const [projects, setProjects] = useState<Project[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Load projects for the selected client
  useEffect(() => {
    if (!form.client) { setProjects([]); return; }
    api
      .get<{ data: Project[] }>(`/projects?client=${form.client}`)
      .then((res) => setProjects(res.data.data || []))
      .catch(() => setProjects([]));
  }, [form.client]);

  const validate = (): boolean => {
    const e: typeof errors = {};
    if (!form.client) e.client = 'Please select a client';
    if (!form.project) e.project = 'Please select a project';
    if (!form.amount || form.amount <= 0) e.amount = 'Amount must be greater than 0';
    if (!form.dueDate) e.dueDate = 'Due date is required';
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSubmit = async (ev: React.FormEvent) => {
    ev.preventDefault();
    if (!validate()) return;
    setIsSubmitting(true);
    try {
      await onSubmit(form);
    } finally {
      setIsSubmitting(false);
    }
  };

  const set =
    (field: keyof InvoiceFormData) =>
    (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
      const value = field === 'amount' ? Number(e.target.value) : e.target.value;
      // Reset project when client changes
      if (field === 'client') {
        setForm((f) => ({ ...f, client: e.target.value, project: '' }));
      } else {
        setForm((f) => ({ ...f, [field]: value }));
      }
    };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <Select
          label="Client *"
          value={form.client}
          onChange={set('client')}
          error={errors.client}
          options={[
            { value: '', label: 'Select a client...' },
            ...clients.map((c) => ({ value: c._id, label: c.name })),
          ]}
        />
        <Select
          label="Project *"
          value={form.project}
          onChange={set('project')}
          error={errors.project}
          options={[
            { value: '', label: form.client ? 'Select a project...' : 'Select client first' },
            ...projects.map((p) => ({ value: p._id, label: p.name })),
          ]}
        />
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <Input
          label="Amount ($) *"
          type="number"
          min="0.01"
          step="0.01"
          placeholder="1500"
          value={form.amount || ''}
          onChange={set('amount')}
          error={errors.amount}
        />
        <Input
          label="Due Date *"
          type="date"
          value={form.dueDate}
          onChange={set('dueDate')}
          error={errors.dueDate}
        />
        <Select
          label="Status"
          value={form.status}
          onChange={set('status')}
          options={[
            { value: 'unpaid', label: 'Unpaid' },
            { value: 'paid', label: 'Paid' },
            { value: 'overdue', label: 'Overdue' },
          ]}
        />
      </div>
      <Textarea
        label="Notes"
        placeholder="Optional invoice notes..."
        value={form.notes}
        onChange={set('notes')}
        rows={2}
      />
      <div className="flex gap-3 justify-end pt-2">
        <Button type="button" variant="ghost" onClick={onCancel} disabled={isSubmitting}>
          Cancel
        </Button>
        <Button type="submit" isLoading={isSubmitting}>
          {initial?._id ? 'Save Changes' : 'Create Invoice'}
        </Button>
      </div>
    </form>
  );
}
