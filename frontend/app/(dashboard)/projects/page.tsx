'use client';

import { useEffect, useState, useCallback } from 'react';
import {
  Plus,
  Search,
  Pencil,
  Trash2,
  FolderKanban,
  Calendar,
  DollarSign,
} from 'lucide-react';
import { Modal, ConfirmModal } from '@/components/ui/Modal';
import { ProjectForm } from '@/components/forms/ProjectForm';
import { ProjectStatusBadge } from '@/components/ui/Badge';
import { EmptyState } from '@/components/ui/EmptyState';
import { LoadingSpinner } from '@/components/ui/LoadingSpinner';
import { Button } from '@/components/ui/Button';
import { Select } from '@/components/ui/Input';
import api from '@/lib/api';
import { formatCurrency, formatDate, timeAgo } from '@/lib/utils';
import type { Project, ProjectFormData, Client, ProjectStatus } from '@/types';

export default function ProjectsPage() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [clients, setClients] = useState<Client[]>([]);
  const [filtered, setFiltered] = useState<Project[]>([]);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState<'' | ProjectStatus>('');
  const [isLoading, setIsLoading] = useState(true);

  const [addOpen, setAddOpen] = useState(false);
  const [editProject, setEditProject] = useState<Project | null>(null);
  const [deleteProject, setDeleteProject] = useState<Project | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const fetchData = useCallback(async () => {
    try {
      const [projRes, clientRes] = await Promise.all([
        api.get<{ data: Project[] }>('/projects'),
        api.get<{ data: Client[] }>('/clients'),
      ]);
      setProjects(projRes.data.data || []);
      setClients(clientRes.data.data || []);
    } catch (err) {
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => { fetchData(); }, [fetchData]);

  useEffect(() => {
    let list = projects;
    if (statusFilter) list = list.filter((p) => p.status === statusFilter);
    if (search) {
      const q = search.toLowerCase();
      list = list.filter(
        (p) =>
          p.name.toLowerCase().includes(q) ||
          (typeof p.client === 'object' && p.client.name.toLowerCase().includes(q))
      );
    }
    setFiltered(list);
  }, [projects, search, statusFilter]);

  const handleAdd = async (data: ProjectFormData) => {
    await api.post('/projects', data);
    setAddOpen(false);
    fetchData();
  };

  const handleEdit = async (data: ProjectFormData) => {
    await api.put(`/projects/${editProject!._id}`, data);
    setEditProject(null);
    fetchData();
  };

  const handleDelete = async () => {
    if (!deleteProject) return;
    setIsDeleting(true);
    try {
      await api.delete(`/projects/${deleteProject._id}`);
      setDeleteProject(null);
      fetchData();
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <div className="space-y-6 animate-fade-in">
      {/* ── Header ───────────────────────────────────────── */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-navy-50">Projects</h2>
          <p className="text-sm text-navy-400 mt-0.5">
            {projects.length} project{projects.length !== 1 ? 's' : ''} total
          </p>
        </div>
        <Button leftIcon={<Plus size={16} />} onClick={() => setAddOpen(true)}>
          New Project
        </Button>
      </div>

      {/* ── Filters ──────────────────────────────────────── */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-navy-500 pointer-events-none" />
          <input
            type="text"
            placeholder="Search projects or clients..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="input-base pl-9"
          />
        </div>
        <Select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value as '' | ProjectStatus)}
          options={[
            { value: '', label: 'All statuses' },
            { value: 'active', label: 'Active' },
            { value: 'on_hold', label: 'On Hold' },
            { value: 'completed', label: 'Completed' },
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
          icon={FolderKanban}
          title={search || statusFilter ? 'No projects found' : 'No projects yet'}
          description={
            search || statusFilter
              ? 'Try adjusting your filters'
              : 'Create your first project to start tracking work'
          }
          action={
            !search && !statusFilter ? (
              <Button leftIcon={<Plus size={16} />} onClick={() => setAddOpen(true)}>
                New Project
              </Button>
            ) : undefined
          }
        />
      ) : (
        <div className="space-y-3">
          {filtered.map((project) => {
            const client = typeof project.client === 'object' ? project.client : null;
            return (
              <div key={project._id} className="card-hover p-5 group">
                <div className="flex flex-col sm:flex-row sm:items-center gap-4">
                  {/* Left icon */}
                  <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
                    <FolderKanban className="h-5 w-5 text-primary-400" />
                  </div>

                  {/* Info */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-3 flex-wrap">
                      <h3 className="text-sm font-semibold text-navy-100">{project.name}</h3>
                      <ProjectStatusBadge status={project.status} />
                    </div>
                    {client && (
                      <p className="text-xs text-navy-500 mt-0.5">{client.name}</p>
                    )}
                    {project.description && (
                      <p className="text-xs text-navy-500 mt-1 line-clamp-1">
                        {project.description}
                      </p>
                    )}
                  </div>

                  {/* Meta */}
                  <div className="flex items-center gap-5 text-xs text-navy-500 flex-shrink-0">
                    {project.deadline && (
                      <span className="flex items-center gap-1">
                        <Calendar size={12} />
                        {formatDate(project.deadline)}
                      </span>
                    )}
                    {project.budget !== undefined && (
                      <span className="flex items-center gap-1 text-secondary">
                        <DollarSign size={12} />
                        {formatCurrency(project.budget)}
                      </span>
                    )}
                    <span className="text-navy-600">{timeAgo(project.createdAt)}</span>
                  </div>

                  {/* Actions */}
                  <div className="flex gap-1 sm:opacity-0 sm:group-hover:opacity-100 transition-opacity">
                    <button
                      onClick={() => setEditProject(project)}
                      className="p-1.5 rounded-lg text-navy-500 hover:text-primary-400 hover:bg-primary/10 transition-colors"
                    >
                      <Pencil size={14} />
                    </button>
                    <button
                      onClick={() => setDeleteProject(project)}
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
      <Modal isOpen={addOpen} onClose={() => setAddOpen(false)} title="Create Project" size="lg">
        <ProjectForm clients={clients} onSubmit={handleAdd} onCancel={() => setAddOpen(false)} />
      </Modal>

      <Modal
        isOpen={!!editProject}
        onClose={() => setEditProject(null)}
        title="Edit Project"
        size="lg"
      >
        {editProject && (
          <ProjectForm
            initial={editProject}
            clients={clients}
            onSubmit={handleEdit}
            onCancel={() => setEditProject(null)}
          />
        )}
      </Modal>

      <ConfirmModal
        isOpen={!!deleteProject}
        onClose={() => setDeleteProject(null)}
        onConfirm={handleDelete}
        title="Delete Project"
        description={`Delete "${deleteProject?.name}"? This action cannot be undone.`}
        isLoading={isDeleting}
      />
    </div>
  );
}
