import { Link,  useActionData, useLoaderData, useSubmit } from "@remix-run/react";
import { useEffect, useState } from "react";
import prisma from "../../../db.server";
import { Toaster, toast } from 'sonner';    

export const loader = async({params}) => {
    //Find out all active langus
    const languages = await prisma.language.findMany({
        select:{
            id: true, name: true, code: true,
        },
    });


    // find out category last serial number
    const support = await prisma.supports.findFirst({
        where: {
            id: parseInt(params?.id)
        },
        include:{
            supportLanguage: true
        }
    });


    return {
        data:{
            languages: languages,
            support: support,
        }
    };
}

export const action = async ({request}) => {
    const formdata = await request.formData();
    const target = formdata.get('target') || "";

    if(target === "update-support"){
        const data = formdata.get('data') || "";
        const submitData = data ?  JSON.parse(data) : {};
        const id = submitData?.id || "";
        const title = submitData?.title || "";
        const url = submitData?.url || "";
         const newTab = submitData?.newTab == "true" ? true : false;
        const status = submitData?.status || "";
        let supportLanguage = submitData?.supportLanguage || [];
        
         // Check duplicate slug 
        const duplicateUrl = await prisma.supports.findFirst({
            select: {id: true},
            where: { url: url,
                NOT:{
                    id: parseInt(id)
                }
            }
        });

        if(duplicateUrl){
            return {
                target: target,
                isDuplicate: true,
                message: "This support url has been already taken",
                data: [],
            }
        }
        
        try{
            // Here update main category and after that update category language 
            await prisma.supports.update({
                data:{
                    title: title,
                    url: url,
                    newTab: newTab,
                    status: status,
                    updatedAt: new Date(),
                },
                where: {
                    id: parseInt(id)
                } 
                
            });

            await Promise.all(
                supportLanguage.map(async (item) => {

                    // If previously set language then it will be only update if not
                    // it will be create as a new entry 
                    if(item?.id){
                      return await prisma.supportLanguage.update({
                            where:{
                                id: parseInt(item?.id),
                            },
                            data:{
                                // If default english category  modify then it will change
                                // english language name also 
                                title: item?.lang == "en" ?  title : item.title,
                                description: item?.description,
                                buttonText: item?.buttonText,
                                supportId: item?.supportId
                            }
                        })
                    }else{
                        return await prisma.supportLanguage.create({
                            data:{
                                supportId: parseInt(id),
                                lang: item.lang,
                                title: item.title,
                                description: item?.description,
                                buttonText: item?.buttonText
                            }
                        })
                    }
                })
            );
            
            return {
                target: target,
                message: "Successfully ! support has been updated",
                data: [],
            }
        }catch(error){
            console.log(error)
            return {
                target: target,
                message: "Support update failed please try again !!",
                data: [],
            }
        }
    }

}


