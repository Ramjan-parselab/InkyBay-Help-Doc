import { Link, useActionData, useLoaderData, useNavigate, useSubmit } from "@remix-run/react";
import { useEffect, useState } from "react";
import prisma from "../../../db.server";
import { Toaster, toast } from 'sonner';

export const loader = async() => {
    //Find out all active langus
    const languages = await prisma.language.findMany({
        select:{
            id: true, name: true, code: true,
        },
        where:{
            status: "ACTIVE",
            NOT:{
                code: "en"
            }
        }
    })

    // find out category last serial number
    const lastMenu = await prisma.footerMenu.findFirst({
        select: {
            position: true
        },
        orderBy:{
            position: "desc"
        }
    });

    return {
        data:{
            languages: languages,
            lastMenu : lastMenu
        }
    };
}

export const action = async ({request}) => {
    const formdata = await request.formData();
    const target = formdata.get('target') || "";

    if(target === "create-menu"){
        const data = formdata.get('data') || "";
        const submitData = data ?  JSON.parse(data) : {};
        const name = submitData?.name || "";
        const newTab = submitData?.newTab == "true" ? true : false;
        const url = submitData?.url || "";
        const position = submitData?.position;
        const status = submitData?.status || "";
        let footerMenuLanguage = submitData?.footerMenuLanguage;

        // Check duplicate slug 
        const duplicateSlug = await prisma.footerMenu.findFirst({
            select: { url: true},
            where: { url: url }
        });
        
        if(duplicateSlug){
            return {
                target: target,
                isDuplicate: true,
                message: "This Menu  has been already taken",
                data: [],
            }
        }

        try{
            await prisma.footerMenu.create({
                data:{
                    name: name,
                    newTab: newTab,
                    url: url,
                    position:position,
                    status: status,
                    createdAt: new Date()
                }
            });

            // Retrive the last insert ID 
            const lastInsertData = await prisma.footerMenu.findFirst({
                select: { id: true },
                where: { url: url }
            });

            // Default english language category merge with  other languages 
            footerMenuLanguage.push({
                lang: "en",
                name: name
            })

            
            const lastInsertId = lastInsertData?.id;
            // Here add foreign category Id for "categoryLanguage" table 
            const footerMenuLanguageData =  footerMenuLanguage.map((item)=> ({
                ...item,
                footerMenuId: lastInsertId
            }))


            await prisma.footerMenuLanguage.createMany({
                data: footerMenuLanguageData
            })

            return {
                target: target,
                message: "Successfully ! menu has been created",
                data: [],
            }
        }catch(error){
            return {
                target: target,
                message: "Category creation failed please try again !!",
                data: error,
            }
        }
    }

}


