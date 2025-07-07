import { Link, useActionData, useLoaderData, useSubmit } from "@remix-run/react";
import { useEffect, useState } from "react";
import { Toaster, toast } from 'sonner';
import RichTextEditor from "../../../components/rich-text-editor";
import prisma from "../../../db.server";

export const loader = async({params}) => {
    const singleDoc = await prisma.docs.findFirst({
        select:{
            id: true, title: true, slug: true, categoryId: true, status: true, createdAt: true, updatedAt: true, isPin: true,
            docsLanguage: true,
            helpDocReviews: true
        },
        where: {
            id: parseInt(params?.id)
        },
        
    });

    //Find out all active langus
    const languages = await prisma.language.findMany({
        select:{
            id: true, name: true, code: true,
        },
        where:{
            status: "ACTIVE",
        }
    })

    // Get All parent category 
    const categories = await prisma.categories.findMany({
        select: {
            id: true, name: true,
        },
        where: {
            parentCategory: null
        },
        orderBy:{
            name: "asc"
        }
    });

    const subCategory = await prisma.categories.findFirst({
        select:{
            id: true, name: true, parentCategory: true
        },
        where:{
            id: parseInt(singleDoc?.categoryId)
        }
    });

    return {
        data:{
            singleDoc: singleDoc,
            languages: languages,
            categories : categories,
            subCategory: subCategory,
        }
    };
}

export const action = async ({request}) => {
    const formdata = await request.formData();
    const target = formdata.get('target') || "";

    if(target === "update-doc"){
        const data = formdata.get('data') || "";
        const submitData = data ?  JSON.parse(data) : {};
        const id = submitData?.id || "";
        const title = submitData?.title || "";
        const slug = submitData?.slug || "";
        const categoryId = parseInt(submitData?.categoryId) || "";
        const isPin = submitData?.isPin ? true : false;
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
                NOT:{
                    id: parseInt(id)
                }
            },
        });
        
        if(duplicateSlug){
            return {
                target: target,
                isDuplicate: true,
                message: "This doc slug or category  has been already used",
                data: [],
            }
        }

        try{
            await prisma.docs.update({
                data:{
                    title: title,
                    slug: slug,
                    categoryId: categoryId,
                    status: status, 
                    isPin: isPin,
                    updatedAt: new Date(),
                },
                where: {
                    id: parseInt(id)
                }
            });
            
            await Promise.all(
                docsLanguage.map(async (item) => {
                    // If previously set language then it will be only update if not
                    // it will be create as a new entry 
                    if(item?.id){
                      return await prisma.docsLanguage.update({
                            where:{
                                id: parseInt(item?.id),
                            },
                            data:{
                                // If default english category  modify then it will change
                                // english language name also
                                title: item?.title, 
                                subtitle: item?.subtitle,
                                content: item?.content,
                                section: item?.section,
                                shortDescription: item?.shortDescription,
                            }
                        })
                    }else{
                        return await prisma.docsLanguage.create({
                            data:{
                                docsId: parseInt(id),
                                lang: item.lang,
                                title: item?.title, 
                                subtitle: item?.subtitle,
                                content: item?.content,
                                section: item?.section,
                                shortDescription:item?.shortDescription,
                            }
                        })
                    }
                }
                )
            );

            return {
                target: target,
                message: "Successfully ! help doc has been updated",
                data: [],
            }
        }catch(error){
            console.log(error)
            return {
                target: target,
                message: "help doc update faile please try again !!",
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
                    id: parseInt(categoryId)
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
    }else if(target === "reset-review"){
        const helpDocId = formdata.get('docId') || "";
        if(helpDocId){
            try{
                await prisma?.helpDocReviews?.deleteMany({
                    where: {
                        docId: parseInt(helpDocId)
                    }
                });
                return {
                    target: target,
                    message: "Successfully ! help doc review  deleted",
                    data: [],
                }
    
            }catch(error){
                console.log(error)
                return {
                    target: target,
                    message: "Help doc delete failed please try again !!",
                    data: error,
                }
            }
        }
    }

}



