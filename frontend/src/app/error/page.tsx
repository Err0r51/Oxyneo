import React from 'react';
import { Mountain } from 'lucide-react';

export default function ErrorPage() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-background text-foreground p-4">
      <Mountain size={60} color="hsl(var(--primary))" className="mb-4" />
      <div className="flex items-center text-center space-x-2">
        <h1 className="text-xl md:text-2xl font-bold">ERROR</h1>
        <span>|</span>
        <p>Frede will fix this when he is back from bouldering.</p>
      </div>
    </div>
  );
}
