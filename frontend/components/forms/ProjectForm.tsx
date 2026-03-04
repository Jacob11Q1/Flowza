'use client';

import { useState } from 'react';
import { Input, Textarea, Select } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';
import type { Project, ProjectFormData, Client } from '@/types';

interface ProjectFormProps {
  initial?: Partial<Project>;
  clients: Client[];
  onSubmit: (data: ProjectFormData) => Promise<void>;
  onCancel: () => void;
}

export function ProjectForm({ initial, clients, onSubmit, onCancel }: ProjectFormProps) {
  const initialClient =
    initial?.client && typeof initial.client === 'object' ? initial.client._id : initial?.client ?? '';

  const [form, setForm] = useState<ProjectFormData>({
    client: initialClient as string,
    name: initial?.name ?? '',
    description: initial?.description ?? '',
    status: initial?.status ?? 'active',
    deadline: initial?.deadline ? initial.deadline.slice(0, 10) : '',
    budget: initial?.budget ?? undefined,
  });
  const [errors, setErrors] = useState<Partial<Record<keyof ProjectFormData, string>>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const validate = (): boolean => {
    const e: typeof errors = {};
    if (!form.name.trim()) e.name = 'Project name is required';
    if (!form.client) e.client = 'Please select a client';
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
    (field: keyof ProjectFormData) =>
    (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
      const value = field === 'budget' ? (e.target.value ? Number(e.target.value) : undefined) : e.target.value;
      setForm((f) => ({ ...f, [field]: value }));
    };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <Input
        label="Project Name *"
        placeholder="Website Redesign"
        value={form.name}
        onChange={set('name')}
        error={errors.name}
      />
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
      <Textarea
        label="Description"
        placeholder="Brief description of the project scope..."
        value={form.description}
        onChange={set('description')}
        rows={3}
      />
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <Select
          label="Status"
          value={form.status}
          onChange={set('status')}
          options={[
            { value: 'active', label: 'Active' },
            { value: 'on_hold', label: 'On Hold' },
            { value: 'completed', label: 'Completed' },
          ]}
        />
        <Input
          label="Deadline"
          type="date"
          value={form.deadline}
          onChange={set('deadline')}
        />
        <Input
          label="Budget ($)"
          type="number"
          min="0"
          step="0.01"
          placeholder="5000"
          value={form.budget ?? ''}
          onChange={set('budget')}
        />
      </div>
      <div className="flex gap-3 justify-end pt-2">
        <Button type="button" variant="ghost" onClick={onCancel} disabled={isSubmitting}>
          Cancel
        </Button>
        <Button type="submit" isLoading={isSubmitting}>
          {initial?._id ? 'Save Changes' : 'Create Project'}
        </Button>
      </div>
    </form>
  );
}
