import { Link, useActionData, useLoaderData, useNavigate, useSubmit } from "@remix-run/react";
import { useEffect, useState } from "react";
import { Toaster, toast } from 'sonner';
import RichTextEditor from "../../../components/rich-text-editor";
import prisma from "../../../db.server";

export const loader = async() => {
    //Find out all active langus
    const languages = await prisma.language.findMany({
        select:{
            id: true, name: true, code: true,
        },
        where:{
            status: "ACTIVE",
        }
    })

    return {
        data:{
            languages: languages,
        }
    };
}

export const action = async ({request}) => {
    const formdata = await request.formData();
    const target = formdata.get('target') || "";

    if(target === "create-page"){
        const data = formdata.get('data') || "";
        const submitData = data ?  JSON.parse(data) : {};
        const name = submitData?.name || "";
        const slug = submitData?.slug || "";
        const status = submitData?.status || "";
        let pageLanguage = submitData?.pageLanguage;

        // Check duplicate slug 
        const duplicateSlug = await prisma.pages.findFirst({
            select: {id: true},
            where: {
                OR: 
                [
                    { slug: slug }, 
                ],
            }
        });
        
        if(duplicateSlug){
            return {
                target: target,
                isDuplicate: true,
                message: "This page slug  has been already used",
                data: [],
            }
        }

        try{
            await prisma.pages.create({
                data:{
                    name: name,
                    slug: slug,
                    status: status, 
                    createdAt: new Date()
                }
            });

            //Retrive the last insert ID 
            const lastInsertData = await prisma.pages.findFirst({
                select: {id: true},
                where: {slug: slug}
            });

            
            const lastInsertId = lastInsertData?.id;
            // Here add foreign doc Id for "pageLanguage" table 
            const pageLanguageData =  pageLanguage.map((item)=> ({
                lang: item?.lang,
                title: item?.title,
                content: item?.content,
                section: item?.section,
                pageId: lastInsertId,
                name: item?.name,
            }))

            await prisma.pageLanguage.createMany({
                data: pageLanguageData
            });

            return {
                target: target,
                message: "Successfully ! help page has been created",
                data: [],
            }
        }catch(error){
            return {
                target: target,
                message: "Page creation failed please try again !!",
                data: error,
            }
        }
    }

}



