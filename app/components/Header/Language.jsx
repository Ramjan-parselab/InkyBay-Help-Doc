import { useEffect, useState } from "react"
import { ChevronDown, ImageIcon } from "lucide-react"
import { useTranslation } from "react-i18next"
import { Link } from "@remix-run/react";


export default function LanguageSelector({languages, handleSubmit}) {
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


    return (
        <>
            <div className="flex items-center gap-2 cursor-pointer">
                <div className="w-full max-w-48 mx-auto">
                    <div className="relative">
                      {/* Dropdown Button */}
                      <button
                          onClick={() => setIsOpen(!isOpen)}
                          className={`flag_button border-[1px] ${isOpen?("border-[#F58220]"):("border-[transparent] hover:border-[#c0c0c0]")}`}
                      >
                        <div className="flex items-center gap-2">
                            <div className="w-6 h-6 flex-shrink-0 rounded-full overflow-hidden">
                                {selectedLanguage?.flug ? (
                                <img className="h-6 w-6 object-cover" src={`${selectedLanguage?.flug}`} alt={selectedLanguage?.name} />
                                ) : (
                                    <ImageIcon className="w-6 h-6 text-gray-300"/>
                                )}
                            </div>
                            <p className="text-[#1a1a1a]">{selectedLanguage?.name}</p>
                        </div>
                        <ChevronDown className={`ml-2 w-5 h-5 text-[#1a1a1a] transition-transform duration-500 ${isOpen ? "transform rotate-180" : ""}`}/>
                          
                      </button>

                      {/* Dropdown Menu */}
                      
                        <div className={`flag_dropdown_menu transition-all duration-500 ${isOpen? ("animate-smallToBig"):("animate-bigToSmall")}`}>
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

            <Link to={`/${selectedLanguage?.code}/ticket`}  className="flex justify-center items-center px-3 py-2 bg-[linear-gradient(45deg,_#F58220_5.77%,_#D42427_58.77%)] text-[#fff] rounded-lg shadow-sm hover:bg-[#FC0]">
              {t("submit_a_ticket")}
            </Link>
        
        </>
    )
}
