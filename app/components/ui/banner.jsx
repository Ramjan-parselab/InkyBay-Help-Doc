import { Info,  XIcon } from "lucide-react"

// change in here(function text value)

// export default function Banner({ variant = "simple", text=null }) {
export default function Banner({ variant = "simple", handleclick}) {

    return (
      <>
        <div className="hidden lg:flex items-center gap-4">
        {/* change in here -- (icon animation) */}
            <div className="h-10 flex justify-center items-center">
                <div className="relative flex justify-center items-center">
                    <div className="absolute w-6 h-6 rounded-full animate-ripple"></div>
                    <div className="absolute w-6 h-6 rounded-full animate-ripple" style={{ animationDelay: '0.7s' }}></div>
                    <div className="z-1 flex justify-center items-center w-5 h-5 rounded-full">
                        <Info className="h-5 w-5 text-[#fff]" />
                    </div>
                </div>
            </div>

                <span className="span1 text-[#fff] flex gap-1">
                    <span className="span1 bold3 text-[#fff]">
                        JewelsLab now supports live preview customization!
                    </span>
                    Check out what’s new in the
                    <a href="#" className="text-[#fff] underline" style={{ textUnderlineOffset: '4px' }}>
                        <span className="span1 bold3 text-[#fff]">latest update.</span>
                    </a>
                </span>

            <button onClick={handleclick}>
                <XIcon className="w-5 h-5 text-[#fff]"/>
            </button>

            {variant === "simple" ? (
                <>
                {/* <button
                    className="text-yellow-900 hover:text-yellow-950 ml-4"
                    aria-label="Close notification"
                >
                    <X className="h-5 w-5" />
                </button> */}
                </>
            ) : (
                <div className="flex items-center gap-2 ml-4">
                    <button  type="button" className="focus:outline-none text-black bg-white hover:bg-slate-200 font-medium rounded-lg text-sm px-5 py-2.5 ">Dismiss</button>
                    <button type="button" className="focus:outline-none text-white bg-black hover:bg-black/80 font-medium rounded-lg text-sm px-5 py-2.5">View Change</button>
                </div>
            )}

        </div>


        <div className="lg:hidden flex flex-col items-center">
            <div className="w-full flex justify-between">
                {/* change in here -- (icon animation) */}
                <div className="h-10 flex justify-center items-center">
                    <div className="relative flex justify-center items-center">
                        <div className="absolute w-6 h-6 rounded-full animate-ripple"></div>
                        <div className="absolute w-6 h-6 rounded-full animate-ripple" style={{ animationDelay: '0.7s' }}></div>
                        <div className="flex justify-center items-center w-5 h-5 rounded-full">
                            <Info className="h-5 w-5 text-[#fff]" />
                        </div>
                    </div>
                </div>
                <button onClick={handleclick}>
                    <XIcon className="w-5 h-5 text-[#fff]"/>
                </button>
            </div>
            <span className="span1 text-[#fff]">
                <strong className="span1 bold3 text-[#fff] mr-1">
                    JewelsLab now supports live preview customization!
                </strong>
                Check out what’s new in the
                <strong className="text-[#fff] underline span1 bold3 ml-1" style={{ textUnderlineOffset: '4px' }}><a href="#">latest update.</a></strong>
                
            </span>

        </div>
      </>
    )
}
