import { ChevronDown, ChevronRight} from "lucide-react";

export default function SubNavItem ({ title, isOpen, onClick, url=false })  {
    return (
        <>  
            <div
                className="flex items-center w-full cursor-pointer py-2 pl-2 pr-4 hover:bg-[#f9fafb] text-sm"
                onClick={onClick}
            >
                {!url && (
                  <div className="text-[#667085] mr-2">{isOpen ?
                   <svg xmlns="http://www.w3.org/2000/svg" width="12" height="10" viewBox="0 0 12 10" fill="none">
                        <path d="M9.72044 2.79062L6.40632 7.43039C6.20691 7.70956 5.79199 7.70956 5.59258 7.43039L2.27846 2.79062C2.04208 2.45968 2.27864 2 2.68533 2L9.31357 2C9.72026 2 9.95682 2.45968 9.72044 2.79062Z" fill="#212121"/>
                    </svg> 
                    :
                    <svg xmlns="http://www.w3.org/2000/svg" width="10" height="12" viewBox="0 0 10 12" fill="none">
                        <path d="M2.79062 2.27907L7.43039 5.59319C7.70956 5.7926 7.70956 6.20752 7.43039 6.40693L2.79062 9.72105C2.45968 9.95743 2 9.72087 2 9.31418V2.68594C2 2.27925 2.45968 2.04269 2.79062 2.27907Z" fill="#212121"/>
                    </svg>
                    }</div>
                )}
                <span className="flex-1 text-gray-800 text-md font-medium">{title}</span>
            </div>
        </>
    )
  }

  