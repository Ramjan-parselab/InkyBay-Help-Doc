import { ArrowRight } from "lucide-react";

export default function Button({variant, icon}) {
    let tone = "";
    switch (variant) {
        case "primary":
        tone = "bg-[#ffd700] text-[#1a1a1a]";
        break;

        case "secondary":
        tone = "border border-[#ffd700] text-white hover:bg-[#564c16] active:bg-[#ffd700]";
        break;
    
        default:""
        break;
    }
    if(icon){
        icon = <ArrowRight className="h-4 w-4" />
        tone = `${tone} flex items-center gap-2`;
    }else{
        icon = "";
    }

    return (
        <>
            <button className={`${tone} font-medium py-2 px-4 rounded-md`}>
                Submit a Ticket {icon}
            </button>
        </>
    );
}