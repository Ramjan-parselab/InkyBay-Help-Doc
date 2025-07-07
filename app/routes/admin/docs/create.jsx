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

    // find out category last serial number
    const categories = await prisma.categories.findMany({
        select: {
            id: true, name: true
        },
        where: {
            parentCategory: null
        },
        orderBy:{
            name: "asc"
        }
    });

    return {
        data:{
            languages: languages,
            categories : categories
        }
    };
}

export const action = async ({request}) => {
    const formdata = await request.formData();
    const target = formdata.get('target') || "";

    if(target === "create-doc"){
        const data = formdata.get('data') || "";
        const submitData = data ?  JSON.parse(data) : {};
        const title = submitData?.title || "";
        const slug = submitData?.slug || "";
        const isPin = submitData?.isPin ? true : false;
        const categoryId = parseInt(submitData?.categoryId) || "";
        const status = submitData?.status || "";
        let docsLanguage = submitData?.docsLanguage;

        // Check duplicate slug 
        const duplicateSlug = await prisma.docs.findFirst({
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
                message: "This doc slug or category has been already used",
                data: [],
            }
        }

        try{
            await prisma.docs.create({
                data:{
                    title: title,
                    slug: slug,
                    categoryId: categoryId,
                    isPin: isPin,
                    status: status, 
                    createdAt: new Date()
                }
            });

            //Retrive the last insert ID 
            const lastInsertData = await prisma.docs.findFirst({
                select: {id: true},
                where: {slug: slug}
            });

            
            const lastInsertId = lastInsertData?.id;
            // Here add foreign doc Id for "docsLanguage" table 
            const docsLanguageData =  docsLanguage.map((item)=> ({
                lang: item?.lang,
                title: item?.title,
                subtitle: item?.subtitle,
                content: item?.content,
                shortDescription:item?.shortDescription,
                section: item?.section,
                docsId: lastInsertId
            }))

            await prisma.docsLanguage.createMany({
                data: docsLanguageData
            })

            return {
                target: target,
                message: "Successfully ! help doc has been created",
                data: [],
            }
        }catch(error){
            return {
                target: target,
                message: "help doc creation failed please try again !!",
                data: error,
            }
        }
    }else if(target === "get-subCategory"){
        const categoryId = formdata.get('categoryId') || "";
        try {
            const SubCategories = await prisma.categories.findFirst({
                select: {
                    id: true,
                    subCategory:{
                        select:{
                            id: true,
                            name: true,
                        }
                    }
                },
                where:{
                    id: parseInt(categoryId),
                }
            });
            return {
                target: target,
                message: "SubCategories",
                data: SubCategories,
            }
        } catch (error) {
            return {
                target: target,
                message: "SubCategories not found",
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
    const [categories, setCategories] = useState([]);
    const [languages, setLanguages] = useState([]);
    const [selectedLanguage, setSelectedLanguage] = useState("en");
    const [sections, setSections] = useState([0]);
    const [subCategories, setSubCategories] = useState([]);
    const [selectedParentCategoryId, setSelectedParentCategoryId] = useState("");
    
    

    const addMoreSection = () => {
        setSections((prev)=> [...prev, prev[prev.length - 1] + 1 ]);
   }
    

    const [formState, setFormState] = useState({
        title: "",
        slug:"",
        categoryId:"",
        isPin: false,
        status: "ACTIVE",
        docsLanguage: []
    });

    const [formError, setFormError] = useState({
        title: "",
        slug:"",
        categoryId:"",
        status: "",
        parentCategory:"",
        docsLanguage: ""
    });
       

    const handleTitleChange = (event)=> {
        const name = event.target.value;
        // Replace all special character with "-" 
        const slug = name.toLocaleLowerCase().replace(/[^A-Z0-9]+/ig, "-")
        setFormState({...formState, title: name, slug: slug });
    }

    const handleSlugChange = (event) => {
        const slug = (event.target.value).toLocaleLowerCase();
        // Replace all special character with "-" 
        const newValue = slug ?  slug.replace(/[^A-Z0-9]+/ig, "-") : "";
        setFormState({...formState, slug: newValue });
    }

    const getSubCategory = (event) => {
        const categoryId = event?.target.value;
        setSelectedParentCategoryId(categoryId)
        submit({ target: "get-subCategory", categoryId: categoryId }, { method: "POST" });
    }

    const handleCategoryChange = (event)=> {
        setFormState({...formState, categoryId: event.target.value});
    }
    const handleLanguageChange = (event)=> {
        setSelectedLanguage(event.target.value);   
    }

    const handleIsPinChange = ()=> {
        setFormState({...formState, isPin: !formState?.isPin });
    }

    // Helper to get existing values for current language/section
    const getExistingValues = (section) => {
        return formState.docsLanguage.find(
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
                title: newValue.title || "",
                subtitle: newValue.subtitle || "",
                content: newValue.content || "",
                shortDescription: newValue.shortDescription || ""
            };

            // Remove old entry for this language/section
            const filtered = prev.docsLanguage.filter(
                item => !(item.lang === selectedLanguage && item.section === section)
            );

            // Add updated entry
            return {
                ...prev,
                docsLanguage: [...filtered, updatedValue]
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

    const handleDescriptionChange = (event, section) => {
        const existing = getExistingValues(section);
        updateFormState(section, { 
            ...existing, 
            shortDescription: event.target.value 
        });
    };
 
    const handleSubtitleChange = (event, section) => {
        const existing = getExistingValues(section);
        updateFormState(section, { 
            ...existing, 
            subtitle: event.target.value 
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
        if(!formState.title || formState.title == "") {
            errorMessages.name = "Title is required";
            validated = false;
        }
        if(!formState.slug || formState.slug == "") {
            errorMessages.slug = "Slug is required";
            validated = false;
        }

        if(!selectedParentCategoryId || selectedParentCategoryId == "") {
            errorMessages.parentCategory = "Category is required";
            validated = false;
        }
        
        if(!formState.categoryId || formState.categoryId == "") {
            errorMessages.categoryId = "Sub Category is required";
            validated = false;
        }
        
        if(!formState.status || formState.status == "" ) {
            errorMessages.status = "Status is required";
            validated = false;
        }
        if(formState?.docsLanguage?.length == 0 || !formState?.docsLanguage?.[0]?.title || !formState?.docsLanguage?.[0]?.shortDescription){
             errorMessages.docsLanguage = "Please add at least one language  translation";
            validated = false;
        }
        
        if(validated) {
            submit({ target: "create-doc", data: JSON.stringify(formState) }, { method: "POST" });
        }
        else {
            setFormError({ ...errorMessages });
            setButtonoader(false);
        }
    }

    useEffect(()=> {
        setPageLoader(true)
        if(loaderData){
            setCategories(loaderData?.data?.categories);
            setLanguages(loaderData?.data?.languages);
        }
        setPageLoader(false)
    },[])

    /**
     * If form submit successfully ,then the form will be reset
     */
    useEffect(() => {
        if (actionData) {
            if (actionData.target == "create-doc") {
                setButtonoader(false);
                if(actionData.isDuplicate){
                    toast.warning(actionData.message, {style: { background: "#EDDD53", color: "black" } });
                }else{
                    toast.success(actionData.message, {style: { background: "#66C25F", color: "white" } });
                    setTimeout(()=> {
                        navigate("/admin/docs", {replace: true});
                    }, 2000)
                
                }
            }else if(actionData?.target == "get-subCategory"){
                // IF category does't have any subCategory then it will be set as a document categoryId
                if(actionData?.data?.subCategory?.length > 0){
                    setSubCategories(actionData?.data?.subCategory);
                }else{
                    setSubCategories([]);
                    setFormState({...formState, categoryId: selectedParentCategoryId})
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
                            <Link to="/admin/docs" className="inline-flex items-center gap-2 rounded bg-[#090808] px-8 py-3 text-sm font-semibold text-white transition-all mb-5">
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
                                        <h1 className="text-center text-2xl sm:text-3xl font-bold text-gray-700">Create Docs</h1>
                                        <form action="" method="POST">
                                            <div className="relative flex flex-col">
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
                                                </div>
                                                <div className="grid w-full grid-cols-2  gap-6 my-4">
                                                    <div className="my-2">
                                                        <label htmlFor="parentCategory" className="text-sm sm:text-md font-bold">Category</label>
                                                        <select onChange={getSubCategory} value={selectedParentCategoryId} className="block w-full px-2 py-2 text-sm sm:text-md rounded-md my-2 bg-gray-100 text-gray-900   outline-none" id="parentCategory">
                                                            <option  value="">Select Category</option>
                                                            {categories?.length > 0 && categories.map((category)=> (
                                                                <option key={category?.id} value={category?.id}>{category?.name}</option>
                                                            ))}
                                                        </select>
                                                        {!selectedParentCategoryId && (
                                                            <p className="bg-red-100 text-left font-medium">{formError?.parentCategory}</p>
                                                        )}
                                                    </div>
                                                    
                                                   
                                                    <div className="my-2">
                                                        <label htmlFor="subcategory" className="text-sm sm:text-md font-bold">Sub Category</label>
                                                        <select onChange={handleCategoryChange} value={formState?.categoryId} className="block w-full px-2 py-2 text-sm sm:text-md rounded-md my-2 bg-gray-100 text-gray-900   outline-none" id="subcategory" name="subcategory">
                                                            <option defaultValue="">Select sub Category</option>
                                                            {subCategories?.length > 0 && subCategories.map((category)=> (
                                                                <option key={category?.id} value={category?.id}>{category?.name}</option>
                                                            ))}
                                                        </select>
                                                        {formError?.categoryId && (
                                                            <p className="bg-red-100 text-left font-medium">{formError?.categoryId}</p>
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

                                                    <div className="my-2">
                                                        <div className="flex items-center mt-4 rounded-sm">
                                                            <input id="isPin" onChange={handleIsPinChange} type="checkbox" value={formState?.isPin ?  true: false} checked={formState?.isPin ?  true: false} name="isPin" className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded-sm focus:ring-blue-500 dark:focus:ring-blue-600 focus:ring-2" />
                                                            <label htmlFor="isPin" className="w-full py-4 ms-2 text-sm font-medium text-gray-90">Pin to Home Page</label>
                                                        </div>
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
                                    {formError?.docsLanguage && (
                                        <p className="bg-red-100 text-left font-medium">{formError?.docsLanguage}</p>
                                    )}
                                    {sections.length > 0 && sections.map((sectionId)=> (
                                        <div key={sectionId} className="relative flex flex-col">
                                            {sectionId === 0 && (
                                                <>
                                                    <div className="my-2">
                                                        <label htmlFor={`title_${sectionId}`} className="text-sm sm:text-md font-bold">Translation Title</label>
                                                        {formState.docsLanguage.some(item => item.lang === selectedLanguage && item.section === sectionId) ? (
                                                            <input
                                                                id={`title_${sectionId}`}
                                                                name="title"
                                                                type="text"
                                                                value={
                                                                formState.docsLanguage.find(
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

                                                    <div className="my-2">
                                                        <label htmlFor={`description_${sectionId}`} className="text-sm sm:text-md font-bold">Short Description</label>
                                                        {formState.docsLanguage.some(item => item.lang === selectedLanguage && item.section === sectionId) ? (
                                                            <textarea
                                                                id={`description_${sectionId}`}
                                                                name="description"
                                                                type="text"
                                                                rows={4}
                                                                placeholder="Short description"
                                                                value={
                                                                formState.docsLanguage.find(
                                                                    item => item.lang === selectedLanguage && item.section === sectionId
                                                                )?.shortDescription || ""
                                                                }
                                                                onChange={e => handleDescriptionChange(e, sectionId)}
                                                                className="block w-full px-2 py-2 text-sm sm:text-md rounded-md my-2 bg-gray-100 text-gray-900 outline-none"
                                                            />
                                                        ) : (
                                                            <textarea
                                                                id={`description_${sectionId}`}
                                                                name="description"
                                                                type="text"
                                                                rows={4}
                                                                placeholder="Short description"
                                                                value=""
                                                                onChange={e => handleDescriptionChange(e, sectionId)}
                                                                className="block w-full px-2 py-2 text-sm sm:text-md rounded-md my-2 bg-gray-100 text-gray-900 outline-none"
                                                            />
                                                        )}
                                                    </div>
                                                </>
                                                
                                            )}

                                            
                                            
                                            <div className="my-2">
                                                <label htmlFor={`subtitle_${sectionId}`} className="text-sm sm:text-md font-bold">Subtitle</label>
                                                {formState.docsLanguage.some(item => item.lang === selectedLanguage && item.section === sectionId) ? (
                                                    <input
                                                        id={`subtitle_${sectionId}`}
                                                        name="subtitle"
                                                        type="text"
                                                        value={
                                                        formState.docsLanguage.find(
                                                            item => item.lang === selectedLanguage && item.section === sectionId
                                                        )?.subtitle || ""
                                                        }
                                                        onChange={e => handleSubtitleChange(e, sectionId)}
                                                        className="block w-full px-2 py-2 text-sm sm:text-md rounded-md my-2 bg-gray-100 text-gray-900 outline-none"
                                                    />
                                                ) : (
                                                    <input
                                                        id={`subtitle_${sectionId}`}
                                                        name="subtitle"
                                                        type="text"
                                                        value=""
                                                        onChange={e => handleSubtitleChange(e, sectionId)}
                                                        className="block w-full px-2 py-2 text-sm sm:text-md rounded-md my-2 bg-gray-100 text-gray-900 outline-none"
                                                    />
                                                )}
                                            </div>
                                            
                                            <div className="my-2">
                                                <label htmlFor={`content_${sectionId}`} className="text-sm sm:text-md font-bold">content</label>
                                                {formState.docsLanguage.some(item => item.lang === selectedLanguage && item.section === sectionId) ? (
                                                    <>
                                                        <RichTextEditor
                                                            id={`content_${sectionId}`}
                                                            name="content"
                                                            content={
                                                            formState.docsLanguage.find(
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