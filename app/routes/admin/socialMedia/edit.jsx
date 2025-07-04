import { Link, useActionData, useLoaderData, useSubmit } from "@remix-run/react";
import { useEffect, useState } from "react";
import prisma from "../../../db.server";
import { Toaster, toast } from 'sonner';

export const loader = async({params}) => {
    // find out category last serial number
    const socialMedia = await prisma.socialMedia.findFirst({
        where: {
            id: parseInt(params?.id)
        },
    });

    return {
        data:{
            socialMedia: socialMedia,
        }
    };
}

export const action = async ({request}) => {
    const formdata = await request.formData();
    const target = formdata.get('target') || "";

    if(target === "update-media"){
        const data = formdata.get('data') || "";
        const submitData = data ?  JSON.parse(data) : {};
        const id = submitData?.id || "";
        const name = submitData?.name || "";
        const url = submitData?.url || "";
       

         // Check duplicate slug 
        const duplicateSlug = await prisma.socialMedia.findFirst({
            select: {url: true},
            where: { url: url,
                NOT:{
                    id: parseInt(id)
                }
            }
        });

        if(duplicateSlug){
            return {
                target: target,
                isDuplicate: true,
                message: "This Social media  has been already taken",
                data: [],
            }
        }

        try{
            // Here update main category and after that update category language 
            await prisma.socialMedia.update({
                data:{
                    name: name,
                    url: url,
                },
                where: {
                    id: parseInt(id)
                } 
                
            });

            
            return {
                target: target,
                message: "Successfully ! Social media has been updated",
                data: [],
            }
        }catch(error){
            return {
                target: target,
                message: "Social media update failed please try again !!",
                data: error,
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
    
    const [formState, setFormState] = useState({
        name: "",
        url:"",
    });

    const [formError, setFormError] = useState({
        name: "",
        url:"",
    });

    

    const handleNameChange = (event)=> {
        setFormState({...formState, name: event.target.value});
    }

    const handleUrlChange = (event)=> {
        setFormState({...formState, url: event.target.value});
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
            errorMessages.flug = "url is required";
            validated = false;
        }
      
        
        if(validated) {
            submit({ target: "update-media", data: JSON.stringify(formState) }, { method: "POST" });
        }
        else {
            setFormError({ ...errorMessages });
            setButtonoader(false);
        }
    }

    useEffect(()=> {
        setPageLoader(true);
        if(loaderData){
            if(loaderData?.data?.socialMedia?.id) {
                const mediaData = loaderData?.data?.socialMedia;
                setFormState({
                    id: mediaData?.id ? mediaData?.id : "",
                    name: mediaData?.name ? mediaData?.name : "",
                    url: mediaData?.url ? mediaData?.url : "",
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
            if (actionData.target == "update-media") {
                setButtonoader(false);
                if(actionData.isDuplicate){
                    toast.warning(actionData.message, {style: { background: "#EDDD53", color: "black" } });

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
                            <Link to="/admin/socials-media" className="inline-flex items-center gap-2 rounded bg-[#090808] px-8 py-3 text-sm font-semibold text-white transition-all mb-5">
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
                                        <h1 className="text-center text-2xl sm:text-3xl font-bold text-gray-700">Update Social Media</h1>
                                        <form action="" method="POST">
                                            <div className="grid w-full grid-cols-1  gap-6 my-5">
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
                                                        <input onChange={handleUrlChange} value={formState?.url} type="text" name="flug" className="block w-full px-2 py-2 text-sm sm:text-md rounded-md my-2 bg-gray-100 text-gray-900   outline-none" id="url" />
                                                        {formError?.url && (
                                                            <p className="bg-red-100 text-left font-medium">{formError?.url}</p>
                                                        )}
                                                    </div>
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