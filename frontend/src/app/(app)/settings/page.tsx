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
    <GSAPReveal className="space-y-8 max-w-3xl mx-auto pb-12">
      <div>
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 border border-primary/20 text-primary text-xs font-bold uppercase tracking-widest mb-2">
          Account & Preferences
        </div>
        <h1 className="h1-premium text-3xl sm:text-4xl">Settings</h1>
        <p className="text-muted-foreground text-base mt-1">Manage your profile details and study preferences.</p>
      </div>

      <GSAPReveal staggerChildren delay={0.1} className="space-y-6">
        {/* Profile Overview moved to /profile */}

        {/* Study Preferences */}
        <Card className="glass-card rounded-2xl overflow-hidden border-border/60">
          <CardHeader className="flex flex-row items-center gap-4 pb-2 border-b border-border/40">
            <div className="bg-accent/10 p-3 rounded-xl text-accent border border-accent/20">
              <FlagIcon className="h-6 w-6" />
            </div>
            <CardTitle className="text-xl font-semibold">Study Preferences</CardTitle>
          </CardHeader>
          <CardContent className="p-6 space-y-6">
            {/* JLPT Target Level */}
            <div className="space-y-4">
              <label className="text-sm font-semibold text-foreground">Target JLPT Level</label>
              <div className="flex flex-wrap gap-3">
                {JLPT_LEVELS.map((level) => (
                  <button
                    key={level.value}
                    onClick={() => setCurrentLevel(level.value)}
                    className={`px-5 py-2.5 rounded-xl text-xs font-semibold transition-all duration-200 ${
                      displayLevel === level.value
                        ? 'bg-primary text-primary-foreground shadow-md scale-105'
                        : 'bg-secondary/60 text-muted-foreground hover:text-foreground hover:bg-secondary'
                    }`}
                  >
                    {level.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Daily Goal */}
            <div className="space-y-4 pt-2">
              <label className="text-sm font-semibold text-foreground flex items-center gap-2">
                <ClockIcon className="h-4 w-4 text-muted-foreground" />
                Daily Study Goal
              </label>
              <div className="flex flex-wrap gap-3">
                {DAILY_GOALS.map((goal) => (
                  <button
                    key={goal}
                    onClick={() => setDailyGoal(goal)}
                    className={`px-5 py-2.5 rounded-xl text-xs font-semibold transition-all duration-200 ${
                      displayGoal === goal
                        ? 'bg-primary text-primary-foreground shadow-md scale-105'
                        : 'bg-secondary/60 text-muted-foreground hover:text-foreground hover:bg-secondary'
                    }`}
                  >
                    {goal} min
                  </button>
                ))}
              </div>
            </div>

            {/* Save Button */}
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
                {saved ? 'Saved!' : 'Save Changes'}
              </Button>
              {updateMutation.isError && (
                <p className="text-sm text-destructive font-semibold">Failed to save. Please try again.</p>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Security */}
        <Card className="glass-card rounded-2xl overflow-hidden border-border/60">
          <CardHeader className="flex flex-row items-center gap-4 pb-2 border-b border-border/40">
            <div className="bg-blue-50 p-3 rounded-xl text-blue-500 border border-blue-100">
              <ShieldCheckIcon className="h-6 w-6" />
            </div>
            <CardTitle className="text-xl font-semibold">Security</CardTitle>
          </CardHeader>
          <CardContent className="p-6">
            <p className="text-muted-foreground text-sm mb-4">
              Password change and account deletion features are protected via HttpOnly session security.
            </p>
            <Button variant="outline" disabled className="opacity-50 rounded-xl font-semibold">
              Change Password (Protected)
            </Button>
          </CardContent>
        </Card>
      </GSAPReveal>
    </GSAPReveal>
  );
}
