"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Loader2, CheckCircle, XCircle, Database, Plus } from "lucide-react"
import { useDatabase } from "@/hooks/use-database"

export default function TestDatabasePage() {
  const {
    contracts,
    payments,
    users,
    dashboardStats,
    loading,
    error,
    testConnection,
    getSystemStatus,
    addContract,
    fetchAllData,
  } = useDatabase()

  const [connectionResult, setConnectionResult] = useState<any>(null)
  const [systemStatus, setSystemStatus] = useState<any>(null)
  const [testLoading, setTestLoading] = useState(false)

  // فحص البيانات قبل العرض
  const contractsLength = contracts?.length || 0
  const paymentsLength = payments?.length || 0
  const usersLength = users?.length || 0
  const totalRevenue = dashboardStats?.totalRevenue || 0

  const runConnectionTest = async () => {
    setTestLoading(true)
    try {
      const result = await testConnection()
      setConnectionResult(result)

      const status = getSystemStatus()
      setSystemStatus(status)
    } catch (err: any) {
      setConnectionResult({
        success: false,
        message: err.message,
      })
    } finally {
      setTestLoading(false)
    }
  }

  const addTestContract = async () => {
    try {
      const testContract = {
        contractName: "عقد تجريبي - " + new Date().toLocaleString("ar"),
        contractNumber: "TEST-" + Date.now(),
        startDate: new Date().toISOString().split("T")[0],
        endDate: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000).toISOString().split("T")[0],
        totalRentValue: 120000,
        facilitiesServiceFees: 5000,
        signageFees: 2000,
        rentPaymentPeriod: "شهري",
        contractStatus: "نشط",
        notes: "هذا عقد تجريبي لاختبار النظام",
        createdBy: "النظام",
      }

      await addContract(testContract)
      alert("تم إضافة العقد التجريبي بنجاح!")
    } catch (err: any) {
      alert("خطأ في إضافة العقد: " + err.message)
    }
  }

  useEffect(() => {
    runConnectionTest()
  }, [])

  return (
    <div className="container mx-auto p-6 space-y-6">
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Database className="w-6 h-6 text-blue-600" />
              <div>
                <CardTitle className="text-xl">اختبار قاعدة البيانات</CardTitle>
                <p className="text-sm text-gray-600 mt-1">اختبار الاتصال والوظائف الأساسية</p>
              </div>
            </div>
            <Button onClick={fetchAllData} disabled={loading}>
              {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : "تحديث البيانات"}
            </Button>
          </div>
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

          {/* نتيجة اختبار الاتصال */}
          {connectionResult && (
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
                      </div>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          {/* إحصائيات البيانات */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <Card>
              <CardContent className="p-4 text-center">
                <h3 className="text-2xl font-bold text-blue-600">{contractsLength}</h3>
                <p className="text-sm text-gray-600">العقود</p>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4 text-center">
                <h3 className="text-2xl font-bold text-green-600">{paymentsLength}</h3>
                <p className="text-sm text-gray-600">الدفعات</p>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4 text-center">
                <h3 className="text-2xl font-bold text-purple-600">{usersLength}</h3>
                <p className="text-sm text-gray-600">المستخدمين</p>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4 text-center">
                <h3 className="text-2xl font-bold text-orange-600">{totalRevenue.toLocaleString()}</h3>
                <p className="text-sm text-gray-600">إجمالي الإيرادات</p>
              </CardContent>
            </Card>
          </div>

          {/* رسائل الخطأ */}
          {error && (
            <Card className="border-2 border-red-200 bg-red-50">
              <CardContent className="p-4">
                <div className="flex items-center gap-3">
                  <XCircle className="w-6 h-6 text-red-600" />
                  <div>
                    <h4 className="font-medium text-red-900">خطأ في النظام</h4>
                    <p className="text-sm text-red-700">{error}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          {/* أزرار الاختبار */}
          <div className="flex gap-4 flex-wrap">
            <Button onClick={runConnectionTest} disabled={testLoading}>
              {testLoading ? (
                <>
                  <Loader2 className="w-4 h-4 ml-2 animate-spin" />
                  جاري الاختبار...
                </>
              ) : (
                "اختبار الاتصال"
              )}
            </Button>

            <Button onClick={addTestContract} disabled={loading} variant="outline">
              <Plus className="w-4 h-4 ml-2" />
              إضافة عقد تجريبي
            </Button>

            <Button variant="outline" onClick={() => (window.location.href = "/database-setup")}>
              إعداد قاعدة البيانات
            </Button>

            <Button variant="outline" onClick={() => (window.location.href = "/dashboard")}>
              العودة إلى لوحة التحكم
            </Button>
          </div>

          {/* عرض البيانات الحالية */}
          {contractsLength > 0 && (
            <div className="space-y-4">
              <h3 className="text-lg font-medium">العقود الحالية:</h3>
              <div className="space-y-2">
                {contracts.slice(0, 3).map((contract) => (
                  <Card key={contract.id} className="p-3">
                    <div className="flex justify-between items-center">
                      <div>
                        <h4 className="font-medium">{contract.contractName}</h4>
                        <p className="text-sm text-gray-600">رقم العقد: {contract.contractNumber}</p>
                      </div>
                      <Badge variant={contract.contractStatus === "نشط" ? "default" : "secondary"}>
                        {contract.contractStatus}
                      </Badge>
                    </div>
                  </Card>
                ))}
                {contractsLength > 3 && (
                  <p className="text-sm text-gray-600 text-center">... و {contractsLength - 3} عقود أخرى</p>
                )}
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
