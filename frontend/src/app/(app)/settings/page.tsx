'use client';

import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { api } from '@/lib/api';
import { useAuthStore } from '@/store/useAuthStore';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Settings, User, Target, Clock, Shield, Loader2, Check } from 'lucide-react';

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

  // Derived values: use local state if user changed, otherwise profile data
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
      <div className="flex h-full items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500 max-w-3xl mx-auto pb-12">
      <div>
        <h1 className="h1-premium text-3xl">Account Settings</h1>
        <p className="text-muted-foreground text-lg mt-1">Manage your profile and study preferences.</p>
      </div>

      {/* Profile Overview */}
      <Card className="glass-card">
        <CardHeader className="flex flex-row items-center gap-4 pb-2">
          <div className="bg-primary/20 p-3 rounded-full">
            <User className="h-6 w-6 text-primary" />
          </div>
          <CardTitle className="text-xl">Profile</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="text-sm font-medium text-muted-foreground">Username</label>
              <Input value={profile?.username || user?.username || ''} disabled className="bg-secondary/50" />
            </div>
            <div className="space-y-1.5">
              <label className="text-sm font-medium text-muted-foreground">Email</label>
              <Input value={profile?.email || ''} disabled className="bg-secondary/50" />
            </div>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="text-sm font-medium text-muted-foreground">Member Since</label>
              <Input
                value={profile?.date_joined ? new Date(profile.date_joined).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' }) : ''}
                disabled
                className="bg-secondary/50"
              />
            </div>
            <div className="space-y-1.5">
              <label className="text-sm font-medium text-muted-foreground">Total XP</label>
              <Input value={profile?.total_xp?.toLocaleString() || '0'} disabled className="bg-secondary/50" />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Study Preferences */}
      <Card className="glass-card">
        <CardHeader className="flex flex-row items-center gap-4 pb-2">
          <div className="bg-accent/20 p-3 rounded-full">
            <Target className="h-6 w-6 text-accent" />
          </div>
          <CardTitle className="text-xl">Study Preferences</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* JLPT Target Level */}
          <div className="space-y-3">
            <label className="text-sm font-medium">Target JLPT Level</label>
            <div className="flex flex-wrap gap-2">
              {JLPT_LEVELS.map((level) => (
                <button
                  key={level.value}
                  onClick={() => setCurrentLevel(level.value)}
                  className={`px-4 py-2.5 rounded-lg text-sm font-medium transition-all ${
                    displayLevel === level.value
                      ? 'bg-primary text-primary-foreground shadow-md'
                      : 'bg-secondary/50 text-muted-foreground hover:text-foreground hover:bg-secondary'
                  }`}
                >
                  {level.label}
                </button>
              ))}
            </div>
          </div>

          {/* Daily Goal */}
          <div className="space-y-3">
            <label className="text-sm font-medium flex items-center gap-2">
              <Clock className="h-4 w-4 text-muted-foreground" />
              Daily Study Goal
            </label>
            <div className="flex flex-wrap gap-2">
              {DAILY_GOALS.map((goal) => (
                <button
                  key={goal}
                  onClick={() => setDailyGoal(goal)}
                  className={`px-4 py-2.5 rounded-lg text-sm font-medium transition-all ${
                    displayGoal === goal
                      ? 'bg-primary text-primary-foreground shadow-md'
                      : 'bg-secondary/50 text-muted-foreground hover:text-foreground hover:bg-secondary'
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
              variant="premium"
              onClick={handleSave}
              disabled={!hasChanges || updateMutation.isPending}
              className="gap-2"
            >
              {updateMutation.isPending ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : saved ? (
                <Check className="h-4 w-4" />
              ) : (
                <Settings className="h-4 w-4" />
              )}
              {saved ? 'Saved!' : 'Save Changes'}
            </Button>
            {updateMutation.isError && (
              <p className="text-sm text-destructive">Failed to save. Please try again.</p>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Security */}
      <Card className="glass-card">
        <CardHeader className="flex flex-row items-center gap-4 pb-2">
          <div className="bg-blue-500/20 p-3 rounded-full">
            <Shield className="h-6 w-6 text-blue-500" />
          </div>
          <CardTitle className="text-xl">Security</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground text-sm mb-4">
            Password change and account management features are coming soon.
          </p>
          <Button variant="outline" disabled className="opacity-50">
            Change Password
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
