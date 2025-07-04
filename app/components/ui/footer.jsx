import { Link } from "@remix-run/react"
import { Facebook, Twitter, Instagram, Linkedin, Youtube, Search, PinIcon as Pinterest } from "lucide-react"

export default function Footer() {
  return (
    <footer className="bg-[#f4f4f4] px-6 py-4">
      {/* App Store Badge */}
      <div className="bg-gray-100 py-8">
        <div className="max-w-6xl mx-auto px-4 flex flex-col md:flex-row justify-between items-center">
          <div>
            <Link href="#" className="inline-block">
              <img 
                src="/images/footer/shopify-badge.svg"
                alt="Available on Shopify App Store"
                width={160}
                height={48}
              />
            </Link>
          </div>

          <div className="flex flex-wrap gap-6 mt-6 md:mt-0">
            <Link href="#" className="text-gray-600 hover:text-gray-900 text-sm">
              Visit Website
            </Link>
            <Link href="#" className="text-gray-600 hover:text-gray-900 text-sm">
              API Docs
            </Link>
            <Link href="#" className="text-gray-600 hover:text-gray-900 text-sm">
              Release Notes
            </Link>
            <Link href="#" className="text-gray-600 hover:text-gray-900 text-sm">
              Privacy Policy
            </Link>
            <Link href="#" className="text-gray-600 hover:text-gray-900 text-sm">
              Terms of Service
            </Link>
          </div>

          <div className="flex gap-4 mt-6 md:mt-0">
            <Link href="#" className="text-gray-600 hover:text-gray-900">
              <Facebook className="h-5 w-5" />
            </Link>
            <Link href="#" className="text-gray-600 hover:text-gray-900">
              <Twitter className="h-5 w-5" />
            </Link>
            <Link href="#" className="text-gray-600 hover:text-gray-900">
              <Instagram className="h-5 w-5" />
            </Link>
            <Link href="#" className="text-gray-600 hover:text-gray-900">
              <Linkedin className="h-5 w-5" />
            </Link>
            <Link href="#" className="text-gray-600 hover:text-gray-900">
              <Youtube className="h-5 w-5" />
            </Link>
            <Link href="#" className="text-gray-600 hover:text-gray-900">
              <Pinterest className="h-5 w-5" />
            </Link>
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className="bg-gray-100 py-4 border-t">
        <div className="max-w-6xl mx-auto px-4 flex flex-col md:flex-row justify-between items-center text-sm text-gray-600">
          <div>© 2025 <strong>JewelsLab</strong>. All rights reserved.</div>
          <div>
          <div className="mt-4 flex flex-wrap justify-center gap-2">
               <div>
                  <p>Powered by</p>
               </div>
               <div className="flex items-center justify-center w-36 h-5">
                    <img src="/images/footer/parselab.svg" alt="logo"/>
                </div>
          </div>
          
            {/* Powered by <span className="font-bold">PAPERCLIP</span> */}
          </div>
          
        </div>
      </div>
    </footer>
  )
}
