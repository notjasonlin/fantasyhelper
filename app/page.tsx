import Link from 'next/link';
import Image from 'next/image';
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
        <div className="grid md:grid-cols-2 gap-8 items-center mb-12">
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
          <div className="relative w-full h-[400px]">
            <Image
              src="/example.png"
              alt="NBA Fantasy Helper Example"
              layout="fill"
              objectFit="contain"
            />
          </div>
        </div>

        <div className="mt-16">
          <h3 className="text-3xl font-bold mb-6 text-center">Powerful Features to Boost Your Fantasy Game</h3>
          <div className="grid md:grid-cols-2 gap-8 items-center">
            <div className="relative w-full h-[400px]">
              <Image
                src="/example2.png"
                alt="Additional NBA Fantasy Helper Feature"
                layout="fill"
                objectFit="contain"
              />
            </div>
            <div>
              <h4 className="text-2xl font-semibold mb-4">Advanced Analytics at Your Fingertips</h4>
              <p className="text-lg mb-6">
                Dive deep into player statistics, trends, and projections. Our advanced analytics tools give you the edge you need to make data-driven decisions and outperform your competition.
              </p>
                <Button className="bg-blue-500 text-white px-6 py-3 rounded-lg text-lg font-semibold hover:bg-blue-600 transition-colors">
                  Explore Features
                </Button>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
