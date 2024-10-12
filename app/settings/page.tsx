'use client';

import { useState, useEffect } from 'react';
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import Sidebar from '@/components/Sidebar';

export default function Settings() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState('');
  const supabase = createClientComponentClient();

  useEffect(() => {
    async function getUser() {
      const { data: { user } } = await supabase.auth.getUser();
      if (user) setEmail(user.email || '');
    }
    getUser();
  }, [supabase.auth]);

  const handleUpdateEmail = async () => {
    const { error } = await supabase.auth.updateUser({ email });
    if (error) setMessage(error.message);
    else setMessage('Email updated successfully');
  };

  const handleUpdatePassword = async () => {
    const { error } = await supabase.auth.updateUser({ password });
    if (error) setMessage(error.message);
    else setMessage('Password updated successfully');
  };

  return (
    <div className="flex min-h-screen">
      <Sidebar />
      <div className="flex-1 ml-64 p-8">
        <h1 className="text-3xl font-bold mb-8">Settings</h1>
        <div className="max-w-md">
          <div className="mb-4">
            <label className="block mb-2">Email</label>
            <Input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full"
            />
            <Button onClick={handleUpdateEmail} className="mt-2">Update Email</Button>
          </div>
          <div className="mb-4">
            <label className="block mb-2">New Password</label>
            <Input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full"
            />
            <Button onClick={handleUpdatePassword} className="mt-2">Update Password</Button>
          </div>
          {message && <p className="text-green-500">{message}</p>}
        </div>
      </div>
    </div>
  );
}

