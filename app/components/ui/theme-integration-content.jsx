import { Layout } from "lucide-react"
import CategoryCard from "./category-card"

export default function ThemeIntegrationContent() {
  const customizeAppItems = [
    { title: "Color scheme", icon: "document" },
    { title: "Typography Settings", icon: "document" },
    { title: "Button and label styling", icon: "document" },
    { title: "Field layout & spacing", icon: "document" },
    { title: "Widget Container Styles", icon: "document" },
    { title: "Desktop vs Mobile Styling", icon: "document" },
  ]

  const themeCompatibilityItems = [
    { title: "Supported Themes", icon: "document" },
    { title: "How Auto-Detection Works", icon: "document" },
    { title: "Manual Installation Guide", icon: "document" },
    { title: "Testing Your Integration", icon: "document" },
    { title: "Common Issues & Fixes", icon: "document" },
    { title: "Troubleshooting", icon: "document" },
  ]

  const placementOptionsItems = [
    { title: "Inline Placement", icon: "document" },
    { title: "Popup Mode", icon: "document" },
    { title: "Tabbed Layout", icon: "document" },
    { title: "Drag & Drop", icon: "document" },
    { title: "Placement Rules per Product", icon: "document" },
  ]

  const customerContentItems = [
    { title: "Input Field Location", icon: "document" },
    { title: "Types of Text Customers Can Enter", icon: "document" },
    { title: "Live Preview Sync", icon: "document" },
    { title: "Character Limit Notifications", icon: "document" },
  ]

  const enableTypingItems = [
    { title: "Go to Product Settings", icon: "document" },
    { title: "Add a New Text Field", icon: "document" },
    { title: "Label and Placeholder Setup", icon: "document" },
    { title: "Set Character Limits", icon: "document" },
    { title: "Mark as Required (Optional)", icon: "document" },
  ]

  const customizationItems = [
    { title: "Custom Label Text", icon: "document" },
    { title: "Font & Size Settings", icon: "document" },
    { title: "Field Width & Alignment", icon: "document" },
    { title: "Input Background & Border Styling", icon: "document" },
    { title: "Live Preview Appearance", icon: "document" },
    { title: "Error States and Validation Styling", icon: "document" },
  ]

  return (
    <div>
      <div className="flex items-center gap-3 mb-3">
        <div className="p-2 bg-[#f4f4f4] rounded-md">
          <Layout className="h-5 w-5 text-[#344054]" />
        </div>
        <h1 className="text-2xl font-semibold text-[#1a1a1a]">Theme Integration</h1>
      </div>

      <p className="text-[#667085] mb-8 max-w-3xl">
        Ensure your personalization widget blends perfectly with your Shopify store. Explore detailed guides on styling,
        placement, and theme compatibility.
      </p>

      <div className="grid md:grid-cols-2 gap-6">
        <CategoryCard title="Customize App Appearance" badge="6" items={customizeAppItems} />

        <CategoryCard title="Theme Compatibility" badge="11" items={themeCompatibilityItems} />

        <CategoryCard title="Placement Options" badge="7" items={placementOptionsItems} />

        <CategoryCard title="Where customers type content" badge="4" items={customerContentItems} />

        <CategoryCard title="How to enable a typing field" badge="3" items={enableTypingItems} />

        <CategoryCard title="Customization for the typing field" badge="13" items={customizationItems} />
      </div>
    </div>
  )
}
