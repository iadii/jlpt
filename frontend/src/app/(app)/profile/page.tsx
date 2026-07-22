'use client';

import { useState, useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { api } from '@/lib/api';
import { useAuthStore } from '@/store/useAuthStore';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { 
  UserIcon, 
  CheckIcon,
  ArrowPathIcon,
  Cog6ToothIcon
} from '@heroicons/react/24/outline';
import { GSAPReveal } from '@/components/ui/GSAPReveal';

interface UserProfile {
  id: number;
  username: string;
  email: string;
  date_joined: string;
  current_level: string;
  daily_goal_minutes: number;
  total_xp: number;
  preferred_language: string;
}

export default function ProfilePage() {
  const { user } = useAuthStore();
  const queryClient = useQueryClient();
  const [saved, setSaved] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  const { data: profile, isLoading } = useQuery<UserProfile>({
    queryKey: ['user-profile'],
    queryFn: async () => {
      const { data } = await api.get('/users/profile/');
      return data.data;
    },
  });

  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');

  useEffect(() => {
    if (profile) {
      setUsername(profile.username);
      setEmail(profile.email);
    }
  }, [profile]);

  const updateMutation = useMutation({
    mutationFn: async (updates: { username?: string; email?: string }) => {
      const { data } = await api.put('/users/profile/update/', updates);
      return data.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['user-profile'] });
      setSaved(true);
      setErrorMsg('');
      setTimeout(() => setSaved(false), 2000);
    },
    onError: (error: any) => {
      setErrorMsg(error.response?.data?.message || 'Failed to update profile');
    }
  });

  const handleSave = () => {
    const updates: { username?: string; email?: string } = {};
    if (username && username !== profile?.username) updates.username = username;
    if (email && email !== profile?.email) updates.email = email;
    if (Object.keys(updates).length > 0) {
      updateMutation.mutate(updates);
    }
  };

  const hasChanges = (username !== profile?.username) || (email !== profile?.email);

  if (isLoading) {
    return (
      <div className="flex h-full items-center justify-center p-16">
        <ArrowPathIcon className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <GSAPReveal className="space-y-8 max-w-3xl mx-auto pb-12">
      <div>
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 border border-primary/20 text-primary text-xs font-bold uppercase tracking-widest mb-2">
          Your Account
        </div>
        <h1 className="h1-premium text-3xl sm:text-4xl">Profile</h1>
        <p className="text-muted-foreground text-base mt-1">Manage your personal information.</p>
      </div>

      <GSAPReveal staggerChildren delay={0.1} className="space-y-6">
        <Card className="glass-card rounded-2xl overflow-hidden border-border/60">
          <CardHeader className="flex flex-row items-center gap-4 pb-2 border-b border-border/40">
            <div className="bg-primary/10 p-3 rounded-xl text-primary border border-primary/20">
              <UserIcon className="h-6 w-6" />
            </div>
            <CardTitle className="text-xl font-semibold">Personal Information</CardTitle>
          </CardHeader>
          <CardContent className="p-6 space-y-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Username</label>
                <Input 
                  value={username} 
                  onChange={(e) => setUsername(e.target.value)}
                  className="bg-secondary/40 font-semibold rounded-xl" 
                />
              </div>
              <div className="space-y-1.5">
                <label className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Email</label>
                <Input 
                  type="email"
                  value={email} 
                  onChange={(e) => setEmail(e.target.value)}
                  className="bg-secondary/40 font-semibold rounded-xl" 
                />
              </div>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Member Since</label>
                <Input
                  value={profile?.date_joined ? new Date(profile.date_joined).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' }) : ''}
                  disabled
                  className="bg-secondary/40 font-semibold rounded-xl opacity-70"
                />
              </div>
              <div className="space-y-1.5">
                <label className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Total XP</label>
                <Input value={profile?.total_xp?.toLocaleString() || '0'} disabled className="bg-secondary/40 font-semibold rounded-xl text-primary opacity-70" />
              </div>
            </div>

            <div className="flex items-center gap-4 pt-4 border-t border-border/50">
              <Button
                onClick={handleSave}
                disabled={!hasChanges || updateMutation.isPending}
                className="gap-2 rounded-xl font-semibold shadow-md px-6 bg-primary hover:bg-primary/90 text-white"
              >
                {updateMutation.isPending ? (
                  <ArrowPathIcon className="h-4 w-4 animate-spin" />
                ) : saved ? (
                  <CheckIcon className="h-4 w-4" />
                ) : (
                  <Cog6ToothIcon className="h-4 w-4" />
                )}
                {saved ? 'Saved!' : 'Save Profile'}
              </Button>
              {errorMsg && (
                <p className="text-sm text-destructive font-semibold">{errorMsg}</p>
              )}
            </div>
          </CardContent>
        </Card>
      </GSAPReveal>
    </GSAPReveal>
  );
}
