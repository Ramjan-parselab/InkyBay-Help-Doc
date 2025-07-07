import { useTranslation } from "react-i18next";
import Breadcrumb from "../components/Breadcrumb";
import { setMetaTag } from "../libs/helper";
import Privacy from "../components/Privacy";

export const meta =   () => {
    const siteName = "InkyBay Help Center";
    const title = "Privacy";
    const metaTitle = `InkyBay Help Center`;
    const metaDescription = `"Welcome to the InkyBay Help Center — your one-stop support hub for all things customization! 
                            Whether you have questions about your order, need help using our design tools, or want to report an issue,
                            we're here to help."`;
    const metaType = "website";
    
    // Set meta tag if null please set value null
    const metaData = setMetaTag(siteName, title, metaTitle, metaDescription,  metaType);
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
