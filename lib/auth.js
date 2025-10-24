import { getServerSession } from 'next-auth';

export async function getSession() {
  return await getServerSession();
}

export async function isAuthenticated() {
  const session = await getSession();
  return !!session;
}

export async function isAdmin() {
  const session = await getSession();
  return session?.user?.role === 'admin';
}

export async function requireAuth() {
  const session = await getSession();
  if (!session) {
    throw new Error('Unauthorized');
  }
  return session;
}

export async function requireAdmin() {
  const session = await getSession();
  if (!session || session.user.role !== 'admin') {
    throw new Error('Forbidden - Admin access required');
  }
  return session;
}