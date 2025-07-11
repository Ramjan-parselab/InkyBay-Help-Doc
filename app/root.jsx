import { Links, Meta, Outlet, Scripts, ScrollRestoration, useLoaderData, useRouteError } from "@remix-run/react";
import "./style/tailwind.css";
import { useChangeLanguage } from "remix-i18next/react";
import { useTranslation } from "react-i18next";
import i18next from "./i18next.server";
import { existsSync } from "node:fs";
import { getSession } from "./services/session.server";
import { useEffect, useState } from "react";
import Error from "./components/Error";
import defaultlogo from "/images/logo/logo.svg";
import { setMetaTag } from "./libs/helper";

export const links = () => [
  { rel: "preconnect", href: "https://fonts.googleapis.com" },
  {
    rel: "preconnect",
    href: "https://fonts.gstatic.com",
    crossOrigin: "anonymous",
  },
  {
    rel: "stylesheet",
    href: "https://fonts.googleapis.com/css2?family=Poppins:ital,wght@0,100;0,200;0,300;0,400;0,500;0,600;0,700;0,800;0,900;1,100;1,200;1,300;1,400;1,500;1,600;1,700;1,800;1,900&display=swap",
  },
   {  rel:"icon", href: "favicon.ico", type:"image/png" },
];



export async function loader({ request, params }) {
    let session = await getSession(request.headers.get("cookie"));
    // First get the language from the request using i18next
    let locale = await i18next.getLocale(request);
     
    // Default namespace to 'common'
    let ns = 'common';


    if(params?.lang){
        locale = params?.lang;
    }else if (session.get('user-selected-language')) {     
        // Split the 'locale' parameter to get locale and namespace
        let locale_with_ns = session.get('user-selected-language')?.split('-');
        
        // Check if this language has namespace
        // If yes, set the language-namespace combination as the language
        if(locale_with_ns[0] == "zh" || locale_with_ns[0] == "pt") {
            locale = session.get('user-selected-language');
        }else {
            // First part is the locale
            locale = locale_with_ns[0];

            // Check if the namespace file exists, default to 'common' if it doesn't
            ns = (existsSync('public/locales/' + locale + '/' + ns + '.json')) ? ns : 'common';
        }
    } 
        

    return {
        locale,
        ns
    }
}

export const meta = () => {
    const title = "Inkybay Knowledgebase - Product Customization Software for Print Shops";
    const metaDescription = `"Welcome to the InkyBay Help Center — your one-stop support hub for all things customization! 
                             Whether you have questions about your order, need help using our design tools, or want to report an issue,
                             we're here to help."`;
    const metaImage = defaultlogo;
    
    // Set meta tag if null please set value null
    const metaData = setMetaTag({title, metaImage, metaDescription});
    return metaData;
}

export function Layout({ children }) {

  const loaderData = useLoaderData();
  const [locale, setLocale] = useState("en");
  const [ns, setNs] = useState("common");

	// This hook will change the i18n instance language to the current locale
	// detected by the loader, this way, when we do something to change the
	// language, this locale will change and i18next will load the correct
	// translation files
	useChangeLanguage(locale);

  let { i18n } = useTranslation(ns);
  let langShow = locale + ((ns == 'common' ) ? '' : ('-' + ns).toUpperCase());

  useEffect(()=> {
      if(loaderData){
        setLocale(loaderData?.locale);
        setNs(loaderData?.ns);
      }
  },[loaderData])

  return (
    <html lang={langShow} dir={i18n.dir()}>
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <Meta />
        <Links />
      </head>
      <body>
        {children}
        <ScrollRestoration />
        <Scripts />
      </body>
    </html>
  );
}

export default function App() {
  return <Outlet />;
}

export function ErrorBoundary() {
    const error = useRouteError();
    if(error?.status == 404){
        return (
            <Error />
          );
      
    }
  }





