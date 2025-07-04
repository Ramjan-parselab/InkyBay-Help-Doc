import { ChevronDown, ChevronUp} from "lucide-react"

export default function  NavItem ({ icon, title, isOpen, hasChildren, onClick, level = 0 }) {
    const isTopLevel = level === 0
  
    return (
        <>
            <div className="flex items-center justify-between w-full cursor-pointer py-2 px-3 gap-2 rounded-md bg-[#FFF]" onClick={onClick} >

                <div className="flex items-center gap-3">
                    {isTopLevel && <div>{icon}</div>}
                    {/* <span className={cn("flex-1 text-[#1a1a1a]", level > 0 && "text-sm")}>{title}</span> */}
                    <p className="bold2 text-[#1A1A1A]">{title}</p>
                </div>


                {hasChildren && (
                <div className="text-[#667085]">{isOpen ? <ChevronUp className="transition-all duration-300" size={20} /> : <ChevronUp size={20} className="transition-all duration-300 rotate-180" />}</div>
                )}
            </div>
        </>
    )
  }
