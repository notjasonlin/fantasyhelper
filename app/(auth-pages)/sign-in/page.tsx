'use client';

import { FormMessage, Message } from "@/components/form-message";
import { SubmitButton } from "@/components/submit-button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import Link from "next/link";
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';

export default function Login({ searchParams }: { searchParams: Message }) {
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const supabase = createClientComponentClient();

  const handleSignIn = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError(null);
    setLoading(true);

    const formData = new FormData(event.currentTarget);
    const email = formData.get('email') as string;
    const password = formData.get('password') as string;

    console.log('Attempting sign-in with email:', email);

    try {
      const { data, error } = await supabase.auth.signInWithPassword({ email, password });

      if (error) {
        console.error('Sign-in error:', error);
        setError(error.message);
      } else if (data?.user) {
        console.log('Sign-in successful, user:', data.user);
        console.log('Attempting to redirect to dashboard...');
        
        // Try using Next.js router
        router.push('/dashboard');
        
        // Fallback: use window.location after a short delay
        setTimeout(() => {
          console.log('Fallback: Using window.location to redirect');
          window.location.href = '/dashboard';
        }, 1000);
      } else {
        console.error('Sign-in successful but no user data returned');
        setError('An unexpected error occurred. Please try again.');
      }
    } catch (err) {
      console.error('Unexpected error during sign-in:', err);
      setError('An unexpected error occurred. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSignIn} className="flex-1 flex flex-col min-w-64">
      <h1 className="text-2xl font-medium">Sign in</h1>
      <p className="text-sm text-foreground">
        Don't have an account?{" "}
        <Link className="text-foreground font-medium underline" href="/sign-up">
          Sign up
        </Link>
      </p>
      <div className="flex flex-col gap-2 [&>input]:mb-3 mt-8">
        <Label htmlFor="email">Email</Label>
        <Input name="email" placeholder="you@example.com" required />
        <div className="flex justify-between items-center">
          <Label htmlFor="password">Password</Label>
          <Link
            className="text-xs text-foreground underline"
            href="/forgot-password"
          >
            Forgot Password?
          </Link>
        </div>
        <Input
          type="password"
          name="password"
          placeholder="Your password"
          required
        />
        <SubmitButton pendingText="Signing In...">
          Sign in
        </SubmitButton>
        {error && <p className="text-red-500 mt-2">{error}</p>}
      </div>
    </form>
  );
}
