import { unstable_createFileUploadHandler, unstable_parseMultipartFormData } from "@remix-run/node";
import { Link, useActionData, useLoaderData, useSubmit } from "@remix-run/react";
import { ImageOff } from "lucide-react";
import fs from "node:fs";
import jsonFile from "node:fs/promises";
import path from "path";
import { useEffect, useState } from "react";
import prisma from "../../../db.server";

export const loader = async({params}) => {
    // find out category last serial number
    const language = await prisma.language.findFirst({
        where: {
            id: parseInt(params?.id)
        },
    });

    let transLationData = {};
    // Translation Json file  data edit
    if(language?.id){
        try {
            const filePath = path.join(process.cwd(), "public", "locales", language?.code, "common.json");
            transLationData = await jsonFile.readFile(filePath, "utf-8");
        } catch (error) {
            console.log(error)
        }
    }

    return {
        data:{
            language: language,
            transLationData: transLationData
        }
    };
}

export const action = async ({request}) => {
    // Icon upload 
    const allowedTypes = ["image/jpeg", "image/png", "image/svg+xml"];
    let uploadedFileError = "";
    const uploadHandler = unstable_createFileUploadHandler({
        directory: "./public/images/flugs",
        maxFileSize: 1024 * 1024 * 1, // 1 MB
        file: ({ filename }) => {
            const currentDate = Date.now();
            return `${currentDate}_${filename}`;
        },
    });

    const formData = await unstable_parseMultipartFormData(
        request,
        async ({ name, contentType, data, filename }) => {
            // Handle file uploads
            if (filename) {
                if (!allowedTypes.includes(contentType)) {
                    uploadedFileError = "Only JPG, PNG, and SVG files are allowed.";
                    return null;
                 }
                 return uploadHandler({ name, contentType, data, filename });
            }
            // Handle text fields
            const chunks = [];
            for await (const chunk of data) chunks.push(chunk);
            return Buffer.concat(chunks).toString("utf-8");
        }
    );
    // If "uploadedFileError" has error then it give error message
    if (uploadedFileError) {
        return {
                target: "update-language",
                isError: true,
                message: uploadedFileError,
            }
    }
        
    const target = formData.get("target");

    if(target === "update-language"){
        const id = formData.get("id") || "" || "";
        const name = formData.get("name") || "";
        const flug = formData.get("flug") || "";
        const code = formData.get("code") || "";
        const status = formData.get("status") || "";
        const uploadDir = `/images/flugs/${flug?.name}`;

         // Check duplicate slug 
        const duplicateCode = await prisma.language.findFirst({
            select: {id: true},
            where: { code: code,
                NOT:{
                    id: parseInt(id)
                }
            }
        });

        if(duplicateCode){
            return {
                target: target,
                isDuplicate: true,
                message: "This language slug has been already taken",
                data: [],
            }
        }


         const languageInfo = await prisma.language.findFirst({
            select: {id: true, flug: true},
            where: { 
                id: parseInt(id)
            }
        });

         // If Icon change then remove previous icon
        if(flug?.name){
            if(fs.existsSync(`public${languageInfo?.flug}`)){
                fs.unlinkSync(`public${languageInfo?.flug}`);
            }
        }

        try{
            // Here update main category and after that update category language 
            await prisma.language.update({
                data:{
                    name: name,
                    flug: flug?.name ? uploadDir : languageInfo?.flug,
                    code: code,
                    status: status,
                    updatedAt: new Date(),
                },
                where: {
                    id: parseInt(id)
                } 
                
            });

        
            return {
                target: target,
                message: "Successfully ! language has been updated",
                data: [],
            }

        }catch(error){
            return {
                target: target,
                message: "Language update failed please try again !!",
                data: [],
            }
        }
    }else if(target === "update-translation"){
        const langCode = formData.get("lang") || "";
        const data = formData.get("data") || "";

        try{
            const filePath = path.join(process.cwd(), "public", "locales", langCode, "common.json");
            
            const parseData = JSON.parse(data);
            const jsonData = JSON.stringify(parseData, null, 4);
            const updated = await  jsonFile.writeFile(filePath, jsonData, "utf-8");
            return {
                target: target,
                message: "Successfully ! Language translation  has been updated",
                data: [],
            }
        }catch(error){
             return {
                target: target,
                message: "Language translation update failed please try again !!",
                data: [],
            }
        }
        
    }

}


