import { Link } from "@remix-run/react";
import { ArrowRight } from "lucide-react";

export default function Card({title, icon, text, buttonText, url= null , variant= null}){
    return (
        <>
        {variant == "support" ? (
            <div className="max-w-[375px] p-[30px] flex flex-col items-start gap-6 rounded-xl bg-[#FFF]">
                {icon && 
                    <div className="h-6 w-6">
                        {icon}
                    </div>
                }
                <div className="flex gap-4 flex-col items-start">
                    <p className="p1 text-[#1A1A1A]">
                        <Link to={url}>
                            {title}
                        </Link>
                    </p>
                    <p className="text-[#667085]">{text}</p>
                </div>

                <div>
                    <p className="bold2">
                        <Link to={url} className="flex gap-[6px] items-center text-[#476DF2] hover:underline">
                            {buttonText}
                            <ArrowRight className="h-4 w-4" />
                        </Link>
                    </p>
                </div>
                
            </div>

        )  :  variant == "featured" ?  (
             <div className="max-w-[375px] flex flex-col justify-center items-start sm:p-6 p-6 gap-9 rounded-2xl border-[1px] border-[#C0C0C0] bg-white hover:bg-[#FFF8ED] transition-colors duration-500 group">   
                <div className="flex items-start space-x-4 gap-2">
                    <div className="flex flex-col gap-2">
                        <div className="flex flex-row gap-3">
                             <div>
                                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="25" viewBox="0 0 24 25" fill="none">
                                    <path d="M8.37658 16.1163L2.71973 21.7732M11.6943 7.14181L10.1334 8.7027C10.0061 8.83003 9.9424 8.89369 9.86986 8.94427C9.80548 8.98917 9.73604 9.02634 9.66297 9.055C9.58065 9.08729 9.49236 9.10495 9.3158 9.14026L5.65133 9.87315C4.69903 10.0636 4.22288 10.1588 4.00012 10.4099C3.80605 10.6286 3.71743 10.9213 3.75758 11.2109C3.80367 11.5434 4.14703 11.8867 4.83375 12.5735L11.9195 19.6592C12.6062 20.3459 12.9496 20.6893 13.282 20.7354C13.5716 20.7755 13.8643 20.6869 14.083 20.4928C14.3341 20.2701 14.4293 19.7939 14.6198 18.8416L15.3527 15.1771C15.388 15.0006 15.4056 14.9123 15.4379 14.83C15.4666 14.7569 15.5038 14.6875 15.5487 14.6231C15.5992 14.5505 15.6629 14.4869 15.7902 14.3596L17.3511 12.7987C17.4325 12.7173 17.4732 12.6766 17.518 12.641C17.5577 12.6095 17.5998 12.581 17.6439 12.5558C17.6935 12.5274 17.7464 12.5048 17.8522 12.4594L20.3466 11.3904C21.0743 11.0785 21.4381 10.9226 21.6034 10.6706C21.7479 10.4503 21.7996 10.1818 21.7473 9.92348C21.6874 9.62813 21.4075 9.34822 20.8477 8.78839L15.7045 3.64526C15.1447 3.08543 14.8648 2.80552 14.5695 2.74565C14.3112 2.69329 14.0427 2.745 13.8223 2.88953C13.5703 3.05481 13.4144 3.41866 13.1025 4.14636L12.0335 6.64071C11.9882 6.74653 11.9655 6.79944 11.9372 6.84905C11.912 6.89313 11.8835 6.93522 11.8519 6.97496C11.8164 7.01971 11.7757 7.06041 11.6943 7.14181Z" stroke="#F58220" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                                </svg>
                             </div>
                             <Link to={url}>
                                <h3 className="text-lg font-medium text-[#1a1a1a]">
                                    {title}
                                </h3>
                             </Link>
                        </div>
                        <Link to={url}>
                            <p className="opacity-50 text-[#1a1a1a]">
                                {text}
                            </p>
                        </Link>
                    </div>
                </div>
            </div>
        ) : (
            <div className="max-w-[375px] flex flex-col justify-center items-start sm:p-6 p-5 gap-9 rounded-2xl border-[1px] border-[#C0C0C0] bg-white hover:bg-[#FFF8ED] transition-colors duration-500 group">
                    <div className="flex flex-col justify-center items-start gap-5">
                        {icon && 
                        <div className="relative h-12 w-12 p-3 shadow-xs flex items-center justify-center rounded-xl border-[1px] border-[#EAECF0] bg-[#FFF] overflow-hidden">
                            <div className="absolute inset-0 z-0 bg-[linear-gradient(45deg,_#F58220_5.77%,_#D42427_96.77%)] opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-xl"></div>
                            <div className="relative z-10">
                                {icon}
                            </div>
                        </div>
                        }
                        <div className="flex flex-col justify-center items-start gap-2">
                            <h6 className="bold3 text-[#101828]">
                                {url ? (
                                    <Link to={url} >{title}</Link>
                                ) : (
                                    <Link href="#" >{title}</Link>
                                )}
                            </h6>
                            <p className="text-[#475467]">{text}</p>
                        </div>
                    </div>

                    {url ? (
                        <p className="text-[#667085]">
                            <Link to={url}>{buttonText}</Link>
                        </p>
                    ) : (
                        <p className="text-[#667085]">{buttonText}</p>
                    )}
                    
            </div>
        )}

        </>
    );
}