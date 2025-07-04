import { Link, useLoaderData, useSearchParams, useSubmit } from "@remix-run/react";
import { useEffect, useState } from "react";
import prisma from "../../../db.server";

export const loader = async ({ request })=> {
    const url = new URL(request.url);
    const query = url?.searchParams.get("query");
    let supports=[];

    // If category params found in url, then params will try to macth with the category name
    if(query){
        supports = await prisma.supports.findMany({
            select: {
                id: true, title:true, url: true,
                supportLanguage:{
                    select:{
                        lang: true, title: true, description: true
                    }
                }
            },
            where: {
                title: { startsWith: query }
            },
            orderBy: {
                id: "desc",
            }
        });
    }else{
        supports = await prisma.supports.findMany({
            select: {
               id: true, title:true, url: true,
                supportLanguage:{
                    select:{
                        lang: true, title: true 
                    }
                }
            },
            orderBy: {
                id: "desc",
            }
        });
    }
     
    return {
        target: "supportList",
        message: "success",
        data: {
            supports: supports || [],
        }
    };
}

export const action = async ({request}) => {
    const formdata = await request.formData();
    const target = formdata.get('target') || "";

    // Delete category with all categoryLanguage 
    if(target === "delete-support"){
        const deleteId = formdata.get('data') || "";
        const support = await prisma.supports.findFirst({
            where: {
                id: parseInt(deleteId)
            },
            select:{id: true}
        })
        if(support?.id){
            try{
                // First delete  category language and 
                // then delete main category
                await prisma.supportLanguage.deleteMany({
                    where: {
                        supportId: support?.id
                    }
                });
                await prisma.supports.delete({
                    where: {
                        id: support?.id
                    }
                });

                return {
                    target: target,
                    message: "Successfully ! support has been deleted",
                    data: [],
                }
    
            }catch(error){
                return {
                    target: target,
                    message: "Support delete failed please try again !!",
                    data: error,
                }
            }
        }
    }
}


