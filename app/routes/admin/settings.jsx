import { unstable_createFileUploadHandler, unstable_parseMultipartFormData } from "@remix-run/node";
import { Link, redirect, useActionData, useLoaderData, useSubmit } from "@remix-run/react";
import { useEffect, useState } from "react";
import prisma from "../../db.server";
import fs from "node:fs";
import { Toaster, toast } from 'sonner';  

export const loader = async() => {
    const settings = await prisma.settings.findMany({
        select :{id: true, fieldType: true, fieldValue: true}
    });

    return {
        target: "setting-List",
        message: "success",
        data: {
            settings: settings || [],
        }
    };
}



export const action = async ({request}) => {
    const allowedTypes = ["image/jpeg", "image/png", "image/svg+xml"];
    const uploadHandler = unstable_createFileUploadHandler({
        directory: "./public/images/logo",
        maxFileSize: 1024 * 1024 * 1, // 1 MB
        file: ({ filename, contentType }) => {
            if(!allowedTypes.includes(contentType)){
                throw new Error("Only JPG, PNG, and SVG files are allowed.");
            }
            const currentDate = Date.now();
            return `${currentDate}_${filename}`;
          },
      });

      const formData = await unstable_parseMultipartFormData(
        request,
        async ({ name, contentType, data, filename }) => {
          // Handle file uploads
          if (filename) {
            return uploadHandler({ name, contentType, data, filename });
          }
          // Handle text fields
          const chunks = [];
          for await (const chunk of data) chunks.push(chunk);
          return Buffer.concat(chunks).toString("utf-8");
        }
      );
    
    const target = formData.get("target");
     
    if(target === "update-settings"){
        const currentLogo = formData.get("currentLogo") || "";
        const logo = formData.get("logo") || "";
        const notice = formData.get("notice") || "";
        const uploadDir = `/images/logo/${logo?.name}`;


        try{
            // Update notice setting
            await prisma.settings.upsert({
                where: { fieldType: "_NOTICE", id: 1 },
                update:{
                    fieldType: "_NOTICE",
                    fieldValue: JSON.stringify({
                        visibility: notice
                    }),
                },
                create:{
                    fieldType: "_NOTICE",
                    fieldValue: JSON.stringify({
                        visibility: notice
                    }),
                }
            });

            // Update Logo setting
            
             // If Icon change then remove previous icon


            if(logo?.name){
                if(fs.existsSync(`public${currentLogo}`)){
                    fs.unlinkSync(`public${currentLogo}`);
                }
            }

            await prisma.settings.upsert({
                where: { fieldType: "_LOGO", id: 2 },
                update:{
                    fieldType: "_LOGO",
                    fieldValue: JSON.stringify({
                        url: logo?.name ? uploadDir : currentLogo
                    }),
                },
                create:{
                    fieldType: "_LOGO",
                    fieldValue: JSON.stringify({
                        url: uploadDir
                    }),
                }
            });

            return {
                target: target,
                message: "Successfully ! settings updated ",
                data: [],
            }

        }catch(error){
            return {
                target: target,
                message: "Settings update failed please try again !!",
                data: error,
            }
        }
    }

}


export default function Create () {
    const submit = useSubmit();
    const actionData = useActionData("");
    const loaderData = useLoaderData();

    const [pageLoader, setPageLoader] = useState(false);
    const [buttonLoader, setButtonoader] = useState(false);

    const [formState, setFormState] = useState({
        logo:"",
        notice:"",
        currentLogo: ""
    });

    const [formError, setFormError] = useState({
        logo:"",
        notice:"",
    });

    const handleLogoChange = (event)=> {
        setFormState({...formState, logo: event.target.files[0]});
    }
    const handleNoticeChange = (event)=> {
        setFormState({...formState, notice: event.target.value});  
    }
    
    const submitForm = async () => {
        
        setButtonoader(true);
        let validated = true;
        const errorMessages = {};

        // Form validation
        if(!formState.logo || formState.logo == "") {
            errorMessages.name = "Logo is required";
            validated = false;
        }
        
      
        if(validated) {
            const formData = new FormData();
            formData.append("target", "update-settings");
            formData.append("currentLogo", formState.currentLogo); 
            formData.append("logo", formState.logo); 
            formData.append("notice", formState.notice);
            submit(formData, { method: "POST", encType: "multipart/form-data" });
        }
        else {
            setFormError({ ...errorMessages });
            setButtonoader(false);
        }
    }

    useEffect(()=> {
        setPageLoader(true);
        if(loaderData){

            // Format notice value from setting table
            const notice = loaderData?.data?.settings?.filter((item)=> item?.fieldType === "_NOTICE")?.[0];
            const noticeValue = notice?.fieldValue ? JSON.parse(notice?.fieldValue) : 0;

            // Format logo value from setting table
            const logo = loaderData?.data?.settings?.filter((item)=> item?.fieldType === "_LOGO")?.[0];
            const logoValue = notice?.fieldValue ? JSON.parse(logo?.fieldValue) : "";
            
            setFormState({
                logo: logoValue ?  logoValue?.url : "",
                currentLogo: logoValue ?  logoValue?.url : "",
                notice: noticeValue ? parseInt(noticeValue?.visibility) : 0,
                
            })
            
        }
        
        setPageLoader(false);
    },[loaderData])

    /**
     * If form submit successfully ,then the form will be reset
     */
    useEffect(() => {
        if (actionData) {
            if (actionData.target == "update-settings") {
                setButtonoader(false);
                toast.success(actionData.message, {style: { background: "#66C25F", color: "white" } });
                setTimeout(()=> {
                    return redirect("/admin/settings");
                }, 2000)
               
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
                                        <h1 className="text-center text-2xl sm:text-3xl font-bold text-gray-700">System Settings</h1>
                                        <form action="" method="POST">
                                            <div className="grid w-full grid-cols-1  gap-6 my-5">
                                                <div className="relative flex flex-col">
                                                    <div className="my-2">
                                                        <label htmlFor="logo" className="text-sm sm:text-md font-bold">Logo</label>
                                                        <input onChange={handleLogoChange}  type="file" name="flug" className="block w-full px-2 py-2 text-sm sm:text-md rounded-md my-2 bg-gray-100 text-gray-900   outline-none" id="logo" />
                                                        {formError?.logo && (
                                                            <p className="bg-red-100 text-left font-medium">{formError?.logo}</p>
                                                        )}
                                                    </div>

                                                    <div className="my-2">
                                                        <label htmlFor="notice" className="text-sm sm:text-md font-bold">Notice</label>
                                                        <select onChange={handleNoticeChange} value={formState?.notice}  className="block w-full px-2 py-2 text-sm sm:text-md rounded-md my-2 bg-gray-100 text-gray-900   outline-none" id="notice" name="notice">
                                                            <option value={1}>Visible</option>
                                                            <option value={0}>Hidden</option>
                                                        </select>
                                                        
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