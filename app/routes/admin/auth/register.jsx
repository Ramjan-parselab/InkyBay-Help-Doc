import { Link, useActionData, useNavigate, useSubmit } from "@remix-run/react";
import { useEffect, useState } from "react";
import prisma from "../../../db.server";
import bcrypt from "bcryptjs";


export const action = async ({request}) => {
    const formdata = await request.formData();
    const target = formdata.get('target') || "";

    if(target === "create-user"){
        const data = formdata.get('data') || "";
        const submitData = data ?  JSON.parse(data) : {};
        const name = submitData?.name || "";
        const phone = submitData?.phone || "";
        const email = submitData?.email || "";
        const password = submitData?.password || "";
        const role = submitData?.role || "";
        const status = submitData?.status || "";

        // Check duplicate slug 
        const duplicateEmail = await prisma.users.findUnique({
            select: {email: true},
            where: {email: email},
        });
        
        if(duplicateEmail){
            return {
                target: target,
                isDuplicate: true,
                message: "This email has been already taken",
                data: [],
            }
        }

        try{
            await prisma.users.create({
                data:{
                    name: name,
                    phone: phone,
                    email:email,
                    password: bcrypt.hashSync(password),
                    role: role,
                    status: status,
                    createdAt: new Date()
                }
            });

            return {
                target: target,
                message: "Successfully ! user has been created",
                data: [],
            }
        }catch(error){
            console.log(error)
            return {
                target: target,
                message: "User creation failed please try again !!",
                data: error,
            }
        }
    }

}

export default function Register(){
    const submit = useSubmit();
    const actionData = useActionData("");
    const [pageLoader, setPageLoader] = useState(false);
    const [buttonLoader, setButtonoader] = useState(false);
    const navigate = useNavigate();

    const [formState, setFormState] = useState({
            name: "",
            phone:"",
            email:"",
            password:"",
            confirmPassword: "",
            role: "ADMIN",
            status: "ACTIVE",
        });
    
        const [formError, setFormError] = useState({
            name: "",
            phone:"",
            email:"",
            password:"",
            confirmPassword: "",
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
            setFormState({...formState, password: password });
        }
        const handleConfirmPasswordChange = (event)=> {
            const confirmPassword = event.target.value;
            setFormState({...formState, confirmPassword: confirmPassword });
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
            if(!formState.password || formState.password == "") {
                errorMessages.password = "Password is required";
                validated = false;
            }

            if(formState.password.length < 4){
                errorMessages.password = "Password must be at least 4 character";
                validated = false;
            }

            if(!formState.confirmPassword || formState.confirmPassword == "") {
                errorMessages.confirmPassword = "Confirm passowrd is required";
                validated = false;
            }

            if(formState.password !== formState.confirmPassword){
                errorMessages.confirmPassword = "Confirm passowrd not match";
                validated = false;
            }
            
            if(!formState.status || formState.status == "" ) {
                errorMessages.status = "Status is required";
                validated = false;
            }
          
            
            if(validated) {
                submit({ target: "create-user", data: JSON.stringify(formState) }, { method: "POST" });
            }
            else {
                setFormError({ ...errorMessages });
                setButtonoader(false);
            }
        }


        /**
     * If form submit successfully ,then the form will be reset
     */
    useEffect(() => {
        if (actionData) {
            if (actionData.target == "create-user") {
                setButtonoader(false);
                if(actionData.isDuplicate){
                    alert(actionData.message)
                }else{
                    alert(actionData.message);
                    navigate("/admin/login", {replace: true})
                }
            }
        }
    }, [actionData]);


    return (
        <div>
            <div className="w-full flex justify-end items-end">
                <Link to="/admin/login" className="inline-flex items-center gap-2 rounded bg-[#090808] px-8 py-3 text-sm font-semibold text-white transition-all mb-5">
                    Login
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="size-5">
                    <path
                        fillRule="evenodd"
                        d="M4.5 5.653c0-1.427 1.529-2.33 2.779-1.643l11.54 6.347c1.295.712 1.295 2.573 0 3.286L7.28 19.99c-1.25.687-2.779-.217-2.779-1.643V5.653Z"
                        clipRule="evenodd"
                    />
                    </svg>
                </Link>
            </div>
                    
            <div className="relative flex flex-col w-full h-full overflow-scroll text-gray-700 bg-white shadow-md rounded-lg bg-clip-border">
                <div className="my-5">
                    <div className="container mx-auto  py-4 px-6  bg-white text-gray-700">
                        <div className="my-3">
                            <h1 className="text-center text-2xl sm:text-3xl font-bold text-gray-700">User Register</h1>
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
                                            <input onChange={handleEmailChange} value={formState?.email} type="email" name="slug" className="block w-full px-2 py-2 text-sm sm:text-md rounded-md my-2 bg-gray-100 text-gray-900   outline-none" id="slug" />
                                            {formError?.email && (
                                                <p className="bg-red-100 text-left font-medium">{formError?.email}</p>
                                            )}
                                        </div>


                                        <div className="my-2">
                                            <label htmlFor="icon" className="text-sm sm:text-md font-bold">Phone</label>
                                            <input onChange={handlePhoneChange} value={formState?.phone} type="text" name="icon" className="block w-full px-2 py-2 text-sm sm:text-md rounded-md my-2 bg-gray-100 text-gray-900   outline-none" id="icon" />
                                            {formError?.phone && (
                                                <p className="bg-red-100 text-left font-medium">{formError?.phone}</p>
                                            )}
                                        </div>
                                        
                                    </div>
                                    <div className="relative flex flex-col">
                                        <div className="my-2">
                                            <label htmlFor="serial" className="text-sm sm:text-md font-bold">Password</label>
                                            <input onChange={handlePasswordChange} value={formState?.password} type="text" name="slug" className="block w-full px-2 py-2 text-sm sm:text-md rounded-md my-2 bg-gray-100 text-gray-900   outline-none" id="serial" />
                                            {formError?.password && (
                                                <p className="bg-red-100 text-left font-medium">{formError?.password}</p>
                                            )}
                                        </div>
                                        <div className="my-2">
                                            <label htmlFor="serial" className="text-sm sm:text-md font-bold">Confirm Passoword</label>
                                            <input onChange={handleConfirmPasswordChange} value={formState?.confirmPassword} type="text" name="slug" className="block w-full px-2 py-2 text-sm sm:text-md rounded-md my-2 bg-gray-100 text-gray-900   outline-none" id="serial" />
                                            {formError?.confirmPassword && (
                                                <p className="bg-red-100 text-left font-medium">{formError?.confirmPassword}</p>
                                            )}
                                        </div>
                                        <div className="my-2">
                                            <label htmlFor="level" className="text-sm sm:text-md font-bold">Status</label>
                                            <select onChange={handleStatusChange} value={formState?.status} className="block w-full px-2 py-2 text-sm sm:text-md rounded-md my-2 bg-gray-100 text-gray-900   outline-none" id="level" name="level">
                                                <option defaultValue="ACTIVE">Active</option>
                                                <option value="INACTIVE">InActive</option>
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
);
}