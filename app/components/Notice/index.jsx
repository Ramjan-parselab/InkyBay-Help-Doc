import Banner from "../ui/banner";
import { useState } from "react";

export default function Notice() {
    // change in here (banner and notic)
    const [bannerShow, setBannerShow] = useState(true);

    // const notice = "<strong>JewelsLab now supports live preview customization!</strong> Check out what&apos;s new in the latest update";
    const handleclickXbutton = ()=>{
            setBannerShow(false);
    }
    return (
        <>
        {bannerShow && 
             <section className="w-full bg-[#DC6803] flex items-center justify-center">
                <div className="flex items-center max-w-7xl lg:px-8 lg:py-3 px-5 py-4">
                    {/* <Banner text={notice} /> */}
                    <Banner handleclick={handleclickXbutton} />
                    
                </div>
            </section>
            }
        </>
    );
} 
