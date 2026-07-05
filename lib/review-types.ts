export interface Review {
  id: string;
  name: string;
  role: string;
  company: string;
  quote: string;
  stars: number;
  status: 'pending' | 'approved' | 'rejected';
  createdAt: string;
}

export function reviewInitials(name: string): string {
  return name
    .split(/\s+/)
    .map((w) => w[0])
    .join('')
    .toUpperCase()
    .slice(0, 2);
}