export default function Create () {
    const loaderData = useLoaderData("");
    const actionData = useActionData("");
    const submit = useSubmit();
    const navigate = useNavigate();

    const [buttonLoader, setButtonoader] = useState(false);
    const [pageLoader, setPageLoader] = useState(false);
    const [languages, setLanguages] = useState([]);
    const [selectedLanguage, setSelectedLanguage] = useState("en");
    const [sections, setSections] = useState([0]);
    
    const addMoreSection = () => {
        setSections((prev)=> [...prev, prev[prev.length - 1] + 1 ]);
   }
    
    const [formState, setFormState] = useState({
        name: "",
        title: "",
        slug:"",
        status: "ACTIVE",
        pageLanguage: []
    });

    const [formError, setFormError] = useState({
        name:"",
        title: "",
        slug:"",
        status: ""
    });
       
    const handleTitleChange = (event)=> {
        const name = event.target.value;
        // Replace all special character with "-" 
        const slug = name.toLocaleLowerCase().replace(/[^A-Z0-9]+/ig, "-")
        setFormState({...formState, title: name, slug: slug });
    }

    const handleNameChange = (event)=> {
        const name = event.target.value;
        setFormState({...formState, name: name });
    }

    const handleSlugChange = (event) => {
        const slug = (event.target.value).toLocaleLowerCase();
        // Replace all special character with "-" 
        const newValue = slug ?  slug.replace(/[^A-Z0-9]+/ig, "-") : "";
        setFormState({...formState, slug: newValue });
    }

    const handleLanguageChange = (event)=> {
        setSelectedLanguage(event.target.value);   
    }

    // Helper to get existing values for current language/section
    const getExistingValues = (section) => {
        return formState.pageLanguage.find(
            item => item.lang === selectedLanguage && item.section === section
        ) || {};
    };

    // Shared update logic for all fields
    const updateFormState = (section, newValue) => {
        setFormState(prev => {
            // Create complete value object with defaults
            const updatedValue = {
                lang: selectedLanguage,
                section: section,
                name: newValue.name || "",
                title: newValue.title || "",
                content: newValue.content || "",
            };

            // Remove old entry for this language/section
            const filtered = prev.pageLanguage.filter(
                item => !(item.lang === selectedLanguage && item.section === section)
            );

            // Add updated entry
            return {
                ...prev,
                pageLanguage: [...filtered, updatedValue]
            };
        });
    };

    const handleLanguageTitleChange = (event, section) => {
        const existing = getExistingValues(section);
        updateFormState(section, { 
            ...existing, 
            title: event.target.value 
        });
    };

    const handleLanguageNameChange = (event, section) => {
        const existing = getExistingValues(section);
        updateFormState(section, { 
            ...existing, 
            name: event.target.value 
        });
    };

    const handleContentChange = (content, section) => {
        const existing = getExistingValues(section);
        updateFormState(section, { 
            ...existing, 
            content: content 
        });
    };
    
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

        if(!formState.title || formState.title == "") {
            errorMessages.title = "Title is required";
            validated = false;
        }
        if(!formState.slug || formState.slug == "") {
            errorMessages.slug = "Slug is required";
            validated = false;
        }

        if(!formState.status || formState.status == "" ) {
            errorMessages.status = "Status is required";
            validated = false;
        }
        if(formState?.pageLanguage?.length == 0 || !formState?.pageLanguage?.[0]?.title){
             errorMessages.pageLanguage = "Please add at least one language  translation";
            validated = false;
        }
        
        if(validated) {
            submit({ target: "create-page", data: JSON.stringify(formState) }, { method: "POST" });
        }
        else {
            setFormError({ ...errorMessages });
            setButtonoader(false);
        }
    }

    useEffect(()=> {
        setPageLoader(true)
        if(loaderData){
            setLanguages(loaderData?.data?.languages);
        }
        setPageLoader(false)
    },[])

    /**
     * If form submit successfully ,then the form will be reset
     */
    useEffect(() => {
        if (actionData) {
            if (actionData.target == "create-page") {
                setButtonoader(false);
                if(actionData.isDuplicate){
                    toast.warning(actionData.message, {style: { background: "#EDDD53", color: "black" } });
                }else{
                    toast.success(actionData.message, {style: { background: "#66C25F", color: "white" } });
                    setTimeout(()=> {
                        navigate("/admin/pages", {replace: true});
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
                            <Link to="/admin/pages" className="inline-flex items-center gap-2 rounded bg-[#090808] px-8 py-3 text-sm font-semibold text-white transition-all mb-5">
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
                                        <h1 className="text-center text-2xl sm:text-3xl font-bold text-gray-700">Create Page</h1>
                                        <form action="" method="POST">
                                            <div className="relative flex flex-col">
                                                <div className="my-2">
                                                    <label htmlFor="name" className="text-sm sm:text-md font-bold">Name</label>
                                                    <input onChange={handleNameChange} value={formState?.name} type="text" name="name" className="block w-full px-2 py-2 text-sm sm:text-md rounded-md my-2 bg-gray-100 text-gray-900   outline-none" id="name" />
                                                    {formError?.name && (
                                                        <p className="bg-red-100 text-left font-medium">{formError?.name}</p>
                                                    )}
                                                </div>
                                                <div className="my-2">
                                                    <label htmlFor="title" className="text-sm sm:text-md font-bold">Title</label>
                                                    <input onChange={handleTitleChange} value={formState?.title} type="text" name="name" className="block w-full px-2 py-2 text-sm sm:text-md rounded-md my-2 bg-gray-100 text-gray-900   outline-none" id="title" />
                                                    {formError?.title && (
                                                        <p className="bg-red-100 text-left font-medium">{formError?.title}</p>
                                                    )}
                                                </div>
                                                <div className="my-2">
                                                    <label htmlFor="slug" className="text-sm sm:text-md font-bold">Slug</label>
                                                    <input onChange={handleSlugChange} value={formState?.slug} type="text" name="slug" className="block w-full px-2 py-2 text-sm sm:text-md rounded-md my-2 bg-gray-100 text-gray-900   outline-none" id="slug" />
                                                    {formError?.slug && (
                                                        <p className="bg-red-100 text-left font-medium">{formError?.slug}</p>
                                                    )}
                                                    {formState?.slug && (
                                                        <p className="bg-yellow-200 text-left font-medium pl-2">{`Live link: inkybay.com/pages/${formState?.slug}`}</p>
                                                    )}
                                                </div>
                                                <div className="grid w-full grid-cols-2  gap-6 my-4">
                                                    <div className="my-2">
                                                        <label htmlFor="status" className="text-sm sm:text-md font-bold">Status</label>
                                                        <select onChange={handleStatusChange} value={formState?.status} className="block w-full px-2 py-2 text-sm sm:text-md rounded-md my-2 bg-gray-100 text-gray-900   outline-none" id="status">
                                                            <option value="ACTIVE">Active</option>
                                                            <option value="INACTIVE">Inactive</option>
                                                            <option value="DRAFT">Draft</option>
                                                        </select>
                                                        {formError?.status && (
                                                            <p className="bg-red-100 text-left font-medium">{formError?.status}</p>
                                                        )}
                                                    </div>  

                                                </div>
                                            </div>

                                            <div className="grid w-full grid-cols-2  gap-6">
                                                <div className="my-2">
                                                    <label htmlFor="language" className="text-sm sm:text-md font-bold">Select Language</label>
                                                    <select onChange={handleLanguageChange} value={formState?.language} className="block w-full px-2 py-2 text-sm sm:text-md rounded-md my-2 bg-gray-100 text-gray-900   outline-none" id="language">
                                                        {languages?.length > 0 && languages.map((language)=> (
                                                            <option key={language?.id} value={language?.code}>{language?.name}</option>
                                                        ))}
                                                    </select>
                                                    {formError?.language && (
                                                        <p className="bg-red-100 text-left font-medium">{formError?.language}</p>
                                                    )}
                                                </div>
                                                <div className="my-2">
                                                    <button onClick={addMoreSection}  type="button" className="float-right px-4 py-1 bg-emerald-500 rounded-md text-black text-sm sm:text-lg shadow-md mt-8">
                                                        Add more section
                                                    </button>
                                                </div>
                                            </div>
                                            
                                        </form>
                                    </div>
                                    {formError?.pageLanguage && (
                                        <p className="bg-red-100 text-left font-medium">{formError?.pageLanguage}</p>
                                    )}
                                    {sections.length > 0 && sections.map((sectionId)=> (
                                        <div key={sectionId} className="relative flex flex-col">
                                            {sectionId === 0 && (
                                                <>
                                                    <div className="my-2">
                                                        <label htmlFor={`name_${sectionId}`} className="text-sm sm:text-md font-bold">Translation Name</label>
                                                        {formState.pageLanguage.some(item => item.lang === selectedLanguage && item.section === sectionId) ? (
                                                            <input
                                                                id={`name_${sectionId}`}
                                                                name="name"
                                                                type="text"
                                                                value={
                                                                formState.pageLanguage.find(
                                                                    item => item.lang === selectedLanguage && item.section === sectionId
                                                                )?.name || ""
                                                                }
                                                                onChange={e => handleLanguageNameChange(e, sectionId)}
                                                                className="block w-full px-2 py-2 text-sm sm:text-md rounded-md my-2 bg-gray-100 text-gray-900 outline-none"
                                                            />
                                                        ) : (
                                                            <input
                                                                id={`name_${sectionId}`}
                                                                name="name"
                                                                type="text"
                                                                value=""
                                                                onChange={e => handleLanguageNameChange(e, sectionId)}
                                                                className="block w-full px-2 py-2 text-sm sm:text-md rounded-md my-2 bg-gray-100 text-gray-900 outline-none"
                                                            />
                                                        )}
                                                    </div>

                                                    <div className="my-2">
                                                        <label htmlFor={`title_${sectionId}`} className="text-sm sm:text-md font-bold">Translation Title</label>
                                                        {formState.pageLanguage.some(item => item.lang === selectedLanguage && item.section === sectionId) ? (
                                                            <input
                                                                id={`title_${sectionId}`}
                                                                name="title"
                                                                type="text"
                                                                value={
                                                                formState.pageLanguage.find(
                                                                    item => item.lang === selectedLanguage && item.section === sectionId
                                                                )?.title || ""
                                                                }
                                                                onChange={e => handleLanguageTitleChange(e, sectionId)}
                                                                className="block w-full px-2 py-2 text-sm sm:text-md rounded-md my-2 bg-gray-100 text-gray-900 outline-none"
                                                            />
                                                        ) : (
                                                            <input
                                                                id={`title_${sectionId}`}
                                                                name="subtitle"
                                                                type="text"
                                                                value=""
                                                                onChange={e => handleLanguageTitleChange(e, sectionId)}
                                                                className="block w-full px-2 py-2 text-sm sm:text-md rounded-md my-2 bg-gray-100 text-gray-900 outline-none"
                                                            />
                                                        )}
                                                    </div>

                                                    
                                                </>
                                                
                                            )}
                                            
                                            <div className="my-2">
                                                <label htmlFor={`content_${sectionId}`} className="text-sm sm:text-md font-bold">content</label>
                                                {formState.pageLanguage.some(item => item.lang === selectedLanguage && item.section === sectionId) ? (
                                                    <>
                                                        <RichTextEditor
                                                            id={`content_${sectionId}`}
                                                            name="content"
                                                            content={
                                                            formState.pageLanguage.find(
                                                                item => item.lang === selectedLanguage && item.section === sectionId
                                                            )?.content || ""
                                                            }
                                                            onChange={content => handleContentChange(content, sectionId)}
                                                            className="block w-full px-2 py-2 text-sm sm:text-md rounded-md my-2 bg-gray-100 text-gray-900 outline-none"
                                                        />
                                                    </>
                                                ) : (
                                                        <RichTextEditor
                                                            id={`content_${sectionId}`}
                                                            name="content"
                                                            content=""
                                                            onChange={content => handleContentChange(content, sectionId)}
                                                            className="block w-full px-2 py-2 text-sm sm:text-md rounded-md my-2 bg-gray-100 text-gray-900 outline-none"
                                                        />
                                                )}
                                            </div>
                                        </div>
                                    ))}
                                            
                                    <button disabled={buttonLoader ? true : false} onClick={submitForm} type="button" className="px-4 py-1 bg-emerald-500 rounded-md text-black text-sm sm:text-lg shadow-md">
                                        {buttonLoader ?  'Loading..' : "Save"}
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                )}
        </>
    );
}