"use client"

import { useState } from "react"
import { Bell, Search } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"

export function Header() {
  const [notifications, setNotifications] = useState(3)

  return (
    <header className="bg-white border-b px-4 py-3 flex items-center justify-between">
      <div className="flex items-center">
        <h1 className="text-xl font-bold text-gray-800 hidden md:block">نظام إدارة عقود الاستثمار</h1>
      </div>

      <div className="flex items-center space-x-4 space-x-reverse">
        <div className="relative hidden md:block w-64">
          <Search className="absolute right-2 top-2.5 h-4 w-4 text-gray-500" />
          <Input placeholder="بحث..." className="pr-8" />
        </div>

        <div className="relative">
          <Button variant="ghost" size="icon" className="relative">
            <Bell className="h-5 w-5" />
            {notifications > 0 && (
              <Badge className="absolute -top-1 -left-1 h-5 w-5 flex items-center justify-center p-0 bg-red-500">
                {notifications}
              </Badge>
            )}
          </Button>
        </div>
      </div>
    </header>
  )
}
