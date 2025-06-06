"use client"

import { Alert, AlertDescription } from "@/components/ui/alert"
import { Shield } from "lucide-react"

export function SimulationModeAlert() {
  return (
    <Alert className="mb-6 border-blue-200 bg-blue-50">
      <Shield className="h-4 w-4" />
      <div className="flex-1">
        <AlertDescription>النظام يعمل في وضع المحاكاة الآمن مع بيانات تجريبية</AlertDescription>
      </div>
    </Alert>
  )
}
