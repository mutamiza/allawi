"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { Switch } from "@/components/ui/switch"
import { Settings, Database, Bell, Save } from "lucide-react"

export default function SettingsPage() {
  const [notifications, setNotifications] = useState({
    emailNotifications: true,
    paymentReminders: true,
    contractExpiry: true,
    overduePayments: true,
  })

  return (
    <div className="container mx-auto p-6 space-y-6">
      <div className="flex items-center gap-3 mb-6">
        <Settings className="w-8 h-8 text-blue-600" />
        <div>
          <h1 className="text-3xl font-bold">إعدادات النظام</h1>
          <p className="text-gray-600">إدارة إعدادات وتكوين النظام</p>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Database className="w-5 h-5" />
            حالة النظام
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="text-center">
              <Badge variant="secondary" className="mb-2">
                وضع المحاكاة
              </Badge>
              <p className="text-sm text-gray-600">النظام يعمل بأمان</p>
            </div>

            <div className="text-center">
              <Badge variant="default" className="mb-2">
                مُكون
              </Badge>
              <p className="text-sm text-gray-600">النظام جاهز للاستخدام</p>
            </div>

            <div className="text-center">
              <Badge variant="secondary" className="mb-2">
                الإصدار 1.0.0
              </Badge>
              <p className="text-sm text-gray-600">آخر تحديث</p>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Bell className="w-5 h-5" />
            إعدادات التنبيهات
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <Label htmlFor="email-notifications">تنبيهات البريد الإلكتروني</Label>
                <p className="text-sm text-gray-600">استقبال التنبيهات عبر البريد الإلكتروني</p>
              </div>
              <Switch
                id="email-notifications"
                checked={notifications.emailNotifications}
                onCheckedChange={(checked) => setNotifications((prev) => ({ ...prev, emailNotifications: checked }))}
              />
            </div>

            <div className="flex items-center justify-between">
              <div>
                <Label htmlFor="payment-reminders">تذكير الدفعات</Label>
                <p className="text-sm text-gray-600">تنبيهات قبل موعد استحقاق الدفعات</p>
              </div>
              <Switch
                id="payment-reminders"
                checked={notifications.paymentReminders}
                onCheckedChange={(checked) => setNotifications((prev) => ({ ...prev, paymentReminders: checked }))}
              />
            </div>
          </div>

          <Button>
            <Save className="w-4 h-4 ml-2" />
            حفظ الإعدادات
          </Button>
        </CardContent>
      </Card>
    </div>
  )
}
