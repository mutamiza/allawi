"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Bell, AlertTriangle, CheckCircle, X, Calendar, Clock } from "lucide-react"
import { NotificationsSystem } from "./notifications-system"

export function NotificationsPanel() {
  const [showFullSystem, setShowFullSystem] = useState(false)
  const [notifications, setNotifications] = useState([
    {
      id: "N001",
      type: "contract_expiry",
      title: "عقد ينتهي قريباً",
      message: "عقد إيجار مجمع الرياض التجاري ينتهي خلال 7 أيام",
      timestamp: "2024-01-15 10:30",
      priority: "high",
      read: false,
    },
    {
      id: "N002",
      type: "payment_due",
      title: "دفعة مستحقة",
      message: "دفعة ربع سنوية مستحقة لعقد مكاتب جدة خلال 3 أيام",
      timestamp: "2024-01-14 14:20",
      priority: "medium",
      read: false,
    },
    {
      id: "N003",
      type: "overdue_payment",
      title: "دفعة متأخرة",
      message: "دفعة شهرية متأخرة لعقد مصنع الدمام بـ 5 أيام",
      timestamp: "2024-01-13 09:15",
      priority: "high",
      read: true,
    },
    {
      id: "N004",
      type: "contract_renewal",
      title: "عقد يحتاج تجديد",
      message: "عقد معرض المدينة يحتاج إلى تجديد خلال 30 يوم",
      timestamp: "2024-01-12 16:45",
      priority: "medium",
      read: true,
    },
  ])

  const getNotificationIcon = (type: string) => {
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

  const getNotificationBadge = (type: string, priority: string) => {
    if (priority === "high") {
      return <Badge className="bg-red-100 text-red-800">عاجل</Badge>
    }
    switch (type) {
      case "contract_expiry":
        return <Badge className="bg-red-100 text-red-800">انتهاء عقد</Badge>
      case "payment_due":
        return <Badge className="bg-yellow-100 text-yellow-800">دفعة مستحقة</Badge>
      case "overdue_payment":
        return <Badge className="bg-red-100 text-red-800">دفعة متأخرة</Badge>
      case "contract_renewal":
        return <Badge className="bg-blue-100 text-blue-800">تجديد عقد</Badge>
      default:
        return <Badge variant="outline">عام</Badge>
    }
  }

  const markAsRead = (id: string) => {
    setNotifications(notifications.map((notif) => (notif.id === id ? { ...notif, read: true } : notif)))
  }

  const deleteNotification = (id: string) => {
    setNotifications(notifications.filter((notif) => notif.id !== id))
  }

  const unreadCount = notifications.filter((n) => !n.read).length

  if (showFullSystem) {
    return <NotificationsSystem />
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <CardTitle>مركز التنبيهات</CardTitle>
              {unreadCount > 0 && <Badge className="bg-red-500 text-white">{unreadCount} غير مقروء</Badge>}
            </div>
            <div className="flex gap-2">
              <Button variant="outline" size="sm">
                تحديد الكل كمقروء
              </Button>
              <Button variant="outline" size="sm" onClick={() => setShowFullSystem(true)}>
                عرض النظام الكامل
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {notifications.map((notification) => (
              <div
                key={notification.id}
                className={`p-4 border rounded-lg ${!notification.read ? "bg-blue-50 border-blue-200" : "bg-white"}`}
              >
                <div className="flex items-start justify-between">
                  <div className="flex items-start gap-3 flex-1">
                    {getNotificationIcon(notification.type)}
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <h4 className="font-medium text-gray-900">{notification.title}</h4>
                        {getNotificationBadge(notification.type, notification.priority)}
                        {!notification.read && <div className="w-2 h-2 bg-blue-600 rounded-full"></div>}
                      </div>
                      <p className="text-gray-600 text-sm mb-2">{notification.message}</p>
                      <p className="text-xs text-gray-500">{notification.timestamp}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    {!notification.read && (
                      <Button variant="ghost" size="sm" onClick={() => markAsRead(notification.id)}>
                        تحديد كمقروء
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
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
