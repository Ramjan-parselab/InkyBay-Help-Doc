import { Link, useActionData, useLoaderData, useNavigate, useSubmit } from "@remix-run/react";
import { useEffect, useState } from "react";
import prisma from "../../../db.server";
import { unstable_createFileUploadHandler, unstable_parseMultipartFormData } from "@remix-run/node";
import { Toaster, toast } from 'sonner';

export const loader = async() => {
    //Find out all active langus
    const languages = await prisma.language.findMany({
        select:{
            id: true, name: true, code: true,
        },
    });

    // get All categories 
        const categories =  await prisma.categories.findMany({
            select: {
                name: true, id: true, level: true 
            },
            where:{
                parentCategory: null
            }
        });

    // find out category last serial number
    const categorySerial = await prisma.categories.findFirst({
        select: {
            serial: true
        },
        where: {
            level: "LEVEL_1"
        },
        orderBy:{
            serial: "desc"
        }
    });

    return {
        data:{
            languages: languages,
            categorySerial : categorySerial,
            categories: categories
        }
    };
}

export const action = async ({request}) => {
    const allowedTypes = ["image/jpeg", "image/png", "image/svg+xml"];
    let uploadedFileError = "";
    const uploadHandler = unstable_createFileUploadHandler({
        directory: "./public/images/categories",
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
            target: "create-category",
            isError: true,
            message: uploadedFileError,
        }
    }
        
    const target = formData.get("target");
    

    if(target === "create-category"){
        const name = formData.get("name") || "";
        const slug = formData.get("slug") || "";
        const icon = formData.get("icon") || "";
        const serial = formData.get("serial");
        const parentCategory = formData.get("parentCategory") || null;
        const status = formData.get("status") || "";
        const uploadDir = `/images/categories/${icon?.name}`;
        let categoryLanguage = JSON.parse(formData.get("categoryLanguage")) || [];

        

        // Check duplicate slug 
        const duplicateSlug = await prisma.categories.findFirst({
            select: {id: true},
            where: {slug: slug}
        });
        
        if(duplicateSlug){
            return {
                target: target,
                isDuplicate: true,
                message: "This category slug has been already taken",
                data: [],
            }
        }

        try{
            await prisma.categories.create({
                data:{
                    name: name,
                    slug: slug,
                    icon: uploadDir,
                    level:  parseInt(parentCategory) > 0 ? "LEVEL_2": "LEVEL_1" ,
                    serial: parseInt(serial ),
                    parentCategory: parseInt(parentCategory) > 0 ?  parseInt(parentCategory) : null,
                    status: status,
                    createdAt: new Date()
                }
            });

            //Retrive the last insert ID 
            const lastInsertData = await prisma.categories.findFirst({
                select: {id: true},
                where: {slug: slug}
            });

            
            const lastInsertId = lastInsertData?.id;
            // Here add foreign category Id for "categoryLanguage" table 
            const categoryLanguageData =  categoryLanguage.map((item)=> ({
                ...item,
                categoryId: lastInsertId
            }))


            await prisma.categoryLanguage.createMany({
                data: categoryLanguageData
            })

            return {
                target: target,
                message: "Successfully ! category has been created",
                data: [],
            }
        }catch(error){
            console.log(error)
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
    const navigate = useNavigate();

    const [pageLoader, setPageLoader] = useState(false);
    const [categories, setCategories] = useState([]);
    const [selectedLanguage, setSelectedLanguage] = useState("en");

    const [formState, setFormState] = useState({
        name: "",
        slug:"",
        icon:"",
        level:"LEVEL_1",
        serial: "",
        parentCategory: "",
        status: "ACTIVE",
        categoryLanguage: [],
        
    });

    const [formError, setFormError] = useState({
        name: "",
        slug:"",
        icon:"",
        level:"",
        serial: "",
        parentCategory:"",
        status: "",
    });

    const [buttonLoader, setButtonoader] = useState(false);

    const handleNameChange = (event)=> {
        const name = event.target.value;
        // Replace all special character with "-" 
        const slug = name.toLocaleLowerCase().replace(/[^A-Z0-9]+/ig, "-")
        setFormState({...formState, name: name, slug: slug });
    }

    const handleLanguageChange = (event)=> {
        setSelectedLanguage(event.target.value);   
    }

    const handleSlugChange = (event) => {
        const slug = (event.target.value).toLocaleLowerCase();
        // Replace all special character with "-" 
        const newValue = slug ?  slug.replace(/[^A-Z0-9]+/ig, "-") : "";
        setFormState({...formState, slug: newValue });
    }

    const handleIconChange = (event)=> {
        setFormState({...formState, icon: event.target.files[0]});
    }
    
    // const handleSerialChange = (event)=> {
    //     setFormState({...formState, serial: event.target.value});
    // }
    
    const handleParentCategory = (event) => {
        setFormState({...formState, parentCategory: event.target.value});
    }

    const handleStatusChange = (event)=> {
        setFormState({...formState, status: event.target.value});
    }

    const handleTranslation = (event) => {
        // This value is input value
        const newInput = event.target.value;
    

        const newValue = {
            lang: selectedLanguage,
            name: newInput,
            description: formState?.categoryLanguage?.find(item=> item?.lang === selectedLanguage) ? formState?.categoryLanguage?.find(item=> item?.lang === selectedLanguage)?.description : "",
        }
        
        setFormState((prev)=> {
            const filtered = prev.categoryLanguage.filter((item)=> item.lang !== newValue?.lang);
            return {
                ...prev,
                categoryLanguage: [...filtered, newValue]
            }
        })
    }

    const handleDescriptionChange = (event) => {
        // This value is input value
        const newInput = event.target.value;
        const newValue = {
            lang: selectedLanguage,
            name: formState?.categoryLanguage?.find(item=> item?.lang === selectedLanguage) ? formState?.categoryLanguage?.find(item=> item?.lang === selectedLanguage)?.name : "",
            description: newInput
        }
        
        setFormState((prev)=> {
            const filtered = prev.categoryLanguage.filter((item)=> item.lang !== newValue?.lang);
            return {
                ...prev,
                categoryLanguage: [...filtered, newValue]
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
        if(!formState.slug || formState.slug == "") {
            errorMessages.slug = "Slug is required";
            validated = false;
        }
        // if(!formState.icon || formState.icon == "") {
        //     errorMessages.icon = "Icon is required";
        //     validated = false;
        // }
        
        // if(!formState.serial || formState.serial == "" || 0 >=  parseInt(formState.serial) ) {
        //     errorMessages.serial = "Serial is required";
        //     validated = false;
        // }
        if(!formState.status || formState.status == "" ) {
            errorMessages.status = "Status is required";
            validated = false;
        }
      
        
        if(validated) {
            const formData = new FormData();
            formData.append("target", "create-category");
            formData.append("name", formState.name);
            formData.append("slug", formState.slug);
            formData.append("icon", formState.icon); // file
            formData.append("level", formState.level);
            formData.append("serial", formState.serial);
            formData.append("parentCategory", formState.parentCategory);
            formData.append("categoryLanguage", JSON.stringify(formState.categoryLanguage));
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
        if(loaderData){
            setLanguageData(loaderData?.data?.languages);
            setCategories(loaderData?.data?.categories);
            if(loaderData?.data?.categorySerial?.serial){
                setFormState({...formState, serial: parseInt(loaderData?.data?.categorySerial?.serial) + 1 })
            }else{
                setFormState({...formState, serial:  1 })
            }
        }
        setPageLoader(false)
    },[])

    /**
     * If form submit successfully ,then the form will be reset
     */
    useEffect(() => {
        if (actionData) {
            if (actionData.target == "create-category") {
                setButtonoader(false);
                if(actionData.isDuplicate){
                   toast.warning(actionData.message, {style: { background: "#EDDD53", color: "black" } });
                }else if(actionData.isError){
                    toast.error(actionData.message, {style: { background: "#F08C71", color: "white" } });
                }else{
                    toast.success(actionData.message, {style: { background: "#66C25F", color: "white" } });
                    setTimeout(()=> {
                        navigate("/admin/categories", {replace: true});
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
                            <Link to="/admin/categories" className="inline-flex items-center gap-2 rounded bg-[#090808] px-8 py-3 text-sm font-semibold text-white transition-all mb-5">
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
                                        <h1 className="text-center text-2xl sm:text-3xl font-bold text-gray-700">Create Category</h1>
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
                                                        <label htmlFor={`name_${selectedLanguage}`} className="text-sm sm:text-md font-bold"> Translation Name</label>
                                                        <input onChange={handleTranslation} value={formState?.categoryLanguage?.find(item=> item?.lang === selectedLanguage)?.name || ""} type="text" name="name" className="block w-full px-2 py-2 text-sm sm:text-md rounded-md my-2 bg-gray-100 text-gray-900   outline-none" id={`name_${selectedLanguage}`} />
                                                        {formError?.name && (
                                                            <p className="bg-red-100 text-left font-medium">{formError?.name}</p>
                                                        )}
                                                    </div>

                                                    <div className="my-2">
                                                        <label htmlFor={`description_${selectedLanguage}`} className="text-sm sm:text-md font-bold"> Description</label>
                                                        <textarea onChange={handleDescriptionChange}  value={formState?.categoryLanguage?.find(item=> item?.lang === selectedLanguage)?.description || ""} className="block w-full px-2 py-2 text-sm sm:text-md rounded-md my-2 bg-gray-100 text-gray-900   outline-none" name="description" id={`description_${selectedLanguage}`}>
                                                            
                                                        </textarea>
                                                        {/* <input onChange={handleDescriptionChange} value={formState?.categoryLanguage?.find(item=> item?.lang === selectedLanguage)?.description || ""} type="text" name="name" className="block w-full px-2 py-2 text-sm sm:text-md rounded-md my-2 bg-gray-100 text-gray-900   outline-none" id={`description_${selectedLanguage}`} /> */}
                                                        {formError?.name && (
                                                            <p className="bg-red-100 text-left font-medium">{formError?.name}</p>
                                                        )}
                                                    </div>
                                                       
                                                    
                                                    <div className="my-2">
                                                        <label htmlFor="slug" className="text-sm sm:text-md font-bold">Slug</label>
                                                        <input onChange={handleSlugChange} value={formState?.slug} type="text" name="slug" className="block w-full px-2 py-2 text-sm sm:text-md rounded-md my-2 bg-gray-100 text-gray-900   outline-none" id="slug" />
                                                        {formError?.slug && (
                                                            <p className="bg-red-100 text-left font-medium">{formError?.slug}</p>
                                                        )}
                                                    </div>
                                                </div>
                                                <div className="relative flex flex-col">
                                                    <div className="my-2">
                                                        <label htmlFor="icon" className="text-sm sm:text-md font-bold">Icon</label>
                                                        <input onChange={handleIconChange}  type="file" name="icon" className="block w-full px-2 py-2 text-sm sm:text-md rounded-md my-2 bg-gray-100 text-gray-900   outline-none" id="icon" />
                                                        {formError?.icon && (
                                                            <p className="bg-red-100 text-left font-medium">{formError?.icon}</p>
                                                        )}
                                                    </div>
                                                    {/* <div className="my-2">
                                                        <label htmlFor="serial" className="text-sm sm:text-md font-bold">Serial</label>
                                                        <input onChange={handleSerialChange} value={formState?.serial} type="number" name="slug" className="block w-full px-2 py-2 text-sm sm:text-md rounded-md my-2 bg-gray-100 text-gray-900   outline-none" id="serial" />
                                                        {formError?.serial && (
                                                            <p className="bg-red-100 text-left font-medium">{formError?.serial}</p>
                                                        )}
                                                    </div> */}
                                                    <div className="my-2">
                                                        <label htmlFor="parentCategory" className="text-sm sm:text-md font-bold">Category</label>
                                                        <select onChange={handleParentCategory}  className="block w-full px-2 py-2 text-sm sm:text-md rounded-md my-2 bg-gray-100 text-gray-900   outline-none" id="parentCategory">
                                                            <option  value="">Select Category</option>
                                                            {categories?.length > 0 && categories.map((category)=> (
                                                                <option key={category?.id} value={category?.id}>{category?.name}</option>
                                                            ))}
                                                        </select>
                                                        {formError?.parentCategory && (
                                                            <p className="bg-red-100 text-left font-medium">{formError?.parentCategory}</p>
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