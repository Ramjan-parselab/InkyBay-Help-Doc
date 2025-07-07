import { useTranslation } from "react-i18next";

export default function Terms() {
    const {t} = useTranslation();
    return (
        <>
             {/* <div className="documantation_details_section">
                <h4 className="text-[#16171A]">dsfdsf</h4>
                <p className="text-[#212121] documantation_paragraph_section" />
                
            </div> */}
            <>
            <section className="w-full">
                <div className="container flex justify-center items-center py-10 px-5">
                    <div className="flex flex-col justify-center items-center gap-12">
                        <div className="flex flex-col justify-center items-center gap-4">
                            <h2 className="text-[#101828] font-semibold">{t('terms_of_service')}</h2>
                        </div>
                    </div>
                </div>

                <div className="container flex justify-start items-start py-5 px-5">
                    <div className="documantation_details_section">
                        <div className="text-[#212121] documantation_paragraph_section">
                            <p className="text-sm py-4"> Effective date: January 01, 2020</p>
                            <p className="text-sm py-4">Inkybay (“us”, “we”, or “our”) operates the https://www.inkybay.com website and the Inkybay – Product Customizer
                                (the “Service”).
                            </p>
                            <p className="text-sm py-4">This page informs you of our policies regarding the collection, use, and disclosure of personal data when you use 
                                our Service and the choices you have associated with that data.
                            </p>
                            <p className="text-sm py-4">We use your data to provide and improve the Service. By using the Service, you agree to the collection and use of 
                                information in accordance with this policy. Unless otherwise defined in this Privacy Policy, terms used in this Privacy Policy have the 
                                same meanings as in our Terms and Conditions
                            </p>
                        </div>
                    </div>
                </div>

                <div className="container flex justify-start items-start py-5 px-5">
                    <div className="documantation_details_section">
                        <div className="text-[#212121] documantation_paragraph_section">
                            <h3 className="text-[#16171A]">Information Collection And Use</h3>
                            <p className="text-sm py-4">We collect several different types of information for various purposes to provide and improve our Service to you.</p>
                            <h4 className="text-[#16171A]">Information Collection And Use</h4>
                            
                            <div className="py-5">
                                <h5 className="text-[#16171A]">Personal Data</h5>
                                <p className="text-sm py-4">While using our Service, we may ask you to provide us with certain personally identifiable information that can be used to 
                                    contact or identify you (“Personal Data”). Personally identifiable information may include, but is not limited to:
                                </p>
                                <ul className="list-disc list-inside px-5">
                                    <li>1. Email address</li>
                                    <li>2. First name and last name</li>
                                    <li>3. Cookies and Usage Data</li>
                                </ul>
                            </div>

                            <div className="py-5">
                                <h5 className="text-[#16171A]">Usage Data</h5>
                                <p className="text-sm py-4">We may also collect information that your browser sends whenever you visit our Service or when you access the Service by or through 
                                    a mobile device (“Usage Data”).
                                </p>
                                <p className="text-sm py-4">When you access the Service by or through a mobile device, this Usage Data may include information such as the 
                                    type of mobile device you use, your mobile device unique ID, the IP address of your mobile device, your mobile operating system, the
                                     type of mobile Internet browser you use, unique device identifiers and other diagnostic data.
                                </p>
                            </div>

                            <div className="py-5">
                                <h5 className="text-[#16171A]">Tracking & Cookies Data</h5>
                                <p className="text-sm py-4">We use cookies and similar tracking technologies to track the activity on our Service
                                    and hold certain information.
                                </p>
                                <p className="text-sm py-4">Cookies are files with a small amount of data which may include an anonymous unique identifier. 
                                    Cookies are sent to your browser from a website and stored on your device. Tracking technologies also used are beacons, tags, and scripts
                                    to collect and track information and to improve and analyze our Service.
                                </p>
                                <p className="text-sm py-4">You can instruct your browser to refuse all cookies or to indicate when a cookie is being sent. 
                                    However, if you do not accept cookies, you may not be able to use some portions of our Service.
                                </p>
                            </div>

                        </div>
                    </div>
                </div>

                

            </section>
        </>
        
        </>
    );

}