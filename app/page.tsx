import Link from 'next/link';
import { Button } from "@/components/ui/button";

export default function LandingPage() {
  return (
    <div className="min-h-screen flex flex-col">
      <header className="bg-black text-white p-4 flex justify-between items-center">
        <h1 className="text-3xl font-bold">NBA Fantasy Helper</h1>
        <div className="space-x-4">
          <Link href="/sign-in">
            <Button variant="outline" className="bg-white text-blue-600 hover:bg-blue-100">Sign In</Button>
          </Link>
          <Link href="/sign-up">
            <Button variant="outline" className="bg-white text-blue-600 hover:bg-blue-100">Sign Up</Button>
          </Link>
        </div>
      </header>

      <main className="flex-grow container mx-auto px-4 py-8">
        <div className="grid md:grid-cols-2 gap-8 items-center">
          <div>
            <h2 className="text-4xl font-bold mb-4">Dominate Your Fantasy League</h2>
            <p className="text-xl mb-6">
              Optimize your NBA fantasy draft with our Draft Board, Player Rankings, and Team Management tools. Make informed decisions and build a winning team from the start.
            </p>
            <Link href="/dashboard">
              <Button className="bg-green-500 text-white px-6 py-3 rounded-lg text-lg font-semibold hover:bg-green-600 transition-colors">
                Get Started for Free
              </Button>
            </Link>
          </div>
        </div>
      </main>
    </div>
  );
}
