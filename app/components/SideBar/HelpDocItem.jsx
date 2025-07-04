import { Link } from "@remix-run/react";


export default function HelpDocItem ({ title,  url })  {

    return (
        <>  
            <div className="flex items-center w-full cursor-pointer py-2 pl-2 pr-4 text-sm  bg-gray-100">
                <Link to={`/${url}`} className="flex-1 text-gray-800 text-sm ">{title}</Link>
            </div>
        </>
    )
  }

  