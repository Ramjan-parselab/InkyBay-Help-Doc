import { redirect } from "@remix-run/react";
import { getSession } from "../../services/session.server";

export async function loader({ request }) {
    // Here check sessionId before login page. 
    // If user already logged in then it will redirect to dashboard
    // If not then user have to must login 
    let session = await getSession(request.headers.get("cookie"));
    const sessionId = session.get('sessionId');
    if(!sessionId) return redirect("/admin/login");
    return null;
}

export default function Dashboard () {

  const actionsData = [
    {
      title: "Language",
      description:
        "Manage and add multiple language options to support international users and enhance the overall accessibility of your platform through localization.",
      createUrl: "/admin/languages/create",
    },
    {
      title: "Categories",
      description:
        "Organize your content into structured categories to improve navigation, content discovery, and user experience across the entire application or website.",
      createUrl: "/admin/categories/create",
    },
    {
      title: "Docs",
      description:
        "Create, edit, and maintain documentation to help users understand features, navigate tools, and solve problems with step-by-step instructions and guides.",
      createUrl: "/admin/docs/create",
    },
    {
      title: "Support media",
      description:
        "Upload and manage media files such as images and videos used in your support sections to ensure helpful, up-to-date, and visually clear support content.",
      createUrl: "/admin/socials-media/create",
    },
    {
      title: "Supports",
      description:
        "Manage support entries, help articles, and FAQs to offer clear answers and guidance, improving customer satisfaction and reducing support requests.",
      createUrl: "/admin/supports/create",
    },
    {
      title: "Footer menu",
      description:
        "Customize and update your website’s footer with links, legal pages, or contact info to ensure clarity, compliance, and better navigation at all times.",
      createUrl: "/admin/footer/create",
    },
    {
      title: "User",
      description:
        "Add and manage user accounts, roles, and permissions to control platform access, ensuring secure operations and efficient user role assignment.",
      createUrl: "/admin/users/create",
    },
    {
      title: "Page",
      description:
        "Create and update web pages like About, Contact, or Terms to deliver informative, SEO-optimized content and enhance your website’s usability.",
      createUrl: "/admin/pages/create",
    },
  ];


  
    return (
      <div>
        <div className="text-md font-bold text-center text-[#dc6803]">
          <h3>Welcome to JewelsLab Help Docs</h3>
        </div>
        
        
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mt-5">
            {actionsData?.length > 0 && actionsData.map((item, index)=> (
              <div key={index} className="max-w-sm p-6 bg-white border border-gray-200 rounded-lg shadow-sm">
                  <a href="#">
                      <h5 className="mb-2 text-md font-bold tracking-tight text-gray-900 ">{item?.title}</h5>
                  </a>
                  <p className="mb-3 font-normal text-gray-700 ">{item?.description}</p>
                  <a href={item?.createUrl} className="inline-flex items-center px-3 py-2 text-sm font-medium text-center text-white bg-emerald-500 rounded-lg ">
                      Create new
                      <svg className="w-4 h-4 ms-2" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 24 24">
                        <path stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" d="M12 5v14m-7-7h14" />
                      </svg>
                  </a>
              </div>
            ))}


        </div>
      </div>
    );
}