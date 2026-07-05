import { createServiceClient } from '@/lib/supabase/server';
import { isSupabaseConfigured } from '@/lib/supabase/config';
import {
  PROJECTS,
  getAllProjects as getStaticProjects,
  getFeaturedProjects as getStaticFeatured,
  getProjectBySlug as getStaticBySlug,
  PROJECT_CATEGORIES,
  type Project,
} from '@/lib/projects';
import { mapDbProject, projectPartialToDb, projectToDb, type DbProject } from '@/lib/cms/types';

export type { Project, ProjectStatus, ProjectMetric } from '@/lib/projects';
export { PROJECT_CATEGORIES };

export async function getAllProjects(): Promise<Project[]> {
  const db = createServiceClient();
  if (!db) return getStaticProjects();

  const { data, error } = await db
    .from('projects')
    .select('*')
    .neq('status', 'draft')
    .order('sort_order', { ascending: true });

  if (error || !data?.length) return getStaticProjects();
  return (data as DbProject[]).map(mapDbProject);
}

export async function getFeaturedProjects(): Promise<Project[]> {
  const db = createServiceClient();
  if (!db) return getStaticFeatured();

  const { data, error } = await db
    .from('projects')
    .select('*')
    .eq('featured', true)
    .neq('status', 'draft')
    .order('sort_order', { ascending: true });

  if (error || !data?.length) return getStaticFeatured();
  return (data as DbProject[]).map(mapDbProject);
}

export async function getProjectBySlug(slug: string): Promise<Project | undefined> {
  const db = createServiceClient();
  if (!db) return getStaticBySlug(slug);

  const { data, error } = await db
    .from('projects')
    .select('*')
    .eq('slug', slug)
    .neq('status', 'draft')
    .maybeSingle();

  if (error || !data) return getStaticBySlug(slug);
  return mapDbProject(data as DbProject);
}

export async function getAllProjectsAdmin(): Promise<Project[]> {
  const db = createServiceClient();
  if (!db) return getStaticProjects();

  const { data, error } = await db.from('projects').select('*').order('sort_order', { ascending: true });
  if (error || !data) return getStaticProjects();
  return (data as DbProject[]).map(mapDbProject);
}

export async function createProject(input: Partial<Project> & { slug: string; title: string }): Promise<Project | null> {
  const db = createServiceClient();
  if (!db) return null;

  const row = { ...projectToDb(input), updated_at: new Date().toISOString() };
  const { data, error } = await db.from('projects').insert(row).select().single();
  if (error || !data) return null;
  return mapDbProject(data as DbProject);
}

export async function updateProject(id: string, input: Partial<Project>): Promise<Project | null> {
  const db = createServiceClient();
  if (!db) return null;

  const row = { ...projectPartialToDb(input), updated_at: new Date().toISOString() };
  const { data, error } = await db.from('projects').update(row).eq('id', id).select().single();
  if (error || !data) return null;
  return mapDbProject(data as DbProject);
}

export async function deleteProject(id: string): Promise<boolean> {
  const db = createServiceClient();
  if (!db) return false;
  const { error } = await db.from('projects').delete().eq('id', id);
  return !error;
}

export function getStaticFallbackProjects(): Project[] {
  return PROJECTS;
}
