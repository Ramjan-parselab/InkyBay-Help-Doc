import { useEffect, useState } from "react";
import Collapsible from "../ui/collapsible";
import { ChevronDown } from "lucide-react";

// const tabItems = [
//   {
//     label: "General",
//     count: 7,
//     content: (
//       <div className="space-y-4">
//         <h2 className="text-xl font-semibold text-[#344054]">General Settings</h2>
//         <p className="text-[#667085]">
//           Configure your general application settings including account information, notifications, and display
//           preferences.
//         </p>
//         <div className="grid gap-4 mt-4">
//           <div className="p-4 border border-[#eaecf0] rounded-lg">
//             <h3 className="font-medium text-[#344054]">Account Information</h3>
//             <p className="text-sm text-[#667085]">Update your account details and preferences.</p>
//           </div>
//           <div className="p-4 border border-[#eaecf0] rounded-lg">
//             <h3 className="font-medium text-[#344054]">Notification Settings</h3>
//             <p className="text-sm text-[#667085]">Control when and how you receive notifications.</p>
//           </div>
//         </div>
//       </div>
//     ),
//   },
//   {
//     label: "Product Customization",
//     count: 11,
//     content: (
//       <div className="space-y-4">
//         <h2 className="text-xl font-semibold text-[#344054]">Product Customization</h2>
//         <p className="text-[#667085]">
//           Customize your product offerings, including options, variants, and pricing rules.
//         </p>
//         <div className="grid gap-4 mt-4">
//           <div className="p-4 border border-[#eaecf0] rounded-lg">
//             <h3 className="font-medium text-[#344054]">Product Options</h3>
//             <p className="text-sm text-[#667085]">Configure customizable options for your products.</p>
//           </div>
//           <div className="p-4 border border-[#eaecf0] rounded-lg">
//             <h3 className="font-medium text-[#344054]">Pricing Rules</h3>
//             <p className="text-sm text-[#667085]">Set up dynamic pricing based on customizations.</p>
//           </div>
//         </div>
//       </div>
//     ),
//   },
//   {
//     label: "Orders & Fulfillment",
//     count: 5,
//     content: (
//       <div className="space-y-4">
//         <h2 className="text-xl font-semibold text-[#344054]">Orders & Fulfillment</h2>
//         <p className="text-[#667085]">Manage your orders, shipping methods, and fulfillment processes.</p>
//         <div className="grid gap-4 mt-4">
//           <div className="p-4 border border-[#eaecf0] rounded-lg">
//             <h3 className="font-medium text-[#344054]">Order Management</h3>
//             <p className="text-sm text-[#667085]">View and process customer orders.</p>
//           </div>
//           <div className="p-4 border border-[#eaecf0] rounded-lg">
//             <h3 className="font-medium text-[#344054]">Shipping Methods</h3>
//             <p className="text-sm text-[#667085]">Configure available shipping options and rates.</p>
//           </div>
//         </div>
//       </div>
//     ),
//   },
// ]

const items = [
  {
    id: 1,
    label: "General",
    count: 3,
    content: (
      <>
      <Collapsible index={1} title="What is JewelsLab?" text="JewelsLab is a Shopify app that helps merchants offer customizable jewelry to customers with a simple and intuitive interface"/>
      <Collapsible index={2} title="Is JewelsLab compatible with all Shopify themes?" text="JewelsLab is a Shopify app that helps merchants offer customizable jewelry to customers with a simple and intuitive interface JewelsLab is a Shopify app that helps merchants offer customizable jewelry to customers with a simple and intuitive interface JewelsLab is a Shopify app that helps merchants offer customizable jewelry to customers with a simple and intuitive interface JewelsLab is a Shopify app that helps merchants offer customizable jewelry to customers with a simple and intuitive interface JewelsLab is a Shopify app that helps merchants offer customizable jewelry to customers with a simple and intuitive interface JewelsLab is a Shopify app that helps merchants offer customizable jewelry to customers with a simple and intuitive interface JewelsLab is a Shopify app that helps merchants offer customizable jewelry to customers with a simple and intuitive interface JewelsLab is a Shopify app that helps merchants offer customizable jewelry to customers with a simple and intuitive interface JewelsLab is a Shopify app that helps merchants offer customizable jewelry to customers with a simple and intuitive interface JewelsLab is a Shopify app that helps merchants offer customizable jewelry to customers with a simple and intuitive interface JewelsLab is a Shopify app that helps merchants offer customizable jewelry to customers with a simple and intuitive interface JewelsLab is a Shopify app that helps merchants offer customizable jewelry to customers with a simple and intuitive interface "/>
      <Collapsible index={3} title="Do I need coding knowledge to use JewelsLab?" text="loJewelsLab is a Shopify app that helps merchants offer customizable jewelry to customers with a simple and intuitive interface"/>
      </>
    ),
  },
  {
    id: 2,
    label: "Product Customization",
    count: 1,
    content: (
      <Collapsible index={1} title="Is JewelsLab compatible with all Shopify themes?" text="loJewelsLab is a Shopify app that helps merchants offer customizable jewelry to customers with a simple and intuitive interface"/>
    ),
  },
  {
    id: 3,
    label: "Orders & Fulfillment",
    count: 1,
    content: (
      <Collapsible index={1} title="Do I need coding knowledge to use JewelsLab?" text="loJewelsLab is a Shopify app that helps merchants offer customizable jewelry to customers with a simple and intuitive interface"/>
    ),
  },
];

