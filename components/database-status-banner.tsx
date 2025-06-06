"use client"

import { Alert, AlertDescription } from "@/components/ui/alert"
import { CheckCircle } from "lucide-react"

export function DatabaseStatusBanner() {
  return (
    <Alert className="mb-6 border-green-200 bg-green-50">
      <div className="flex items-center gap-3">
        <CheckCircle className="w-5 h-5 text-green-600" />
        <div>
          <h4 className="font-medium text-green-900">النظام آمن ومجاني</h4>
          <AlertDescription className="text-green-700">النظام يعمل في وضع المحاكاة - لا توجد تكاليف</AlertDescription>
        </div>
      </div>
    </Alert>
  )
}
