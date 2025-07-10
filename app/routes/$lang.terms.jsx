import { useTranslation } from "react-i18next";
import Breadcrumb from "../components/Breadcrumb";
import { setMetaTag } from "../libs/helper";
import Terms from "../components/termsOfService";
import defaultlogo from "/images/logo/logo.svg";


export const meta = ({ params }) => {
    const title = "InkyBay - Product Customizer - Terms of Service";
    const metaDescription = `InkyBay - Product Customizer Software for Shopify, Terms of Service`
    const metaImage = defaultlogo;
    const urlParams = `/${params?.lang}/terms`;
    
    // Set meta tag if null please set value null
    const metaData = setMetaTag({title, metaImage, metaDescription, urlParams});
    return metaData;
}

export default function TermsPage() {
    const {t} = useTranslation();

    return (
        <div className="w-full">
            <Breadcrumb selectedCategory={''} activePage={t('terms_of_service')} showSearchBar={false}/>
            <Terms />
        </div>
    )
}
