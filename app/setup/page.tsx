"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { CheckCircle, AlertTriangle, ExternalLink, Copy, Settings, Database, Key, FileText } from "lucide-react"

export default function SetupPage() {
  const [copiedText, setCopiedText] = useState("")

  const copyToClipboard = (text: string, label: string) => {
    navigator.clipboard.writeText(text)
    setCopiedText(label)
    setTimeout(() => setCopiedText(""), 2000)
  }

  const envConfig = {
    sheetsId: process.env.NEXT_PUBLIC_GOOGLE_SHEETS_ID || "",
    apiKey: process.env.NEXT_PUBLIC_GOOGLE_API_KEY || "",
  }

  const isConfigured = !!(envConfig.sheetsId && envConfig.apiKey)

  return (
    <div className="container mx-auto p-6 space-y-6">
      <Card>
        <CardHeader>
          <div className="flex items-center gap-3">
            <Settings className="w-6 h-6 text-blue-600" />
            <div>
              <CardTitle className="text-xl">إعداد Google Sheets API</CardTitle>
              <p className="text-sm text-gray-600 mt-1">اتبع هذه الخطوات لربط النظام بـ Google Sheets</p>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {/* حالة الإعداد الحالية */}
          <div className="mb-6 p-4 rounded-lg border-2 border-dashed">
            <div className="flex items-center gap-3 mb-3">
              {isConfigured ? (
                <CheckCircle className="w-6 h-6 text-green-600" />
              ) : (
                <AlertTriangle className="w-6 h-6 text-yellow-600" />
              )}
              <h3 className="text-lg font-medium">{isConfigured ? "الإعداد مكتمل جزئياً" : "الإعداد غير مكتمل"}</h3>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="flex items-center justify-between p-3 bg-gray-50 rounded">
                <span className="text-sm">معرف جدول البيانات</span>
                <Badge variant={envConfig.sheetsId ? "default" : "destructive"}>
                  {envConfig.sheetsId ? "✓ موجود" : "✗ مفقود"}
                </Badge>
              </div>
              <div className="flex items-center justify-between p-3 bg-gray-50 rounded">
                <span className="text-sm">مفتاح Google API</span>
                <Badge variant={envConfig.apiKey ? "default" : "destructive"}>
                  {envConfig.apiKey ? "✓ موجود" : "✗ مفقود"}
                </Badge>
              </div>
            </div>

            {!isConfigured && (
              <div className="mt-4 p-3 bg-yellow-50 border border-yellow-200 rounded">
                <p className="text-sm text-yellow-800">
                  ⚠️ النظام يعمل حالياً في الوضع التجريبي. لاستخدام Google Sheets، يرجى إكمال الإعداد أدناه.
                </p>
              </div>
            )}
          </div>

          <Tabs defaultValue="overview" className="space-y-4">
            <TabsList className="grid grid-cols-4 w-full">
              <TabsTrigger value="overview">نظرة عامة</TabsTrigger>
              <TabsTrigger value="sheets">إنشاء الجدول</TabsTrigger>
              <TabsTrigger value="api">إعداد API</TabsTrigger>
              <TabsTrigger value="env">متغيرات البيئة</TabsTrigger>
            </TabsList>

            {/* نظرة عامة */}
            <TabsContent value="overview" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">ما تحتاجه للبدء</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="p-4 border rounded-lg">
                      <Database className="w-8 h-8 text-blue-600 mb-2" />
                      <h4 className="font-medium mb-1">Google Spreadsheet</h4>
                      <p className="text-sm text-gray-600">جدول بيانات في Google Sheets مع الأوراق المطلوبة</p>
                    </div>
                    <div className="p-4 border rounded-lg">
                      <Key className="w-8 h-8 text-green-600 mb-2" />
                      <h4 className="font-medium mb-1">Google API Key</h4>
                      <p className="text-sm text-gray-600">مفتاح API من Google Cloud Console</p>
                    </div>
                    <div className="p-4 border rounded-lg">
                      <FileText className="w-8 h-8 text-orange-600 mb-2" />
                      <h4 className="font-medium mb-1">متغيرات البيئة</h4>
                      <p className="text-sm text-gray-600">إضافة المعرفات إلى ملف .env.local</p>
                    </div>
                  </div>

                  <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                    <h4 className="font-medium text-blue-900 mb-2">الوقت المطلوب: 10-15 دقيقة</h4>
                    <p className="text-sm text-blue-800">
                      اتبع الخطوات في التبويبات التالية بالترتيب. إذا واجهت أي مشكلة، يمكنك الاستمرار في استخدام النظام
                      في الوضع التجريبي.
                    </p>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* إنشاء الجدول */}
            <TabsContent value="sheets" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">الخطوة 1: إنشاء Google Spreadsheet</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-3">
                    <div className="flex items-start gap-3">
                      <div className="w-6 h-6 rounded-full bg-blue-600 text-white text-sm flex items-center justify-center flex-shrink-0 mt-0.5">
                        1
                      </div>
                      <div>
                        <p className="font-medium">انتقل إلى Google Sheets</p>
                        <p className="text-sm text-gray-600">افتح Google Sheets وأنشئ جدول بيانات جديد</p>
                        <Button
                          variant="outline"
                          size="sm"
                          className="mt-2"
                          onClick={() => window.open("https://sheets.google.com", "_blank")}
                        >
                          <ExternalLink className="w-4 h-4 mr-2" />
                          فتح Google Sheets
                        </Button>
                      </div>
                    </div>

                    <div className="flex items-start gap-3">
                      <div className="w-6 h-6 rounded-full bg-blue-600 text-white text-sm flex items-center justify-center flex-shrink-0 mt-0.5">
                        2
                      </div>
                      <div>
                        <p className="font-medium">أنشئ الأوراق المطلوبة</p>
                        <p className="text-sm text-gray-600 mb-2">أنشئ الأوراق التالية بهذه الأسماء بالضبط:</p>
                        <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                          {["Contracts", "Payments", "Users"].map((sheet) => (
                            <div key={sheet} className="p-2 bg-gray-100 rounded text-sm font-mono">
                              {sheet}
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>

                    <div className="flex items-start gap-3">
                      <div className="w-6 h-6 rounded-full bg-blue-600 text-white text-sm flex items-center justify-center flex-shrink-0 mt-0.5">
                        3
                      </div>
                      <div>
                        <p className="font-medium">أضف العناوين</p>
                        <p className="text-sm text-gray-600 mb-2">أضف الصف الأول كعناوين في كل ورقة:</p>

                        <div className="space-y-3">
                          <div>
                            <p className="text-sm font-medium">ورقة Contracts:</p>
                            <div className="p-2 bg-gray-50 rounded text-xs font-mono overflow-x-auto">
                              Contract ID | Contract Name | Contract Number | Start Date | End Date | Total Rent Value |
                              Facilities Service Fees | Signage Fees | Rent Payment Period | Contract Status | Notes |
                              Created At | Updated At | Created By
                            </div>
                          </div>

                          <div>
                            <p className="text-sm font-medium">ورقة Payments:</p>
                            <div className="p-2 bg-gray-50 rounded text-xs font-mono overflow-x-auto">
                              Payment ID | Contract ID | Type | Amount | Payment Date | Due Date | Status | Payment
                              Method | Receipt Number | Notes | Created By | Created At | Updated At
                            </div>
                          </div>

                          <div>
                            <p className="text-sm font-medium">ورقة Users:</p>
                            <div className="p-2 bg-gray-50 rounded text-xs font-mono overflow-x-auto">
                              User ID | Username | Full Name | Email | Role | Permissions | Status | Last Login |
                              Created At
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="flex items-start gap-3">
                      <div className="w-6 h-6 rounded-full bg-blue-600 text-white text-sm flex items-center justify-center flex-shrink-0 mt-0.5">
                        4
                      </div>
                      <div>
                        <p className="font-medium">اجعل الجدول قابل للمشاركة</p>
                        <p className="text-sm text-gray-600">
                          اضغط على "مشاركة" واختر "أي شخص لديه الرابط" بصلاحية "مشاهد"
                        </p>
                      </div>
                    </div>

                    <div className="flex items-start gap-3">
                      <div className="w-6 h-6 rounded-full bg-blue-600 text-white text-sm flex items-center justify-center flex-shrink-0 mt-0.5">
                        5
                      </div>
                      <div>
                        <p className="font-medium">انسخ معرف الجدول</p>
                        <p className="text-sm text-gray-600">
                          انسخ الجزء من الرابط بين <code>/d/</code> و <code>/edit</code>
                        </p>
                        <div className="mt-2 p-2 bg-yellow-50 border border-yellow-200 rounded text-xs">
                          مثال: في الرابط <br />
                          <code>
                            https://docs.google.com/spreadsheets/d/
                            <strong>1BxiMVs0XRA5nFMdKvBdBZjgmUUqptlbs74OgvE2upms</strong>/edit
                          </code>
                          <br />
                          المعرف هو: <strong>1BxiMVs0XRA5nFMdKvBdBZjgmUUqptlbs74OgvE2upms</strong>
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* إعداد API */}
            <TabsContent value="api" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">الخطوة 2: إنشاء Google API Key</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-3">
                    <div className="flex items-start gap-3">
                      <div className="w-6 h-6 rounded-full bg-green-600 text-white text-sm flex items-center justify-center flex-shrink-0 mt-0.5">
                        1
                      </div>
                      <div>
                        <p className="font-medium">انتقل إلى Google Cloud Console</p>
                        <Button
                          variant="outline"
                          size="sm"
                          className="mt-2"
                          onClick={() => window.open("https://console.cloud.google.com", "_blank")}
                        >
                          <ExternalLink className="w-4 h-4 mr-2" />
                          فتح Google Cloud Console
                        </Button>
                      </div>
                    </div>

                    <div className="flex items-start gap-3">
                      <div className="w-6 h-6 rounded-full bg-green-600 text-white text-sm flex items-center justify-center flex-shrink-0 mt-0.5">
                        2
                      </div>
                      <div>
                        <p className="font-medium">أنشئ مشروع جديد أو اختر مشروع موجود</p>
                        <p className="text-sm text-gray-600">من القائمة العلوية، اختر مشروع أو أنشئ مشروع جديد</p>
                      </div>
                    </div>

                    <div className="flex items-start gap-3">
                      <div className="w-6 h-6 rounded-full bg-green-600 text-white text-sm flex items-center justify-center flex-shrink-0 mt-0.5">
                        3
                      </div>
                      <div>
                        <p className="font-medium">فعّل Google Sheets API</p>
                        <p className="text-sm text-gray-600 mb-2">
                          انتقل إلى "APIs & Services" > "Library" وابحث عن "Google Sheets API"
                        </p>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() =>
                            window.open("https://console.cloud.google.com/apis/library/sheets.googleapis.com", "_blank")
                          }
                        >
                          <ExternalLink className="w-4 h-4 mr-2" />
                          فتح Google Sheets API
                        </Button>
                      </div>
                    </div>

                    <div className="flex items-start gap-3">
                      <div className="w-6 h-6 rounded-full bg-green-600 text-white text-sm flex items-center justify-center flex-shrink-0 mt-0.5">
                        4
                      </div>
                      <div>
                        <p className="font-medium">أنشئ API Key</p>
                        <p className="text-sm text-gray-600">
                          انتقل إلى "Credentials" > "Create Credentials" > "API Key"
                        </p>
                      </div>
                    </div>

                    <div className="flex items-start gap-3">
                      <div className="w-6 h-6 rounded-full bg-green-600 text-white text-sm flex items-center justify-center flex-shrink-0 mt-0.5">
                        5
                      </div>
                      <div>
                        <p className="font-medium">قيّد API Key (مهم للأمان)</p>
                        <p className="text-sm text-gray-600">اضغط على "Restrict Key" واختر "Google Sheets API" فقط</p>
                      </div>
                    </div>

                    <div className="flex items-start gap-3">
                      <div className="w-6 h-6 rounded-full bg-green-600 text-white text-sm flex items-center justify-center flex-shrink-0 mt-0.5">
                        6
                      </div>
                      <div>
                        <p className="font-medium">انسخ API Key</p>
                        <p className="text-sm text-gray-600">احفظ المفتاح في مكان آمن - ستحتاجه في الخطوة التالية</p>
                      </div>
                    </div>
                  </div>

                  <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                    <h4 className="font-medium text-red-900 mb-2">⚠️ تنبيه أمني</h4>
                    <ul className="text-sm text-red-800 space-y-1">
                      <li>• لا تشارك API Key مع أي شخص</li>
                      <li>• قيّد استخدام المفتاح لـ Google Sheets API فقط</li>
                      <li>• راقب استخدام API في Google Cloud Console</li>
                    </ul>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* متغيرات البيئة */}
            <TabsContent value="env" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">الخطوة 3: إعداد متغيرات البيئة</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-3">
                    <div className="flex items-start gap-3">
                      <div className="w-6 h-6 rounded-full bg-orange-600 text-white text-sm flex items-center justify-center flex-shrink-0 mt-0.5">
                        1
                      </div>
                      <div>
                        <p className="font-medium">أنشئ ملف .env.local</p>
                        <p className="text-sm text-gray-600">
                          في مجلد المشروع الرئيسي، أنشئ ملف باسم <code>.env.local</code>
                        </p>
                      </div>
                    </div>

                    <div className="flex items-start gap-3">
                      <div className="w-6 h-6 rounded-full bg-orange-600 text-white text-sm flex items-center justify-center flex-shrink-0 mt-0.5">
                        2
                      </div>
                      <div className="flex-1">
                        <p className="font-medium">أضف المتغيرات</p>
                        <p className="text-sm text-gray-600 mb-2">انسخ المحتوى التالي إلى ملف .env.local:</p>

                        <div className="relative">
                          <pre className="bg-gray-900 text-gray-100 p-4 rounded-lg text-sm overflow-x-auto">
                            {`# Google Sheets Configuration
NEXT_PUBLIC_GOOGLE_SHEETS_ID=your_spreadsheet_id_here
NEXT_PUBLIC_GOOGLE_API_KEY=your_google_api_key_here`}
                          </pre>
                          <Button
                            variant="outline"
                            size="sm"
                            className="absolute top-2 right-2"
                            onClick={() =>
                              copyToClipboard(
                                `# Google Sheets Configuration
NEXT_PUBLIC_GOOGLE_SHEETS_ID=your_spreadsheet_id_here
NEXT_PUBLIC_GOOGLE_API_KEY=your_google_api_key_here`,
                                "env template",
                              )
                            }
                          >
                            <Copy className="w-4 h-4" />
                            {copiedText === "env template" ? "تم النسخ!" : "نسخ"}
                          </Button>
                        </div>
                      </div>
                    </div>

                    <div className="flex items-start gap-3">
                      <div className="w-6 h-6 rounded-full bg-orange-600 text-white text-sm flex items-center justify-center flex-shrink-0 mt-0.5">
                        3
                      </div>
                      <div>
                        <p className="font-medium">استبدل القيم</p>
                        <p className="text-sm text-gray-600">
                          استبدل <code>your_spreadsheet_id_here</code> و <code>your_google_api_key_here</code> بالقيم
                          الحقيقية
                        </p>
                      </div>
                    </div>

                    <div className="flex items-start gap-3">
                      <div className="w-6 h-6 rounded-full bg-orange-600 text-white text-sm flex items-center justify-center flex-shrink-0 mt-0.5">
                        4
                      </div>
                      <div>
                        <p className="font-medium">أعد تشغيل التطبيق</p>
                        <p className="text-sm text-gray-600">احفظ الملف وأعد تشغيل خادم التطوير</p>
                        <div className="mt-2 p-2 bg-gray-100 rounded text-sm font-mono">npm run dev</div>
                      </div>
                    </div>
                  </div>

                  <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                    <h4 className="font-medium text-green-900 mb-2">✅ بعد إكمال الإعداد</h4>
                    <p className="text-sm text-green-800 mb-2">
                      انتقل إلى صفحة اختبار الاتصال للتأكد من أن كل شيء يعمل بشكل صحيح:
                    </p>
                    <Button variant="outline" size="sm" onClick={() => (window.location.href = "/test-connection")}>
                      اختبار الاتصال
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>

          <div className="flex gap-4 pt-6 border-t">
            <Button onClick={() => (window.location.href = "/test-connection")}>اختبار الاتصال</Button>
            <Button variant="outline" onClick={() => (window.location.href = "/dashboard")}>
              العودة إلى لوحة التحكم
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
