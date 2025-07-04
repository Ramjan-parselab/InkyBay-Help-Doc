import { useEffect, useState } from "react";
import { validateEmail } from "../../libs/helper";
import { useActionData, useSubmit } from "@remix-run/react";
import { useTranslation } from "react-i18next";
import { Toaster, toast } from 'sonner';

export default function TicketForm() {
    const {t} = useTranslation() || {}; 
    const submit = useSubmit();
    const actionData = useActionData();
    const [buttonLoader, setButtonLoader ] = useState(false);
    const [notificationBar, setNotificationBar] = useState(false);
    const [formState, setFormState] = useState({
        name: "",
        email: "",
        subject:"",
        description: "",
        attachFile:"",
    });

    const [formError, setFormError] = useState({
        name: "",
        email: "",
        subject:"",
        description: "",
        attachFile:"",
    });

    const handleNameChange = (event) =>{
        setFormState({ ...formState, name: event.target.value })
    }

    const handleEmailChange = (event) => {
        setFormState({ ...formState, email: event.target.value })
    }

    const handleSubjectChange = (event) =>{
        setFormState({ ...formState, subject: event.target.value })
    }

    const handleDescriptionChange = (event) => {
        setFormState({ ...formState, description: event.target.value })
    }

    const handleFileChange = (event) => {
        setFormState({ ...formState, attachFile: event?.target?.files[0] })
    }

    const submitForm = async () => {
        setButtonLoader(true);
        let validated = true;
        const errorMessages = {};

        // Form validation
        if(!formState.name || formState.name == "") {
            errorMessages.name = t("required_field", { field: t("name") });
            validated = false;
        }
        if(!formState.email || formState.email == "") {
            errorMessages.email =  t("required_field", { field: t("email") });
            validated = false;
        }
        if(!validateEmail(formState.email)){
            errorMessages.email = t("please_insert_valid_email");
            validated = false;
        }
        if(!formState.subject || formState.subject == "" ) {
            errorMessages.subject =  t("required_field", { field: t("subject") });
            validated = false;
        }
        if(!formState.description || formState.description == "") {
            errorMessages.description =  t("required_field", { field:t("description") });
            validated = false;
        }
        
        if(validated) {
            const formData = new FormData();
            formData.append("target", "create-ticket");
            formData.append("name", formState.name);
            formData.append("email", formState.email); // file
            formData.append("subject", formState.subject);
            formData.append("description", formState.description);
            formData.append("attachFile", formState.attachFile);
            submit(formData, { method: "POST", encType: "multipart/form-data" });
        }
        else {
            setFormError({ ...errorMessages });
            setButtonLoader(false);
        }
    }

    useEffect(()=> {
        if(actionData){
            if (actionData.target == "create-ticket") {
                if(actionData.isError){
                    toast.warning(actionData.message, {style: { background: "#EDDD53", color: "black" } });
                }else{
                    toast.success(actionData.message, {style: { background: "#66C25F", color: "white" } });
                    setFormState({ name: "", email: "", subject: "", description: "", file: ""});
                    setFormError({ name: "", email: "", subject: "", description: "", file: ""})
                    setButtonLoader(false);
                    setNotificationBar(true);
                }
            }
        }
    },[actionData]);

  return (
    <>
         <section className="relative bg-white bg-cover bg-no-repeat text-start py-12">
             <Toaster  position="top-right" closeButton={true}  />
            <div className="max-w-6xl mx-auto px-4">
                <h2 className="text-5xl font-medium text-center mb-2 text-black">{t("submit_a_ticket")}</h2>
                <p className="text-center text-xl text-[#667085] mb-8">{t("fill_out_the_form_below_to_create_a_new_support_ticket")}</p>
                
                {!notificationBar ? (
                    <div className="grid grid-cols-1 md:grid-cols-1 gap-6 mb-10">
                        <div className="w-full max-w-full bg-white rounded-lg shadow-lg overflow-hidden">
                            <form className="p-6">
                                <div className="space-y-4">
                                    <div className="space-y-2">
                                        <label htmlFor="name" className="block text-sm font-medium">
                                            {t("name")}
                                        </label>
                                        <input
                                            id="name"
                                            name="name"
                                            type="text"
                                            placeholder={t("please_enter_your", {title: t("name")})}
                                            required
                                            onChange={handleNameChange}
                                            value={formState?.name}
                                            className="w-full text-[#1a1a1a] px-3 py-2 bg-white border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-amber-500 placeholder-black placeholder-opacity-70"
                                        />
                                        {formError?.name && (
                                            <p className="bg-red-100 text-left font-medium">{formError?.name}</p>
                                        )}
                                    </div>

                            
                                    <div className="space-y-2">
                                        <label htmlFor="email" className="block text-sm font-medium">
                                        {t("email")}
                                        </label>
                                        <input
                                            id="email"
                                            name="email"
                                            type="email"
                                            placeholder={t("please_enter_your", {title: t("email")})}
                                            required
                                            onChange={handleEmailChange}
                                            value={formState?.email}
                                            className="w-full text-[#1a1a1a] px-3 py-2 bg-white border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-amber-500 placeholder-black placeholder-opacity-70"
                                        />
                                        {formError?.email && (
                                            <p className="bg-red-100 text-left font-medium">{formError?.email}</p>
                                        )}
                                    </div>

                            
                                    <div className="space-y-2">
                                        <label htmlFor="subject" className="block text-sm font-medium">
                                            {t("subject")}
                                        </label>
                                        <input
                                            id="subject"
                                            name="subject"
                                            type="text"
                                            placeholder={t("please_enter_your", {title: t("subject")})}
                                            required
                                            onChange={handleSubjectChange}
                                            value={formState?.subject}
                                            className="w-full text-[#1a1a1a] px-3 py-2 bg-white border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-amber-500 placeholder-black placeholder-opacity-70"
                                        />
                                        {formError?.subject && (
                                            <p className="bg-red-100 text-left font-medium">{formError?.subject}</p>
                                        )}
                                    </div>

                                
                                    <div className="space-y-2">
                                        <label htmlFor="description" className="block text-sm font-medium">
                                            {t("description")} 
                                        </label>
                                        <textarea
                                            id="description"
                                            name="description"
                                            placeholder={t("please_enter_your", {title: t("description")})}
                                            required
                                            onChange={handleDescriptionChange}
                                            value={formState?.description}
                                            rows={4}
                                            className="w-full text-[#1a1a1a] px-3 py-2 bg-white border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-amber-500 placeholder-black placeholder-opacity-70"
                                        ></textarea>
                                        {formError?.description && (
                                            <p className="bg-red-100 text-left font-medium">{formError?.description}</p>
                                        )}
                                    </div>

                                    <div className="space-y-2">
                                        <label htmlFor="name" className="block text-sm font-medium">
                                            {t('file')}
                                        </label>
                                        <input
                                            onChange={handleFileChange}
                                            value={formState?.attachFile?.file?.[0]}
                                            id="attachFile"
                                            name="attachFile"
                                            type="file"
                                            placeholder="select a file"
                                            className="w-full text-[#1a1a1a] px-3 py-2 bg-white border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-amber-500 placeholder-black placeholder-opacity-70"
                                        />
                                        {formError?.attachFile && (
                                            <p className="bg-red-100 text-left font-medium">{formError?.attachFile}</p>
                                        )}
                                    </div>

                                </div>

                                {/* Submit Button */}
                                <div className="mt-6">
                                <button
                                    onClick={submitForm}
                                    disabled={buttonLoader ? true : false}
                                    type="button"
                                    className="w-full text-[#1a1a1a] flex items-center  justify-center px-4 py-2 bg-[#ffd700] hover:bg-[#ffd700]/90 text-xl font-medium rounded-md transition-colors shadow-md"
                                >
                                {buttonLoader ?  t("loading") : t("send_ticket") }
                                    {/* <ArrowRight  className="h-6 w-6 ml-4"/> */}
                                </button>
                                </div>
                            </form>
                        </div>
                    </div>
                ) : (
                    <span className="w-full flex items-center text-[#1a1a1a] justify-center px-4 py-2 bg-[#ffd700]/90 text-xl font-medium rounded-md transition-colors shadow-md mt-5">
                        {t(actionData?.message)} 
                    </span> 
                )}
            </div>
        </section>
    
    </>
  );
}
