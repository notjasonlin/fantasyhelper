'use client';

import { FormMessage, Message } from "@/components/form-message";
import { SubmitButton } from "@/components/submit-button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import Link from "next/link";
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';

export default function Signup({ searchParams }: { searchParams: Message }) {
  const [error, setError] = useState<string | null>(null);
  const [message, setMessage] = useState<string | null>(null);
  const router = useRouter();
  const supabase = createClientComponentClient();

  const handleSignUp = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError(null);
    setMessage(null);

    const formData = new FormData(event.currentTarget);
    const email = formData.get('email') as string;
    const password = formData.get('password') as string;

    console.log('Attempting sign-up with email:', email); // Log the email being used

    try {
      const { data, error } = await supabase.auth.signUp({ 
        email, 
        password,
        options: {
          emailRedirectTo: `${window.location.origin}/auth/callback`,
        },
      });

      if (error) {
        console.error('Sign-up error:', error);
        setError(error.message);
      } else if (data.user) {
        console.log('Sign-up successful, user:', data.user);
        setMessage('Sign-up successful. Redirecting to sign-in page...');
        // Redirect to sign-in page after a short delay
        setTimeout(() => {
          router.push('/sign-in');
        }, 2000);
      } else {
        console.error('Sign-up successful but no user data returned');
        setError('An unexpected error occurred. Please try again.');
      }
    } catch (err) {
      console.error('Unexpected error during sign-up:', err);
      setError('An unexpected error occurred. Please try again.');
    }
  };

  return (
    <>
      <form onSubmit={handleSignUp} className="flex flex-col w-full">
        <h1 className="text-2xl font-medium">Sign up</h1>
        <p className="text-sm text text-foreground">
          Already have an account?{" "}
          <Link className="text-primary font-medium underline" href="/sign-in">
            Sign in
          </Link>
        </p>
        <div className="flex flex-col gap-2 [&>input]:mb-3 mt-8">
          <Label htmlFor="email">Email</Label>
          <Input name="email" placeholder="you@example.com" required />
          <Label htmlFor="password">Password</Label>
          <Input
            type="password"
            name="password"
            placeholder="Your password"
            minLength={6}
            required
          />
          <SubmitButton pendingText="Signing up...">
            Sign up
          </SubmitButton>
        </div>
        {error && <p className="text-red-500 mt-2">{error}</p>}
        {message && <p className="text-green-500 mt-2">{message}</p>}
      </form>
    </>
  );
}
