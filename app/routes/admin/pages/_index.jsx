import { Link,  useLoaderData, useSearchParams, useSubmit } from "@remix-run/react";
import prisma from "../../../db.server";
import { useEffect, useState } from "react";

export const loader = async ({ request })=> {
    const url = new URL(request.url);
    const query = url?.searchParams.get("query")?.trim();

    let pages=[];
    // If category params found in url, then params will try to macth with the category name
    if(query){
        pages = await prisma?.pages?.findMany({
            select: {
                id: true, name:true, slug: true,  status: true,
            },
            where: {
                OR:[
                    {
                        name: { contains: query }
                    },
                    {
                        slug: { contains: query }
                    },
                ]
            },
            orderBy: {
                id: "desc",
            }
        });
    }else{
        pages = await prisma?.pages?.findMany({
            select: {
                id: true, name:true, slug: true,  status: true,
            },
            orderBy: {
                id: "desc",
            },
        });
    }
     
    return {
        target: "pageList",
        message: "success",
        data: {
            pages: pages,
        }
    }
}

export const action = async ({request}) => {
    const formdata = await request.formData();
    const target = formdata.get('target') || "";

    // Delete category with all categoryLanguage 
    if(target === "delete-page"){
        const deleteId = formdata.get('data') || "";
        const PageIno = await prisma.pages.findFirst({
            where: {
                id: parseInt(deleteId)
            },
            select:{id: true}
        })
        if(PageIno?.id){
            try{
                await prisma.pageLanguage.deleteMany({
                    where: {
                        pageId: PageIno?.id
                    }
                });
                await prisma.pages.delete({
                    where: {
                        id: PageIno?.id
                    }
                });

                return {
                    target: target,
                    message: "Successfully ! help doc  deleted",
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


export default function Cotagory () {
    const submit = useSubmit();
    const loaderData = useLoaderData();
    const [searchParams, setSearchParams] = useSearchParams();
    const newParams = new URLSearchParams(searchParams);

    const [pageLoader, setPageLoader] = useState(false);
    const [pages, setPages] = useState([]);
    const [searchDoc, setSearchDoc] = useState("");

    const handleInputSearch = (event) => {
        setSearchDoc(event.target.value);
    }

    // Set search data in params url
    const getSearchPage =  ()=> {
        newParams.set("query", searchDoc);
        setSearchParams(newParams, {replace: true, preventScrollReset: true});
    }

    // Delete category 
    const deleteRaw = (deleteId) => {
        if(deleteId){
            if(confirm("Do you want to delete this  ?? ")){
                submit({ target: "delete-page", data: deleteId }, { method: "POST" });  
            }
        }
    }

    useEffect(()=> {
        setPageLoader(true);
        if(loaderData){
            if(loaderData?.data?.pages){
                setPages(loaderData?.data?.pages)
            }
            // Get search data in params url by using "category" key
            if(newParams.get("query")){
                setSearchDoc(newParams.get("query"))
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
                        <div className="w-full h-8 bg-gray-300 rounded mb-2"></div>
                    </div>
                ) : (
                    <div>
                        <div className="w-full flex justify-end items-end">
                            <Link to="/admin/pages/create" className="inline-flex items-center gap-2 rounded bg-[#090808] px-8 py-3 text-sm font-semibold text-white transition-all mb-5">
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
                                <h3 className="text-lg font-semibold text-slate-800">All Pages</h3>
                            </div>
                            <div className="mx-3">
                                <div className="w-full max-w-sm min-w-[200px] relative">
                                <div className="relative">
                                    <input onChange={handleInputSearch} onKeyUp={getSearchPage}  value={searchDoc} className="bg-white w-full pr-11 h-10 pl-3 py-2 bg-transparent placeholder:text-slate-400 text-slate-700 text-sm border border-slate-200 rounded transition duration-300 ease focus:outline-none focus:border-slate-400 hover:border-slate-400 shadow-sm focus:shadow-md"
                                        placeholder="Search for doc..."
                                    />
                                    <button onClick={getSearchPage}
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
                                    <th className="p-4 text-sm font-normal leading-none text-slate-500">Name</th>
                                    <th className="p-4 text-sm font-normal leading-none text-slate-500">Slug</th>
                                    <th className="p-4 text-sm font-normal leading-none text-slate-500">Status</th>
                                    <th className="p-4 text-sm font-normal leading-none text-slate-500">Action</th>
                                </tr>
                                </thead>
                                <tbody>
                                    {pages?.length > 0 ? (
                                        pages?.map((page)=> (
                                            <tr className="hover:bg-slate-50" key={page?.id}>
                                                <td className="p-4 border-b border-slate-200 py-5">
                                                    <Link to={`/admin/pages/${page?.id}`}>
                                                        <p className="block font-semibold text-sm text-slate-800">{page?.name}</p>
                                                    </Link>
                                                </td>
                                                <td className="p-4 border-b border-slate-200 py-5">
                                                    <p className="text-sm text-slate-500">{page?.slug}</p>
                                                </td>
                                                <td className="p-4 border-b border-slate-200 py-5">
                                                    <p className="text-sm text-slate-500">{page?.status}</p>
                                                </td>
                                                <td className="p-4 border-b border-slate-200 py-5">
                                                    <div className="grid w-full grid-cols-2 gap-2">
                                                        <Link to={`/admin/pages/${page?.id}`} className="text-slate-500 hover:text-slate-700">
                                                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor" className="w-6 h-6">
                                                                <path strokeLinecap="round" strokeLinejoin="round" d="M15.232 5.232l3.536 3.536M9 11l6.768-6.768a2 2 0 112.828 2.828L11.828 13.828a2 2 0 01-1.414.586H7v-3a2 2 0 01.586-1.414z" />
                                                            </svg>
                                                        </Link>
                                                        <button onClick={()=> deleteRaw(page?.id) } className="text-slate-500 hover:text-slate-700">
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