
import {
  ChevronDown,
  ChevronRight,
  ChevronUp,
  Diamond,
  DollarSign,
  Settings,
  ShoppingCart,
  Store,
  Wrench,
} from "lucide-react"
import { useState } from "react"



const NavItem = ({ icon, title, isOpen, hasChildren, onClick, level = 0 }) => {
  const isTopLevel = level === 0

  return (
    <div
    //   className={cn(
    //     "flex items-center w-full cursor-pointer py-2 px-4",
    //     isTopLevel ? "hover:bg-[#f9fafb]" : "hover:bg-[#f9fafb]",
    //     level > 0 && "pl-8",
    //   )}
      className="flex items-center w-full cursor-pointer py-2 px-4"
      onClick={onClick}
    >
      {isTopLevel && <div className="mr-2 text-[#344054]">{icon}</div>}
      {/* <span className={cn("flex-1 text-[#1a1a1a]", level > 0 && "text-sm")}>{title}</span> */}
      <span className="flex-1 text-[#1a1a1a]">{title}</span>
      {hasChildren && (
        <div className="text-[#667085]">{isOpen ? <ChevronUp size={18} /> : <ChevronDown size={18} />}</div>
      )}
    </div>
  )
}


const SubNavItem = ({ title, isOpen, onClick }) => {
  return (
    <div
      className="flex items-center w-full cursor-pointer py-2 pl-10 pr-4 hover:bg-[#f9fafb] text-sm"
      onClick={onClick}
    >
      <div className="text-[#667085] mr-2">{isOpen ? <ChevronDown size={16} /> : <ChevronRight size={16} />}</div>
      <span className="flex-1 text-[#344054]">{title}</span>
    </div>
  )
}

export default function SidebarNavigation() {
  const [openItems, setOpenItems] = useState({
    "Theme Integration": true,
    "Customize App Appearance": true,
  })

  const toggleItem = (item) => {
    setOpenItems((prev) => ({
      ...prev,
      [item]: !prev[item],
    }))
  }

  return (
    <div className="w-full max-w-[280px] border-r border-[#eaecf0] h-screen bg-white">
      <div className="flex flex-col">
        <NavItem
          icon={<Wrench size={20} />}
          title="Getting Started"
          hasChildren={true}
          isOpen={openItems["Getting Started"]}
          onClick={() => toggleItem("Getting Started")}
        />

        <NavItem
          icon={<Diamond size={20} />}
          title="Jewelry Customization"
          hasChildren={true}
          isOpen={openItems["Jewelry Customization"]}
          onClick={() => toggleItem("Jewelry Customization")}
        />

        <NavItem
          icon={<Store size={20} />}
          title="Theme Integration"
          hasChildren={true}
          isOpen={openItems["Theme Integration"]}
          onClick={() => toggleItem("Theme Integration")}
        />

        {openItems["Theme Integration"] && (
          <div className="border-l border-[#d0d5dd] ml-5">
            <SubNavItem
              title="Customize App Appearance"
              isOpen={openItems["Customize App Appearance"]}
              onClick={() => toggleItem("Customize App Appearance")}
            />

            <SubNavItem
              title="Theme Compatibility"
              isOpen={openItems["Theme Compatibility"]}
              onClick={() => toggleItem("Theme Compatibility")}
            />

            <SubNavItem
              title="Placement Options"
              isOpen={openItems["Placement Options"]}
              onClick={() => toggleItem("Placement Options")}
            />

            <SubNavItem
              title="Where Customers Type Content"
              isOpen={openItems["Where Customers Type Content"]}
              onClick={() => toggleItem("Where Customers Type Content")}
            />

            <SubNavItem
              title="How to Enable a Typing Field"
              isOpen={openItems["How to Enable a Typing Field"]}
              onClick={() => toggleItem("How to Enable a Typing Field")}
            />

            <SubNavItem
              title="Customization Options for the Typing Field"
              isOpen={openItems["Customization Options for the Typing Field"]}
              onClick={() => toggleItem("Customization Options for the Typing Field")}
            />
          </div>
        )}

        <NavItem
          icon={<Settings size={20} />}
          title="Inventory Management"
          hasChildren={true}
          isOpen={openItems["Inventory Management"]}
          onClick={() => toggleItem("Inventory Management")}
        />

        <NavItem
          icon={<ShoppingCart size={20} />}
          title="Order Processing"
          hasChildren={true}
          isOpen={openItems["Order Processing"]}
          onClick={() => toggleItem("Order Processing")}
        />

        <NavItem
          icon={<DollarSign size={20} />}
          title="Pricing & Billing"
          hasChildren={true}
          isOpen={openItems["Pricing & Billing"]}
          onClick={() => toggleItem("Pricing & Billing")}
        />
      </div>
    </div>
  )
}
