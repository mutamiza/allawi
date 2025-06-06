"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Users, FileText, Bell, TrendingUp, AlertTriangle, CheckCircle, Clock, DollarSign, Loader2 } from "lucide-react"
import { Sidebar } from "@/components/sidebar"
import { ContractsTable } from "@/components/contracts-table"
import { PaymentsTable } from "@/components/payments-table"
import { UsersTable } from "@/components/users-table"
import { NotificationsPanel } from "@/components/notifications-panel"
import { NotificationsSettings } from "@/components/notifications-settings"
import { useDatabase } from "@/hooks/use-database"
import type { Contract, Payment, User } from "@/lib/database-mock"

export default function Dashboard() {
  const [activeTab, setActiveTab] = useState("overview")
  const [contracts, setContracts] = useState<Contract[]>([])
  const [payments, setPayments] = useState<Payment[]>([])
  const [users, setUsers] = useState<User[]>([])
  const [stats, setStats] = useState({
    totalContracts: 0,
    activeContracts: 0,
    totalUsers: 0,
    pendingPayments: 0,
    overduePayments: 0,
    expiringContracts: 0,
    totalRevenue: 0,
  })
  const [notifications, setNotifications] = useState<any[]>([])
  const [systemStatus, setSystemStatus] = useState({
    mode: "loading",
    configured: false,
    message: "جاري التحقق من حالة النظام...",
  })
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const database = useDatabase()

  // تحميل البيانات عند بدء تشغيل المكون
  useEffect(() => {
    loadAllData()
  }, [])

  const loadAllData = async () => {
    try {
      setLoading(true)
      setError(null)

      // تحميل حالة النظام
      const status = await database.getSystemStatus()
      setSystemStatus(status)

      // تحميل البيانات بشكل متوازي
      const [contractsData, paymentsData, usersData, statsData, notificationsData] = await Promise.all([
        database.getContracts().catch(() => []),
        database.getPayments().catch(() => []),
        database.getUsers().catch(() => []),
        database.getDashboardStats().catch(() => ({
          totalContracts: 0,
          activeContracts: 0,
          totalUsers: 0,
          pendingPayments: 0,
          overduePayments: 0,
          expiringContracts: 0,
          totalRevenue: 0,
        })),
        database.getActiveNotifications().catch(() => []),
      ])

      setContracts(contractsData)
      setPayments(paymentsData)
      setUsers(usersData)
      setStats(statsData)
      setNotifications(notificationsData)
    } catch (err: any) {
      console.error("خطأ في تحميل البيانات:", err)
      setError(err.message || "خطأ في تحميل البيانات")
    } finally {
      setLoading(false)
    }
  }

  // إعادة تحميل البيانات
  const refreshData = () => {
    loadAllData()
  }

  const renderContent = () => {
    switch (activeTab) {
      case "contracts":
        return <ContractsTable contracts={contracts} onRefresh={refreshData} />
      case "payments":
        return <PaymentsTable payments={payments} contracts={contracts} onRefresh={refreshData} />
      case "users":
        return <UsersTable users={users} onRefresh={refreshData} />
      case "notifications":
        return <NotificationsPanel notifications={notifications} />
      case "notifications-settings":
        return <NotificationsSettings />
      default:
        return (
          <div className="space-y-6">
            {/* بانر حالة النظام */}
            <Card
              className={`border-2 ${
                systemStatus.mode === "connected"
                  ? "border-green-200 bg-green-50"
                  : systemStatus.mode === "simulation"
                    ? "border-blue-200 bg-blue-50"
                    : "border-red-200 bg-red-50"
              }`}
            >
              <CardHeader className="pb-2">
                <CardTitle
                  className={`text-lg flex items-center gap-2 ${
                    systemStatus.mode === "connected"
                      ? "text-green-700"
                      : systemStatus.mode === "simulation"
                        ? "text-blue-700"
                        : "text-red-700"
                  }`}
                >
                  {systemStatus.mode === "connected" ? (
                    <CheckCircle className="w-5 h-5" />
                  ) : systemStatus.mode === "simulation" ? (
                    <Clock className="w-5 h-5" />
                  ) : (
                    <AlertTriangle className="w-5 h-5" />
                  )}
                  حالة النظام
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center justify-between">
                  <span className="text-sm">{systemStatus.message}</span>
                  <Badge
                    className={
                      systemStatus.mode === "connected"
                        ? "bg-green-500 text-white"
                        : systemStatus.mode === "simulation"
                          ? "bg-blue-500 text-white"
                          : "bg-red-500 text-white"
                    }
                  >
                    {systemStatus.mode === "connected" ? "متصل" : systemStatus.mode === "simulation" ? "محاكاة" : "خطأ"}
                  </Badge>
                </div>
              </CardContent>
            </Card>

            {/* تنبيهات سريعة */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Card className="border-red-200 bg-red-50">
                <CardHeader className="pb-2">
                  <CardTitle className="text-lg flex items-center gap-2 text-red-700">
                    <AlertTriangle className="w-5 h-5" />
                    تنبيهات عاجلة
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-sm">عقود تنتهي خلال أسبوع</span>
                      <Badge className="bg-red-500 text-white">{stats.expiringContracts}</Badge>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm">دفعات متأخرة</span>
                      <Badge className="bg-red-500 text-white">{stats.overduePayments}</Badge>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="border-yellow-200 bg-yellow-50">
                <CardHeader className="pb-2">
                  <CardTitle className="text-lg flex items-center gap-2 text-yellow-700">
                    <Clock className="w-5 h-5" />
                    تنبيهات قادمة
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-sm">دفعات معلقة</span>
                      <Badge className="bg-yellow-500 text-white">{stats.pendingPayments}</Badge>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm">عقود تحتاج مراجعة</span>
                      <Badge className="bg-yellow-500 text-white">
                        {contracts.filter((c) => c.contractStatus === "قيد المراجعة").length}
                      </Badge>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* إحصائيات سريعة */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">إجمالي العقود</CardTitle>
                  <FileText className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{stats.totalContracts}</div>
                  <p className="text-xs text-muted-foreground">
                    <span className="text-green-600">+{stats.totalContracts - stats.activeContracts}</span> عقد غير نشط
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">العقود النشطة</CardTitle>
                  <CheckCircle className="h-4 w-4 text-green-600" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{stats.activeContracts}</div>
                  <p className="text-xs text-muted-foreground">
                    {stats.totalContracts > 0 ? ((stats.activeContracts / stats.totalContracts) * 100).toFixed(1) : 0}%
                    من إجمالي العقود
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">المستخدمين</CardTitle>
                  <Users className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{stats.totalUsers}</div>
                  <p className="text-xs text-muted-foreground">
                    <span className="text-blue-600">نشط</span> في النظام
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">الدفعات المعلقة</CardTitle>
                  <Clock className="h-4 w-4 text-orange-600" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{stats.pendingPayments}</div>
                  <p className="text-xs text-muted-foreground">تحتاج إلى مراجعة</p>
                </CardContent>
              </Card>
            </div>

            {/* الإيرادات والنمو */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <DollarSign className="h-5 w-5" />
                    إجمالي الإيرادات
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold text-green-600">{stats.totalRevenue.toLocaleString()} ر.س</div>
                  <div className="flex items-center gap-2 mt-2">
                    <TrendingUp className="h-4 w-4 text-green-600" />
                    <span className="text-sm text-green-600">من الدفعات المحصلة</span>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <AlertTriangle className="h-5 w-5" />
                    التنبيهات الحديثة
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  {notifications.slice(0, 3).map((notification, index) => (
                    <div key={index} className="flex items-center justify-between">
                      <span className="text-sm">{notification.title}</span>
                      <Badge variant={notification.priority === "high" ? "destructive" : "secondary"}>
                        {notification.priority === "high" ? "عاجل" : "متوسط"}
                      </Badge>
                    </div>
                  ))}

                  {notifications.length === 0 && (
                    <div className="text-center py-4">
                      <p className="text-gray-500 text-sm">لا توجد تنبيهات حالياً</p>
                    </div>
                  )}

                  <Button
                    variant="outline"
                    size="sm"
                    className="w-full mt-3"
                    onClick={() => setActiveTab("notifications")}
                  >
                    عرض جميع التنبيهات
                  </Button>
                </CardContent>
              </Card>
            </div>
          </div>
        )
    }
  }

  const unreadNotifications = notifications.filter((n) => !n.isRead).length

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <Loader2 className="w-8 h-8 animate-spin mx-auto mb-4" />
          <p>جاري تحميل النظام...</p>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <AlertTriangle className="w-8 h-8 text-red-500 mx-auto mb-4" />
          <p className="text-red-600">خطأ في تحميل النظام: {error}</p>
          <Button onClick={refreshData} className="mt-4">
            إعادة المحاولة
          </Button>
        </div>
      </div>
    )
  }

  return (
    <div className="flex flex-row h-screen bg-gray-50">
      {/* القائمة الجانبية في اليسار */}
      <Sidebar activeTab={activeTab} setActiveTab={setActiveTab} />

      {/* المحتوى الرئيسي */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Header */}
        <header className="bg-white shadow-sm border-b px-6 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">
                {activeTab === "overview" && "نظرة عامة"}
                {activeTab === "contracts" && "إدارة العقود"}
                {activeTab === "payments" && "إدارة الدفعات"}
                {activeTab === "users" && "إدارة المستخدمين"}
                {activeTab === "notifications" && "التنبيهات"}
                {activeTab === "notifications-settings" && "إعدادات التنبيهات"}
              </h1>
              <p className="text-gray-600 text-sm mt-1">مرحباً بك في نظام إدارة العقود الاستثمارية</p>
            </div>
            <div className="flex items-center gap-4">
              <Button variant="outline" size="sm" onClick={() => setActiveTab("notifications")}>
                <Bell className="h-4 w-4 mr-2" />
                التنبيهات
                {unreadNotifications > 0 && <Badge className="ml-2 bg-red-500">{unreadNotifications}</Badge>}
              </Button>
              <Button variant="outline" size="sm" onClick={refreshData}>
                <TrendingUp className="h-4 w-4 mr-2" />
                تحديث البيانات
              </Button>
              <div className="text-right">
                <p className="text-sm font-medium">أحمد محمد</p>
                <p className="text-xs text-gray-500">مدير النظام</p>
              </div>
            </div>
          </div>
        </header>

        {/* Main Content */}
        <main className="flex-1 overflow-auto p-6">{renderContent()}</main>
      </div>
    </div>
  )
}
