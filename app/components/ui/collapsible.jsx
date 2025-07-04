import { useState } from "react"
import { Plus, Minus } from "lucide-react"

export default function Collapsible({title, text, index}) {
    const [isOpen, setIsOpen] = useState(false);
    const [time, setTime] = useState(false);

    const handleOpenFAQ = () => {
        if (isOpen) {
            setIsOpen(false); // matches animation duration
        } else {
            setIsOpen(true);
        }
    };
  return (
    <div className="">
      <div className={`${index === 1 ? "" : "border-t border-[#eaecf0]"} bg-white overflow-hidden`}>
        <div className="pt-6 flex justify-between items-start gap-2 cursor-pointer" onClick={handleOpenFAQ}>
          <div className="flex flex-col w-full">
            <p className="p1 text-[#101828]">{title}</p>
            
              <div className={`md:-mr-7 -mr-5 md:pr-7 pr-5 overflow-hidden transition-all duration-700 ${isOpen?("max-h-[1000px] opacity-100 mt-4"):("max-h-[0px] opacity-0")}`}>
                <p className="text-[#475467]">
                  {text}
                </p>
              </div>

          </div>
          {isOpen ? (
            <Minus className="h-6 w-6 text-[#98A2B3]" />
          ) : (
            <Plus className="h-6 w-6 text-[#98A2B3]" />
          )}
        </div>
      </div>
    </div>





    // <div className="">
    //   <div className={`${index === 1 ? "" : "border-t border-[#eaecf0]"} bg-white overflow-hidden`}>
    //     <div className="pt-6 flex justify-between items-start gap-2 cursor-pointer" onClick={handleOpenFAQ}>
    //       <div className="flex flex-col w-full">
    //         <p className="p1 text-[#101828]">{title}</p>
    //         {isOpen && (
    //           <div className={`mt-4 overflow-y-auto md:-mr-7 -mr-5 md:pr-7 pr-5 ${time ? "animate-smallToBig" : "animate-bigToSmall"}`}>
    //             <p className={`text-[#475467] ${time ? "animate-dropdown" : "animate-dropUp"}`}>
    //               {text}
    //             </p>
    //           </div>
    //         )}
    //       </div>
    //       {isOpen ? (
    //         <Minus className="h-6 w-6 text-[#98A2B3]" />
    //       ) : (
    //         <Plus className="h-6 w-6 text-[#98A2B3]" />
    //       )}
    //     </div>
    //   </div>
    // </div>
  );
}
