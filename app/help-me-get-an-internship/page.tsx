import Link from 'next/link'
import { Button } from '@/components/ui/button'

export default function HelpMeGetAnInternship() {
  return (
    <div className="max-w-3xl mx-auto text-center">
      <Link href="/dashboard">
        <Button className="bg-green-500 text-white px-8 py-4 rounded-lg text-xl font-semibold hover:bg-green-600 transition-colors">
          Back to Fantasy Helper
        </Button>
      </Link>

      <div className="mt-16 bg-gray-100 p-8 rounded-lg shadow-md">
        <h3 className="text-2xl font-semibold mb-4">Why I Created This</h3>
        <p className="text-lg mb-6">
          As a passionate fantasy basketball player, I've always dreamed of having a tool that could give me an edge in my leagues. That's why I poured my heart and soul into creating NBA Fantasy Helper. This project is a labor of love, born out of countless hours of coding and my deep enthusiasm for the game we all love.
        </p>
        <p className="text-lg mb-6">
          If you find this tool helpful, I'd be incredibly grateful if you could share it with your fellow fantasy basketball enthusiasts and star the project on GitHub. Your support means the world to me and helps motivate further improvements.
        </p>
        <p className="text-lg mb-6">
          GitHub Project: <a href="https://github.com/notjasonlin/fantasyhelper" className="text-blue-600 hover:underline">Star my Project, This Helps Me Get an Internship</a>
        </p>
        <div className="bg-white p-4 rounded-md">
          <h4 className="text-xl font-semibold mb-2">Support the Project</h4>
          <p className="text-md mb-4">
            If you'd like to buy me a cup of coffee to fuel more features, you can do so via:
          </p>
          <ul className="list-disc list-inside">
            <li>Cash App: $jaslijay</li>
            <li>Zelle: linyongkang9@gmail.com</li>
          </ul>
        </div>
      </div>
    </div>
  )
}
