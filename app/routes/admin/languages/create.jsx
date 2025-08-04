import { unstable_createFileUploadHandler, unstable_parseMultipartFormData } from "@remix-run/node";
import { Link, useActionData, useNavigate, useSubmit } from "@remix-run/react";
import { useEffect, useState } from "react";
import { Toaster, toast } from 'sonner';
import prisma from "../../../db.server";
import { createTranslationFile } from "../../../libs/helper";

export const action = async ({request}) => {
    const allowedTypes = ["image/jpeg", "image/png", "image/svg+xml"];
    let uploadedFileError = "";
    const uploadHandler = unstable_createFileUploadHandler({
        directory: "./public/images/flugs",
        maxFileSize: 1024 * 1024 * 1, // 1 MB
        file: ({ filename, contentType }) => {
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
            target: "create-language",
            isError: true,
            message: uploadedFileError,
        }
    }
    
    const target = formData.get("target");
     

    if(target === "create-language"){
        const name = formData.get("name") || "";
        const flug = formData.get("flug") || "";
        const code = formData.get("code") || "";
        const status = formData.get("status") || "";
        const uploadDir = `/images/flugs/${flug?.name}`;

        // Check duplicate slug 
        const duplicateCode = await prisma.language.findFirst({
            select: {id: true},
            where: {code: code}
        });
        
        if(duplicateCode){
            return {
                target: target,
                isDuplicate: true,
                message: "This Language  has been already taken",
                data: [],
            }
        }

        try{
            await prisma.language.create({
                data:{
                    name: name,
                    flug: uploadDir,
                    code: code,
                    status: status,
                    createdAt: new Date()
                }
            });

            // Create translation json file
            createTranslationFile(code);

            return {
                target: target,
                message: "Successfully ! language has been created",
                data: [],
            }

        }catch(error){
            return {
                target: target,
                message: "Language creation failed please try again !!",
                data: error,
            }
        }
    }

}


export default function Create () {
    const submit = useSubmit();
    const actionData = useActionData("");

    const [pageLoader, setPageLoader] = useState(false);
    const [buttonLoader, setButtonoader] = useState(false);
    const navigate = useNavigate();

    const [formState, setFormState] = useState({
        name: "",
        flug:"",
        code:"",
        status: "ACTIVE",
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
        setFormState({...formState, flug: event.target.files[0]});
    }
    const handleCodeChange = (event)=> {
        setFormState({...formState, code: event.target.value});  
    }
    const handleStatusChange = (event)=> {
        setFormState({...formState, status: event.target.value});
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
            formData.append("target", "create-language");
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

    useEffect(()=> {
        setPageLoader(true)
       
        setPageLoader(false)
    },[])

    /**
     * If form submit successfully ,then the form will be reset
     */
    useEffect(() => {
        if (actionData) {
            if (actionData.target == "create-language") {
                setButtonoader(false);
                if(actionData.isDuplicate){
                    toast.warning(actionData.message, {style: { background: "#EDDD53", color: "black" } });
                }else if(actionData.isError){
                     toast.error(actionData.message, {style: { background: "#F08C71", color: "white" } });
                }else{
                    toast.success(actionData.message, {style: { background: "#66C25F", color: "white" } });
                    setTimeout(()=> {
                         navigate("/admin/languages", {replace: true});
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
                                        <h1 className="text-center text-2xl sm:text-3xl font-bold text-gray-700">Create Language</h1>
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