
import nodemailer from "nodemailer";
/**
 * This is HTML page and made by palin html and css
 * @param  mailData The mailData is the  dynamic data those data want to see in  the mail.This mailData accept object data which format is like {name: 'a', email:
 * @returns It returns html page  with css for more attractive email
 */
function mailBody({mailData}) {
    const name = mailData &&  mailData?.name;
    const email = mailData &&  mailData?.email;
    const subject = mailData &&  mailData?.subject;
    const body = mailData &&  mailData?.body;
    const html = `<!DOCTYPE html>
    <html lang="en">
        <head>
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>Email Template</title>
            <style>
                body {
                    font-family: Arial, sans-serif;
                    background-color: #f4f4f4;
                    margin: 0;
                    padding: 0;
                }
                .container {
                    margin: 50px auto;
                    background-color: #fff;
                    padding: 20px;
                    border-radius: 8px;
                    box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
                }
                h1 {
                    text-align: center;
                    color: #333;
                }
                .content {
                    margin-bottom: 15px;
                }
                .footer {
                    text-align: center;
                    color: #777;
                    font-size: 12px;
                    margin-top: 20px;
                }
            </style>
        </head>
        <body>
            <div class="container">
                <div class="content">
                    <p>Dear <strong> Concern </strong>,</p>
                    <p>A new help ticket has been submitted by a customer. Please find the details below: </p>
                    <p>Name : <strong> ${name} </strong></p>
                    <p>Email : <strong> ${email} </strong></p>
                    <p>Subject : <strong> ${subject} </strong></p>
                    <p>Message : <strong> ${body} </strong></p>
                    <p>Best regards,</p>
                    <p>parseLab.LLC</p>
                </div>
                <div class="footer">
                    <p>&copy; 2024 Our Service. All rights reserved.</p>
                </div>
            </div>
        </body>
    </html>`;
    return html;
}
/**
 * Method  to send email
 * @param to  The email you want to send  mail
 * @param subject The subject for the mail
 * @param mailData The mailData is the  dynamic data those data want to see in  the mail.This mailData accept object data which format is like {name: 'a', email: 'abc.com'}
 */
export default async function sendMail({toMail=null, subject=null, attachments=null, mailData=""}){
    if(process.env.DOCS_INKYBAY_ALLOW_SEND_MAIL != "YES"){
        return {
            success: 200,
            message: `Mail currently is not allowed`
        }
    }
    if(toMail && subject){
        try {
            const transporter = nodemailer.createTransport({
                host: process.env.DOCS_INKYBAY_MAIL_HOST,
                port: process.env.DOCS_INKYBAY_MAIL_PORT,
                secure: process.env.DOCS_INKYBAY_MAIL_PORT == 465 ? true : false, // true for 465, false for other por
                auth: {
                    user: process.env.DOCS_INKYBAY_MAIL_USER,
                    pass: process.env.DOCS_INKYBAY_MAIL_PASSWORD,
                },
            });
            const mailOptions = {
                from: process.env.DOCS_INKYBAY_MAIL_USER,
                to: toMail,
                subject: subject,
                // attachments:[
                //     {
                //         filename: "1748839631960_Logo (1).png",
                //         path: "./public/images/tickets/1748839631960_Logo (1).png",
                //     },
                // ],
                attachments: attachments ? attachments : [],
                html: mailBody({mailData: mailData})
            };
    
           const info = await transporter.sendMail(mailOptions);
            return {
                success: 200,
                message: "Email Send successfully"
            }

        } catch (error) {
            console.log(error)
            return {
                success: 400,
                error: error
            }
        }
    } else {
        return {
            success: 400,
            message: "Email address or Email subject not found"
        }
    }
}