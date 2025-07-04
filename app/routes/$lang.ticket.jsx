import { unstable_createFileUploadHandler, unstable_parseMultipartFormData } from "@remix-run/node";
import TicketForm from "../components/Ticket";
import prisma from "../db.server";
import sendMail from "../libs/sendMail";
import { setMetaTag } from "../libs/helper";

export const meta =   () => {
    const siteName = "InkyBay Help Center";
    const title = "Ticket";
    const metaTitle = `InkyBay Help Center`;
    const metaDescription = `"Welcome to the InkyBay Help Center — your one-stop support hub for all things customization! 
                            Whether you have questions about your order, need help using our design tools, or want to report an issue,
                            we're here to help."`;
    const metaType = "website";
    
    // Set meta tag if null please set value null
    const metaData = setMetaTag(siteName, title, metaTitle, metaDescription,  metaType);
    return metaData;
}

export const action = async ({request}) => {
    const allowedTypes = ["image/jpeg", "image/png", "image/svg+xml", "application/pdf"];
    let uploadedFileError = "";
    const uploadHandler = unstable_createFileUploadHandler({
        directory: "./public/images/tickets",
        maxFileSize: 1024 * 1024 * 1, // 2 MB
        file: ({ filename }) => {
            const currentDate = Date.now();
            return `${currentDate}_${filename}`;
          },
      });

      const formData = await unstable_parseMultipartFormData(
        request,
        async ({ name, contentType, data, filename }) => {
          // Handle file uploads
          if (filename) {
            if (!allowedTypes.includes(contentType)) {
                uploadedFileError = "Only JPG, PNG, pdf, and SVG files are allowed.";
                return null;
            }
            return uploadHandler({ name, contentType, data, filename });
          }
          // Handle text fields
          const chunks = [];
          for await (const chunk of data) chunks.push(chunk);
          return Buffer.concat(chunks).toString("utf-8");
        }
      );

    // If "uploadedFileError" has error then it give error message
    if (uploadedFileError) {
        return {
            target: "create-ticket",
            isError: true,
            message: uploadedFileError,
        }
    }
    

    const target = formData.get("target");
    
    if(target === "create-ticket"){
        const name = formData.get("name") || "";
        const email = formData.get("email") || "";
        const subject = formData.get("subject") || "";
        const description = formData.get("description") || "";
        const attachFile = formData.get("attachFile") || "";
        const uploadDir = attachFile ?  `/images/tickets/${attachFile?.name}` : null;

        try{
            await prisma?.tickets.create({
                data:{
                    name: name,
                    email: email,
                    subject: subject,
                    description: description,
                    attachFile: uploadDir,
                    createdAt: new Date()
                }
            });

            // This method is send a mail to the assign mail
            const  mailResponse = await sendMail({
                toMail: process.env.MAIL_RECEIVE_ADDRESS,
                subject: subject,
                attachments: attachFile?.name ? 
                    [
                        {
                            filename: attachFile?.name,
                            path:  `./public/images/tickets/${attachFile?.name}`,
                        },
                    ] 
                    : [

                    ],
                mailData: {
                    name: name,
                    email: email,
                    subject: subject,
                    body: description,
                }
            });
            if(mailResponse?.success == 200){
                    return {
                    target: target,
                    message: "submit_ticket_description",
                    data: [],
                }
            }else{
                return {
                    target: target,
                    isError: true,
                    message: "main_not_send_try_again",
                    data: [],
                }
            }

        }catch(error){
            return {
                target: target,
                isError: true,
                message: "ticket_not_send_try_again",
                data: error,
            }
        }
    }

}

export default function Ticket() {
    

    return (
        <div className="flex flex-col min-h-screen">
            <TicketForm />
        </div>
    )
}
