import { Link, useLoaderData } from "@remix-run/react";
import { useEffect, useState } from "react";
import prisma from "../../../db.server";
import { getSession } from "../../../services/session.server";
import { ArrowRight } from "lucide-react";

export const loader = async({request}) => {
    // Authentication check if authenticate then go ahed
        let session = await getSession(request.headers.get("cookie"));
        const userId = session.get('sessionId');
        if(userId){
            // find out category last serial number
            const user = await prisma.users.findFirst({
                where: {
                    id: parseInt(userId)
                },
            });

            return {
                data:{
                    user: user,
                }
            };
        }
}


export default function Edit () {
    const loaderData = useLoaderData("");
    const [pageLoader, setPageLoader] = useState(false);

    const [formState, setFormState] = useState({
        name: "",
        phone:"",
        email:"",
        changePassword:"",
        password: "",
        role: "ADMIN",
        status: "ACTIVE",
    });

    useEffect(()=> {
        setPageLoader(true);
        if(loaderData){
            if(loaderData?.data?.user?.id) {
                const userData = loaderData?.data?.user;
                setFormState({
                    id: userData?.id ? userData?.id : "",
                    name: userData?.name ? userData?.name : "",
                    phone: userData?.phone ? userData?.phone : "",
                    email: userData?.email ? userData?.email : "",
                    role: userData?.role ? userData?.role : "",
                    password:  userData?.password ? userData?.password : "",
                    status: userData?.status ? userData?.status : "",
                    changePassword: ""
                });
            }
        }
        setPageLoader(false)
    },[])
    
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
                            <Link to="/admin/users" className="inline-flex items-center gap-2 rounded bg-[#090808] px-8 py-3 text-sm font-semibold text-white transition-all mb-5">
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
                                        <h1 className="text-center text-2xl sm:text-3xl font-bold text-gray-700">User Profile</h1>
                                        <form action="" method="POST">
                                            <div className="grid w-full grid-cols-1  gap-6 my-5">
                                                <div className="relative flex flex-col">
                                                    <div className="my-2">
                                                        <label htmlFor="name" className="text-sm sm:text-md font-bold">Name</label>
                                                        <input readOnly  value={formState?.name} type="text" name="name" className="block w-full px-2 py-2 text-sm sm:text-md rounded-md my-2 bg-gray-100 text-gray-900   outline-none" id="name" />
                                                       
                                                    </div>
                                                    <div className="my-2">
                                                        <label htmlFor="slug" className="text-sm sm:text-md font-bold">Email</label>
                                                        <input readOnly  value={formState?.email} type="email" name="email" className="block w-full px-2 py-2 text-sm sm:text-md rounded-md my-2 bg-gray-100 text-gray-900   outline-none" id="email" />
                                                        
                                                    </div>


                                                    <div className="my-2">
                                                        <label htmlFor="icon" className="text-sm sm:text-md font-bold">Phone</label>
                                                        <input readOnly  value={formState?.phone} type="text" name="phone" className="block w-full px-2 py-2 text-sm sm:text-md rounded-md my-2 bg-gray-100 text-gray-900   outline-none" id="phone" />
                                                        
                                                    </div>
                                                </div>
                                                <div className="relative flex flex-col">
                                                     <div className="my-2">
                                                        <label htmlFor="role" className="text-sm sm:text-md font-bold">Role</label>
                                                        <select disabled  value={formState?.role} className="block w-full px-2 py-2 text-sm sm:text-md rounded-md my-2 bg-gray-100 text-gray-900   outline-none" id="level" name="role">
                                                            <option value="ADMIN">Admin</option>
                                                            <option value="USER">User</option>
                                                        </select>
                                                    </div>
                                                    <div className="my-2">
                                                        <label htmlFor="level" className="text-sm sm:text-md font-bold">Status</label>
                                                        <select disabled  value={formState?.status} className="block w-full px-2 py-2 text-sm sm:text-md rounded-md my-2 bg-gray-100 text-gray-900   outline-none" id="level" name="level">
                                                            <option value="ACTIVE">Active</option>
                                                            <option value="INACTIVE">InActive</option>
                                                        </select>
                                                    </div>
                                                </div>
                                            </div>
                                            <Link to={`/admin/users/${formState?.id}`} className="px-4 py-2  rounded-md  text-sm sm:text-lg  text-blue-500 ">
                                                Update Profile 
                                            </Link>
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