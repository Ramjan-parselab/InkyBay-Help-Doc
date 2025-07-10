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
 * @param {String} metaImage - The URL of the image used in meta tags (e.g., Open Graph, Twitter).
 * @param {String} metaType - The type of content (default: "website"). Common types include "article" or "website".
 * @returns {Array} An array of meta tag objects, each containing a `name` or `property` and `content`.
 */
export const setMetaTag = ({siteName="InkyBay Help Center", title=null, metaImage=null, metaDescription=null, metaType = "article", urlParams=''} ) => {
    const siteUrl   = `https://docs.inkybay.com${urlParams}`;
    const metaData = [
        { title: `${title}`},
        { name: 'description', content: metaDescription },
        { name: "robots", content: "index, follow, max-snippet:-1, max-video-preview:-1, max-image-preview:large " },
        { property: 'og:locale', content: "en_US" },
        { property: 'og:type', content: metaType },
        { property: 'og:title', content: title },
        { property: 'og:description', content: metaDescription },
        { property: 'og:url', content: siteUrl },
        { tagName: "link", rel: "canonical", href: siteUrl },
        { property: 'og:site_name', content: siteName },
        { property: 'og:image:width', content: "1200" },
        { property: 'og:image:height', content: "630" },
        { property: 'og:image:alt', content: title },
        { property: 'og:image:type', content: "image/png" },
        
        // Twitter Card Meta Tags
        { name: 'twitter:card', content: 'summary_large_image' },
        { name: 'twitter:title', content: title },
        { name: 'twitter:creator', content: '@inkybay' },
        { name: 'twitter:description', content: metaDescription },
        { name: 'twitter:url', content: siteUrl },
        { name: 'twitter:image', content: metaImage },
        { name: 'twitter:image:width', content: "800"},
        { name: 'twitter:image:height', content: "600" },
        { name: 'twitter:url', content: siteUrl },

        // Pinterest Meta Tags
        { name: 'pinterest:rich_pin', content: 'true' },
        { name: 'pinterest:title', content: title },
        { name: 'pinterest:description', content: metaDescription },
        { name: 'pinterest:image', content: metaImage },
    ];
    return metaData;
}