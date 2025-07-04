import { Link, useActionData, useLoaderData, useSubmit } from "@remix-run/react";
import { useEffect, useState } from "react";
import prisma from "../../../db.server";
import bcrypt from "bcryptjs";
import { Toaster, toast } from 'sonner';  

export const loader = async({params}) => {
    // find out category last serial number
    const user = await prisma.users.findFirst({
        where: {
            id: parseInt(params?.id)
        },
    });

    return {
        data:{
            user: user,
        }
    };
}

export const action = async ({request}) => {
    const formdata = await request.formData();
    const target = formdata.get('target') || "";

    if(target === "update-user"){
        const data = formdata.get('data') || "";
        const submitData = data ?  JSON.parse(data) : {};
        const id = submitData?.id || "";
        const name = submitData?.name || "";
        const phone = submitData?.phone || "";
        const email = submitData?.email || "";
        const password = submitData?.password || "";
        const changePassword = submitData?.changePassword || "";
        const role = submitData?.role || "";
        const status = submitData?.status || "";

         // Check duplicate slug 
        const duplicateUser = await prisma.users.findFirst({
            select: {id: true},
            where: { email: email,
                NOT:{
                    id: parseInt(id)
                }
            }
        });

        if(duplicateUser){
            return {
                target: target,
                isDuplicate: true,
                message: "This email slug has been already taken",
                data: [],
            }
        }

        try{
            // Here update main category and after that update category language 
            await prisma.users.update({
                data:{
                    name: name,
                    phone: phone,
                    email:email,
                    password: changePassword != "" ? bcrypt.hashSync(changePassword) : password,
                    role: role,
                    status: status,
                    updatedAt: new Date(),
                },
                where: {
                    id: parseInt(id)
                } 
                
            });

        
            return {
                target: target,
                message: "Successfully ! user has been updated",
                data: [],
            }

        }catch(error){
            return {
                target: target,
                message: "User update failed please try again !!",
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
        phone:"",
        email:"",
        changePassword:"",
        password: "",
        role: "ADMIN",
        status: "ACTIVE",
    });

    const [formError, setFormError] = useState({
        name: "",
        phone:"",
        email:"",
        changePassword:"",
        password: "",
        role: "",
    });

    

    const handleNameChange = (event)=> {
        const name = event.target.value;
        setFormState({...formState, name: name });
    }
    const handleEmailChange = (event)=> {
        const email = event.target.value;
        setFormState({...formState, email: email });
    }
    const handlePhoneChange = (event)=> {
        const phone = event.target.value;
        setFormState({...formState, phone: phone });
    }
    const handlePasswordChange = (event)=> {
        const password = event.target.value;
        setFormState({...formState, changePassword: password });
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
        if(!formState.email || formState.email == "") {
            errorMessages.email = "Email is required";
            validated = false;
        }
        if(!formState.phone || formState.phone == "") {
            errorMessages.phone = "Phone is required";
            validated = false;
        }

        if(formState.changePassword != "" && formState.changePassword.length < 4){
            errorMessages.changePassword = "Password must be at least 4 character";
            validated = false;
        }
        
        if(!formState.status || formState.status == "" ) {
            errorMessages.status = "Status is required";
            validated = false;
        }
        
        if(validated) {
            submit({ target: "update-user", data: JSON.stringify(formState) }, { method: "POST" });
        }
        else {
            setFormError({ ...errorMessages });
            setButtonoader(false);
        }
    }

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

    /**
     * If form submit successfully ,then the form will be reset
     */
    useEffect(() => {
        if (actionData) {
            if (actionData.target == "update-user") {
                setButtonoader(false);
                if(actionData.isDuplicate){
                   toast.warning(actionData.message, {style: { background: "#EDDD53", color: "black" } });
                }else{
                    toast.success(actionData.message, {style: { background: "#66C25F", color: "white" } });
                    setTimeout(()=> {
                        location.reload();
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
                                        <h1 className="text-center text-2xl sm:text-3xl font-bold text-gray-700">Update User</h1>
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
                                                        <label htmlFor="slug" className="text-sm sm:text-md font-bold">Email</label>
                                                        <input onChange={handleEmailChange} value={formState?.email} type="email" name="email" className="block w-full px-2 py-2 text-sm sm:text-md rounded-md my-2 bg-gray-100 text-gray-900   outline-none" id="email" />
                                                        {formError?.email && (
                                                            <p className="bg-red-100 text-left font-medium">{formError?.email}</p>
                                                        )}
                                                    </div>


                                                    <div className="my-2">
                                                        <label htmlFor="icon" className="text-sm sm:text-md font-bold">Phone</label>
                                                        <input onChange={handlePhoneChange} value={formState?.phone} type="text" name="phone" className="block w-full px-2 py-2 text-sm sm:text-md rounded-md my-2 bg-gray-100 text-gray-900   outline-none" id="phone" />
                                                        {formError?.phone && (
                                                            <p className="bg-red-100 text-left font-medium">{formError?.phone}</p>
                                                        )}
                                                    </div>
                                                </div>
                                                <div className="relative flex flex-col">
                                                    <div className="my-2">
                                                        <label htmlFor="changePassword" className="text-sm sm:text-md font-bold">Changed Password</label>
                                                        <input onChange={handlePasswordChange} value={formState?.changePassword} type="password" name="changePassword" className="block w-full px-2 py-2 text-sm sm:text-md rounded-md my-2 bg-gray-100 text-gray-900   outline-none" id="changePassword" />
                                                        {formError?.changePassword && (
                                                            <p className="bg-red-100 text-left font-medium">{formError?.changePassword}</p>
                                                        )}
                                                    </div>
                                                    <div className="my-2">
                                                        <label htmlFor="level" className="text-sm sm:text-md font-bold">Status</label>
                                                        <select onChange={handleStatusChange} value={formState?.status} className="block w-full px-2 py-2 text-sm sm:text-md rounded-md my-2 bg-gray-100 text-gray-900   outline-none" id="level" name="level">
                                                            <option value="ACTIVE">Active</option>
                                                            <option value="INACTIVE">InActive</option>
                                                        </select>
                                                        {formError?.status && (
                                                            <p className="bg-red-100 text-left font-medium">{formError?.status}</p>
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