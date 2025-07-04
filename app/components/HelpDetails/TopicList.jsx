import { Link } from "@remix-run/react";

export default function TopicList({topicList}) {
    
    return (
        <>
            <div className="topic_list_section max-h-screen overflow-y-auto">

                <p className="p1 bold3 text-[#1a1a1a]">IN THIS ARTICLE</p>

                <ul className="topic_lists relative">
                    {topicList?.map((topic, index)=> (
                        <li key={topic?.id} className={`topic_list_item -ml-[1px] ${index === 0 ? 'border-l border-[#1a1a1a]' : ''}`}>
                            <Link to={`#${topic?.id}`} className="hover:underline">
                                    <p className={index === 0? "text-[#1A1A1A] bold2":"text-[#475467]"}>
                                    {index+1}.{0 + 1} {topic?.subtitle}
                                </p>
                            </Link>
                        </li>
                    ))}
                    {/* <ul className="pl-4 mt-2 space-y-2">
                        <li>
                        <Link href="#" className="text-gray-600 text-sm hover:underline">
                            • 3.1 Font Family
                        </Link>
                        </li>
                        <li>
                        <Link href="#" className="text-gray-600 text-sm hover:underline">
                            • 3.2 Font Size
                        </Link>
                        </li>
                        <li>
                        <Link href="#" className="text-gray-600 text-sm hover:underline">
                            • 3.3 Line Height
                        </Link>
                        </li>
                        <li>
                        <Link href="#" className="text-gray-600 text-sm hover:underline">
                            • 3.4 Font Weight
                        </Link>
                        </li>
                        <li>
                        <Link href="#" className="text-gray-600 text-sm hover:underline">
                            • 3.5 Text Transform
                        </Link>
                        </li>
                    </ul> */}
                </ul>

            </div>
        </>
    );
}