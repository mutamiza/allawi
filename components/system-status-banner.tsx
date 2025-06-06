"use client"

import { useState, useEffect } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { AlertTriangle, X, Settings } from "lucide-react"
import { db } from "@/lib/google-sheets"

export function SystemStatusBanner() {
  const [systemStatus, setSystemStatus] = useState<any>(null)
  const [dismissed, setDismissed] = useState(false)

  useEffect(() => {
    const status = db.getSystemStatus()
    setSystemStatus(status)

    // تحقق من localStorage إذا كان المستخدم قد أخفى البانر
    const isDismissed = localStorage.getItem("system-status-dismissed") === "true"
    setDismissed(isDismissed)
  }, [])

  const handleDismiss = () => {
    setDismissed(true)
    localStorage.setItem("system-status-dismissed", "true")
  }

  // لا تظهر البانر إذا كان النظام متصل أو إذا تم إخفاؤه
  if (!systemStatus || systemStatus.mode === "connected" || dismissed) {
    return null
  }

  return (
    <Card className="border-yellow-200 bg-yellow-50 mb-6">
      <CardContent className="p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <AlertTriangle className="w-5 h-5 text-yellow-600" />
            <div>
              <div className="flex items-center gap-2">
                <span className="font-medium text-yellow-900">الوضع التجريبي نشط</span>
                <Badge className="bg-yellow-200 text-yellow-800">تجريبي</Badge>
              </div>
              <p className="text-sm text-yellow-800">
                النظام يعمل بالبيانات التجريبية. لاستخدام Google Sheets، يرجى إكمال الإعداد.
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm" onClick={() => (window.location.href = "/setup")}>
              <Settings className="w-4 h-4 mr-2" />
              إعداد Google Sheets
            </Button>
            <Button variant="ghost" size="sm" onClick={handleDismiss}>
              <X className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
