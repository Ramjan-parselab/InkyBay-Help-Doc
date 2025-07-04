import {  useState } from "react";
import SearchBar from "./SearchBar";
import { useTranslation } from "react-i18next";


export default function Hero() {
    const { t } = useTranslation() || {};
    const [blurEffect, setBlurEffect] = useState(false);
    const handleBlurEffect = ()=>{
        setBlurEffect(false);
    }
    

    return (
        <>
            <div className="w-full relative sm:py-24 py-12 px-5 text-center bg-[#FFF8ED]">
                    <div className="flex flex-col items-center gap-4 md:gap-9 mx-auto">
                        <div className="flex flex-col md:gap-0 gap-4">
                            <h1 className="text-[#1a1a1a] text-center">{ t("welcome") }</h1>
                            <p className="p1 text-[#1a1a1a] text-center">{ t("how_can_help") }</p>
                        </div>
            
                        {blurEffect &&
                        <div onClick={handleBlurEffect} className="fixed inset-0 h-screen bg-black/50">
                        </div>
                        }
            
                        <div className="w-full flex flex-col items-center gap-3">
                            <SearchBar blurEffect={blurEffect} handleBlur={handleBlurEffect} setBlur={()=>setBlurEffect(true)} />
                        </div>

                    </div>
            </div>
        </>
    );
}