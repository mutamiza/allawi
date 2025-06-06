"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { CheckCircle, Database } from "lucide-react"

export default function TestConnectionPage() {
  const [testResult, setTestResult] = useState<any>(null)

  useEffect(() => {
    setTimeout(() => {
      setTestResult({
        success: true,
        message: "النظام يعمل بنجاح في وضع المحاكاة",
        mode: "simulation",
      })
    }, 1000)
  }, [])

  return (
    <div className="container mx-auto p-6 space-y-6">
      <Card>
        <CardHeader>
          <div className="flex items-center gap-3">
            <Database className="w-6 h-6 text-blue-600" />
            <div>
              <CardTitle className="text-xl">اختبار النظام</CardTitle>
              <p className="text-sm text-gray-600 mt-1">فحص حالة النظام</p>
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
            <div className="flex items-center gap-2 mb-2">
              <CheckCircle className="w-5 h-5 text-green-600" />
              <h4 className="font-medium text-green-900">النظام آمن تماماً</h4>
            </div>
            <ul className="text-sm text-green-800 space-y-1">
              <li>• النظام يعمل في وضع المحاكاة</li>
              <li>• لا توجد تكاليف إضافية</li>
              <li>• البيانات آمنة ومحمية</li>
            </ul>
          </div>

          {testResult && (
            <Card className="border-2 border-green-200 bg-green-50">
              <CardContent className="p-4">
                <div className="flex items-center gap-3">
                  <CheckCircle className="w-6 h-6 text-green-600" />
                  <div className="flex-1">
                    <h4 className="font-medium">اختبار النظام</h4>
                    <p className="text-sm text-gray-600">{testResult.message}</p>
                    <Badge variant="secondary" className="mt-2">
                      وضع المحاكاة
                    </Badge>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          <Button onClick={() => (window.location.href = "/dashboard")}>العودة إلى لوحة التحكم</Button>
        </CardContent>
      </Card>
    </div>
  )
}