export default function Create () {
    const loaderData = useLoaderData("");
    const submit = useSubmit();
    const actionData = useActionData("");
    const [languageData, setLanguageData] = useState("");
    const [pageLoader, setPageLoader] = useState(false);
    const [buttonLoader, setButtonoader] = useState(false);
    const navigate = useNavigate();
  
    const [formState, setFormState] = useState({
        name: "",
        url:"",
        position: "",
        newTab:false,
        status: "ACTIVE",
        footerMenuLanguage: [],
    });

    const [formError, setFormError] = useState({
        name: "",
        url:"",
        position: "",
        newTab:false,
        status: "",
    });


    const handleNameChange = (event)=> {
        setFormState({...formState, name: event.target.value });
    }

    const handleUrlChange = (event) => {
        setFormState({...formState, url: event.target.value });
    }

    const handlePositionChange = (event)=> {
        setFormState({...formState, position: event.target.value});
    }
    
    const handleNewTabChange = (event)=> {
        setFormState({...formState, newTab: event.target.value});
    }

    const handleStatusChange = (event)=> {
        setFormState({...formState, status: event.target.value});
    }
    

    const handleTranslation = (event) => {
        // This value is input value
        const newInput = event.target.value;
        // This code is contry code like "en, fr, it" etc.
        const code = event.target.id;

        const newValue = {
            lang: code,
            name: newInput
        }
        
        setFormState((prev)=> {
            const filtered = prev.footerMenuLanguage.filter((item)=> item.lang !== newValue?.lang);
            return {
                ...prev,
                footerMenuLanguage: [...filtered, newValue]
            }
        })
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
        if(!formState.url || formState.url == "") {
            errorMessages.url = "Url is required";
            validated = false;
        }
        if(!formState.position || formState.position == "") {
            errorMessages.position = "Position is required";
            validated = false;
        }
        
        if(!formState.status || formState.status == "" ) {
            errorMessages.status = "Status is required";
            validated = false;
        }
      
        
        if(validated) {
            submit({ target: "create-menu", data: JSON.stringify(formState) }, { method: "POST" });
        }
        else {
            setFormError({ ...errorMessages });
            setButtonoader(false);
        }
    }

    useEffect(()=> {
        setPageLoader(true)
        if(loaderData){
            setLanguageData(loaderData?.data?.languages);
            if(loaderData?.data?.lastMenu?.position){
                setFormState({...formState, position: parseInt(loaderData?.data?.lastMenu?.position) + 1 })
            }else{
                setFormState({...formState, position:  1 })
            }
        }
        setPageLoader(false)
    },[])

    /**
     * If form submit successfully ,then the form will be reset
     */
    useEffect(() => {
        if (actionData) {
            if (actionData.target == "create-menu") {
                setButtonoader(false);
                if(actionData.isDuplicate){
                    toast.warning(actionData.message, {style: { background: "#EDDD53", color: "black" } });
                }else{
                    toast.success(actionData.message, {style: { background: "#66C25F", color: "white" } });
                    setTimeout(()=> {
                       navigate("/admin/footer/menus", {replace: true});
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
                            <Link to="/admin/footer/menus" className="inline-flex items-center gap-2 rounded bg-[#090808] px-8 py-3 text-sm font-semibold text-white transition-all mb-5">
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
                                        <h1 className="text-center text-2xl sm:text-3xl font-bold text-gray-700">Create footer menu</h1>
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
                                                        <label htmlFor="url" className="text-sm sm:text-md font-bold">Url</label>
                                                        <input onChange={handleUrlChange} value={formState?.slug} type="text" name="url" className="block w-full px-2 py-2 text-sm sm:text-md rounded-md my-2 bg-gray-100 text-gray-900   outline-none" id="url" />
                                                        {formError?.url && (
                                                            <p className="bg-red-100 text-left font-medium">{formError?.url}</p>
                                                        )}
                                                    </div>

                                                    {languageData?.length > 0 && languageData?.map((language) => (
                                                        <div  className="my-2" key={language?.id}>
                                                            <label htmlFor={language?.code} className="text-sm sm:text-md font-bold">{language?.name}</label>
                                                            <input onChange={handleTranslation} value={formState?.footerMenuLanguage?.[language.code]} type="text" name={language?.code}  className="block w-full px-2 py-2 text-sm sm:text-md rounded-md my-2 bg-gray-100 text-gray-900   outline-none" id={language?.code} />
                                                        </div>
                                                    ))}
                                                </div>
                                                <div className="relative flex flex-col">
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
                                                        <label htmlFor="position" className="text-sm sm:text-md font-bold">Position</label>
                                                        <input onChange={handlePositionChange} value={formState?.position} type="number" name="slug" className="block w-full px-2 py-2 text-sm sm:text-md rounded-md my-2 bg-gray-100 text-gray-900   outline-none" id="position" />
                                                        {formError?.position && (
                                                            <p className="bg-red-100 text-left font-medium">{formError?.position}</p>
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
                                            </div>
                                            <button disabled={buttonLoader ? true : false} onClick={submitForm} type="button" className="px-4 py-1 bg-emerald-500 rounded-md text-black text-sm sm:text-lg shadow-md">
                                                {buttonLoader ?  'Loading..' : "Save"}
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