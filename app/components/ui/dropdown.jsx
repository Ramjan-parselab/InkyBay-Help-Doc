import { ChevronDown } from "lucide-react"
import { useState } from "react"

export default function DropDown() {
    const [isOpen, setIsOpen] = useState(false)
    const [selectedLanguage, setSelectedLanguage] = useState({
      code: "en-US",
      name: "English (US)",
      flag: "/flags/us.svg",
    })

  const languages = [
    {
      code: "en-GB",
      name: "English (UK)",
      flag: "/flags/uk.svg",
    },
    {
      code: "en-US",
      name: "English (US)",
      flag: "/flags/us.svg",
    },
    {
      code: "ar",
      name: "العربية",
      flag: "/flags/sa.svg",
    },
    {
      code: "es",
      name: "Español",
      flag: "/flags/es.svg",
    },
    {
      code: "fr",
      name: "Français",
      flag: "/flags/fr.svg",
    },
    {
      code: "de",
      name: "Deutsch",
      flag: "/flags/de.svg",
    },
    {
      code: "ja",
      name: "日本語",
      flag: "/flags/jp.svg",
    },
    {
      code: "pt",
      name: "Português",
      flag: "/flags/pt.svg",
    },
    {
      code: "zh",
      name: "简体中文",
      flag: "/flags/cn.svg",
    },
  ]

  const handleSelectLanguage = (language) => {
    setSelectedLanguage(language)
    setIsOpen(false)
  }
  return (
    <div className="w-full max-w-xs mx-auto">
      <div className="relative">
        {/* Dropdown Button */}
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="w-full flex items-center justify-between px-4 py-3  rounded-lg hover:border shadow-sm active:border active:border-[#ffd700]"
        >
          <div className="flex items-center">
            <div className="w-8 h-8 flex-shrink-0 rounded-full overflow-hidden">
              <FlagIcon code={selectedLanguage.code} />
            </div>
            <span className="ml-3 text-white text-lg font-medium">{selectedLanguage.name}</span>
          </div>
          <ChevronDown
            className={`w-5 h-5 text-gray-500 transition-transform duration-200 ${isOpen ? "transform rotate-180" : ""}`}
          />
        </button>

        {/* Dropdown Menu */}
        {isOpen && (
          <div className="absolute mt-1 w-full bg-white rounded-3xl shadow-lg overflow-hidden z-10 transition-all duration-200 ease-in-out">
            <div className="py-2 max-h-80 overflow-y-auto">
              {languages.map((language) => (
                <button
                  key={language.code}
                  className={`w-full flex items-center px-4 py-3 hover:bg-[#f7fcff] ${
                    selectedLanguage.code === language.code ? "bg-[#f0f0f0]" : ""
                  }`}
                  onClick={() => handleSelectLanguage(language)}
                >
                  <div className="w-8 h-8 flex-shrink-0 rounded-full overflow-hidden">
                    <FlagIcon code={language.code} />
                  </div>
                  <span className="ml-3 text-[#1a1a1a] text-lg font-medium">{language.name}</span>
                </button>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

function FlagIcon({ code }) {
    // Using SVG flags for accurate representation
    switch (code) {
      case "en-GB":
        return <UKFlag />
      case "en-US":
        return <USFlag />
      case "ar":
        return <SaudiFlag />
      case "es":
        return <SpainFlag />
      case "fr":
        return <FranceFlag />
      case "de":
        return <GermanyFlag />
      case "ja":
        return <JapanFlag />
      case "pt":
        return <PortugalFlag />
      case "zh":
        return <ChinaFlag />
      default:
        return null
    }
  }
  
  function UKFlag() {
    return (
      <svg viewBox="0 0 60 30" className="w-full h-full">
        <clipPath id="s">
          <path d="M0,0 v30 h60 v-30 z" />
        </clipPath>
        <clipPath id="t">
          <path d="M30,15 h30 v15 z v15 h-30 z h-30 v-15 z v-15 h30 z" />
        </clipPath>
        <g clipPath="url(#s)">
          <path d="M0,0 v30 h60 v-30 z" fill="#012169" />
          <path d="M0,0 L60,30 M60,0 L0,30" stroke="#fff" strokeWidth="6" />
          <path d="M0,0 L60,30 M60,0 L0,30" clipPath="url(#t)" stroke="#C8102E" strokeWidth="4" />
          <path d="M30,0 v30 M0,15 h60" stroke="#fff" strokeWidth="10" />
          <path d="M30,0 v30 M0,15 h60" stroke="#C8102E" strokeWidth="6" />
        </g>
      </svg>
    )
  }
  
  function USFlag() {
    return (
      <svg viewBox="0 0 1235 650" className="w-full h-full">
        <rect width="1235" height="650" fill="#bf0a30" />
        <rect y="50" width="1235" height="550" fill="white" />
        <rect y="100" width="1235" height="450" fill="#bf0a30" />
        <rect y="150" width="1235" height="350" fill="white" />
        <rect y="200" width="1235" height="250" fill="#bf0a30" />
        <rect y="250" width="1235" height="150" fill="white" />
        <rect y="300" width="1235" height="50" fill="#bf0a30" />
        <rect width="494" height="350" fill="#002868" />
        <g fill="white">
          {Array.from({ length: 9 }, (_, i) => (
            <g key={i}>
              {Array.from({ length: i % 2 === 0 ? 6 : 5 }, (_, j) => (
                <circle key={j} cx={41 * j + (i % 2 === 0 ? 41 : 61.5)} cy={35 * i + 35} r="15" />
              ))}
            </g>
          ))}
        </g>
      </svg>
    )
  }
  
  function SaudiFlag() {
    return (
      <svg viewBox="0 0 900 600" className="w-full h-full">
        <rect width="900" height="600" fill="#026c34" />
        <g transform="translate(450, 300)">
          <text textAnchor="middle" fontSize="120" fill="white" fontFamily="Arial" y="20">
            لا إله إلا الله محمد رسول الله
          </text>
          <path d="M-150 -30 L-120 40 L-175 -5 L-100 -5 L-150 40 Z" fill="white" />
        </g>
      </svg>
    )
  }
  
  function SpainFlag() {
    return (
      <svg viewBox="0 0 750 500" className="w-full h-full">
        <rect width="750" height="500" fill="#c60b1e" />
        <rect y="125" width="750" height="250" fill="#ffc400" />
      </svg>
    )
  }
  
  function FranceFlag() {
    return (
      <svg viewBox="0 0 900 600" className="w-full h-full">
        <rect width="300" height="600" fill="#002395" />
        <rect x="300" width="300" height="600" fill="#ffffff" />
        <rect x="600" width="300" height="600" fill="#ed2939" />
      </svg>
    )
  }
  
  function GermanyFlag() {
    return (
      <svg viewBox="0 0 900 600" className="w-full h-full">
        <rect width="900" height="200" fill="#000000" />
        <rect y="200" width="900" height="200" fill="#dd0000" />
        <rect y="400" width="900" height="200" fill="#ffce00" />
      </svg>
    )
  }
  
  function JapanFlag() {
    return (
      <svg viewBox="0 0 900 600" className="w-full h-full">
        <rect width="900" height="600" fill="#ffffff" />
        <circle cx="450" cy="300" r="180" fill="#bc002d" />
      </svg>
    )
  }
  
  function PortugalFlag() {
    return (
      <svg viewBox="0 0 600 400" className="w-full h-full">
        <rect width="600" height="400" fill="#f00" />
        <rect width="240" height="400" fill="#060" />
        <circle cx="240" cy="200" r="65" fill="#ff0" />
      </svg>
    )
  }
  
  function ChinaFlag() {
    return (
      <svg viewBox="0 0 900 600" className="w-full h-full">
        <rect width="900" height="600" fill="#de2910" />
        <g fill="#ffde00">
          <path d="M5,20 L30,60 L55,20 L30,40 Z" transform="translate(100, 60) scale(3)" />
          <path d="M30,5 L40,30 L55,40 L40,45 L30,60 L20,45 L5,40 L20,30 Z" transform="translate(200, 40) scale(1.5)" />
          <path d="M30,5 L40,30 L55,40 L40,45 L30,60 L20,45 L5,40 L20,30 Z" transform="translate(240, 80) scale(1.5)" />
          <path d="M30,5 L40,30 L55,40 L40,45 L30,60 L20,45 L5,40 L20,30 Z" transform="translate(240, 120) scale(1.5)" />
          <path d="M30,5 L40,30 L55,40 L40,45 L30,60 L20,45 L5,40 L20,30 Z" transform="translate(200, 160) scale(1.5)" />
        </g>
      </svg>
    )
  }

