import { redirect, useActionData, useSubmit } from "@remix-run/react";
import { useEffect, useState } from "react";
import { authenticator } from "../../../services/auth.server";
import { commitSession, getSession } from "../../../services/session.server";
import { Toaster, toast } from 'sonner';

export async function loader({ request }) {
    // Here check sessionId before login page. 
    // If user already logged in then it will redirect to dashboard
    // If not then user have to must login 
    let session = await getSession(request.headers.get("cookie"));
    const sessionId = session.get('sessionId');
    if(sessionId) return redirect("/admin");
    return null;
}

export async function action({ request }) {
    try {
        let user = await authenticator.authenticate("user-pass", request, {
            failureRedirect: "/admin/login",
        });
        
        if (!user) {
            return {
                target: "error",
                message: "Sorry! email or password  not match!",
                data: {},
            };
        }
    
        // manually get the session
        let session = await getSession(request.headers.get("cookie"));
        // and store the user data
        session.set(authenticator.sessionKey, user?.email);
        session.set("sessionId", user?.id);
    
        // commit the session
        let headers = new Headers({ "Set-Cookie": await commitSession(session) });
        return redirect("/admin", { headers });
    } catch (error) {
        return {
            target: "error",
            message: "Sorry! something went wrong!",
            data: error
        };
    }
}

export default function Login(){
    const submit = useSubmit();
    const actionData = useActionData();

    const [formState, setFormState] = useState({
        email: "",
        password:"",
    });
    const [formError, setFormError] = useState({
        email: "",
        password:"",
    });
    const [buttonLoader, setButtonoader] = useState(false);

    const handleEmailChange = (event)=> {
        const email = event.target.value;
        setFormState({...formState, email: email });
    }

    const handlePasswordChange = (event)=> {
        const password = event.target.value;
        setFormState({...formState, password: password });
    }

    const submitForm = async () => {
        setButtonoader(true);
        let validated = true;
        const errorMessages = {};

        // Form validation
        if(!formState.email || formState.email == "") {
            errorMessages.email = "Email is required";
            validated = false;
        }

        if(!formState.password || formState.password == "") {
            errorMessages.password = "Password is required";
            validated = false;
        }
        
        if(validated) {
            submit(formState, { method: "POST" });
        }
        else {
            setFormError({ ...errorMessages });
            setButtonoader(false);
        }
    }

    const handleEnterPress = (event)=> {
        if(event.key === "Enter"){
            submitForm();
        }
    }

    useEffect(() => {
        if (actionData) {
            setButtonoader(false);
            if(actionData?.target == "error"){
                 toast.warning(actionData.message, {style: { background: "#EDDD53", color: "black" } });
            }
        }
    }, [actionData]);

    return (
        <div>
            <Toaster  position="top-right" closeButton={true}  />
            <div className="relative flex flex-col w-full h-full overflow-scroll text-gray-700 bg-white shadow-md rounded-lg bg-clip-border">
                <div className="my-5">
                    <div className="container mx-auto  py-4 px-6  bg-white text-gray-700">
                        <div className="my-3">
                            <h1 className="text-center text-2xl sm:text-3xl font-bold text-gray-700">Welcome to JewelsLab Help Doc</h1>
                            <form action="" method="POST">
                            <div className="my-2">
                                            <label htmlFor="name" className="text-sm sm:text-md font-bold">Email</label>
                                            <input onChange={handleEmailChange} value={formState?.email} type="email" name="name" className="block w-full px-2 py-2 text-sm sm:text-md rounded-md my-2 bg-gray-100 text-gray-900   outline-none" id="name" />
                                            {formError?.email && (
                                                <p className="bg-red-100 text-left font-medium">{formError?.email}</p>
                                            )}
                                        </div>
                                        <div className="my-2">
                                            <label htmlFor="slug" className="text-sm sm:text-md font-bold">Password</label>
                                            <input onChange={handlePasswordChange} value={formState?.password} onKeyDown={handleEnterPress} type="password" name="slug" className="block w-full px-2 py-2 text-sm sm:text-md rounded-md my-2 bg-gray-100 text-gray-900   outline-none" id="slug" />
                                            {formError?.password && (
                                                <p className="bg-red-100 text-left font-medium">{formError?.password}</p>
                                            )}
                                        </div>
                                        <button disabled={buttonLoader ? true : false} onClick={submitForm}   type="button" className="px-4 py-1 bg-emerald-500 rounded-md text-black text-sm sm:text-lg shadow-md">
                                            {buttonLoader ?  'Loading..' : "Login"}
                                        </button>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}