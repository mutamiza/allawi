"use client"

import { Alert, AlertDescription } from "@/components/ui/alert"
import { CheckCircle, DollarSign } from "lucide-react"

export function SystemSafetyBanner() {
  return (
    <Alert className="mb-6 border-green-200 bg-green-50">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <CheckCircle className="w-5 h-5 text-green-600" />
          <div>
            <h4 className="font-medium text-green-900">النظام آمن ومجاني تماماً</h4>
            <AlertDescription className="text-green-700">يعمل بدون تكاليف في وضع المحاكاة</AlertDescription>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <DollarSign className="w-4 h-4 text-green-600" />
          <span className="text-sm font-medium text-green-800">0 ر.س</span>
        </div>
      </div>
    </Alert>
  )
}
