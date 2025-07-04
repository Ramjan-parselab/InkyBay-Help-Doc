import { Link } from "@remix-run/react"
import { ArrowRight, FileText } from "lucide-react"


export default function CategoryCard({ title, badge, items }) {
  return (
    <div className="bg-white border border-[#eaecf0] rounded-lg overflow-hidden">
      <div className="flex items-center justify-between p-4 bg-[#fffdf0]">
        <div className="flex items-center gap-2">
          <h2 className="font-medium text-[#344054]">{title}</h2>
          <span className="inline-flex items-center justify-center w-6 h-6 rounded-full bg-[#ffd700] text-xs font-medium text-[#344054]">
            {badge}
          </span>
        </div>
        <ArrowRight className="h-4 w-4 text-[#344054]" />
      </div>

      <div className="divide-y divide-[#eaecf0]">
        {items.map((item, index) => (
          <Link key={index} href="#" className="flex items-center gap-3 p-4 hover:bg-[#f9fafb] transition-colors">
            <FileText className="h-4 w-4 text-[#667085] flex-shrink-0" />
            <span className="text-sm text-[#344054]">{item.title}</span>
          </Link>
        ))}
      </div>

      <div className="p-4 border-t border-[#eaecf0]">
        <Link href="#" className="flex items-center gap-2 text-sm text-[#344054] font-medium">
          See all Articles
          <ArrowRight className="h-4 w-4" />
        </Link>
      </div>
    </div>
  )
}
