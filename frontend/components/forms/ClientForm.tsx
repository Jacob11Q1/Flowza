'use client';

import { useState } from 'react';
import { Input, Textarea } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';
import type { Client, ClientFormData } from '@/types';

interface ClientFormProps {
  initial?: Partial<Client>;
  onSubmit: (data: ClientFormData) => Promise<void>;
  onCancel: () => void;
}

export function ClientForm({ initial, onSubmit, onCancel }: ClientFormProps) {
  const [form, setForm] = useState<ClientFormData>({
    name: initial?.name ?? '',
    email: initial?.email ?? '',
    phone: initial?.phone ?? '',
    company: initial?.company ?? '',
    notes: initial?.notes ?? '',
  });
  const [errors, setErrors] = useState<Partial<ClientFormData>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const validate = (): boolean => {
    const newErrors: Partial<ClientFormData> = {};
    if (!form.name.trim()) newErrors.name = 'Name is required';
    if (!form.email.trim()) newErrors.email = 'Email is required';
    else if (!/^\S+@\S+\.\S+$/.test(form.email)) newErrors.email = 'Enter a valid email';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;
    setIsSubmitting(true);
    try {
      await onSubmit(form);
    } finally {
      setIsSubmitting(false);
    }
  };

  const set = (field: keyof ClientFormData) => (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => setForm((f) => ({ ...f, [field]: e.target.value }));

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <Input
          label="Full Name *"
          placeholder="Jane Smith"
          value={form.name}
          onChange={set('name')}
          error={errors.name}
        />
        <Input
          label="Email *"
          type="email"
          placeholder="jane@company.com"
          value={form.email}
          onChange={set('email')}
          error={errors.email}
        />
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <Input
          label="Phone"
          type="tel"
          placeholder="+1 (555) 000-0000"
          value={form.phone}
          onChange={set('phone')}
        />
        <Input
          label="Company"
          placeholder="Acme Inc."
          value={form.company}
          onChange={set('company')}
        />
      </div>
      <Textarea
        label="Notes"
        placeholder="Any relevant notes about this client..."
        value={form.notes}
        onChange={set('notes')}
        rows={3}
      />
      <div className="flex gap-3 justify-end pt-2">
        <Button type="button" variant="ghost" onClick={onCancel} disabled={isSubmitting}>
          Cancel
        </Button>
        <Button type="submit" isLoading={isSubmitting}>
          {initial ? 'Save Changes' : 'Add Client'}
        </Button>
      </div>
    </form>
  );
}
