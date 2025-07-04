import { ArrowLeftRight } from "lucide-react";
import Card from "../ui/card";
import { useTranslation } from "react-i18next";

export default function Support({supportData}) {
    const { t } = useTranslation() || {};

    return (
        <>
            <section className="w-full flex justify-center items-center bg-[#FEEFD6]">
                <div className="container flex justify-center items-center py-24 px-5 ">


            {/* <section className="w-full flex flex-col justify-center items-center py-12 sm:py-18 md:py-24 px-5">
                <div className="max-w-6xl flex flex-col justify-center items-center gap-12"> */}

                    <div className="flex flex-col justify-center items-center gap-12">
                        <div className="max-w-3xl flex flex-col justify-center items-center gap-4">
                            <h2 className="text-center text-[#1a1a1a]">{t('still_need_our_support')}</h2>
                            <p className="p1 text-center text-[#1a1a1a]">{ t("support_options_subtitle") }</p>
                        </div>

                        <div className="grid gap-6 grid-cols-1 md:grid-cols-2 lg:grid-cols-3">


                            {supportData?.length > 0 ? (
                                <>
                                    {supportData?.map((support)=> (
                                        <Card
                                            key={support?.id}
                                            title={support?.supportLanguage?.[0]?.title}
                                            text = {support?.supportLanguage?.[0]?.description}
                                            icon={<img src="/images/support/youtube.svg" alt="" className="h-6 w-6 text-[#344054]" />}
                                            url={support?.url}
                                            buttonText={support?.supportLanguage?.[0]?.buttonText}
                                            variant="support"
                                        />
                                    ))}
                                </>

                            ): (
                                <Card 
                                    title="Support not found" 
                                    text = ""
                                    icon={<ArrowLeftRight className="h-5 w-5 text-[#344054]" />}
                                    variant="support"
                                />
                            )}
                        </div>
                    </div>            
              </div>
            </section>
        </>
    );
}