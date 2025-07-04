import { Outlet } from "@remix-run/react";

export default function Documentation () {
    return (
        <div className="min-h-screen flex flex-row bg-gray-50 text-gray-800 w-full">
            <main className="flex-1 p-6 ml-15">
                <div className="max-w-[800px] mx-auto">
                    <Outlet />
                </div>
            </main>
        </div>
    );

}