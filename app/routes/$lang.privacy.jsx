import { useTranslation } from "react-i18next";
import Breadcrumb from "../components/Breadcrumb";
import { setMetaTag } from "../libs/helper";
import Privacy from "../components/Privacy";
import defaultlogo from "/images/logo/logo.svg";


export const meta = ({ params }) => {
    const title = "InkyBay - Product Customizer - Privacy Policy";
    const metaDescription = `InkyBay - Product Customizer Software for Shopify, Privacy Policy`
    const metaImage = defaultlogo;
    const urlParams = `/${params?.lang}/privacy`;
    
    // Set meta tag if null please set value null
    const metaData = setMetaTag({title, metaImage, metaDescription, urlParams});
    return metaData;
}

export default function PrivacyPage() {
    const {t} = useTranslation();

    return (
        <div className="w-full">
            <Breadcrumb selectedCategory={''} activePage={t('privacy')} showSearchBar={false}/>
            <Privacy />
        </div>
    )
}