export default function Create () {
    const loaderData = useLoaderData("");
    const submit = useSubmit();
    const actionData = useActionData("");

    const [buttonLoader, setButtonoader] = useState(false);
    const [pageLoader, setPageLoader] = useState(false);
    const [categories, setCategories] = useState([]);
    const [languages, setLanguages] = useState([]);
    const [selectedLanguage, setSelectedLanguage] = useState("en");
    const [sections, setSections] = useState([0]);
    const [subCategories, setSubCategories] = useState([]);
    const [selectedParentCategoryId, setSelectedParentCategoryId] = useState("");
    const [positiveReview, setPositiveReview] = useState(0);
    const [negetiveReview, setNegetiveReview] = useState(0);
    

    const addMoreSection = () => {
        setSections((prev)=> [...prev, prev[prev.length - 1] + 1 ]);
   }
    

    const [formState, setFormState] = useState({
        id:"",
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

    const resetReview = () => {
        if(positiveReview > 0 || negetiveReview > 0){
            if(confirm("Do you want reset this help doc review ?? ")){
                submit({ target: "reset-review", docId: formState?.id }, { method: "POST" });  
            }
        }
        
    }
       

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

    // Helper function to update any field in the docsLanguage array
    const updateDocsField = (section, field, value) => {
    setFormState(prev => {
        // Create a copy of the docsLanguage array
        const docsLanguage = [...prev.docsLanguage];
        
        // Find existing index for current language/section
        const index = docsLanguage.findIndex(
        item => item.lang === selectedLanguage && item.section === section
        );
        
        if (index !== -1) {
        // Update existing entry - keep other fields unchanged
        docsLanguage[index] = { ...docsLanguage[index], [field]: value };
        } else {
        // Create new entry with default values
        const newEntry = {
            lang: selectedLanguage,
            section,
            title: '',
            subtitle: '',
            content: '',
            shortDescription: '',
            [field]: value  // Set the specific field value
        };
        docsLanguage.push(newEntry);
        }
        
        return { ...prev, docsLanguage };
    });
    };

// Simplified handlers using the helper function
    const handleLanguageTitleChange = (event, section) => {
    updateDocsField(section, 'title', event.target.value);
    };

    const handleDescriptionChange = (event, section) => {
    updateDocsField(section, 'shortDescription', event.target.value);
    };

    const handleSubtitleChange = (event, section) => {
    updateDocsField(section, 'subtitle', event.target.value);
    };

    const handleContentChange = (content, section) => {
    updateDocsField(section, 'content', content);
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
            submit({ target: "update-doc", data: JSON.stringify(formState) }, { method: "POST" });
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
            if(loaderData?.data?.singleDoc?.id) {
                const singleDoc = loaderData?.data?.singleDoc;
                const sectionsData = loaderData?.data?.singleDoc?.docsLanguage;
                const maxSection = Math.max(...sectionsData.map(item => item.section));
                console.log(singleDoc?.isPin)
                const data = [];
                for(let i=0; i <= maxSection; i++){
                    data.push(i);
                }
                setSections(data)
                setFormState({
                    id: singleDoc?.id ? singleDoc?.id : "",
                    title: singleDoc?.title ? singleDoc?.title : "",
                    slug: singleDoc?.slug ? singleDoc?.slug : "",
                    categoryId: singleDoc?.categoryId ? singleDoc?.categoryId : "",
                    isPin: singleDoc?.isPin ? singleDoc?.isPin : false,
                    status: singleDoc?.status ? singleDoc?.status : "",
                    docsLanguage: singleDoc?.docsLanguage ? singleDoc?.docsLanguage : "",
                });
                
            }
            if(loaderData?.data?.subCategory?.parentCategory){
                setSelectedParentCategoryId(loaderData?.data?.subCategory?.parentCategory);
                // In this code we call subCategories by using parent category id 
                // In loader function  subCategory object return selected subcategory data
                submit({ target: "get-subCategory", categoryId: loaderData?.data?.subCategory?.parentCategory }, { method: "POST" });
            }else{
                setSelectedParentCategoryId(loaderData?.data?.singleDoc?.categoryId);
            }

            

        }
        setPageLoader(false)
    },[]);

    useEffect(()=> {
        if(loaderData){
            let positiveReview = loaderData?.data?.singleDoc?.helpDocReviews?.filter((item)=> item?.review === "YES");
            let negetiveReview = loaderData?.data?.singleDoc?.helpDocReviews?.filter((item)=> item?.review === "NO");
            
            setPositiveReview(positiveReview?.length);
            setNegetiveReview(negetiveReview?.length);
        }
    },[loaderData])
    
    /**
     * If form submit successfully ,then the form will be reset
     */
    useEffect(() => {
        if (actionData) {
            if (actionData.target == "update-doc") {
                setButtonoader(false);
                if(actionData.isDuplicate){
                    toast.warning(actionData.message, {style: { background: "#EDDD53", color: "black" } });
                }else{
                    toast.success(actionData.message, {style: { background: "#66C25F", color: "white" } });
                    // setTimeout(()=> {
                    //    location.reload();
                    // }, 2000)
                }
                
            }else if(actionData?.target == "get-subCategory"){
                // IF category does't have any subCategory then it will be set as a document categoryId
                if(actionData?.data?.subCategory?.length > 0){
                    setSubCategories(actionData?.data?.subCategory);
                }else{
                    setSubCategories([]);
                    setFormState({...formState, categoryId: selectedParentCategoryId})
                }
            }else if(actionData?.target == "reset-review"){
                toast.success(actionData.message, {style: { background: "#66C25F", color: "white" } });
            }
        }
    }, [actionData]);

console.log(actionData)
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
                                         <div className="grid w-full grid-cols-2 gap-6">
                                            {/* Left side content */}
                                            <div className="flex flex-col">
                                                <label htmlFor="title" className="text-sm sm:text-md font-bold text-green-400">
                                                    Positive Review: <span className="text-black font-bold ml-3">{positiveReview}</span>
                                                </label>
                                                <label htmlFor="title" className="text-sm sm:text-md font-bold text-yellow-400">
                                                    Negative Review: <span className="text-black font-bold ml-3">{negetiveReview}</span>
                                                </label>
                                            </div>
                                            
                                            {/* Right side content - aligned to the right */}
                                            <div className="flex flex-col items-end">
                                                <button onClick={resetReview} type="button" className="px-4 py-1 bg-red-300 rounded-md text-black text-sm sm:text-lg shadow-md">
                                                Reset
                                            </button>
                                            </div>
                                        </div>
                                        <h1 className="text-center text-2xl sm:text-3xl font-bold text-gray-700">Update  Docs</h1>
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
                                                        <select onChange={getSubCategory}  value={selectedParentCategoryId} className="block w-full px-2 py-2 text-sm sm:text-md rounded-md my-2 bg-gray-100 text-gray-900   outline-none" id="parentCategory">
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
                                                        <label htmlFor="category" className="text-sm sm:text-md font-bold">Sub Category</label>
                                                        <select onChange={handleCategoryChange} value={formState?.categoryId} className="block w-full px-2 py-2 text-sm sm:text-md rounded-md my-2 bg-gray-100 text-gray-900   outline-none" id="category" name="category">
                                                            <option defaultValue="">Select Category</option>
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
                                                                <label htmlFor={`title_${sectionId}`} className="text-sm sm:text-md font-bold">Short Description</label>
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
                                                                        id={`title_${sectionId}`}
                                                                        name="subtitle"
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