import { redirect } from 'next/navigation';

export default function Home() {
  redirect('/login'); // If not authenticated, the app layout redirects to login, but root can redirect to login directly or dashboard. Let's redirect to dashboard, which is protected.
}
