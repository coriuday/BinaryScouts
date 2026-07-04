import { redirect } from 'next/navigation';
import { isAdminSessionValid } from '@/lib/admin-session';
import AdminDashboardPage from '@/components/pages/AdminDashboardPage';

export const metadata = {
  title: 'Admin — BinaryScouts',
  robots: { index: false, follow: false },
};

export default async function Page() {
  if (!(await isAdminSessionValid())) {
    redirect('/admin/login');
  }
  return <AdminDashboardPage />;
}
