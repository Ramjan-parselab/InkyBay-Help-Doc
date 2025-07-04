import TopSection from "./TopSection";
import BottomSection from "./BottomSection";

export default function Footer({footerMenuData, socialMediaData}) {
    return (
        <footer className="w-full flex flex-col items-start pt-12 px-5 md:px-6 lg:px-24 bg-[#F4F4F4]">
            <div className="w-full flex flex-col items-center gap-6 md:gap-8 lg:gap-12">
                <TopSection footerMenuData={footerMenuData} socialMediaData={socialMediaData}/>
                <BottomSection />
            </div>
        </footer>
    )
}