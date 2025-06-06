"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Bell, Calendar, AlertTriangle, Clock, CheckCircle, X, Settings, Mail, Smartphone } from "lucide-react"

interface Notification {
  id: string
  type: "contract_expiry" | "payment_due" | "contract_renewal" | "overdue_payment"
  title: string
  message: string
  contractId: string
  contractName: string
  priority: "high" | "medium" | "low"
  dueDate: string
  daysRemaining: number
  isRead: boolean
  createdAt: string
}

interface NotificationSettings {
  contractExpiry: {
    enabled: boolean
    daysBeforeExpiry: number[]
    emailEnabled: boolean
    smsEnabled: boolean
  }
  paymentDue: {
    enabled: boolean
    daysBeforeDue: number[]
    emailEnabled: boolean
    smsEnabled: boolean
  }
  overduePayments: {
    enabled: boolean
    checkFrequency: "daily" | "weekly"
    emailEnabled: boolean
    smsEnabled: boolean
  }
}

export function NotificationsSystem() {
  const [notifications, setNotifications] = useState<Notification[]>([
    {
      id: "n1",
      type: "contract_expiry",
      title: "عقد ينتهي قريباً",
      message: "عقد إيجار مجمع الرياض التجاري ينتهي خلال 7 أيام",
      contractId: "C001",
      contractName: "عقد إيجار مجمع الرياض التجاري",
      priority: "high",
      dueDate: "2024-01-22",
      daysRemaining: 7,
      isRead: false,
      createdAt: "2024-01-15",
    },
    {
      id: "n2",
      type: "payment_due",
      title: "دفعة مستحقة",
      message: "دفعة ربع سنوية مستحقة لعقد مكاتب جدة خلال 3 أيام",
      contractId: "C002",
      contractName: "عقد إيجار مكاتب جدة",
      priority: "medium",
      dueDate: "2024-01-18",
      daysRemaining: 3,
      isRead: false,
      createdAt: "2024-01-15",
    },
    {
      id: "n3",
      type: "overdue_payment",
      title: "دفعة متأخرة",
      message: "دفعة شهرية متأخرة لعقد مصنع الدمام بـ 5 أيام",
      contractId: "C003",
      contractName: "عقد إيجار مصنع الدمام",
      priority: "high",
      dueDate: "2024-01-10",
      daysRemaining: -5,
      isRead: true,
      createdAt: "2024-01-11",
    },
    {
      id: "n4",
      type: "contract_renewal",
      title: "عقد يحتاج تجديد",
      message: "عقد معرض المدينة يحتاج إلى تجديد خلال 30 يوم",
      contractId: "C004",
      contractName: "عقد إيجار معرض المدينة",
      priority: "medium",
      dueDate: "2024-02-15",
      daysRemaining: 30,
      isRead: false,
      createdAt: "2024-01-15",
    },
  ])

  const [settings, setSettings] = useState<NotificationSettings>({
    contractExpiry: {
      enabled: true,
      daysBeforeExpiry: [30, 15, 7, 3, 1],
      emailEnabled: true,
      smsEnabled: false,
    },
    paymentDue: {
      enabled: true,
      daysBeforeDue: [7, 3, 1],
      emailEnabled: true,
      smsEnabled: true,
    },
    overduePayments: {
      enabled: true,
      checkFrequency: "daily",
      emailEnabled: true,
      smsEnabled: true,
    },
  })

  const [activeTab, setActiveTab] = useState("notifications")

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "high":
        return "bg-red-100 text-red-800 border-red-200"
      case "medium":
        return "bg-yellow-100 text-yellow-800 border-yellow-200"
      case "low":
        return "bg-blue-100 text-blue-800 border-blue-200"
      default:
        return "bg-gray-100 text-gray-800 border-gray-200"
    }
  }

  const getTypeIcon = (type: string) => {
    switch (type) {
      case "contract_expiry":
        return <Calendar className="w-5 h-5 text-red-600" />
      case "payment_due":
        return <Clock className="w-5 h-5 text-yellow-600" />
      case "overdue_payment":
        return <AlertTriangle className="w-5 h-5 text-red-600" />
      case "contract_renewal":
        return <CheckCircle className="w-5 h-5 text-blue-600" />
      default:
        return <Bell className="w-5 h-5 text-gray-600" />
    }
  }

  const getTypeName = (type: string) => {
    switch (type) {
      case "contract_expiry":
        return "انتهاء عقد"
      case "payment_due":
        return "دفعة مستحقة"
      case "overdue_payment":
        return "دفعة متأخرة"
      case "contract_renewal":
        return "تجديد عقد"
      default:
        return "تنبيه"
    }
  }

  const markAsRead = (notificationId: string) => {
    setNotifications(notifications.map((n) => (n.id === notificationId ? { ...n, isRead: true } : n)))
  }

  const markAllAsRead = () => {
    setNotifications(notifications.map((n) => ({ ...n, isRead: true })))
  }

  const deleteNotification = (notificationId: string) => {
    setNotifications(notifications.filter((n) => n.id !== notificationId))
  }

  const unreadCount = notifications.filter((n) => !n.isRead).length
  const highPriorityCount = notifications.filter((n) => n.priority === "high" && !n.isRead).length

  const updateSettings = (category: keyof NotificationSettings, field: string, value: any) => {
    setSettings((prev) => ({
      ...prev,
      [category]: {
        ...prev[category],
        [field]: value,
      },
    }))
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <CardTitle className="text-xl">نظام التنبيهات</CardTitle>
              {unreadCount > 0 && <Badge className="bg-red-500 text-white">{unreadCount} غير مقروء</Badge>}
              {highPriorityCount > 0 && <Badge className="bg-orange-500 text-white">{highPriorityCount} عاجل</Badge>}
            </div>
            <div className="flex gap-2">
              <Button variant="outline" size="sm" onClick={markAllAsRead}>
                تحديد الكل كمقروء
              </Button>
              <Button variant="outline" size="sm">
                <Settings className="w-4 h-4 mr-2" />
                الإعدادات
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="grid grid-cols-3 w-full">
              <TabsTrigger value="notifications">التنبيهات</TabsTrigger>
              <TabsTrigger value="calendar">التقويم</TabsTrigger>
              <TabsTrigger value="settings">الإعدادات</TabsTrigger>
            </TabsList>

            {/* قائمة التنبيهات */}
            <TabsContent value="notifications" className="space-y-4 mt-6">
              {notifications.length === 0 ? (
                <div className="text-center py-8">
                  <Bell className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                  <p className="text-gray-500">لا توجد تنبيهات حالياً</p>
                </div>
              ) : (
                <div className="space-y-3">
                  {notifications.map((notification) => (
                    <Card
                      key={notification.id}
                      className={`${!notification.isRead ? "border-blue-200 bg-blue-50" : "bg-white"} transition-all hover:shadow-md`}
                    >
                      <CardContent className="p-4">
                        <div className="flex items-start justify-between">
                          <div className="flex items-start gap-3 flex-1">
                            <div className="mt-1">{getTypeIcon(notification.type)}</div>
                            <div className="flex-1">
                              <div className="flex items-center gap-2 mb-1">
                                <h4 className="font-medium text-gray-900">{notification.title}</h4>
                                <Badge className={getPriorityColor(notification.priority)}>
                                  {notification.priority === "high"
                                    ? "عاجل"
                                    : notification.priority === "medium"
                                      ? "متوسط"
                                      : "منخفض"}
                                </Badge>
                                <Badge variant="outline" className="text-xs">
                                  {getTypeName(notification.type)}
                                </Badge>
                                {!notification.isRead && <div className="w-2 h-2 bg-blue-600 rounded-full"></div>}
                              </div>
                              <p className="text-gray-600 text-sm mb-2">{notification.message}</p>
                              <div className="flex items-center gap-4 text-xs text-gray-500">
                                <span>العقد: {notification.contractName}</span>
                                <span>•</span>
                                <span>التاريخ المستهدف: {notification.dueDate}</span>
                                <span>•</span>
                                <span
                                  className={
                                    notification.daysRemaining < 0
                                      ? "text-red-600 font-medium"
                                      : notification.daysRemaining <= 3
                                        ? "text-orange-600 font-medium"
                                        : ""
                                  }
                                >
                                  {notification.daysRemaining < 0
                                    ? `متأخر بـ ${Math.abs(notification.daysRemaining)} يوم`
                                    : `${notification.daysRemaining} يوم متبقي`}
                                </span>
                              </div>
                            </div>
                          </div>
                          <div className="flex items-center gap-2">
                            {!notification.isRead && (
                              <Button variant="ghost" size="sm" onClick={() => markAsRead(notification.id)}>
                                <CheckCircle className="w-4 h-4" />
                              </Button>
                            )}
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => deleteNotification(notification.id)}
                              className="text-red-600 hover:bg-red-50"
                            >
                              <X className="w-4 h-4" />
                            </Button>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              )}
            </TabsContent>

            {/* تقويم التنبيهات */}
            <TabsContent value="calendar" className="space-y-4 mt-6">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                <Card className="border-red-200">
                  <CardHeader className="pb-2">
                    <CardTitle className="text-lg flex items-center gap-2 text-red-600">
                      <AlertTriangle className="w-5 h-5" />
                      عقود تنتهي هذا الأسبوع
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2">
                      {notifications
                        .filter((n) => n.type === "contract_expiry" && n.daysRemaining <= 7)
                        .map((n) => (
                          <div key={n.id} className="text-sm">
                            <p className="font-medium">{n.contractName}</p>
                            <p className="text-gray-500">{n.dueDate}</p>
                          </div>
                        ))}
                    </div>
                  </CardContent>
                </Card>

                <Card className="border-yellow-200">
                  <CardHeader className="pb-2">
                    <CardTitle className="text-lg flex items-center gap-2 text-yellow-600">
                      <Clock className="w-5 h-5" />
                      دفعات مستحقة قريباً
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2">
                      {notifications
                        .filter((n) => n.type === "payment_due" && n.daysRemaining <= 7)
                        .map((n) => (
                          <div key={n.id} className="text-sm">
                            <p className="font-medium">{n.contractName}</p>
                            <p className="text-gray-500">{n.dueDate}</p>
                          </div>
                        ))}
                    </div>
                  </CardContent>
                </Card>

                <Card className="border-blue-200">
                  <CardHeader className="pb-2">
                    <CardTitle className="text-lg flex items-center gap-2 text-blue-600">
                      <CheckCircle className="w-5 h-5" />
                      عقود تحتاج تجديد
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2">
                      {notifications
                        .filter((n) => n.type === "contract_renewal")
                        .map((n) => (
                          <div key={n.id} className="text-sm">
                            <p className="font-medium">{n.contractName}</p>
                            <p className="text-gray-500">{n.dueDate}</p>
                          </div>
                        ))}
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            {/* إعدادات التنبيهات */}
            <TabsContent value="settings" className="space-y-6 mt-6">
              <div className="space-y-6">
                {/* إعدادات انتهاء العقود */}
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg flex items-center gap-2">
                      <Calendar className="w-5 h-5 text-blue-600" />
                      تنبيهات انتهاء العقود
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="flex items-center justify-between">
                      <Label htmlFor="contract-expiry-enabled">تفعيل تنبيهات انتهاء العقود</Label>
                      <Switch
                        id="contract-expiry-enabled"
                        checked={settings.contractExpiry.enabled}
                        onCheckedChange={(checked) => updateSettings("contractExpiry", "enabled", checked)}
                      />
                    </div>

                    <div className="space-y-2">
                      <Label>التنبيه قبل انتهاء العقد بـ (أيام)</Label>
                      <div className="flex flex-wrap gap-2">
                        {[30, 15, 7, 3, 1].map((days) => (
                          <Badge
                            key={days}
                            variant={settings.contractExpiry.daysBeforeExpiry.includes(days) ? "default" : "outline"}
                            className="cursor-pointer"
                          >
                            {days} يوم
                          </Badge>
                        ))}
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div className="flex items-center space-x-2">
                        <Switch
                          id="contract-email"
                          checked={settings.contractExpiry.emailEnabled}
                          onCheckedChange={(checked) => updateSettings("contractExpiry", "emailEnabled", checked)}
                        />
                        <Label htmlFor="contract-email" className="flex items-center gap-2">
                          <Mail className="w-4 h-4" />
                          تنبيه بالبريد الإلكتروني
                        </Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Switch
                          id="contract-sms"
                          checked={settings.contractExpiry.smsEnabled}
                          onCheckedChange={(checked) => updateSettings("contractExpiry", "smsEnabled", checked)}
                        />
                        <Label htmlFor="contract-sms" className="flex items-center gap-2">
                          <Smartphone className="w-4 h-4" />
                          تنبيه برسالة نصية
                        </Label>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* إعدادات الدفعات المستحقة */}
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg flex items-center gap-2">
                      <Clock className="w-5 h-5 text-yellow-600" />
                      تنبيهات الدفعات المستحقة
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="flex items-center justify-between">
                      <Label htmlFor="payment-due-enabled">تفعيل تنبيهات الدفعات المستحقة</Label>
                      <Switch
                        id="payment-due-enabled"
                        checked={settings.paymentDue.enabled}
                        onCheckedChange={(checked) => updateSettings("paymentDue", "enabled", checked)}
                      />
                    </div>

                    <div className="space-y-2">
                      <Label>التنبيه قبل موعد الدفع بـ (أيام)</Label>
                      <div className="flex flex-wrap gap-2">
                        {[7, 3, 1].map((days) => (
                          <Badge
                            key={days}
                            variant={settings.paymentDue.daysBeforeDue.includes(days) ? "default" : "outline"}
                            className="cursor-pointer"
                          >
                            {days} يوم
                          </Badge>
                        ))}
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div className="flex items-center space-x-2">
                        <Switch
                          id="payment-email"
                          checked={settings.paymentDue.emailEnabled}
                          onCheckedChange={(checked) => updateSettings("paymentDue", "emailEnabled", checked)}
                        />
                        <Label htmlFor="payment-email" className="flex items-center gap-2">
                          <Mail className="w-4 h-4" />
                          تنبيه بالبريد الإلكتروني
                        </Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Switch
                          id="payment-sms"
                          checked={settings.paymentDue.smsEnabled}
                          onCheckedChange={(checked) => updateSettings("paymentDue", "smsEnabled", checked)}
                        />
                        <Label htmlFor="payment-sms" className="flex items-center gap-2">
                          <Smartphone className="w-4 h-4" />
                          تنبيه برسالة نصية
                        </Label>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* إعدادات الدفعات المتأخرة */}
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg flex items-center gap-2">
                      <AlertTriangle className="w-5 h-5 text-red-600" />
                      تنبيهات الدفعات المتأخرة
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="flex items-center justify-between">
                      <Label htmlFor="overdue-enabled">تفعيل تنبيهات الدفعات المتأخرة</Label>
                      <Switch
                        id="overdue-enabled"
                        checked={settings.overduePayments.enabled}
                        onCheckedChange={(checked) => updateSettings("overduePayments", "enabled", checked)}
                      />
                    </div>

                    <div className="space-y-2">
                      <Label>تكرار فحص الدفعات المتأخرة</Label>
                      <Select
                        value={settings.overduePayments.checkFrequency}
                        onValueChange={(value) => updateSettings("overduePayments", "checkFrequency", value)}
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="daily">يومياً</SelectItem>
                          <SelectItem value="weekly">أسبوعياً</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div className="flex items-center space-x-2">
                        <Switch
                          id="overdue-email"
                          checked={settings.overduePayments.emailEnabled}
                          onCheckedChange={(checked) => updateSettings("overduePayments", "emailEnabled", checked)}
                        />
                        <Label htmlFor="overdue-email" className="flex items-center gap-2">
                          <Mail className="w-4 h-4" />
                          تنبيه بالبريد الإلكتروني
                        </Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Switch
                          id="overdue-sms"
                          checked={settings.overduePayments.smsEnabled}
                          onCheckedChange={(checked) => updateSettings("overduePayments", "smsEnabled", checked)}
                        />
                        <Label htmlFor="overdue-sms" className="flex items-center gap-2">
                          <Smartphone className="w-4 h-4" />
                          تنبيه برسالة نصية
                        </Label>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  )
}
