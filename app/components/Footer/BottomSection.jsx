import { useTranslation } from "react-i18next";

export default function BottomSection() {
    const {t} = useTranslation() || {};

    return (
        <>
            <div className="w-full flex pb-10 flex-col items-center gap-10">

                <hr className="w-full h-[1px] bg-[#C0C0C0]"/>

                <div className="w-full flex justify-between items-start flex-col md:flex-row gap-10">
                    <p>© {t("copy_right_year")} <strong className="bold3">{t("app_name")}</strong>. { t('all_right_reserved') }</p>
                    <div className="flex items-center gap-3">
                        <div>
                            <p>{t('powered_by')}</p>
                        </div>
                        <div className="w-[153px]">
                            <img src="/images/footer/parselab.svg" alt="logo"/>
                        </div>
                    </div>
                </div>
                
            </div>
        </>
    );
}
