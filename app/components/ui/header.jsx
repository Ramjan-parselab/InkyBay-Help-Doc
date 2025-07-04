
import { Link } from "@remix-run/react"
import { ChevronDown } from "lucide-react"

export default function Header() {
  return (
    <div className="min-h-screen">
      <header className="bg-transparent px-4 py-3 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="relative w-10 h-10">
            <svg
              width="40"
              height="40"
              viewBox="0 0 40 40"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
              className="absolute inset-0"
            >
              <path d="M20 0L38.6603 10V30L20 40L1.33975 30V10L20 0Z" fill="#FFD700" />
            </svg>
          </div>
          <div className="flex items-center">
            <span className="text-white text-xl font-semibold">JewelsLab</span>
            <span className="text-[#acacac] text-xl ml-2">Help Center</span>
          </div>
        </div>
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2 text-white cursor-pointer">
            <div className="w-6 h-4 relative">
              <div className="absolute inset-0 bg-[#f0f0f0]"></div>
              <div className="absolute inset-0">
                <div className="absolute top-0 left-0 right-0 h-1/3 bg-[#d80027]"></div>
                <div className="absolute bottom-0 left-0 right-0 h-1/3 bg-[#d80027]"></div>
                <div className="absolute top-1/3 bottom-1/3 left-0 w-1/3 bg-[#0052b4]"></div>
              </div>
            </div>
            <span>English (US)</span>
            <ChevronDown className="w-4 h-4" />
          </div>
          <Link
            href="#"
            className="bg-[#ffd700] text-[#1a1a1a] px-4 py-2 rounded font-medium hover:bg-[#ffd700]/90 transition-colors"
          >
            Submit a Ticket
          </Link>
        </div>
      </header>
      <main className="max-w-7xl mx-auto p-6">{/* Main content would go here */}</main>
    </div>
  )
}
