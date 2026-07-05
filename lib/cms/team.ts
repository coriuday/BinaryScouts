import { createServiceClient } from '@/lib/supabase/server';
import { FLIP_TEAM_MEMBERS, type FlipCardData } from '@/lib/flip-team';
import { TEAM_MEMBERS, getTeamMembers, type TeamMember, type TeamSkill } from '@/lib/team';
import { mapDbTeamMember, teamMemberToFlipCard, type DbTeamMember } from '@/lib/cms/types';

export type { TeamMember, TeamSkill };
export { SKILL_CATEGORY_COLORS } from '@/lib/team';

export async function getTeamMembersCms(): Promise<TeamMember[]> {
  const db = createServiceClient();
  if (!db) return getTeamMembers();

  const { data, error } = await db.from('team_members').select('*').order('sort_order', { ascending: true });
  if (error || !data?.length) return getTeamMembers();
  return (data as DbTeamMember[]).map(mapDbTeamMember);
}

export async function getHomepageTeam(): Promise<FlipCardData[]> {
  const db = createServiceClient();
  if (!db) return FLIP_TEAM_MEMBERS;

  const { data, error } = await db
    .from('team_members')
    .select('*')
    .eq('show_on_homepage', true)
    .order('sort_order', { ascending: true });

  if (error || !data?.length) return FLIP_TEAM_MEMBERS;
  return (data as DbTeamMember[]).map(teamMemberToFlipCard);
}

export async function getAllTeamAdmin(): Promise<DbTeamMember[]> {
  const db = createServiceClient();
  if (!db) {
    return TEAM_MEMBERS.map((m, i) => ({
      id: m.id,
      name: m.name,
      username: FLIP_TEAM_MEMBERS[i]?.username ?? '',
      titles: FLIP_TEAM_MEMBERS[i]?.titles ?? [],
      role: m.role,
      bio: m.bio,
      image_url: m.avatar ?? '',
      stats: FLIP_TEAM_MEMBERS[i]?.stats ?? [],
      skills: m.skills,
      social_links: m.socials ?? {},
      badges: m.badges,
      experience: m.experience,
      projects_shipped: m.projectsShipped,
      sort_order: i,
      show_on_homepage: true,
    }));
  }

  const { data, error } = await db.from('team_members').select('*').order('sort_order', { ascending: true });
  if (error || !data) return [];
  return data as DbTeamMember[];
}

export type TeamMemberInput = {
  name: string;
  username?: string;
  titles?: string[];
  role?: string;
  bio?: string;
  image_url?: string;
  stats?: { label: string; value: string }[];
  skills?: TeamSkill[];
  social_links?: { github?: string; linkedin?: string; twitter?: string };
  badges?: string[];
  experience?: number;
  projects_shipped?: number;
  sort_order?: number;
  show_on_homepage?: boolean;
};

export async function createTeamMember(input: TeamMemberInput): Promise<DbTeamMember | null> {
  const db = createServiceClient();
  if (!db) return null;

  const { data, error } = await db
    .from('team_members')
    .insert({ ...input, updated_at: new Date().toISOString() })
    .select()
    .single();
  if (error || !data) return null;
  return data as DbTeamMember;
}

export async function updateTeamMember(id: string, input: Partial<TeamMemberInput>): Promise<DbTeamMember | null> {
  const db = createServiceClient();
  if (!db) return null;

  const { data, error } = await db
    .from('team_members')
    .update({ ...input, updated_at: new Date().toISOString() })
    .eq('id', id)
    .select()
    .single();
  if (error || !data) return null;
  return data as DbTeamMember;
}

export async function deleteTeamMember(id: string): Promise<boolean> {
  const db = createServiceClient();
  if (!db) return false;
  const { error } = await db.from('team_members').delete().eq('id', id);
  return !error;
}

export function dbTeamToFlipCard(row: DbTeamMember): FlipCardData {
  return teamMemberToFlipCard(row);
}

export function dbTeamToMember(row: DbTeamMember): TeamMember {
  return mapDbTeamMember(row);
}
