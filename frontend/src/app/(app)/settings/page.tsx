'use client';

import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { api } from '@/lib/api';
import { useAuthStore } from '@/store/useAuthStore';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Cog6ToothIcon,
  UserIcon,
  FlagIcon,
  ClockIcon,
  ShieldCheckIcon,
  CheckIcon,
  ArrowPathIcon
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

const JLPT_LEVELS = [
  { value: 'n5', label: 'N5 — Beginner' },
  { value: 'n4', label: 'N4 — Elementary' },
  { value: 'n3', label: 'N3 — Intermediate' },
  { value: 'n2', label: 'N2 — Upper Intermediate' },
  { value: 'n1', label: 'N1 — Advanced' },
];

const DAILY_GOALS = [5, 10, 15, 20, 30, 45, 60];

export default function SettingsPage() {
  const { user } = useAuthStore();
  const queryClient = useQueryClient();
  const [saved, setSaved] = useState(false);

  const { data: profile, isLoading } = useQuery<UserProfile>({
    queryKey: ['user-profile'],
    queryFn: async () => {
      const { data } = await api.get('/users/profile/');
      return data.data;
    },
  });

  const [currentLevel, setCurrentLevel] = useState<string | null>(null);
  const [dailyGoal, setDailyGoal] = useState<number | null>(null);

  const displayLevel = currentLevel ?? profile?.current_level ?? 'n5';
  const displayGoal = dailyGoal ?? profile?.daily_goal_minutes ?? 15;

  const updateMutation = useMutation({
    mutationFn: async (updates: { current_level?: string; daily_goal_minutes?: number }) => {
      const { data } = await api.put('/users/profile/update/', updates);
      return data.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['user-profile'] });
      setSaved(true);
      setTimeout(() => setSaved(false), 2000);
    },
  });

  const handleSave = () => {
    const updates: { current_level?: string; daily_goal_minutes?: number } = {};
    if (currentLevel) updates.current_level = currentLevel;
    if (dailyGoal) updates.daily_goal_minutes = dailyGoal;
    if (Object.keys(updates).length > 0) {
      updateMutation.mutate(updates);
    }
  };

  const hasChanges = currentLevel !== null || dailyGoal !== null;

  if (isLoading) {
    return (
      <div className="flex h-full items-center justify-center p-16">
        <ArrowPathIcon className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <GSAPReveal className="space-y-8 max-w-4xl mx-auto pb-12">
      <div>
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 border border-primary/20 text-primary text-xs font-bold uppercase tracking-widest mb-2">
          Preferences
        </div>
        <h1 className="h1-premium text-3xl sm:text-4xl">Settings</h1>
        <p className="text-muted-foreground text-base mt-1">Manage your study preferences and account security.</p>
      </div>

      <GSAPReveal staggerChildren delay={0.1} className="space-y-0">
        
        {/* Study Preferences Section Header */}
        <div className="pb-4 border-b border-border/40">
          <h2 className="text-xl font-semibold flex items-center gap-3">
             <FlagIcon className="h-6 w-6 text-accent" />
             Study Preferences
          </h2>
        </div>

        {/* JLPT Target Level Row */}
        <div className="py-6 border-b border-border/40 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="space-y-1 max-w-md">
            <h3 className="text-sm font-semibold text-foreground">Target JLPT Level</h3>
            <p className="text-sm text-muted-foreground">Select the JLPT exam level you are currently studying for. This affects your curriculum.</p>
          </div>
          <div className="w-full sm:w-64 relative">
            <select
              value={displayLevel}
              onChange={(e) => setCurrentLevel(e.target.value)}
              className="w-full appearance-none bg-secondary/50 border border-border/60 text-foreground font-semibold text-sm rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-primary cursor-pointer transition-all pr-10"
            >
              {JLPT_LEVELS.map((level) => (
                <option key={level.value} value={level.value} className="bg-background">{level.label}</option>
              ))}
            </select>
            <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-4 text-muted-foreground">
              <svg className="h-4 w-4 fill-current" viewBox="0 0 20 20"><path d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" /></svg>
            </div>
          </div>
        </div>

        {/* Daily Goal Row */}
        <div className="py-6 border-b border-border/40 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="space-y-1 max-w-md">
            <h3 className="text-sm font-semibold text-foreground flex items-center gap-2">
              <ClockIcon className="h-4 w-4 text-muted-foreground" /> Daily Study Goal
            </h3>
            <p className="text-sm text-muted-foreground">Set a daily target to maintain your study streak and build consistency.</p>
          </div>
          <div className="w-full sm:w-64 relative">
            <select
              value={displayGoal}
              onChange={(e) => setDailyGoal(Number(e.target.value))}
              className="w-full appearance-none bg-secondary/50 border border-border/60 text-foreground font-semibold text-sm rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-primary cursor-pointer transition-all pr-10"
            >
              {DAILY_GOALS.map((goal) => (
                <option key={goal} value={goal} className="bg-background">{goal} minutes per day</option>
              ))}
            </select>
            <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-4 text-muted-foreground">
              <svg className="h-4 w-4 fill-current" viewBox="0 0 20 20"><path d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" /></svg>
            </div>
          </div>
        </div>

        {/* Save Changes Row */}
        <div className="py-6 flex items-center justify-end gap-4">
           {updateMutation.isError && (
             <p className="text-sm text-destructive font-semibold">Failed to save. Please try again.</p>
           )}
           <Button
             onClick={handleSave}
             disabled={!hasChanges || updateMutation.isPending}
             className="gap-2 rounded-xl font-semibold shadow-md px-8 py-6 bg-primary hover:bg-primary/90 text-white transition-all"
           >
             {updateMutation.isPending ? (
               <ArrowPathIcon className="h-5 w-5 animate-spin" />
             ) : saved ? (
               <CheckIcon className="h-5 w-5" />
             ) : (
               <Cog6ToothIcon className="h-5 w-5" />
             )}
             {saved ? 'Saved Successfully' : 'Save Preferences'}
           </Button>
        </div>

        {/* Security Section Header */}
        <div className="pt-10 pb-4 border-b border-border/40">
          <h2 className="text-xl font-semibold flex items-center gap-3">
             <ShieldCheckIcon className="h-6 w-6 text-blue-500" />
             Security & Privacy
          </h2>
        </div>

        {/* Password Row */}
        <div className="py-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="space-y-1 max-w-md">
            <h3 className="text-sm font-semibold text-foreground">Change Password</h3>
            <p className="text-sm text-muted-foreground">Password changes are protected via HttpOnly session security protocols.</p>
          </div>
          <div>
            <Button variant="outline" disabled className="opacity-50 rounded-xl font-semibold w-full sm:w-auto px-6 py-6">
              Change Password
            </Button>
          </div>
        </div>

      </GSAPReveal>
    </GSAPReveal>
  );
}