// export default function Tab ({items}) {
export default function Tab () {
    const [activeIndex, setActiveIndex] = useState(0);
    const [isOpen, setIsOpen] = useState(false);
    const [itemLabel, setItemLabel] = useState(items[0].label);

    const handleTabClick = (index) => {
        setActiveIndex(index);
    };

    // useEffect(()=> {
    //   if(items?.length > 0) {
    //     setItemData(items);
    //   }
    // }, [])
    return (
      <>

          <div className="w-full">

              <div className="flex justify-center">

                <div className="hidden md:flex flex-wrap items-center gap-1 bg-gray-50 p-2 rounded-2xl border border-gray-200">
                    {items.map((item, index) => (
                      <button
                        key={index}
                        className={`flex items-center gap-2 rounded-lg px-4 py-2 cursor-pointer hover:bg-[#FFF] hover:shadow-sm transition-all duration-300
                            ${index === activeIndex?
                              "bg-[#FFF] shadow-sm"
                              :
                              ""
                            }
                            `}
                        onClick={() => {handleTabClick(index); setItemLabel(item.label); setIsOpen(false)}}
                        role="tab"
                        aria-selected={item.isActive}
                        tabIndex={item?.id}
                      >
                        
                        <p className={`${index === activeIndex? "text-[#344054]":"text-[#667085]"}`}>{item.label}</p>
                        <span className="span1 flex h-7 w-7 items-center justify-center rounded-xl bg-gray-50 text-gray-700 border border-gray-200">
                          {item.count}
                        </span>
                      </button>
                  ))}
                </div>

                {/* Mobile vesion */}
                <div className="md:hidden">
                  <div className="relative">
                    {/* Dropdown Button */}
                        <button onClick={() => setIsOpen(!isOpen)} className="px-[14px] py-[10px] sm:w-[550px] min-w-[335px] h-16 flex items-center justify-between rounded-lg border-[#D0D5DD] border bg-[#fff] shadow-sm">
                          <p className="text-[#101828] flex items-center flex-row gap-2">{itemLabel}
                            <span className="span1 flex h-7 w-7 items-center justify-center rounded-xl bg-[#F9FAFB] text-[#344054] border border-[#EAECF0]">{items.map((item)=>item.label == itemLabel?item.count:"")}</span>
                          </p>
                          <ChevronDown className={`w-6 h-6 text-[#667085] transition-transform duration-200 ${isOpen ? "transform rotate-180" : ""}`}/>
                        </button>

                        {/* Dropdown Menu */}
                        
                            <div className={`absolute mt-1 shadow-sm sm:w-[550px] min-w-[335px] border-[#EAECF0] bg-[#FFF] rounded-lg z-10 overflow-hidden transition-all duration-700 ${isOpen ?("max-h-[1000px] border"):("max-h-[0px]")}`}>
                                <div className="w-full p-[14px] flex flex-col gap-2 items-start animate-dropdown">
                                  {items.map((item, index)=>(
                                    item.label == itemLabel?(
                                    <button key={index} className="w-full flex items-center px-[14px] py-[10px] gap-2 rounded-lg bg-[#F9FAFB] shadow-sm" >
                                        <p className="text-[#101828]">{item.label}</p>
                                        <span className="span1 flex h-7 w-7 items-center justify-center rounded-xl bg-[#F9FAFB] text-[#344054] border border[#EAECF0]">{item.count}</span>
                                    </button>
                                    ):(
                                      <button onClick={()=>{handleTabClick(index);setItemLabel(item.label);setIsOpen(false)}} key={index} className="w-full flex items-center px-[14px] py-[10px] gap-2 rounded-lg hover:bg-[#F9FAFB] hover:shadow-sm" >
                                        <p className="text-[#101828]">{item.label}</p>
                                        <span className="span1 flex h-7 w-7 items-center justify-center rounded-xl bg-[#fff] text-[#344054] border border-[#EAECF0]">{item.count}</span>
                                    </button>
                                  )))}
                                </div>
                            </div>
                        

                    </div>

                </div>

              </div>



             {/* Tab content area */}
            <div className="bg-white rounded-xl p-6 flex justify-center items-center">
              {items.map(
                (item, index) =>
                  activeIndex === index && (
                    <div key={index} role="tabpanel" className="flex flex-col gap-5 w-[780px]">
                      {item.content}
                    </div>
                  ),
              )}
            </div>
          </div>
      </>
    );


}