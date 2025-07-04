

import { redirect } from "@remix-run/react";
import {   getSession } from "../services/session.server";


export const loader = async({request}) => {
    // If user set language then get the selected language data 
    // if not get only english language data 
    let session = await getSession(request.headers.get("cookie"));
    let selectedLanguage = "en";
    
    if(session.get('user-selected-language')){
        selectedLanguage = session.get('user-selected-language');
        return redirect(`/${selectedLanguage}`);
    }

    return redirect(`/${selectedLanguage}`);
}

