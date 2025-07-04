import { useState } from "react"

// Simple utility function to join classNames conditionally
function classNames(...classes) {
  return classes.filter(Boolean).join(" ")
}

export default function tab({ items: initialItems }) {
  const [activeIndex, setActiveIndex] = useState(0)

  // Create a copy of items with active state based on activeIndex
  const items = initialItems.map((item, index) => ({
    ...item,
    isActive: index === activeIndex,
  }))

  const handleTabClick = (index) => {
    setActiveIndex(index)
  }

  return (
    <div className="w-full">
      <div className="rounded-xl bg-white shadow-sm p-4 mb-4">
        <div className="flex flex-wrap items-center gap-4 md:gap-8">
          {items.map((item, index) => (
            <div
              key={index}
              className={classNames(
                "flex items-center gap-2 rounded-lg px-4 py-2 cursor-pointer transition-colors",
                item.isActive ? "bg-[#f9fafb]" : "hover:bg-[#f9fafb]/50",
              )}
              onClick={() => handleTabClick(index)}
              role="tab"
              aria-selected={item.isActive}
              tabIndex={item.isActive ? 0 : -1}
            >
              <span className="text-[#344054] text-lg font-medium">{item.label}</span>
              <span className="flex h-7 w-7 items-center justify-center rounded-full bg-[#f9fafb] text-sm font-medium text-[#667085]">
                {item.count}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Tab content area */}
      <div className="bg-white rounded-xl shadow-sm p-6 min-h-[200px]">
        {items.map(
          (item, index) =>
            item.isActive && (
              <div key={index} role="tabpanel">
                {item.content}
              </div>
            ),
        )}
      </div>
    </div>
  )
}
