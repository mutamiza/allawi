"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { AlertCircle, CheckCircle, Copy, ExternalLink } from "lucide-react"

export default function ApiSetupGuidePage() {
  return (
    <div className="container mx-auto p-6 space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="text-2xl">دليل إعداد Google Sheets API</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 flex gap-3">
            <AlertCircle className="w-6 h-6 text-yellow-600 shrink-0" />
            <div>
              <h3 className="font-medium text-yellow-800 mb-1">ملاحظة مهمة</h3>
              <p className="text-yellow-700">
                يعمل النظام حالياً في وضع المحاكاة باستخدام بيانات تجريبية. لتفعيل الاتصال بـ Google Sheets، اتبع الخطوات
                أدناه.
              </p>
            </div>
          </div>

          <Tabs defaultValue="setup">
            <TabsList className="grid grid-cols-3 w-full">
              <TabsTrigger value="setup">إعداد API</TabsTrigger>
              <TabsTrigger value="sheets">إعداد جدول البيانات</TabsTrigger>
              <TabsTrigger value="env">متغيرات البيئة</TabsTrigger>
            </TabsList>

            {/* إعداد API */}
            <TabsContent value="setup" className="space-y-4 mt-4">
              <h3 className="text-xl font-medium">خطوات إعداد Google Sheets API</h3>

              <div className="space-y-6">
                <div className="border rounded-lg p-4 space-y-3">
                  <div className="flex items-center gap-2">
                    <div className="bg-blue-100 text-blue-800 rounded-full w-6 h-6 flex items-center justify-center font-medium">
                      1
                    </div>
                    <h4 className="font-medium">إنشاء مشروع في Google Cloud Console</h4>
                  </div>
                  <ol className="list-decimal list-inside space-y-2 mr-8">
                    <li>
                      انتقل إلى{" "}
                      <a
                        href="https://console.cloud.google.com"
                        target="_blank"
                        className="text-blue-600 hover:underline flex items-center gap-1 inline-flex"
                        rel="noreferrer"
                      >
                        Google Cloud Console <ExternalLink className="w-3 h-3" />
                      </a>
                    </li>
                    <li>انقر على "إنشاء مشروع" أو اختر مشروع موجود</li>
                    <li>أدخل اسم المشروع واضغط على "إنشاء"</li>
                  </ol>
                </div>

                <div className="border rounded-lg p-4 space-y-3">
                  <div className="flex items-center gap-2">
                    <div className="bg-blue-100 text-blue-800 rounded-full w-6 h-6 flex items-center justify-center font-medium">
                      2
                    </div>
                    <h4 className="font-medium">تفعيل Google Sheets API</h4>
                  </div>
                  <ol className="list-decimal list-inside space-y-2 mr-8">
                    <li>في لوحة التحكم، انتقل إلى "APIs & Services" > "Library"</li>
                    <li>ابحث عن "Google Sheets API"</li>
                    <li>انقر على "تفعيل"</li>
                  </ol>
                </div>

                <div className="border rounded-lg p-4 space-y-3">
                  <div className="flex items-center gap-2">
                    <div className="bg-blue-100 text-blue-800 rounded-full w-6 h-6 flex items-center justify-center font-medium">
                      3
                    </div>
                    <h4 className="font-medium">إنشاء مفتاح API</h4>
                  </div>
                  <ol className="list-decimal list-inside space-y-2 mr-8">
                    <li>انتقل إلى "APIs & Services" > "Credentials"</li>
                    <li>انقر على "Create Credentials" واختر "API key"</li>
                    <li>سيتم إنشاء مفتاح API جديد، انسخه</li>
                    <li>انقر على "تقييد المفتاح" لتحديد استخدامه لـ Google Sheets API فقط</li>
                  </ol>
                </div>
              </div>
            </TabsContent>

            {/* إعداد جدول البيانات */}
            <TabsContent value="sheets" className="space-y-4 mt-4">
              <h3 className="text-xl font-medium">إعداد جدول البيانات</h3>

              <div className="space-y-6">
                <div className="border rounded-lg p-4 space-y-3">
                  <div className="flex items-center gap-2">
                    <div className="bg-blue-100 text-blue-800 rounded-full w-6 h-6 flex items-center justify-center font-medium">
                      1
                    </div>
                    <h4 className="font-medium">إنشاء جدول بيانات جديد</h4>
                  </div>
                  <ol className="list-decimal list-inside space-y-2 mr-8">
                    <li>
                      انتقل إلى{" "}
                      <a
                        href="https://sheets.google.com"
                        target="_blank"
                        className="text-blue-600 hover:underline flex items-center gap-1 inline-flex"
                        rel="noreferrer"
                      >
                        Google Sheets <ExternalLink className="w-3 h-3" />
                      </a>
                    </li>
                    <li>أنشئ جدول بيانات جديد</li>
                    <li>انسخ معرف الجدول من الرابط (الجزء بين /d/ و /edit)</li>
                  </ol>
                </div>

                <div className="border rounded-lg p-4 space-y-3">
                  <div className="flex items-center gap-2">
                    <div className="bg-blue-100 text-blue-800 rounded-full w-6 h-6 flex items-center justify-center font-medium">
                      2
                    </div>
                    <h4 className="font-medium">إنشاء الأوراق المطلوبة</h4>
                  </div>
                  <p className="text-sm text-gray-600 mb-2">أنشئ الأوراق التالية بالأسماء الإنجليزية:</p>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="border rounded p-3">
                      <h5 className="font-medium mb-1">Contracts</h5>
                      <p className="text-xs text-gray-600">لبيانات العقود</p>
                    </div>
                    <div className="border rounded p-3">
                      <h5 className="font-medium mb-1">Payments</h5>
                      <p className="text-xs text-gray-600">لبيانات الدفعات</p>
                    </div>
                    <div className="border rounded p-3">
                      <h5 className="font-medium mb-1">Users</h5>
                      <p className="text-xs text-gray-600">لبيانات المستخدمين</p>
                    </div>
                  </div>
                </div>

                <div className="border rounded-lg p-4 space-y-3">
                  <div className="flex items-center gap-2">
                    <div className="bg-blue-100 text-blue-800 rounded-full w-6 h-6 flex items-center justify-center font-medium">
                      3
                    </div>
                    <h4 className="font-medium">إعداد الصلاحيات</h4>
                  </div>
                  <ol className="list-decimal list-inside space-y-2 mr-8">
                    <li>انقر على زر "مشاركة" في الزاوية العلوية اليمنى</li>
                    <li>غير الإعداد إلى "أي شخص لديه الرابط"</li>
                    <li>اضبط الصلاحية على "مشاهد"</li>
                    <li>انقر على "تم"</li>
                  </ol>
                </div>
              </div>
            </TabsContent>

            {/* متغيرات البيئة */}
            <TabsContent value="env" className="space-y-4 mt-4">
              <h3 className="text-xl font-medium">إعداد متغيرات البيئة</h3>

              <div className="space-y-6">
                <div className="border rounded-lg p-4 space-y-3">
                  <h4 className="font-medium">إضافة المتغيرات في Vercel</h4>
                  <ol className="list-decimal list-inside space-y-2">
                    <li>انتقل إلى لوحة تحكم Vercel</li>
                    <li>اختر مشروعك</li>
                    <li>انتقل إلى "Settings" > "Environment Variables"</li>
                    <li>أضف المتغيرات التالية:</li>
                  </ol>

                  <div className="space-y-3 mt-4">
                    <div className="bg-gray-50 rounded p-3">
                      <div className="flex items-center justify-between mb-2">
                        <span className="font-mono text-sm">NEXT_PUBLIC_GOOGLE_SHEETS_ID</span>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => navigator.clipboard.writeText("NEXT_PUBLIC_GOOGLE_SHEETS_ID")}
                        >
                          <Copy className="w-3 h-3" />
                        </Button>
                      </div>
                      <p className="text-xs text-gray-600">معرف جدول البيانات من الرابط</p>
                    </div>

                    <div className="bg-gray-50 rounded p-3">
                      <div className="flex items-center justify-between mb-2">
                        <span className="font-mono text-sm">NEXT_PUBLIC_GOOGLE_API_KEY</span>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => navigator.clipboard.writeText("NEXT_PUBLIC_GOOGLE_API_KEY")}
                        >
                          <Copy className="w-3 h-3" />
                        </Button>
                      </div>
                      <p className="text-xs text-gray-600">مفتاح API من Google Cloud Console</p>
                    </div>
                  </div>
                </div>

                <div className="bg-green-50 border border-green-200 rounded-lg p-4 flex gap-3">
                  <CheckCircle className="w-6 h-6 text-green-600 shrink-0" />
                  <div>
                    <h4 className="font-medium text-green-800 mb-1">اختبار الإعداد</h4>
                    <p className="text-green-700 mb-3">بعد إضافة المتغيرات وإعادة نشر المشروع، يمكنك اختبار الاتصال.</p>
                    <Button size="sm" onClick={() => (window.location.href = "/test-connection")}>
                      اختبار الاتصال
                    </Button>
                  </div>
                </div>
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  )
}
