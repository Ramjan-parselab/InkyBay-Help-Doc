/**
 * 
 * @param {string or object} text - This params expect full text  
 * @param {number} wordsPerMinute - This is the adult reading total word number per minute
 * @returns - A valid round number
 */
export const calculateReadingTime = (text, wordsPerMinute=200) => {
    if(typeof text === "string"){
        const words = text.trim().split(/\s+/).length;
        const minutes = words/wordsPerMinute;
        const readingTime = Math.ceil(minutes);
        return readingTime;
    }else if(typeof text === "object"){
            let fullTime = 0;
            text?.map((singleText)=> {
                const words = singleText?.body?.trim().split(/\s+/).length;
                const minutes = words/wordsPerMinute;
                const readingTime = Math.ceil(minutes);
                fullTime = fullTime + readingTime;
            })
            return fullTime;
    }else{
        return 0;
    }
}

/**
 * * This method convert date and time to readable 
 * @param {string} dateTime - Date and time 
 */
export const formatDateTime = (dateTime) => {
    if(dateTime){
        const date = new Date(dateTime);
        const dateFormat = new Intl.DateTimeFormat("en-GB",{
            day:"2-digit",
            month:"short",
            year:"numeric"
        }).format(date);
        return dateFormat;
    }else{
        return dateTime;
    }
}

/**
 * 
 * @param {email} email - Email validation
 * @returns 
 */
export const validateEmail = (email) => {
    // Simple regex for basic email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
};

/**
 * 
 * @param {phone} phone - phone validation
 * @returns 
 */
export const validatePhone = (phone) => {
    // Simple regex for basic phone validation
    const phoneRegex = /^(\+?\d{1,3}[-.\s]?)?(\(?\d{3}\)?[-.\s]?)?\d{3}[-.\s]?\d{4}$/;
    return phoneRegex.test(phone);
};

/**
 * Generates meta tag information for a webpage.
 *
 * @param {String} siteName - The name of the website (default: "ParseLab").
 * @param {String} title - The title displayed in the browser tab.
 * @param {String} metaTitle - The title used for meta tags (e.g., Open Graph, Twitter, Pinterest).
 * @param {String} metaDescription - A brief description of the content, used in meta tags.
 * @param {String} metaType - The type of content (default: "website"). Common types include "article" or "website".
 * @returns {Array} An array of meta tag objects, each containing a `name` or `property` and `content`.
 */
export const setMetaTag = (siteName="JewelsLab Help Center", title=null, metaTitle=null, metaDescription=null, metaType = "website" ) => {
    const siteUrl   = `https://docs.inkybay.com`;
    const metaData = [
        { charset: "utf-8" },
        { name: "viewport", content: "width=device-width, initial-scale=1" },
        { title: title ?  `${title} | ${siteName}` : `${siteName}`},
        { name:"charset", content:"utf-8"},
        { name: 'description', content: metaDescription },
        { name: "robots", content: "index, follow" },
        { property: 'og:locale', content: "en_US" },
        { property: 'og:type', content: metaType },
        { property: 'og:title', content: metaTitle },
        { property: 'og:description', content: metaDescription },
        { property: 'og:url', content: siteUrl },
        { tagName: "link", rel: "canonical", href: siteUrl },
        { property: 'og:site_name', content: siteName },
        
        // Twitter Card Meta Tags
        { name: 'twitter:card', content: 'summary_large_image' },
        { name: 'twitter:title', content: metaTitle },
        { name: 'twitter:description', content: metaDescription },
        { name: 'twitter:url', content: siteUrl },

        // Pinterest Meta Tags
        { name: 'pinterest:rich_pin', content: 'true' },
        { name: 'pinterest:title', content: metaTitle },
        { name: 'pinterest:description', content: metaDescription },
    ];
    return metaData;
}