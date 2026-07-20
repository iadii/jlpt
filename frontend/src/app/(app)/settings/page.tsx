'use client';

import { Card, CardContent } from '@/components/ui/card';
import { Settings } from 'lucide-react';

export default function SettingsPage() {
  return (
    <div className="h-full flex items-center justify-center animate-in fade-in slide-in-from-bottom-4 duration-500">
      <Card className="glass-card max-w-lg w-full text-center p-12">
        <CardContent className="space-y-6">
          <div className="mx-auto bg-secondary p-6 rounded-full w-24 h-24 flex items-center justify-center text-muted-foreground mb-6">
            <Settings className="h-12 w-12" />
          </div>
          <h1 className="h1-premium text-3xl">Account Settings</h1>
          <p className="text-muted-foreground text-lg">
            Manage your profile, adjust your daily study goals, and change your preferred UI language. Coming soon.
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
