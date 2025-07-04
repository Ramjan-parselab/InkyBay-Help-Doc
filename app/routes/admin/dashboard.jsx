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
    return (
      <div>
        <p>Welcome to JewelsLab Help Docs</p>
      </div>
    );
}