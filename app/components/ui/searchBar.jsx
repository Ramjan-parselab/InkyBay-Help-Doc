import { Search, X } from "lucide-react"

export default function SearchBar() {
  return (
    <div className="w-full max-w-4xl mx-auto">
      <div className="relative border-2 border-[#ffd700] rounded-md px-4 py-3 flex items-center bg-white">
        <Search className="w-6 h-6 text-[#667085] mr-2" />
        <input
          type="text"
          placeholder="i need help with.."
          className="flex-1 bg-transparent outline-none text-[#667085] placeholder-[#667085]"
        />
        <button className="focus:outline-none hover:bg-[#F2F4F7]">
          <X className="w-6 h-6 text-[#98a2b3]" />
        </button>
      </div>
    </div>
  )
}
