import { useTranslation } from "react-i18next";
import Tab from "../ui/tab";
// import tabItems from "./tabItem";

export default function Faq({ faqData }) { 
    const { t } = useTranslation() || {};

    return (
        <>
            <section className="flex flex-col justify-center items-center gap-12 bg-white py-12 lg:py-24 md:py-16">
                <div className="flex flex-col justify-center items-center gap-4">
                    <h2 className="text-center text-[#101828]">{t("frequently_asked_questions")}</h2>
                    <p className="p1 text-center text-[#667085]">{t("check_out_our_most_common_questions")}</p>
                </div>
                <Tab/>
            </section>
        </>
    );
}