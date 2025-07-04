import { Link, useSubmit } from "@remix-run/react";

export default function Sidebar({user= null, logo}){
  const submit = useSubmit();

  const logout = () => {
      submit({ target: "logout" }, { method: "POST" });
  }
    return (
        <>
            <div className="fixed flex flex-col top-0 left-0 w-64 bg-white h-full border-r">
              <div className="flex items-center justify-center h-14 border-b bg-black">
                  <div className="p-6">
                   <a href="/"> 
                        <img src={logo} alt="logo"/>
                    </a>
                  </div>
              </div>
              <div className="overflow-y-auto overflow-x-hidden flex-grow">
                  <ul className="flex flex-col py-4 space-y-1">
                      <li className="px-5">
                          <div className="flex flex-row items-center h-8">
                              <div className="text-sm font-light tracking-wide text-gray-500"> 
                                {/* Ramja hosen */}
                                {/* <span className="inline-block w-4 h-4 rounded-full bg-green-600 ml-3"></span> */}
                                <span className="ml-2 text-sm tracking-wide truncate"> {user?.name}</span>
                                <span className="inline-block w-3 h-3 rounded-full bg-green-600 ml-2"></span>
                                
                                </div>
                              

                          </div>
                      </li>
                    <li>
                      <Link to="/admin" className="relative flex flex-row items-center h-11 focus:outline-none hover:bg-gray-50 text-gray-600 hover:text-gray-800 border-l-4 border-transparent hover:border-indigo-500 pr-6">
                          <span className="inline-flex justify-center items-center ml-4">
                              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 3h7v7H3V3zm0 11h7v7H3v-7zm11-11h7v7h-7V3zm0 11h7v7h-7v-7z" />
                              </svg>
                          </span>
                          <span className="ml-2 text-sm tracking-wide truncate">Dashboard</span>
                      </Link>
                    </li>
                    <li>
                      <Link to="/admin/languages" className="relative flex flex-row items-center h-11 focus:outline-none hover:bg-gray-50 text-gray-600 hover:text-gray-800 border-l-4 border-transparent hover:border-indigo-500 pr-6">
                        <span className="inline-flex justify-center items-center ml-4">
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                               <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 3c4.97 0 9 4.03 9 9s-4.03 9-9 9-9-4.03-9-9 4.03-9 9-9zm0 0c2.21 0 4 4.03 4 9s-1.79 9-4 9-4-4.03-4-9 1.79-9 4-9zm0 0c4.97 0 9 4.03 9 9H3c0-4.97 4.03-9 9-9z" />
                            </svg>
                        </span>
                        <span className="ml-2 text-sm tracking-wide truncate">Languages</span>
                      </Link>
                    </li>
                    <li>
                      <Link to="/admin/categories" className="relative flex flex-row items-center h-11 focus:outline-none hover:bg-gray-50 text-gray-600 hover:text-gray-800 border-l-4 border-transparent hover:border-indigo-500 pr-6">
                        <span className="inline-flex justify-center items-center ml-4">
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 7a2 2 0 012-2h4l2 2h8a2 2 0 012 2v7a2 2 0 01-2 2H5a2 2 0 01-2-2V7z" />
                            </svg>
                        </span>
                        <span className="ml-2 text-sm tracking-wide truncate">Categories</span>
                      </Link>
                    </li>
                    <li>
                      <Link to="/admin/docs" className="relative flex flex-row items-center h-11 focus:outline-none hover:bg-gray-50 text-gray-600 hover:text-gray-800 border-l-4 border-transparent hover:border-indigo-500 pr-6">
                          <span className="inline-flex justify-center items-center ml-4">
                              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6l-2-2H5a2 2 0 00-2 2v13a1 1 0 001 1h13a1 1 0 001-1V8l-2-2m-3-2v4m0 0h4m-4 0l4 4" />
                              </svg>
                          </span>
                          <span className="ml-2 text-sm tracking-wide truncate">Docs</span>
                      </Link>
                    </li>
                    <li>
                      <Link to="/admin/socials-media" className="relative flex flex-row items-center h-11 focus:outline-none hover:bg-gray-50 text-gray-600 hover:text-gray-800 border-l-4 border-transparent hover:border-indigo-500 pr-6">
                          <span className="inline-flex justify-center items-center ml-4">
                              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                < path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 3c4.97 0 9 4.03 9 9s-4.03 9-9 9-9-4.03-9-9 4.03-9 9-9zm0 0c2.21 0 4 4.03 4 9s-1.79 9-4 9-4-4.03-4-9 1.79-9 4-9zm0 0c4.97 0 9 4.03 9 9H3c0-4.97 4.03-9 9-9z" />
                              </svg>
                          </span>
                          <span className="ml-2 text-sm tracking-wide truncate">Social Media</span>
                      </Link>
                    </li>
                    <li>
                      <Link to="/admin/supports" className="relative flex flex-row items-center h-11 focus:outline-none hover:bg-gray-50 text-gray-600 hover:text-gray-800 border-l-4 border-transparent hover:border-indigo-500 pr-6">
                          <span className="inline-flex justify-center items-center ml-4">
                              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                < path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 3c4.97 0 9 4.03 9 9s-4.03 9-9 9-9-4.03-9-9 4.03-9 9-9zm0 0c2.21 0 4 4.03 4 9s-1.79 9-4 9-4-4.03-4-9 1.79-9 4-9zm0 0c4.97 0 9 4.03 9 9H3c0-4.97 4.03-9 9-9z" />
                              </svg>
                          </span>
                          <span className="ml-2 text-sm tracking-wide truncate">Supports</span>
                      </Link>
                    </li>
                    <li>
                      <Link to="/admin/footer/menus" className="relative flex flex-row items-center h-11 focus:outline-none hover:bg-gray-50 text-gray-600 hover:text-gray-800 border-l-4 border-transparent hover:border-indigo-500 pr-6">
                          <span className="inline-flex justify-center items-center ml-4">
                              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 12c1.38 0 2.5-1.12 2.5-2.5S13.38 7 12 7s-2.5 1.12-2.5 2.5S10.62 12 12 12zm0 0c-1.38 0-2.5 1.12-2.5 2.5S10.62 17 12 17s2.5-1.12 2.5-2.5S13.38 12 12 12zm0 9c-4.97 0-9-4.03-9-9s4.03-9 9-9 9 4.03 9 9-4.03 9-9 9z" />
                              </svg>
                          </span>
                        <span className="ml-2 text-sm tracking-wide truncate">Footer menu</span>
                      </Link>
                    </li>
                    <li>
                      <Link to="/admin/users" className="relative flex flex-row items-center h-11 focus:outline-none hover:bg-gray-50 text-gray-600 hover:text-gray-800 border-l-4 border-transparent hover:border-indigo-500 pr-6">
                          <span className="inline-flex justify-center items-center ml-4">
                              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5.121 17.804A6 6 0 0112 15a6 6 0 016.879 2.804M12 12a4 4 0 100-8 4 4 0 000 8z" />
                              </svg>
                          </span>
                          <span className="ml-2 text-sm tracking-wide truncate">Users</span>
                      </Link>
                    </li>
                    
                   
                    {/* <li>
                      <a href="#" className="relative flex flex-row items-center h-11 focus:outline-none hover:bg-gray-50 text-gray-600 hover:text-gray-800 border-l-4 border-transparent hover:border-indigo-500 pr-6">
                        <span className="inline-flex justify-center items-center ml-4">
                          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"></path></svg>
                        </span>
                        <span className="ml-2 text-sm tracking-wide truncate">Notifications</span>
                        <span className="px-2 py-0.5 ml-auto text-xs font-medium tracking-wide text-red-500 bg-red-50 rounded-full">1.2k</span>
                      </a>
                    </li> */}
                    <li className="px-5">
                      <div className="flex flex-row items-center h-8">
                        <div className="text-sm font-light tracking-wide text-gray-500">Settings</div>
                      </div>
                    </li>
                    <li>
                      <Link to="/admin/users/profile" className="relative flex flex-row items-center h-11 focus:outline-none hover:bg-gray-50 text-gray-600 hover:text-gray-800 border-l-4 border-transparent hover:border-indigo-500 pr-6">
                        <span className="inline-flex justify-center items-center ml-4">
                          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"></path></svg>
                        </span>
                        <span className="ml-2 text-sm tracking-wide truncate">Profile</span>
                      </Link>
                    </li>
                    <li>
                      <Link to="/admin/settings" className="relative flex flex-row items-center h-11 focus:outline-none hover:bg-gray-50 text-gray-600 hover:text-gray-800 border-l-4 border-transparent hover:border-indigo-500 pr-6">
                        <span className="inline-flex justify-center items-center ml-4">
                          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"></path>
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"></path>
                          </svg>
                        </span>
                        <span className="ml-2 text-sm tracking-wide truncate">Settings</span>
                      </Link>
                    </li>
                    <li>
                      <button onClick={logout} className="relative flex flex-row items-center h-11 focus:outline-none hover:bg-gray-50 text-gray-600 hover:text-gray-800 border-l-4 border-transparent hover:border-indigo-500 pr-6">
                        <span className="inline-flex justify-center items-center ml-4">
                          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"></path></svg>
                        </span>
                        <span className="ml-2 text-sm tracking-wide truncate">Logout</span>
                      </button>
                    </li>
                  </ul>
              </div>
          </div>
        </>
    );
}