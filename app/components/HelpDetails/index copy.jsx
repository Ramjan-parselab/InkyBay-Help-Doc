import { Link } from "@remix-run/react";
import { Clock, Home, Search } from "lucide-react"
import RelatedArticle from "./RelatedArticle";
import TopicList from "./TopicList";

export default function Details() {
    return (
        <>
             <div className="min-h-screen bg-[#f9fafb]">
                <main className="container mx-auto px-4 py-8 flex flex-col md:flex-row gap-8">
                  <div className="md:w-3/4">
                    <div className="flex items-center text-xs text-[#667085] mb-4">
                      <Clock className="h-3.5 w-3.5 mr-1" />
                      <span>5min to read</span>
                      <span className="mx-2">•</span>
                      <span>Last Update on 21 July 2023</span>
                    </div>

                    <h1 className="text-3xl font-bold text-[#1a1a1a] mb-6">Typography Settings</h1>

                    <p className="text-[#344054] mb-6">
                      Typography plays a vital role in delivering a seamless, luxurious, and brand consistent customization
                      experience for your jewelry store. With <strong>JewelsLab</strong>, you can fine-tune every text element
                      within the personalization widget from font styles to spacing ensuring your customization experience aligns
                      with your store&apos;s aesthetic.
                    </p>

                    <h2 className="text-2xl font-bold text-[#1a1a1a] mt-8 mb-4">1.0 Why Typography Matters</h2>

                    <p className="text-[#344054] mb-4">
                      Typography isn&apos;t just about fonts. It&apos;s about communicating your brand personality, creating a
                      premium shopping.
                    </p>

                    <p className="text-[#344054] mb-4">A thoughtful typography setup can:</p>

                    <ul className="list-none space-y-2 mb-6">
                      <li className="flex items-start">
                        <span className="text-[#344054] mr-2">•</span>
                        <span className="text-[#344054]">Reflect the elegance or edginess of your jewelry brand</span>
                      </li>
                      <li className="flex items-start">
                        <span className="text-[#344054] mr-2">•</span>
                        <span className="text-[#344054]">Help users quickly understand customization steps</span>
                      </li>
                    </ul>

                    <h2 className="text-2xl font-bold text-[#1a1a1a] mt-8 mb-4">2.0 How to Access Typography Settings</h2>

                    <p className="text-[#344054] mb-4">To begin customizing your widget&apos;s typography:</p>

                    <ol className="list-decimal list-inside space-y-2 mb-6 pl-4">
                      <li className="text-[#344054]">Open the JewelsLab Dashboard</li>
                      <li className="text-[#344054]">Navigate to Design & Theme Integration</li>
                      <li className="text-[#344054]">Select Typography Settings</li>
                    </ol>

                    <p className="text-[#344054] mb-6">
                      This panel provides a live preview and granular controls to style every text element.
                    </p>

                    <div className="relative w-full h-[200px] bg-gradient-to-r from-[#ffd700] to-[#1a1a1a] rounded-md mb-8 overflow-hidden">
                      <div className="absolute inset-0 flex items-center justify-center">
                        <span className="text-white text-8xl font-light">Aa</span>
                      </div>
                      <div className="absolute right-0 top-0 bottom-0 w-[120px] flex items-center justify-center">
                        <div className="text-white transform rotate-90 whitespace-nowrap text-sm font-medium">
                          Typography Settings
                        </div>
                      </div>
                    </div>

                    <h2 className="text-2xl font-bold text-[#1a1a1a] mt-8 mb-4">3.0 Available Typography Options</h2>

                    <p className="text-[#344054] mb-6">JewelsLab gives you full control over the following:</p>

                    <h3 className="text-xl font-bold text-[#1a1a1a] mt-6 mb-3">3.1 Font Family</h3>

                    <p className="text-[#344054] mb-6">
                      Choose from a curated list of web-safe fonts and Google Fonts. Pick fonts that reflect your jewelry brand
                      classic vibes for timeless elegance or modern sans-serifs for a sleek look.
                    </p>

                    <h3 className="text-xl font-bold text-[#1a1a1a] mt-6 mb-3">3.1 Font Size</h3>

                    <p className="text-[#344054] mb-4">Adjust text size for key components like:</p>

                    <ul className="list-none space-y-2 mb-6">
                      <li className="flex items-start">
                        <span className="text-[#344054] mr-2">•</span>
                        <span className="text-[#344054]">Field labels (e.g., "Engraving text")</span>
                      </li>
                      <li className="flex items-start">
                        <span className="text-[#344054] mr-2">•</span>
                        <span className="text-[#344054]">Field inputs (user-typed text)</span>
                      </li>
                      <li className="flex items-start">
                        <span className="text-[#344054] mr-2">•</span>
                        <span className="text-[#344054]">Section titles</span>
                      </li>
                      <li className="flex items-start">
                        <span className="text-[#344054] mr-2">•</span>
                        <span className="text-[#344054]">Help text or tooltips</span>
                      </li>
                    </ul>

                    <p className="text-[#344054] mb-8">Separate settings for desktop and mobile ensure responsiveness.</p>

                    <div className="relative w-full aspect-video bg-black rounded-md mb-8 overflow-hidden">
                      <div className="absolute inset-0 flex items-center justify-center">
                        <img
                          src="/placeholder.svg?height=400&width=600"
                          alt="JewelsLab Ultimate Jewelry Personalizer Video"
                          width={600}
                          height={400}
                          className="w-full h-full object-cover"
                        />
                        <div className="absolute bottom-0 left-0 right-0 flex items-center justify-between p-2 bg-black/80">
                          <div className="flex items-center space-x-2">
                            <button className="text-white p-1">
                              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <path d="M5 3L19 12L5 21V3Z" fill="white" />
                              </svg>
                            </button>
                            <button className="text-white p-1">
                              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <rect x="6" y="4" width="4" height="16" fill="white" />
                                <rect x="14" y="4" width="4" height="16" fill="white" />
                              </svg>
                            </button>
                            <button className="text-white p-1">
                              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <path
                                  d="M2 16.1A5 5 0 0 1 5.9 20M2 12h1m18 0h1M2 8h1m18 0h1m-9-6v1m0 18v1M8 2h.01M12 2h.01M16 2h.01M8 22h.01M12 22h.01M16 22h.01M20 16.1A5 5 0 0 0 16.1 20"
                                  stroke="white"
                                  strokeWidth="2"
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                />
                              </svg>
                            </button>
                          </div>
                          <div className="text-white text-xs">0:01 / 1:00</div>
                        </div>
                      </div>
                    </div>

                    <div className="bg-[#f5f5f5] p-4 rounded-md border border-[#eaecf0] mb-8">
                      <p className="text-[#344054] mb-4">Did this post help you?</p>
                      <div className="flex space-x-4">
                        <button className="px-4 py-2 bg-white border border-[#d0d5dd] rounded-md text-sm flex items-center">
                          Yes <span className="ml-2">👍</span>
                        </button>
                        <button className="px-4 py-2 bg-white border border-[#d0d5dd] rounded-md text-sm flex items-center">
                          Not Really <span className="ml-2">👎</span>
                        </button>
                      </div>
                    </div>

                    <div className="flex justify-between items-center pt-6 mt-8 border-t border-[#eaecf0]">
                      <Link href="#" className="flex items-center text-[#476df2] text-sm">
                        <svg
                          width="16"
                          height="16"
                          viewBox="0 0 24 24"
                          fill="none"
                          xmlns="http://www.w3.org/2000/svg"
                          className="mr-2"
                        >
                          <path
                            d="M19 12H5M5 12L12 19M5 12L12 5"
                            stroke="currentColor"
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          />
                        </svg>
                        Previous article
                        <div className="text-[#344054] font-medium">Color Scheme Guideline</div>
                      </Link>
                      <Link href="#" className="flex items-center text-right text-[#476df2] text-sm">
                        Next article
                        <svg
                          width="16"
                          height="16"
                          viewBox="0 0 24 24"
                          fill="none"
                          xmlns="http://www.w3.org/2000/svg"
                          className="ml-2"
                        >
                          <path
                            d="M5 12H19M19 12L12 5M19 12L12 19"
                            stroke="currentColor"
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          />
                        </svg>
                        <div className="text-[#344054] font-medium">Button & Label styling</div>
                      </Link>
                    </div>
                  </div>

                  <div className="md:w-1/4">
                    <div className="sticky top-4">
                      <TopicList />
                      <RelatedArticle />
                    </div>
                  </div>
                </main>
            </div>
        </>
    );
}