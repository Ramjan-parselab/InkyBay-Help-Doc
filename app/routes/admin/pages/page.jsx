import { Outlet, redirect } from "@remix-run/react";
import { getSession } from "../../../services/session.server";

export async function loader({ request }) {
    // Authentication check if authenticate then go ahed
    let session = await getSession(request.headers.get("cookie"));
    const sessionId = session.get('sessionId');
    if(!sessionId) return redirect("/admin/login");
    return null;
}

export default function Documentation () {
    return (
        <Outlet />
    );

}