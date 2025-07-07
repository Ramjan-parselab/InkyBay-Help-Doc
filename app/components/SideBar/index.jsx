import { Link, useParams } from "@remix-run/react";
import { ChevronUp, MenuIcon } from "lucide-react";
import { useEffect, useState } from "react";
import { useLang } from "../../context/LangContext";

export default function Sidebar({ categoryData, selectedCategory }) {
    const [openItems, setOpenItems] = useState({});
    const selectedLanguage = useLang();
    const params = useParams();
    
    const toggleItem = (item) => {
        setOpenItems((prev) => ({
            ...prev,
            [item]: !prev[item],
        }));
    };

    useEffect(() => {
        const category = selectedCategory?.name;
        const subcategory = selectedCategory?.subCategory?.[0]?.name;
        const doctitle = selectedCategory?.subCategory?.[0]?.docs?.[0]?.title;

        if (category) {
            setOpenItems((prev) => ({
                ...prev,
                [category]: true,
                [subcategory]: true,
                [doctitle]: true
            }));
        }
    }, [selectedCategory]);

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
    
    const [mobileSideBar, setMobileSideBar] = useState(false);

    return (
        <>
            <style>{`
                .side_bar::before{
                    ${isVisible ? "" : "top: -1px;"};
                }
            `}</style>

            {/* Desktop Sidebar */}
            <div className={`side_bar hidden mb-12 md:flex top-0 bg-[#FFF] ${isVisible ? 'top-[72px]' : 'top-0 max-h-screen'}`}>
                <div className="side_bar_nav_item py-6">
                    {categoryData?.map((category) => (
                        <div key={category?.id} className="side_bar_box">
                            {/* Main Category Item */}
                            <div className="side_bar_nav_items">
                                <div className="side_bar_nav_item_catagory cursor-pointer hover:bg-[#F5F5F5]">
                                    <Link 
                                        className="h-full flex items-center" 
                                        to={category?.subCategory?.length > 0 
                                            ? `/${selectedLanguage}/${category?.slug}` 
                                            : `/${selectedLanguage}/docs/${category?.docs?.[0]?.slug}`
                                        }
                                    >
                                        <div className="category_name py-2">
                                            {category?.icon ? (
                                                <img 
                                                    src={category?.icon ? category?.icon : `no`} 
                                                    alt={category?.name} 
                                                    className="w-5 h-5"
                                                />
                                            ) : (
                                                <MenuIcon size={20} />
                                            )}
                                            <p className="bold2 text-[#1A1A1A]">{category?.categoryLanguage?.[0]?.name}</p>
                                        </div>
                                    </Link>
                                    {category?.subCategory?.length > 0 ?  (
                                        <div 
                                            onClick={() => toggleItem(category?.name)}  
                                            className="text-[#667085]"
                                        >
                                            {openItems[category?.name] ? 
                                                <ChevronUp className="transition-all duration-300" size={20} /> : 
                                                <ChevronUp size={20} className="transition-all duration-300 rotate-180" />
                                            }
                                        </div>
                                    ): (
                                        // Help docs item
                                        <div 
                                            onClick={() => toggleItem(category?.name)}  
                                            className="text-[#667085]"
                                        >
                                            {openItems[category?.name] ? 
                                                <ChevronUp className="transition-all duration-300" size={20} /> : 
                                                <ChevronUp size={20} className="transition-all duration-300 rotate-180" />
                                            }
                                        </div>
                                    )}
                                </div>

                                 {/* Subcategory Items */}
                                 {category?.subCategory?.length > 0 && (
                                    <div className={`sub_nav_bar_menu overflow-hidden transition-all duration-500 ease-in-out ${
                                        openItems[category?.name] && category?.subCategory?.length > 0 
                                            ? "max-h-[1000px] py-1" 
                                            : "max-h-0"
                                    }`}>
                                        <div className="sub_nav_bar_menu_items">
                                            {category?.subCategory?.map((singleSubCategory) => (
                                                <div className="sub_category_box" key={singleSubCategory?.id}>
                                                    <div className="sub_nav_bar_menu_item cursor-pointer hover:bg-[#F5F5F5]">  
                                                        <div 
                                                            className={`sub_cat_logo transition-all duration-300 ${
                                                                openItems[singleSubCategory?.name] ? "rotate-90" : ""
                                                            }`} 
                                                            onClick={() => toggleItem(singleSubCategory?.name)}
                                                        >
                                                            <svg xmlns="http://www.w3.org/2000/svg" width="10" height="12" viewBox="0 0 10 12" fill="none">
                                                                <path d="M2.79062 2.27907L7.43039 5.59319C7.70956 5.7926 7.70956 6.20752 7.43039 6.40693L2.79062 9.72105C2.45968 9.95743 2 9.72087 2 9.31418V2.68594C2 2.27925 2.45968 2.04269 2.79062 2.27907Z" fill="#212121"/>
                                                            </svg>
                                                        </div>

                                                        <Link 
                                                            className="h-full flex flex-wrap items-center py-2" 
                                                            to={`/${selectedLanguage}/${category?.slug}/${singleSubCategory?.slug}`}
                                                        >
                                                            <span className="span1 bold2 h-full flex flex-wrap items-center">
                                                                {singleSubCategory?.categoryLanguage?.[0]?.name}
                                                            </span>
                                                        </Link>
                                                    </div>
                                                    
                                                    <div className="overflow-hidden">
                                                        {openItems[singleSubCategory?.name] && (
                                                            <div className="help_doc_items animate-dropdown">
                                                                {singleSubCategory?.docs?.map((singleDoc) => (
                                                                    <Link 
                                                                        className="flex h-full w-full" 
                                                                        key={singleDoc?.id} 
                                                                        to={`/${selectedLanguage}/${category?.slug}/${singleSubCategory?.slug}/${singleDoc?.slug}`}
                                                                    >
                                                                        <div className={`help_doc_item h-full w-full cursor-pointer hover:bg-[#F5F5F5] ${
                                                                            singleDoc?.slug === params?.slug 
                                                                                ? "bg-gray-100" 
                                                                                : ""
                                                                        }`}>
                                                                            <span className="span1">
                                                                                {singleDoc?.docsLanguage?.[0]?.title}
                                                                            </span>
                                                                        </div>
                                                                    </Link>
                                                                ))}
                                                            </div>
                                                        )}
                                                    </div>
                                                </div>
                                            ))}
                                            {/* Help docs  Item */}
                                            {category?.docs?.map((item) => (
                                                <div className="sub_category_box" key={item?.id}>
                                                    <div className="sub_nav_bar_menu_item cursor-pointer hover:bg-[#F5F5F5]">  
                                                        <div 
                                                            className={`sub_cat_logo transition-all duration-300 ${
                                                                openItems[item?.docsLanguage?.[0]?.title] ? "rotate-90" : ""
                                                            }`} 
                                                            onClick={() => toggleItem(item?.docsLanguage?.[0]?.title)}
                                                        >
                                                            <svg xmlns="http://www.w3.org/2000/svg" width="10" height="12" viewBox="0 0 10 12" fill="none">
                                                                <path d="M2.79062 2.27907L7.43039 5.59319C7.70956 5.7926 7.70956 6.20752 7.43039 6.40693L2.79062 9.72105C2.45968 9.95743 2 9.72087 2 9.31418V2.68594C2 2.27925 2.45968 2.04269 2.79062 2.27907Z" fill="#212121"/>
                                                            </svg>
                                                        </div>

                                                        <Link 
                                                            className="h-full flex flex-wrap items-center py-2" 
                                                            to={`/${selectedLanguage}/docs/${item?.slug}`}
                                                        >
                                                            <span className="span1 bold2 h-full flex flex-wrap items-center">
                                                                {item?.docsLanguage?.[0]?.title}
                                                            </span>
                                                        </Link>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                )}
                                 {/* Help docs item */}
                                 {category?.docs?.length > 0 && (
                                    <div className={`sub_nav_bar_menu overflow-hidden transition-all duration-500 ease-in-out ${
                                        openItems[category?.name] && category?.docs?.length > 0 
                                            ? "max-h-[1000px] py-1" 
                                            : "max-h-0"
                                    }`}>
                                        <div className="sub_nav_bar_menu_items">
                                            {/* Help docs  Item */}
                                            {category?.docs?.map((item) => (
                                                <div className="sub_category_box" key={item?.id}>
                                                    <div className="sub_nav_bar_menu_item cursor-pointer hover:bg-[#F5F5F5]">  
                                                        <div 
                                                            className={`sub_cat_logo transition-all duration-300 ${
                                                                openItems[item?.docsLanguage?.[0]?.title] ? "rotate-90" : ""
                                                            }`} 
                                                            onClick={() => toggleItem(item?.docsLanguage?.[0]?.title)}
                                                        >
                                                            <svg xmlns="http://www.w3.org/2000/svg" width="10" height="12" viewBox="0 0 10 12" fill="none">
                                                                <path d="M2.79062 2.27907L7.43039 5.59319C7.70956 5.7926 7.70956 6.20752 7.43039 6.40693L2.79062 9.72105C2.45968 9.95743 2 9.72087 2 9.31418V2.68594C2 2.27925 2.45968 2.04269 2.79062 2.27907Z" fill="#212121"/>
                                                            </svg>
                                                        </div>

                                                        <Link 
                                                            className={`h-full flex flex-wrap items-center py-2 ${params?.slug === item?.slug ?  'bg-gray-100' : ''}`} 
                                                            to={`/${selectedLanguage}/docs/${item?.slug}`}
                                                        >
                                                            <span className="span1 bold2 h-full flex flex-wrap items-center">
                                                                {item?.docsLanguage?.[0]?.title}
                                                            </span>
                                                        </Link>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* Mobile Sidebar Toggle */}
            
            <div className={`flex md:hidden mobile_side_bar_box z-50 ${mobileSideBar? "animate-slideIn" : 'animate-slideOut'}`}>
                <div className="mobile_side_bar_box_header">
                    <div className="mobile_side_bar_box_header_title">
                        <span className="p1 text-[#1a1a1a]">Category</span>
                        {/* <span className="p1 text-[#fff]">Category</span> */}
                    </div>
                    <div className="mobile_side_bar_box_header_icon">
                        <button 
                            className="w-5 h-5" 
                            onClick={() => setMobileSideBar(!mobileSideBar)}
                        >
                            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 20 20" fill="none">
                                <path d="M15 5L5 15M5 5L15 15" stroke="#1a1a1a" strokeWidth="1.66667" strokeLinecap="round" strokeLinejoin="round"/>
                                {/* <path d="M15 5L5 15M5 5L15 15" stroke="#fff" strokeWidth="1.66667" strokeLinecap="round" strokeLinejoin="round"/> */}
                            </svg>
                        </button>
                    </div>
                </div>
                <div className="max-h-96 overflow-auto">
                    <div className="mobile_side_bar_list">
                        {categoryData?.map((category) => (
                            <div key={category?.id} className="side_bar_box">
                                <div className="side_bar_nav_items">
                                    <div className="side_bar_nav_item_catagory cursor-pointer hover:bg-[#F5F5F5]">
                                        <Link 
                                            to={category?.subCategory?.length > 0 
                                                ? `/${selectedLanguage}/${category?.slug}` 
                                                : `/${selectedLanguage}/docs/${category?.docs?.[0]?.slug}`
                                            } 
                                            className="category_name py-2" 
                                            onClick={() => setMobileSideBar(false)}
                                        >
                                            {category?.icon ? (
                                                <img 
                                                    src={category?.icon ? category?.icon : `no`} 
                                                    alt={category?.name} 
                                                    className="w-4 h-4"
                                                />
                                            ) : (
                                                <MenuIcon size={16} />
                                            )}
                                            <p className="bold2 text-[#1A1A1A]">{category?.categoryLanguage?.[0]?.name}</p>
                                        </Link>
                                        {category?.subCategory?.length > 0 ? (
                                            <div 
                                                onClick={() => toggleItem(category?.name)} 
                                                className="text-[#667085] py-2"
                                            >
                                                {openItems[category?.name] ? 
                                                    <ChevronUp className="transition-all duration-300" size={20} /> : 
                                                    <ChevronUp size={20} className="transition-all duration-300 rotate-180" />
                                                }
                                            </div>
                                        ) : (
                                            <div 
                                                onClick={() => toggleItem(category?.name)} 
                                                className="text-[#667085] py-2"
                                            >
                                                {openItems[category?.name] ? 
                                                    <ChevronUp className="transition-all duration-300" size={20} /> : 
                                                    <ChevronUp size={20} className="transition-all duration-300 rotate-180" />
                                                }
                                            </div>
                                        )}
                                    </div>
                                        {/* Subcategory Items */}
                                    {openItems[category?.name] && category?.subCategory?.length > 0 && (
                                        <div className="sub_nav_bar_menu">
                                            <div className="sub_nav_bar_menu_items">
                                                {category?.subCategory?.map((singleSubCategory) => (
                                                    <div className="sub_category_box" key={singleSubCategory?.id}>
                                                        <div className="sub_nav_bar_menu_item cursor-pointer hover:bg-[#F5F5F5]">
                                                            <div 
                                                                className={`sub_cat_logo transition-all duration-300 ${
                                                                    openItems[singleSubCategory?.name] ? "rotate-90" : ""
                                                                }`} 
                                                                onClick={() => toggleItem(singleSubCategory?.name)}
                                                            >
                                                                <svg xmlns="http://www.w3.org/2000/svg" width="10" height="12" viewBox="0 0 10 12" fill="none">
                                                                    <path d="M2.79062 2.27907L7.43039 5.59319C7.70956 5.7926 7.70956 6.20752 7.43039 6.40693L2.79062 9.72105C2.45968 9.95743 2 9.72087 2 9.31418V2.68594C2 2.27925 2.45968 2.04269 2.79062 2.27907Z" fill="#212121"/>
                                                                </svg>
                                                            </div>

                                                            <Link 
                                                                to={`/${selectedLanguage}/${category?.slug}/${singleSubCategory?.slug}`} 
                                                                className="h-full w-full flex"
                                                            >
                                                                <span className="span1 bold2 py-2">
                                                                    {singleSubCategory?.categoryLanguage?.[0]?.name}
                                                                </span>
                                                            </Link>
                                                        </div>
                                                        
                                                        {openItems[singleSubCategory?.name] && (
                                                            <div className="help_doc_items">
                                                                {singleSubCategory?.docs?.map((singleDoc) => (
                                                                    <div 
                                                                        className={`help_doc_item cursor-pointer hover:bg-[#F5F5F5] ${
                                                                            singleDoc?.slug === params?.slug
                                                                                ? "bg-gray-100" 
                                                                                : ""
                                                                        }`} 
                                                                        key={singleDoc?.id}
                                                                    >
                                                                        <span className="span1">
                                                                            <Link to={`/${selectedLanguage}/${category?.slug}/${singleSubCategory?.slug}/${singleDoc?.slug}`}>
                                                                                {singleDoc?.docsLanguage?.[0]?.title}
                                                                            </Link>
                                                                        </span>
                                                                    </div>
                                                                ))}
                                                            </div>
                                                        )}
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                    )}

                                    {/* Help docs item */}
                                    {openItems[category?.name] && category?.docs?.length > 0  && (
                                        <div className="sub_nav_bar_menu">
                                            <div className="sub_nav_bar_menu_items">
                                                {category?.docs?.map((item) => (
                                                    <div className="sub_category_box" key={item?.id}>
                                                        <div className="sub_nav_bar_menu_item cursor-pointer hover:bg-[#F5F5F5]">
                                                            <div 
                                                                className={`sub_cat_logo transition-all duration-300 ${
                                                                    openItems[item?.docsLanguage?.[0]?.title] ? "rotate-90" : ""
                                                                }`} 
                                                                onClick={() => toggleItem(item?.docsLanguage?.[0]?.title)}
                                                            >
                                                                <svg xmlns="http://www.w3.org/2000/svg" width="10" height="12" viewBox="0 0 10 12" fill="none">
                                                                    <path d="M2.79062 2.27907L7.43039 5.59319C7.70956 5.7926 7.70956 6.20752 7.43039 6.40693L2.79062 9.72105C2.45968 9.95743 2 9.72087 2 9.31418V2.68594C2 2.27925 2.45968 2.04269 2.79062 2.27907Z" fill="#212121"/>
                                                                </svg>
                                                            </div>

                                                            <Link 
                                                                to={`/${selectedLanguage}/docs/${item?.slug}`} 
                                                                className={`h-full w-full flex ${params?.slug === item?.slug ?  'bg-gray-100' : ''}`} 

                                                            >
                                                                <span className="span1 bold2 py-2">
                                                                    {item?.docsLanguage?.[0]?.title}
                                                                </span>
                                                            </Link>
                                                        </div>
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                    )}
                                </div>
                            </div>
                        ))}                    
                    </div>
                </div>
            </div>
            {mobileSideBar ? (
                <>
                    <div className="fixed z-40 md:hidden inset-0 h-screen bg-black/50" onClick={() => setMobileSideBar(false)}></div>
                </>
            ) : (
                //  bg-[linear-gradient(45deg,_#F58220_5.77%,_#D42427_96.77%)]
                <button 
                    className="flex md:hidden side_bar_mobile_icon_box" 
                    onClick={() => setMobileSideBar(!mobileSideBar)}
                >
                    <i className="side_bar_icon">
                        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none">
                            <path d="M15 1.25H9C3.567 1.25 1.25 3.567 1.25 9V15C1.25 20.433 3.567 22.75 9 22.75H15C20.433 22.75 22.75 20.433 22.75 15V9C22.75 3.567 20.433 1.25 15 1.25ZM14.25 21.25H9C4.386 21.25 2.75 19.614 2.75 15V9C2.75 4.386 4.386 2.75 9 2.75H14.25V21.25ZM21.25 15C21.25 19.354 19.791 21.054 15.75 21.232V2.768C19.791 2.946 21.25 4.646 21.25 9V15ZM8.53 8.91L11.09 11.47C11.1597 11.5396 11.2149 11.6222 11.2526 11.7131C11.2903 11.8041 11.3098 11.9016 11.3098 12C11.3098 12.0984 11.2903 12.1959 11.2526 12.2869C11.2149 12.3778 11.1597 12.4604 11.09 12.53L8.53 15.09C8.38848 15.2266 8.199 15.3021 8.00235 15.3003C7.8057 15.2985 7.61763 15.2195 7.47864 15.0804C7.33965 14.9412 7.26086 14.7531 7.25924 14.5565C7.25763 14.3598 7.33331 14.1704 7.47 14.029L9.5 12L7.47 9.971C7.33331 9.82961 7.25763 9.6402 7.25924 9.44355C7.26086 9.2469 7.33965 9.05875 7.47864 8.91963C7.61763 8.78051 7.8057 8.70154 8.00235 8.69974C8.199 8.69794 8.38848 8.77345 8.53 8.91Z" fill="white"/>
                        </svg>
                    </i>
                </button>
            )}
        </>
    );
}