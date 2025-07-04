import { Link } from "@remix-run/react";
import { Search } from "lucide-react";


export default function Breadcrumb() {
  return (
    <div className="min-h-screen bg-white">
      <div className="border-b border-[#d0d5dd]">
        <div className="container mx-auto px-4 py-3 flex justify-between items-center">
          <nav className="flex items-center space-x-2">
            <Link href="/" className="text-[#667085] hover:text-[#475467] transition-colors">
              <div className="flex items-center">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="20"
                  height="20"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="mr-1"
                >
                  <path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
                  <polyline points="9 22 9 12 15 12 15 22" />
                </svg>
                <span>Home</span>
              </div>
            </Link>
            <span className="text-[#98a2b3]">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <polyline points="9 18 15 12 9 6" />
              </svg>
            </span>
            <Link href="/theme-integration" className="text-[#667085] hover:text-[#475467] transition-colors">
              Theme Integration
            </Link>
            <span className="text-[#98a2b3]">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <polyline points="9 18 15 12 9 6" />
              </svg>
            </span>
            <Link href="/customize-app-appearance" className="text-[#667085] hover:text-[#475467] transition-colors">
              Customize app appearance
            </Link>
            <span className="text-[#98a2b3]">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <polyline points="9 18 15 12 9 6" />
              </svg>
            </span>
            <span className="text-[#1a1a1a] font-medium">Typography settings</span>
          </nav>
          <div className="relative">
            <div className="absolute inset-y-0 left-3 flex items-center pointer-events-none">
              <Search className="h-4 w-4 text-[#667085]" />
            </div>
            <input
              type="text"
              placeholder="Search"
              className="bg-transparent placeholder-[#667085] pl-10 pr-4 py-2 rounded-lg border border-[#d0d5dd] focus:outline-none focus:ring-2 focus:ring-[#94a3b8] focus:border-transparent w-64"
            />
          </div>
        </div>
      </div>
      <div className="container mx-auto px-4 py-6">{/* Content for Typography settings would go here */}</div>
    </div>
  )
}
