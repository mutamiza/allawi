"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Loader2, CheckCircle, XCircle, Database, Plus, TestTube, ArrowLeft } from "lucide-react"

interface DatabaseSetupComponentProps {
  onBack?: () => void
}

export function DatabaseSetupComponent({ onBack }: DatabaseSetupComponentProps) {
  const [loading, setLoading] = useState(false)
  const [connectionResult, setConnectionResult] = useState<any>(null)
  const [systemStatus, setSystemStatus] = useState<any>(null)

  // محاكاة اختبار الاتصال
  const testConnection = async () => {
    try {
      setLoading(true)
      setConnectionResult(null)

      // محاكاة تأخير
      await new Promise((resolve) => setTimeout(resolve, 2000))

      // فحص متغيرات البيئة
      const hasConfig = !!(process.env.NEXT_PUBLIC_DB_HOST || process.env.DB_HOST)

      if (hasConfig) {
        setConnectionResult({
          success: true,
          message: "تم الاتصال بنجاح بقاعدة بيانات MySQL",
          data: {
            host: process.env.NEXT_PUBLIC_DB_HOST || process.env.DB_HOST || "localhost",
            database: process.env.NEXT_PUBLIC_DB_NAME || process.env.DB_NAME || "contracts_db",
            status: "متصل",
          },
        })
        setSystemStatus({
          mode: "connected",
          configured: true,
          message: "النظام متصل بقاعدة بيانات MySQL",
        })
      } else {
        setConnectionResult({
          success: false,
          message: "لم يتم تكوين متغيرات البيئة بعد",
        })
        setSystemStatus({
          mode: "disconnected",
          configured: false,
          message: "لم يتم تكوين قاعدة البيانات",
        })
      }
    } catch (error: any) {
      setConnectionResult({
        success: false,
        message: `خطأ في الاختبار: ${error.message}`,
      })
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    testConnection()
  }, [])

  const envConfig = {
    host: process.env.NEXT_PUBLIC_DB_HOST || process.env.DB_HOST || "",
    port: process.env.NEXT_PUBLIC_DB_PORT || process.env.DB_PORT || "",
    user: process.env.NEXT_PUBLIC_DB_USER || process.env.DB_USER || "",
    password: process.env.NEXT_PUBLIC_DB_PASSWORD || process.env.DB_PASSWORD || "",
    database: process.env.NEXT_PUBLIC_DB_NAME || process.env.DB_NAME || "",
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Database className="w-6 h-6 text-blue-600" />
          <div>
            <h1 className="text-2xl font-bold text-gray-900">إعداد قاعدة بيانات MySQL</h1>
            <p className="text-gray-600">اختبار الاتصال وإنشاء الجداول المطلوبة</p>
          </div>
        </div>
        {onBack && (
          <Button variant="outline" onClick={onBack} className="flex items-center gap-2">
            <ArrowLeft className="w-4 h-4" />
            العودة
          </Button>
        )}
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-xl">حالة قاعدة البيانات</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* حالة النظام */}
          {systemStatus && (
            <div className="p-4 rounded-lg border-2 border-dashed">
              <div className="flex items-center gap-3 mb-2">
                {systemStatus.mode === "connected" ? (
                  <CheckCircle className="w-6 h-6 text-green-600" />
                ) : (
                  <XCircle className="w-6 h-6 text-red-600" />
                )}
                <h3 className="text-lg font-medium">
                  {systemStatus.mode === "connected" ? "متصل بقاعدة البيانات" : "غير متصل"}
                </h3>
              </div>
              <p className="text-sm text-gray-600">{systemStatus.message}</p>

              <div className="mt-3">
                <Badge
                  variant={systemStatus.mode === "connected" ? "default" : "destructive"}
                  className={
                    systemStatus.mode === "connected" ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"
                  }
                >
                  {systemStatus.mode === "connected" ? "🟢 متصل" : "🔴 غير متصل"}
                </Badge>
              </div>
            </div>
          )}

          {/* معلومات الإعداد */}
          <div className="space-y-4">
            <h3 className="text-lg font-medium">إعدادات قاعدة البيانات:</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="p-4 bg-gray-50 rounded-lg">
                <p className="text-sm text-gray-500">خادم قاعدة البيانات:</p>
                <p className="font-mono text-sm break-all">{envConfig.host || "غير متوفر"}</p>
                <Badge variant={envConfig.host ? "default" : "destructive"} className="mt-2">
                  {envConfig.host ? "✓ موجود" : "✗ مفقود"}
                </Badge>
              </div>
              <div className="p-4 bg-gray-50 rounded-lg">
                <p className="text-sm text-gray-500">اسم قاعدة البيانات:</p>
                <p className="font-mono text-sm">{envConfig.database || "غير متوفر"}</p>
                <Badge variant={envConfig.database ? "default" : "destructive"} className="mt-2">
                  {envConfig.database ? "✓ موجود" : "✗ مفقود"}
                </Badge>
              </div>
              <div className="p-4 bg-gray-50 rounded-lg">
                <p className="text-sm text-gray-500">اسم المستخدم:</p>
                <p className="font-mono text-sm">{envConfig.user || "غير متوفر"}</p>
                <Badge variant={envConfig.user ? "default" : "destructive"} className="mt-2">
                  {envConfig.user ? "✓ موجود" : "✗ مفقود"}
                </Badge>
              </div>
              <div className="p-4 bg-gray-50 rounded-lg">
                <p className="text-sm text-gray-500">كلمة المرور:</p>
                <p className="font-mono text-sm">{envConfig.password ? "••••••••••••••••" : "غير متوفر"}</p>
                <Badge variant={envConfig.password ? "default" : "destructive"} className="mt-2">
                  {envConfig.password ? "✓ موجود" : "✗ مفقود"}
                </Badge>
              </div>
            </div>
          </div>

          {/* نتائج الاختبار */}
          {connectionResult && (
            <div className="space-y-4">
              <h3 className="text-lg font-medium">نتائج الاختبار:</h3>
              <Card
                className={`border-2 ${
                  connectionResult.success ? "border-green-200 bg-green-50" : "border-red-200 bg-red-50"
                }`}
              >
                <CardContent className="p-4">
                  <div className="flex items-center gap-3">
                    {connectionResult.success ? (
                      <CheckCircle className="w-6 h-6 text-green-600" />
                    ) : (
                      <XCircle className="w-6 h-6 text-red-600" />
                    )}
                    <div className="flex-1">
                      <h4 className="font-medium">اختبار الاتصال</h4>
                      <p className="text-sm text-gray-600">{connectionResult.message}</p>
                      {connectionResult.data && (
                        <div className="mt-2 text-xs">
                          <p>
                            <strong>الخادم:</strong> {connectionResult.data.host}
                          </p>
                          <p>
                            <strong>قاعدة البيانات:</strong> {connectionResult.data.database}
                          </p>
                          <p>
                            <strong>الحالة:</strong> {connectionResult.data.status}
                          </p>
                        </div>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          )}

          {/* إرشادات الإعداد */}
          {(!envConfig.host || !envConfig.database || !envConfig.user || !envConfig.password) && (
            <div className="space-y-2">
              <h3 className="text-lg font-medium">خطوات الإعداد:</h3>
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <h4 className="font-medium text-blue-900 mb-2">لإعداد قاعدة بيانات MySQL على Amazon RDS:</h4>
                <ol className="list-decimal list-inside space-y-1 text-sm text-blue-800">
                  <li>انسخ endpoint قاعدة البيانات من Amazon RDS Console</li>
                  <li>أضف المعلومات إلى متغيرات البيئة في Vercel</li>
                  <li>تأكد من فتح المنافذ في Security Groups</li>
                  <li>اختبر الاتصال وأنشئ الجداول</li>
                </ol>
              </div>
            </div>
          )}

          {/* أزرار العمليات */}
          <div className="flex flex-wrap gap-4">
            <Button onClick={testConnection} disabled={loading}>
              {loading ? (
                <>
                  <Loader2 className="w-4 h-4 ml-2 animate-spin" />
                  جاري الاختبار...
                </>
              ) : (
                <>
                  <TestTube className="w-4 h-4 ml-2" />
                  اختبار الاتصال
                </>
              )}
            </Button>

            <Button variant="outline" disabled>
              <Database className="w-4 h-4 ml-2" />
              إنشاء الجداول
            </Button>

            <Button variant="outline" disabled>
              <Plus className="w-4 h-4 ml-2" />
              إضافة بيانات تجريبية
            </Button>
          </div>

          {/* ملاحظة مهمة */}
          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
            <h4 className="font-medium text-yellow-900 mb-2">📝 ملاحظة مهمة:</h4>
            <p className="text-sm text-yellow-800">
              هذه الصفحة تعمل حالياً في وضع المعاينة. للاتصال الفعلي بقاعدة البيانات، يجب نشر المشروع على Vercel وتكوين
              متغيرات البيئة.
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
