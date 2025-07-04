import { Link } from "@remix-run/react";
import Language from "./Language"
import defaultlogo from "/images/logo/logo.svg";
import { useState, useEffect } from "react";
import { XIcon, ChevronDown } from "lucide-react";
import { useTranslation } from "react-i18next"


export default function Header({logoData, languages, handleSubmit}) {

    const {t} = useTranslation() || {} ;
    const [isOpen, setIsOpen] = useState(false);
    const languageData = languages;
    
    const [selectedLanguage, setSelectedLanguage] = useState({});
    const [newUrlPathName, setNewUrlPathName] = useState("");


    const handleSelectLanguage = (language) => {
        setSelectedLanguage(language);
        setIsOpen(false);
        
        const newUrl = newUrlPathName ?  `${language?.code}/${newUrlPathName}` : `${language?.code}`;
        
        const submitData = {
            target: "language-change",
            url: newUrl
        };
        handleSubmit(submitData);
    }


    useEffect(()=> {
        // Findout current url and split the browser url 
        // Here first index is blank that's why index start form 1
        const urlPath = window?.location?.pathname?.split("/");
        const languageUrlCode = urlPath?.[1];
        const category = urlPath?.[2];
        const subCategory = urlPath?.[3];
        const subSubCategory = urlPath?.[4];

        // Check any category, subcategory or sub sub category is blank 
        // If blank then ignore this
        const newUrl =  subSubCategory ? `${category}/${subCategory}/${subSubCategory}` :
                        subCategory ? `${category}/${subCategory}`: 
                        category ?  `${category}` : "";

        
        const getUrlLanguage = languageData?.filter((item)=> item?.code === languageUrlCode)?.[0];

        if(getUrlLanguage){
          setSelectedLanguage(getUrlLanguage);
        }else{
          setSelectedLanguage(languageData?.[0]);
        }
        setNewUrlPathName(newUrl);

    },[languageData]);


    const [isVisible, setIsVisible] = useState(true);
  const [prevScrollY, setPrevScrollY] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;

      if (currentScrollY > prevScrollY && currentScrollY > 80) {
        setIsVisible(false);
      } else {
        setIsVisible(true);
      }

      setPrevScrollY(currentScrollY);
    };

    window.addEventListener('scroll', handleScroll);
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };

  }, [prevScrollY]);


    const [mobileDropDown, setMobileDropDown] = useState(false);

    
    return (
        <>
            <header className={`Header_nav_bar ${!mobileDropDown && isVisible ? 'top-0' : '-top-80'} ${mobileDropDown&&("top-0")} px-5 px_Header md:py-6 z-50`}>
                <div className="flex flex-row justify-center items-center gap-2">

                    <Link to="/" > 
                        <img className="logo_size" src={ logoData? `${logoData?.url}` : defaultlogo} alt="logo"/>
                    </Link>

                </div>
                <div className="hidden md:flex items-center gap-4">
                    <Language languages={languages} handleSubmit={handleSubmit}/>
                </div>

                {/* Mobile version */}
                <div className="md:hidden p-3 flex justify-center items-center rounded-xl border-[1px] border-[#1a1a1a] overflow-hidden">
                    <button onClick={()=>setMobileDropDown((p)=>!p)}>
                        {mobileDropDown?(
                            <>
                                <XIcon className="w-6 h-6 text-[#1a1a1a] animate-dropdown"/>
                            </>
                        ):(
                            <svg className="animate-dropdown" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none">
                                <path d="M3 12H21M3 6H21M3 18H21" stroke="#1a1a1a" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                            </svg>
                        )}
                    </button>
                </div>

                {mobileDropDown &&(
                    <div className="md:hidden w-full min-h-44 absolute px-5 pt-6 pb-12 z-10 top-24 left-0 bg-[#FFF8ED]">
                        <div className="flex flex-col justify-center items-start gap-9">
                            
                            <div className="flex items-center gap-2 text-white cursor-pointer">
                                <div className="w-full max-w-xs mx-auto">
                                    <div className="relative">
                                    {/* Dropdown Button */}
                                    <button
                                        onClick={() => setIsOpen(!isOpen)}
                                        className={`w-full min-w-44 flex items-center px-[14px] py-[10px] rounded-lg ${isOpen && ("border-[1px] border-[#F58220]")}`}
                                    >
                                        <div className="w-full flex flex-row items-center justify-between gap-2">
                                            <div className="flex items-center gap-2">
                                                <div className="w-4 h-4 flex-shrink-0 rounded-full overflow-hidden">
                                                    <img className="h-6 w-6 object-cover" src={`${selectedLanguage?.flug}`} alt={selectedLanguage?.name} />
                                                  
                                                </div>
                                                <p className="text-[#1a1a1a]">{selectedLanguage?.name}</p>
                                            </div>

                                            <ChevronDown className={`ml-2 w-5 h-5 text-[#1a1a1a] transition-transform duration-500 ${isOpen ? "transform rotate-180" : ""}`}/>
                                        </div>
                                    </button>

                                    {/* Dropdown Menu */}
                                    <div className={`flag_dropdown_menu transition-all duration-500 ${isOpen? ("max-h-[1000px]"):("max-h-[0px] opacity-80")}`}>
                                        <div className="w-full p-[14px] inline-flex flex-col items-start">
                                        {languageData?.length > 0 && languageData.map((language) => (
                                            <button
                                            key={language.code}
                                            className={`w-full flex items-center px-[14px] py-[10px] gap-2 rounded-lg hover:bg-[#EEE]`}
                                            onClick={() => handleSelectLanguage(language)}
                                            >
                                            <div className="h-6 w-6 overflow-hidden">
                                                <img src={`${language?.flug}`} alt={language?.name} />
                                            </div>
                                            <span className="text-[#1a1a1a] text-sm font-medium">{language.name}</span>
                                            </button>
                                        ))}

                                        </div>
                                    </div>

                                    </div>
                                </div>
                            </div>

                            <button className="flex absolute -z-10 top-24 justify-center items-center px-4 py-3 bg-[linear-gradient(45deg,_#F58220_5.77%,_#D42427_58.77%)] text-[#fff] rounded-lg shadow-sm">
                            {t("submit_a_ticket")}
                            </button>
                        </div>
                    </div>
                )}
                
            </header>
            {mobileDropDown &&(<div onClick={()=>{setMobileDropDown(false); setIsOpen(false)}} className="fixed z-20 inset-0 bg-black/50"></div>)}
        </>
    );
}