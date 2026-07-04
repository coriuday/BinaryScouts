import { redirect } from 'next/navigation';
import { isAdminSessionValid } from '@/lib/admin-session';
import AdminLoginPage from '@/components/pages/AdminLoginPage';

export const metadata = {
  title: 'Admin Login — BinaryScouts',
  robots: { index: false, follow: false },
};

export default async function Page() {
  if (await isAdminSessionValid()) {
    redirect('/admin');
  }
  return <AdminLoginPage />;
}