export default function Edit () {
    const loaderData = useLoaderData("");
    const submit = useSubmit();
    const actionData = useActionData("");

    const [pageLoader, setPageLoader] = useState(false);
    const [buttonLoader, setButtonoader] = useState(false);
    const [translations, setTranslations] = useState(""); 
    
    const [formState, setFormState] = useState({
        id: "",
        name: "",
        flug:"",
        code:"",
        status: "ACTIVE",
        oldFlug: "",
    });

    const [formError, setFormError] = useState({
        name: "",
        flug:"",
        code:"",
        status: "",
    });

    const supportedLngs=  ["af", "am", "ar", "az", "be", "bg", "bn", "bs", "ca", "cs", "cy", "da", "de",
		"el", "en", "eo", "es", "et", "eu", "fa", "fi", "fr", "ga", "gl", "gu", "he",
		"hi", "hr", "ht", "hu", "hy", "id", "is", "it", "ja", "jv", "ka", "kk", "km",
		"kn", "ko", "ku", "ky", "la", "lb", "lo", "lt", "lv", "mg", "mi", "mk", "ml",
		"mn", "mr", "ms", "mt", "my", "ne", "nl", "no", "ny", "pa", "pl", "ps", "pt",
		"ro", "ru", "rw", "sd", "si", "sk", "sl", "sm", "sn", "so", "sq", "sr", "st",
		"su", "sv", "sw", "ta", "te", "tg", "th", "tk", "tl", "tr", "tt", "ug", "uk",
		"ur", "uz", "vi", "xh", "yi", "yo", "zh", "zh-CN", "zh-TW", "zu", "pt-BR"
	];

    

    const handleNameChange = (event)=> {
        setFormState({...formState, name: event.target.value});
    }

    const handleFlugChange = (event)=> {
        setFormState({...formState, flug: event?.target?.files?.[0]});
    }
    const handleCodeChange = (event)=> {
        setFormState({...formState, code: event.target.value});  
    }
    const handleStatusChange = (event)=> {
        setFormState({...formState, status: event.target.value});
    }
    const handleTranslationValue = (key, value) => {
        setTranslations((prev)=> ({...prev, [key]: value}));
    }

    const submitForm = async () => {
        
        setButtonoader(true);
        let validated = true;
        const errorMessages = {};

        // Form validation
        if(!formState.name || formState.name == "") {
            errorMessages.name = "Name is required";
            validated = false;
        }
        if(!formState.flug || formState.flug == "") {
            errorMessages.flug = "flug is required";
            validated = false;
        }
        if(!formState.code || formState.code == "") {
            errorMessages.code = "Code is required";
            validated = false;
        }
        if(!formState.status || formState.status == "" ) {
            errorMessages.status = "Status is required";
            validated = false;
        }
      
        
        if(validated) {
            const formData = new FormData();
            formData.append("target", "update-language");
            formData.append("id", formState.id);
            formData.append("name", formState.name);
            formData.append("flug", formState.flug); // file
            formData.append("code", formState.code);
            formData.append("status", formState.status);
            submit(formData, { method: "POST", encType: "multipart/form-data" });
        }
        else {
            setFormError({ ...errorMessages });
            setButtonoader(false);
        }
    }

    // Update translation json file
    const updateTranslation = async () => {
        setButtonoader(true);
        const formData = new FormData();
        formData.append("target", "update-translation");
        formData.append("lang", formState.code);
        formData.append("data", JSON.stringify(translations));
        submit(formData, { method: "POST", encType: "multipart/form-data"});
    }

    useEffect(()=> {
        setPageLoader(true);
        if(loaderData){
            if(loaderData?.data?.language?.id) {
                const languageData = loaderData?.data?.language;
                setFormState({
                    id: languageData?.id ? languageData?.id : "",
                    name: languageData?.name ? languageData?.name : "",
                    flug: languageData?.flug ? languageData?.flug : "",
                    code: languageData?.code ? languageData?.code : "",
                    status: languageData?.status ? languageData?.status : "",
                    oldFlug: languageData?.flug ? languageData?.flug : "",
                });
            }
            if(typeof loaderData?.data?.transLationData == "string"){
                setTranslations(JSON.parse(loaderData?.data?.transLationData))
            }
        }
        setPageLoader(false)
    },[])

    /**
     * If form submit successfully ,then the form will be reset
     */
    useEffect(() => {
        if (actionData) {
            if (actionData.target == "update-language") {
                setButtonoader(false);
                if(actionData.isDuplicate){
                    alert(actionData.message)
                }else if(actionData.isError){
                     alert(actionData.message);
                }else{
                    alert(actionData.message);
                    location.reload()
                }
            }else if (actionData.target == "update-translation") {
                setButtonoader(false);
                alert(actionData.message);
            }
        }
    }, [actionData]);

    return (
        <>
            {pageLoader  ? (
                    <div className="bg-white rounded-lg shadow-md p-4 animate-pulse">
                        <div className="w-full h-8 bg-gray-300 rounded mb-2"></div>
                        <div className="w-full h-8 bg-gray-300 rounded mb-2"></div>
                        <div className="w-full h-8 bg-gray-300 rounded mb-2"></div>
                        <div className="w-full h-8 bg-gray-300 rounded mb-2"></div>
                        <div className="w-full h-8 bg-gray-300 rounded mb-2"></div>
                    </div>
                ) : (
                    <div>
                        <div className="w-full flex justify-end items-end">
                            <Link to="/admin/languages" className="inline-flex items-center gap-2 rounded bg-[#090808] px-8 py-3 text-sm font-semibold text-white transition-all mb-5">
                                Back
                                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="size-5">
                                    <path
                                        fillRule="evenodd"
                                        d="M19.5 5.653c0-1.427-1.529-2.33-2.779-1.643L5.181 10.357c-1.295.712-1.295 2.573 0 3.286l11.54 6.347c1.25.687 2.779-.217 2.779-1.643V5.653Z"
                                        clipRule="evenodd"
                                    />
                                </svg>
                            </Link>
                        </div>
                        
                        <div className="relative flex flex-col w-full h-full overflow-scroll text-gray-700 bg-white shadow-md rounded-lg bg-clip-border">
                            <div className="my-5">
                                <div className="container mx-auto  py-4 px-6  bg-white text-gray-700">
                                    <div className="my-3">
                                        <h1 className="text-center text-2xl sm:text-3xl font-bold text-gray-700">Update language</h1>
                                        <form action="" method="POST">
                                            <div className="grid w-full grid-cols-2  gap-6 my-5">
                                                <div className="relative flex flex-col">
                                                <div className="my-2">
                                                        <label htmlFor="name" className="text-sm sm:text-md font-bold">Name</label>
                                                        <input onChange={handleNameChange} value={formState?.name} type="text" name="name" className="block w-full px-2 py-2 text-sm sm:text-md rounded-md my-2 bg-gray-100 text-gray-900   outline-none" id="name" />
                                                        {formError?.name && (
                                                            <p className="bg-red-100 text-left font-medium">{formError?.name}</p>
                                                        )}
                                                    </div>
                                                    <div className="my-2">
                                                        <label htmlFor="slug" className="text-sm sm:text-md font-bold">Flag</label>
                                                        <input onChange={handleFlugChange}  type="file" name="flug" className="block w-full px-2 py-2 text-sm sm:text-md rounded-md my-2 bg-gray-100 text-gray-900   outline-none" id="flug" />
                                                        {formError?.flug && (
                                                            <p className="bg-red-100 text-left font-medium">{formError?.flug}</p>
                                                        )}
                                                    </div>
                                                </div>
                                                <div className="relative flex flex-col">
                                                    <div className="my-2">
                                                        <label htmlFor="name" className="text-sm sm:text-md font-bold">Code</label>
                                                         {/* <input onChange={handleCodeChange} value={formState?.code} type="text" name="code" className="block w-full px-2 py-2 text-sm sm:text-md rounded-md my-2 bg-gray-100 text-gray-900   outline-none" id="code" />*/}
                                                        <select onChange={handleCodeChange} value={formState?.code} type="text" name="code" className="block w-full px-2 py-2 text-sm sm:text-md rounded-md my-2 bg-gray-100 text-gray-900   outline-none" id="code">
                                                            <option value="">Select code</option>
                                                            {supportedLngs.length > 0 && supportedLngs.map((item)=> (
                                                                <option value={item}>{item}</option>
                                                            ))}
                                                            
                                                        </select>
                                                        {formError?.code && (
                                                            <p className="bg-red-100 text-left font-medium">{formError?.code}</p>
                                                        )}
                                                    </div>
                                                    <div className="my-2">
                                                        <label htmlFor="status" className="text-sm sm:text-md font-bold">Status</label>
                                                        <select onChange={handleStatusChange} value={formState?.status} className="block w-full px-2 py-2 text-sm sm:text-md rounded-md my-2 bg-gray-100 text-gray-900   outline-none" id="status">
                                                            <option value="ACTIVE">Active</option> 
                                                            <option value="INACTIVE">Inactive</option>
                                                        </select>
                                                        {formError?.status && (
                                                            <p className="bg-red-100 text-left font-medium">{formError?.status}</p>
                                                        )}
                                                    </div>
                                                </div>
                                                        
                                                    <div className="my-2">
                                                        <label htmlFor="status" className="text-sm sm:text-md font-bold">Flag</label>
                                                        <div className="inline-flex h-20 w-20 items-end justify-end ml-4">
                                                            {formState?.oldFlug ? (
                                                                <img src={formState?.oldFlug} alt={formState?.name} />
                                                            ) : (
                                                                <ImageOff className="h-10 w-10 text-[#344054]" />
                                                            )}
                                                        </div>
                                                    </div>
                                            </div>
                                            
                                            
                                            
                                            <button disabled={buttonLoader ? true : false} onClick={submitForm} type="button" className="px-4 py-1 bg-emerald-500 rounded-md text-black text-sm sm:text-lg shadow-md">
                                                {buttonLoader ?  'Loading..' : "Update language"}
                                            </button>
                                        </form>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="relative mt-4 flex flex-col w-full h-full overflow-scroll text-gray-700 bg-white shadow-md rounded-lg bg-clip-border">
                            <table className="w-full text-left table-auto min-w-max">
                                <thead>
                                <tr className="border-b border-slate-300 bg-slate-50">
                                    <th className="p-4 text-sm font-normal leading-none text-slate-500">Key</th>
                                    <th className="p-4 text-sm font-normal leading-none text-slate-500">Value</th>
                                </tr>
                                </thead>
                                <tbody>
                                    {Object.entries(translations)?.length > 0 && Object.entries(translations).map(([key, value]) => (
                                    <tr key={key} className="hover:bg-slate-50">
                                        <td width={150} className="p-4 border-b border-slate-200 py-5">
                                            <p className="block font-semibold text-sm text-slate-800"> {key} </p>
                                        </td>
                                        <td className="p-4 border-b border-slate-200 py-5">
                                            <input
                                                className="block w-full px-2 py-2 text-sm sm:text-md rounded-md my-2 bg-gray-100 text-gray-900   outline-none"
                                                type="text"
                                                name={key}
                                                value={value}
                                                onChange={e => handleTranslationValue(key, e.target.value)}
                                            />
                                        </td>
                                    </tr>
                                     ))}
                                </tbody>
                            </table>
                        </div>
                        <button disabled={buttonLoader ? true : false} onClick={updateTranslation} type="button" className="px-4 py-1 mt-5 bg-emerald-500 rounded-md text-black text-sm sm:text-lg shadow-md">
                                {buttonLoader ?  'Loading..' : "Update Translation"}
                            </button>
                    </div>
                )}
        </>
    );
}