export default function Cotagory () {
    const submit = useSubmit();
    const loaderData = useLoaderData();
    const [searchParams, setSearchParams] = useSearchParams();
    const newParams = new URLSearchParams(searchParams);
    const [pageLoader, setPageLoader] = useState(false);
    const [supports, setSupports] = useState([]);
    const [searchQuery, setSearchQuery] = useState("");

    // Handle query search 
    const handleInputCategory = (event) => {
        setSearchQuery(event.target.value);
    }

    // Set search data in params url
    const getSearchQuery =  ()=> {
        newParams.set("query", searchQuery);
        setSearchParams(newParams, {replace: true, preventScrollReset: true});
    }

    // Delete single  category 
    const deleteSupport = (deleteId) => {
        if(deleteId){
            if(confirm("Do you want to delete this support ?? ")){
                submit({ target: "delete-support", data: deleteId }, { method: "POST" });  
            }
        }
    }

    useEffect(()=> {
        setPageLoader(true)
        if(loaderData){
            if(loaderData?.data?.supports){
                setSupports(loaderData?.data?.supports)
            }
            // Get search data in params url by using "category" key
            if(newParams.get("query")){
                setSearchQuery(newParams.get("query"))
            }
        }
        setPageLoader(false)
    },[loaderData]);
    
    
    return (
        <>
            {pageLoader  ? (
                    <div className="bg-white rounded-lg shadow-md p-4 animate-pulse">
                        <div className="w-full h-8 bg-gray-300 rounded mb-2"></div>
                        <div className="w-full h-8 bg-gray-300 rounded mb-2"></div>
                        <div className="w-full h-8 bg-gray-300 rounded mb-2"></div>
                        <div className="w-full h-8 bg-gray-300 rounded mb-2"></div>
                    </div>
                ) : (
                    <div>
                        <div className="w-full flex justify-end items-end">
                            <Link to="/admin/supports/create" className="inline-flex items-center gap-2 rounded bg-[#090808] px-8 py-3 text-sm font-semibold text-white transition-all mb-5">
                                Create new
                                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="size-5">
                                <path
                                    fillRule="evenodd"
                                    d="M4.5 5.653c0-1.427 1.529-2.33 2.779-1.643l11.54 6.347c1.295.712 1.295 2.573 0 3.286L7.28 19.99c-1.25.687-2.779-.217-2.779-1.643V5.653Z"
                                    clipRule="evenodd"
                                />
                                </svg>
                            </Link>
                        </div>
                        <div className="w-full flex justify-between items-center mb-3 mt-12 pl-3">
                            <div>
                                <h3 className="text-lg font-semibold text-slate-800">supports</h3>
                            </div>
                            <div className="mx-3">
                                <div className="w-full max-w-sm min-w-[200px] relative">
                                <div className="relative">
                                    <input onChange={handleInputCategory} onKeyUp={getSearchQuery}  value={searchQuery} className="bg-white w-full pr-11 h-10 pl-3 py-2 bg-transparent placeholder:text-slate-400 text-slate-700 text-sm border border-slate-200 rounded transition duration-300 ease focus:outline-none focus:border-slate-400 hover:border-slate-400 shadow-sm focus:shadow-md"
                                        placeholder="Search for supports..."
                                    />
                                    <button onClick={getSearchQuery}
                                    className="absolute h-8 w-8 right-1 top-1 my-auto px-2 flex items-center bg-white rounded "
                                    type="button"
                                    >
                                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="3" stroke="currentColor" className="w-8 h-8 text-slate-600">
                                        <path strokeLinecap="round" strokeLinejoin="round" d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607Z" />
                                    </svg>
                                    </button>
                                </div>
                                </div>
                            </div>
                        </div>  
                        
                        <div className="relative flex flex-col w-full h-full overflow-scroll text-gray-700 bg-white shadow-md rounded-lg bg-clip-border">
                            <table className="w-full text-left table-auto min-w-max">
                                <thead>
                                <tr className="border-b border-slate-300 bg-slate-50">
                                    <th className="p-4 text-sm font-normal leading-none text-slate-500">title</th>
                                    <th className="p-4 text-sm font-normal leading-none text-slate-500">url</th>
                                    <th className="p-4 text-sm font-normal leading-none text-slate-500">Action</th>
                                </tr>
                                </thead>
                                <tbody>
                                    {supports?.length > 0 ? (
                                        supports?.map((support)=> (
                                            <tr className="hover:bg-slate-50" key={support?.id}>
                                                <td className="p-4 border-b border-slate-200 py-5">
                                                    <p className="block font-semibold text-sm text-slate-800">{support?.title}</p>
                                                </td>
                                                <td className="p-4 border-b border-slate-200 py-5">
                                                    <p className="text-sm text-slate-500">{support?.url}</p>
                                                </td>
                                                  
                                                <td className="p-4 border-b border-slate-200 py-5">
                                                    <div className="grid w-full grid-cols-2 gap-2">
                                                        <Link to={`/admin/supports/${support?.id}`} className="text-slate-500 hover:text-slate-700">
                                                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor" className="w-6 h-6">
                                                                <path strokeLinecap="round" strokeLinejoin="round" d="M15.232 5.232l3.536 3.536M9 11l6.768-6.768a2 2 0 112.828 2.828L11.828 13.828a2 2 0 01-1.414.586H7v-3a2 2 0 01.586-1.414z" />
                                                            </svg>
                                                        </Link>
                                                        <button onClick={()=> deleteSupport(support?.id) } className="text-slate-500 hover:text-slate-700">
                                                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor" className="w-6 h-6">
                                                                <path strokeLinecap="round" strokeLinejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6M9 7h6m2 0a1 1 0 011 1v0a1 1 0 01-1 1H7a1 1 0 01-1-1v0a1 1 0 011-1h10z" />
                                                            </svg>
                                                        </button>
                                                    </div>
                                                </td>
                                            </tr>
                                        ))
                                    ) : (
                                        <tr className="hover:bg-slate-50">
                                        <td className="p-4 border-b border-slate-200 py-5" colSpan={4}>
                                            <p className="block font-semibold text-sm text-slate-800">Data not found</p>
                                        </td>
                                        
                                    </tr>
                                    )}
                                    
                                </tbody>
                            </table>
                        </div>
                    </div>
                )}
        </>
    );
}