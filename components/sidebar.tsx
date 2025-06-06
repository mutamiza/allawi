"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { Home, FileText, CreditCard, Users, Settings, BarChart3, HelpCircle, Bell, Menu, X } from "lucide-react"
import { useState } from "react"
import { cn } from "@/lib/utils"

export function Sidebar() {
  const pathname = usePathname()
  const [isOpen, setIsOpen] = useState(false)

  const toggleSidebar = () => {
    setIsOpen(!isOpen)
  }

  const navigation = [
    { name: "لوحة التحكم", href: "/", icon: Home },
    { name: "العقود", href: "/contracts", icon: FileText },
    { name: "الدفعات", href: "/payments", icon: CreditCard },
    { name: "المستخدمين", href: "/users", icon: Users },
    { name: "التقارير", href: "/reports", icon: BarChart3 },
    { name: "التنبيهات", href: "/notifications", icon: Bell },
    { name: "الإعدادات", href: "/settings", icon: Settings },
    { name: "المساعدة", href: "/help", icon: HelpCircle },
  ]

  return (
    <>
      {/* زر القائمة للشاشات الصغيرة */}
      <button onClick={toggleSidebar} className="fixed top-4 right-4 z-50 md:hidden bg-white p-2 rounded-md shadow-md">
        {isOpen ? <X size={24} /> : <Menu size={24} />}
      </button>

      {/* الشريط الجانبي */}
      <div
        className={cn(
          "fixed inset-y-0 right-0 z-40 w-64 bg-white shadow-lg transform transition-transform duration-300 ease-in-out md:translate-x-0",
          isOpen ? "translate-x-0" : "translate-x-full",
        )}
      >
        <div className="flex flex-col h-full">
          {/* رأس الشريط الجانبي */}
          <div className="flex items-center justify-center h-16 border-b">
            <h2 className="text-xl font-bold text-gray-800">نظام إدارة العقود</h2>
          </div>

          {/* قائمة التنقل */}
          <nav className="flex-1 px-2 py-4 space-y-1 overflow-y-auto">
            {navigation.map((item) => {
              const isActive = pathname === item.href
              return (
                <Link
                  key={item.name}
                  href={item.href}
                  className={cn(
                    "flex items-center px-4 py-3 text-sm font-medium rounded-md transition-colors",
                    isActive ? "bg-blue-100 text-blue-700" : "text-gray-700 hover:bg-gray-100 hover:text-gray-900",
                  )}
                  onClick={() => setIsOpen(false)}
                >
                  <item.icon className={cn("ml-3 h-5 w-5", isActive ? "text-blue-700" : "text-gray-500")} />
                  {item.name}
                </Link>
              )
            })}
          </nav>

          {/* تذييل الشريط الجانبي */}
          <div className="p-4 border-t">
            <div className="flex items-center">
              <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center text-white">
                <span className="text-sm font-medium">أ</span>
              </div>
              <div className="mr-3">
                <p className="text-sm font-medium text-gray-900">أحمد محمد</p>
                <p className="text-xs text-gray-500">مدير النظام</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}
