import { Link } from "@remix-run/react";
import { Facebook, Twitter, Instagram, Linkedin, Youtube, PinIcon as Pinterest } from "lucide-react";
import { useTranslation } from "react-i18next";
import { useLang } from "../../context/LangContext";

export default function TopSection({footerMenuData, socialMediaData}) {
    const {t} = useTranslation() || {};
    const selectedLanguage = useLang();
    
    return (
        <>
           <div className="w-full flex justify-between gap-6 md:items-center items-start md:flex-row flex-col">
                <div>
                  <Link to="/" className="inline-block md:w-64 w-[200px]">
                    <img 
                      src="/images/footer/shopify-badge.svg"
                      alt="Available on Shopify App Store"
                      width={240}
                      height={48}
                    />
                  </Link>
                </div>

                <div className="flex flex-col md:flex-row items-start md:items-center md:flex-wrap gap-9 justify-center">
                  {footerMenuData?.length > 0 ? (
                      <>
                      {footerMenuData?.map((menu)=> (
        
                        <div key={menu?.id}>
                          {menu?.newTab ? (
                              <Link to={menu?.url} target="_blank" rel="noopener noreferrer" className="p1 text-[#1A1A1A] hover:underline text-sm ">
                              {menu?.footerMenuLanguage?.[0]?.name}
                          </Link>
                          ) : (
                              <Link to={`/${selectedLanguage}/${menu?.url}`} className="p1 text-[#1A1A1A] hover:underline text-sm ">
                                {menu?.footerMenuLanguage?.[0]?.name}
                            </Link>
                          )}
                        </div>
                        
                      ))}
                      </>
                      
                  ) : (
                      <Link to="#" className="text-gray-600 hover:text-gray-900 text-sm">
                          {t("no_visit_link")}
                      </Link>
                  )}
                  
                </div>

                <div className="flex flex-wrap items-center lg:gap-5 gap-7">
                  {/* {socialMediaData?.filter((item) => (item?.name === "Facebook" || item?.name === "facebook")) } */}
                  <Link 
                      // to={socialMediaData?.filter((item)=> (item?.name === "Facebook" || item?.name === "facebook")?.[0]?.url} 
                      to={socialMediaData?.length > 0 ? socialMediaData?.filter((item)=> (item?.name === "Facebook" || item?.name === "facebook"))?.[0]?.url : ""}
                      target="_blank" 
                      rel="noopener noreferrer" 
                      className="text-gray-600 hover:text-gray-900">
                      <Facebook className="h-6 w-6" />
                  </Link>
                  <Link 
                       to={socialMediaData?.length > 0 ? socialMediaData?.filter((item)=> (item?.name === "Twitter" || item?.name === "twitter"))?.[0]?.url : ""}
                       className="text-gray-600 hover:text-gray-900">
                      <Twitter className="h-6 w-6" />
                  </Link>
                  <Link 
                      to={socialMediaData?.length > 0 ? socialMediaData?.filter((item)=> (item?.name === "Instagram" || item?.name === "instagram"))?.[0]?.url : ""}
                      className="text-gray-600 hover:text-gray-900">
                      <Instagram className="h-6 w-6" />
                  </Link>
                  <Link 
                      to={socialMediaData?.length > 0 ? socialMediaData?.filter((item)=> (item?.name === "Linkedin" || item?.name === "linkedin"))?.[0]?.url : ""}
                      className="text-gray-600 hover:text-gray-900">
                      <Linkedin className="h-6 w-6" />
                  </Link>
                  <Link 
                      to={socialMediaData?.length > 0 ? socialMediaData?.filter((item)=> (item?.name === "Youtube" || item?.name === "youtube"))?.[0]?.url : ""}
                      target="_blank" rel="noopener noreferrer" className="text-gray-600 hover:text-gray-900">
                      <Youtube className="h-6 w-6" />
                  </Link>
                  <Link  
                      to={socialMediaData?.length > 0 ? socialMediaData?.filter((item)=> (item?.name === "Pinterest" || item?.name === "pinterest"))?.[0]?.url : ""}
                      className="text-gray-600 hover:text-gray-900">
                      <Pinterest className="h-6 w-6" />
                  </Link>
                </div>

          </div>
        </>
    );

}