export default function Edit () {
    const loaderData = useLoaderData("");
    const submit = useSubmit();
    const actionData = useActionData("");
    const [languageData, setLanguageData] = useState("");
    const [selectedLanguage, setSelectedLanguage] = useState("en");

    const [pageLoader, setPageLoader] = useState(false);
    // const [supports, setSupports] = useState([]);

    const [formState, setFormState] = useState({
        id: "",
        title: "",
        url: "",
        newTab:false,
        status: "ACTIVE",
        supportLanguage: [],
    });

    const [formError, setFormError] = useState({
        title: "",
        url: "",
        newTab:false,
        status: "",
    });

    const [buttonLoader, setButtonoader] = useState(false);

     const handleTitleChange = (event)=> {
        const title = event.target.value;
        setFormState({...formState, title: title });
    }

    const handleLanguageChange = (event)=> {
        setSelectedLanguage(event.target.value);   
    }

    const handleStatusChange = (event)=> {
        setFormState({...formState, status: event.target.value});
    }

    const handleUrlChange = (event)=> {
        setFormState({...formState, url: event.target.value});
    }

    const handleNewTabChange = (event)=> {
        setFormState({...formState, newTab: event.target.value});
    }

    const handleTitleTranslation = (event) => {
        // This value is input value
        const newInput = event.target.value;
        // This code is contry code like "en, fr, it" etc.
        const code = selectedLanguage;

        let newValue = {};
        // Check is this language previously added to the supportLanguage table 
        // if Yes then it formate newValue and if not then set newValue
        const previousData = formState.supportLanguage.some((item) => item.lang === code);
        if(previousData){
            setFormState((prev)=> {
                const existing = prev.supportLanguage.find((item) => item.lang === code);
                if(existing){
                    newValue = {
                        id: existing.id,
                        lang: existing.lang,
                        title: newInput,
                        description: existing.description,
                        buttonText: existing.buttonText,
                        supportId: existing.supportId, 
                    }
                }
                const filtered = prev.supportLanguage.filter((item)=> item.lang !== newValue?.lang);
                return {
                    ...prev,
                    supportLanguage: [...filtered, newValue]
                }
            })
        }else{
            newValue = {
                lang: code,
                title: newInput,
                description: formState?.supportLanguage?.find(item=> item?.lang === selectedLanguage) ? formState?.supportLanguage?.find(item=> item?.lang === selectedLanguage)?.description : "",
                buttonText: formState?.supportLanguage?.find(item=> item?.lang === selectedLanguage) ? formState?.supportLanguage?.find(item=> item?.lang === selectedLanguage)?.buttonText : "",
                supportId: formState?.id, 
            }
    
            setFormState((prev)=> {
                const filtered = prev.supportLanguage.filter((item)=> item.lang !== newValue?.lang);
                return {
                    ...prev,
                    supportLanguage: [...filtered, newValue]
                }
            })
        }
        
    };

    const handleDescriptionChange = (event) => {
        // This value is input value
        const newInput = event.target.value;
        // This code is contry code like "en, fr, it" etc.
        const code = selectedLanguage;

        let newValue = {};
        // Check is this language previously added to the supportLanguage table 
        // if Yes then it formate newValue and if not then set newValue
        const previousData = formState.supportLanguage.some((item) => item.lang === code);
        if(previousData){
            setFormState((prev)=> {
                const existing = prev.supportLanguage.find((item) => item.lang === code);
                if(existing){
                    newValue = {
                        id: existing.id,
                        lang: existing.lang,
                        title: existing.title,
                        description: newInput,
                        buttonText: existing?.buttonText,
                        supportId: existing.supportId, 
                    }
                }
                const filtered = prev.supportLanguage.filter((item)=> item.lang !== newValue?.lang);
                return {
                    ...prev,
                    supportLanguage: [...filtered, newValue]
                }
            })
        }else{
            newValue = {
                lang: code,
                description: newInput,
                title: formState?.supportLanguage?.find(item=> item?.lang === selectedLanguage) ? formState?.supportLanguage?.find(item=> item?.lang === selectedLanguage)?.title : "",
                buttonText: formState?.supportLanguage?.find(item=> item?.lang === selectedLanguage) ? formState?.supportLanguage?.find(item=> item?.lang === selectedLanguage)?.buttonText : "",
                supportId: formState?.id, 
            }
    
            setFormState((prev)=> {
                const filtered = prev.supportLanguage.filter((item)=> item.lang !== newValue?.lang);
                return {
                    ...prev,
                    supportLanguage: [...filtered, newValue]
                }
            })
        }
        
    };

    const handleButtonTextChange = (event) => {
        // This value is input value
        const newInput = event.target.value;
        // This code is contry code like "en, fr, it" etc.
        const code = selectedLanguage;

        let newValue = {};
        // Check is this language previously added to the supportLanguage table 
        // if Yes then it formate newValue and if not then set newValue
        const previousData = formState.supportLanguage.some((item) => item.lang === code);
        if(previousData){
            setFormState((prev)=> {
                const existing = prev.supportLanguage.find((item) => item.lang === code);
                if(existing){
                    newValue = {
                        id: existing.id,
                        lang: existing.lang,
                        title: existing.title,
                        description: existing.description,
                        buttonText: newInput,
                        supportId: existing.supportId, 
                    }
                }
                const filtered = prev.supportLanguage.filter((item)=> item.lang !== newValue?.lang);
                return {
                    ...prev,
                    supportLanguage: [...filtered, newValue]
                }
            })
        }else{
            newValue = {
                lang: code,
                title: formState?.supportLanguage?.find(item=> item?.lang === selectedLanguage) ? formState?.supportLanguage?.find(item=> item?.lang === selectedLanguage)?.title : "",
                description: formState?.supportLanguage?.find(item=> item?.lang === selectedLanguage) ? formState?.supportLanguage?.find(item=> item?.lang === selectedLanguage)?.description : "",
                buttonText: newInput,
                supportId: formState?.id, 
            }
    
            setFormState((prev)=> {
                const filtered = prev.supportLanguage.filter((item)=> item.lang !== newValue?.lang);
                return {
                    ...prev,
                    supportLanguage: [...filtered, newValue]
                }
            })
        }
        
    };

    const submitForm = async () => {
        
        setButtonoader(true);
        let validated = true;
        const errorMessages = {};

         // Form validation
        if(!formState.title || formState.title == "") {
            errorMessages.title = "Title is required";
            validated = false;
        }

        if(!formState.url || formState.url == "") {
            errorMessages.url = "Url is required";
            validated = false;
        }
       
        if(!formState.status || formState.status == "" ) {
            errorMessages.status = "Status is required";
            validated = false;
        }
      
        
        if(validated) {
             submit({ target: "update-support", data: JSON.stringify(formState) }, { method: "POST" });
        }
        else {
            setFormError({ ...errorMessages });
            setButtonoader(false);
        }
    }

    useEffect(()=> {
        setPageLoader(true);
        if(loaderData){
            setLanguageData(loaderData?.data?.languages);
            if(loaderData?.data?.support?.id) {
                const supportData = loaderData?.data?.support;
                setFormState({
                    id: supportData?.id ? supportData?.id : "",
                    title: supportData?.title ? supportData?.title : "",
                    url: supportData?.url ? supportData?.url : "",
                    newTab: supportData?.newTab ?  supportData?.newTab : false,
                    status: supportData?.status ? supportData?.status : "",
                    supportLanguage: supportData?.supportLanguage ? supportData?.supportLanguage : "",
                });
            }
        }
        setPageLoader(false)
    },[])

    /**
     * If form submit successfully ,then the form will be reset
     */
    useEffect(() => {
        if (actionData) {
            if (actionData.target == "update-support") {
                setButtonoader(false);
                if(actionData.isDuplicate){
                    toast.warning(actionData.message, {style: { background: "#EDDD53", color: "black" } });
                }else if(actionData.isError){
                     toast.error(actionData.message, {style: { background: "#F08C71", color: "white" } });
                }else{
                    toast.success(actionData.message, {style: { background: "#66C25F", color: "white" } });
                    setTimeout(()=> {
                      location.reload()
                    }, 2000)
                }
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
                         <Toaster  position="top-right" closeButton={true}  />
                        <div className="w-full flex justify-end items-end">
                            <Link to="/admin/supports" className="inline-flex items-center gap-2 rounded bg-[#090808] px-8 py-3 text-sm font-semibold text-white transition-all mb-5">
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
                                        <h1 className="text-center text-2xl sm:text-3xl font-bold text-gray-700">Update Support</h1>
                                        <form action="" method="POST">
                                            <div className="grid w-full grid-cols-2  gap-6 my-5">
                                                
                                                    <div className="my-2">
                                                        <label htmlFor="title" className="text-sm sm:text-md font-bold">Title</label>
                                                        <input onChange={handleTitleChange} value={formState?.title} type="text" name="title" className="block w-full px-2 py-2 text-sm sm:text-md rounded-md my-2 bg-gray-100 text-gray-900   outline-none" id="title" />
                                                        {formError?.title && (
                                                            <p className="bg-red-100 text-left font-medium">{formError?.title}</p>
                                                        )}
                                                    </div>

                                                    <div className="my-2">
                                                        <label htmlFor="url" className="text-sm sm:text-md font-bold">Url</label>
                                                        <input onChange={handleUrlChange} value={formState?.url} type="text" name="url" className="block w-full px-2 py-2 text-sm sm:text-md rounded-md my-2 bg-gray-100 text-gray-900   outline-none" id="url" />
                                                        {formError?.url && (
                                                            <p className="bg-red-100 text-left font-medium">{formError?.url}</p>
                                                        )}
                                                    </div>


                                                    <div className="my-2">
                                                        <label htmlFor="language" className="text-sm sm:text-md font-bold">Select Language</label>
                                                        <select onChange={handleLanguageChange} value={formState?.language} className="block w-full px-2 py-2 text-sm sm:text-md rounded-md my-2 bg-gray-100 text-gray-900   outline-none" id="language">
                                                            {languageData?.length > 0 && languageData.map((language)=> (
                                                                <option key={language?.id} value={language?.code}>{language?.name}</option>
                                                            ))}
                                                        </select>
                                                        {formError?.language && (
                                                            <p className="bg-red-100 text-left font-medium">{formError?.language}</p>
                                                        )}
                                                    </div>
                                                    

                                                    
                                                    <div className="my-2">
                                                        <label htmlFor={`title_${selectedLanguage}`} className="text-sm sm:text-md font-bold"> Language Title</label>
                                                        <input onChange={handleTitleTranslation} value={formState?.supportLanguage?.find(item=> item?.lang === selectedLanguage)?.title || ""} type="text" name="name" className="block w-full px-2 py-2 text-sm sm:text-md rounded-md my-2 bg-gray-100 text-gray-900   outline-none" id={`title_${selectedLanguage}`} />
                                                    </div>

                                                    <div className="my-2">
                                                        <label htmlFor={`description_${selectedLanguage}`} className="text-sm sm:text-md font-bold"> Description</label>
                                                        <textarea onChange={handleDescriptionChange}  value={formState?.supportLanguage?.find(item=> item?.lang === selectedLanguage)?.description || ""} className="block w-full px-2 py-2 text-sm sm:text-md rounded-md my-2 bg-gray-100 text-gray-900   outline-none" name="description" id={`description_${selectedLanguage}`}>
                                                            
                                                        </textarea>
                                                    </div>
                                                    

                                                     <div className="my-2">
                                                        <label htmlFor={`button_${selectedLanguage}`} className="text-sm sm:text-md font-bold"> Button  </label>
                                                        <input onChange={handleButtonTextChange} value={formState?.supportLanguage?.find(item=> item?.lang === selectedLanguage)?.buttonText || ""} type="text" name="name" className="block w-full px-2 py-2 text-sm sm:text-md rounded-md my-2 bg-gray-100 text-gray-900   outline-none" id={`button_${selectedLanguage}`} />
                                                    </div>

                                                    <div className="my-2">
                                                        <label htmlFor="newTab" className="text-sm sm:text-md font-bold">New Tab Allow</label>
                                                        <select onChange={handleNewTabChange} value={formState?.newTab} className="block w-full px-2 py-2 text-sm sm:text-md rounded-md my-2 bg-gray-100 text-gray-900   outline-none" id="level" name="newTab">
                                                            <option value={true}>Yes</option>
                                                            <option value={false}>No</option>
                                                        </select>
                                                        {formError?.newTab && (
                                                            <p className="bg-red-100 text-left font-medium">{formError?.newTab}</p>
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
                                            <button disabled={buttonLoader ? true : false} onClick={submitForm} type="button" className="px-4 py-1 bg-emerald-500 rounded-md text-black text-sm sm:text-lg shadow-md">
                                                {buttonLoader ?  'Loading..' : "Update"}
                                            </button>
                                        </form>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                )}
        </>
    );
}