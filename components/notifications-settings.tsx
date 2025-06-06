"use client"

import type React from "react"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import {
  Settings,
  Calendar,
  Clock,
  AlertTriangle,
  Bell,
  Mail,
  Smartphone,
  Plus,
  X,
  Save,
  RotateCcw,
  CheckCircle,
} from "lucide-react"

interface NotificationRule {
  id: string
  name: string
  enabled: boolean
  days: number
  hours: number
  minutes: number
  emailEnabled: boolean
  smsEnabled: boolean
  systemEnabled: boolean
}

interface NotificationCategory {
  id: string
  name: string
  description: string
  icon: React.ReactNode
  enabled: boolean
  rules: NotificationRule[]
  customSettings: {
    workingDaysOnly: boolean
    workingHoursOnly: boolean
    workingHoursStart: string
    workingHoursEnd: string
    excludeWeekends: boolean
    excludeHolidays: boolean
  }
}

export function NotificationsSettings() {
  const [categories, setCategories] = useState<NotificationCategory[]>([
    {
      id: "contract_expiry",
      name: "انتهاء العقود",
      description: "تنبيهات قبل انتهاء العقود",
      icon: <Calendar className="w-5 h-5 text-red-600" />,
      enabled: true,
      rules: [
        {
          id: "exp_30",
          name: "تنبيه مبكر",
          enabled: true,
          days: 30,
          hours: 9,
          minutes: 0,
          emailEnabled: true,
          smsEnabled: false,
          systemEnabled: true,
        },
        {
          id: "exp_15",
          name: "تنبيه متوسط",
          enabled: true,
          days: 15,
          hours: 9,
          minutes: 0,
          emailEnabled: true,
          smsEnabled: false,
          systemEnabled: true,
        },
        {
          id: "exp_7",
          name: "تنبيه عاجل",
          enabled: true,
          days: 7,
          hours: 9,
          minutes: 0,
          emailEnabled: true,
          smsEnabled: true,
          systemEnabled: true,
        },
        {
          id: "exp_3",
          name: "تنبيه حرج",
          enabled: true,
          days: 3,
          hours: 9,
          minutes: 0,
          emailEnabled: true,
          smsEnabled: true,
          systemEnabled: true,
        },
        {
          id: "exp_1",
          name: "تنبيه أخير",
          enabled: true,
          days: 1,
          hours: 9,
          minutes: 0,
          emailEnabled: true,
          smsEnabled: true,
          systemEnabled: true,
        },
      ],
      customSettings: {
        workingDaysOnly: true,
        workingHoursOnly: true,
        workingHoursStart: "08:00",
        workingHoursEnd: "17:00",
        excludeWeekends: true,
        excludeHolidays: true,
      },
    },
    {
      id: "payment_due",
      name: "الدفعات المستحقة",
      description: "تنبيهات قبل مواعيد استحقاق الدفعات",
      icon: <Clock className="w-5 h-5 text-yellow-600" />,
      enabled: true,
      rules: [
        {
          id: "pay_7",
          name: "تنبيه مبكر",
          enabled: true,
          days: 7,
          hours: 10,
          minutes: 0,
          emailEnabled: true,
          smsEnabled: false,
          systemEnabled: true,
        },
        {
          id: "pay_3",
          name: "تنبيه متوسط",
          enabled: true,
          days: 3,
          hours: 10,
          minutes: 0,
          emailEnabled: true,
          smsEnabled: true,
          systemEnabled: true,
        },
        {
          id: "pay_1",
          name: "تنبيه عاجل",
          enabled: true,
          days: 1,
          hours: 10,
          minutes: 0,
          emailEnabled: true,
          smsEnabled: true,
          systemEnabled: true,
        },
      ],
      customSettings: {
        workingDaysOnly: true,
        workingHoursOnly: true,
        workingHoursStart: "08:00",
        workingHoursEnd: "17:00",
        excludeWeekends: false,
        excludeHolidays: true,
      },
    },
    {
      id: "overdue_payment",
      name: "الدفعات المتأخرة",
      description: "تنبيهات للدفعات المتأخرة",
      icon: <AlertTriangle className="w-5 h-5 text-red-600" />,
      enabled: true,
      rules: [
        {
          id: "over_1",
          name: "تأخير يوم واحد",
          enabled: true,
          days: 1,
          hours: 9,
          minutes: 0,
          emailEnabled: true,
          smsEnabled: true,
          systemEnabled: true,
        },
        {
          id: "over_3",
          name: "تأخير 3 أيام",
          enabled: true,
          days: 3,
          hours: 9,
          minutes: 0,
          emailEnabled: true,
          smsEnabled: true,
          systemEnabled: true,
        },
        {
          id: "over_7",
          name: "تأخير أسبوع",
          enabled: true,
          days: 7,
          hours: 9,
          minutes: 0,
          emailEnabled: true,
          smsEnabled: true,
          systemEnabled: true,
        },
      ],
      customSettings: {
        workingDaysOnly: false,
        workingHoursOnly: false,
        workingHoursStart: "08:00",
        workingHoursEnd: "17:00",
        excludeWeekends: false,
        excludeHolidays: false,
      },
    },
    {
      id: "contract_renewal",
      name: "تجديد العقود",
      description: "تنبيهات للعقود التي تحتاج تجديد",
      icon: <CheckCircle className="w-5 h-5 text-blue-600" />,
      enabled: true,
      rules: [
        {
          id: "ren_60",
          name: "تنبيه مبكر للتجديد",
          enabled: true,
          days: 60,
          hours: 9,
          minutes: 0,
          emailEnabled: true,
          smsEnabled: false,
          systemEnabled: true,
        },
        {
          id: "ren_30",
          name: "تنبيه متوسط للتجديد",
          enabled: true,
          days: 30,
          hours: 9,
          minutes: 0,
          emailEnabled: true,
          smsEnabled: false,
          systemEnabled: true,
        },
      ],
      customSettings: {
        workingDaysOnly: true,
        workingHoursOnly: true,
        workingHoursStart: "08:00",
        workingHoursEnd: "17:00",
        excludeWeekends: true,
        excludeHolidays: true,
      },
    },
  ])

  const [activeCategory, setActiveCategory] = useState("contract_expiry")
  const [hasChanges, setHasChanges] = useState(false)

  const updateCategoryEnabled = (categoryId: string, enabled: boolean) => {
    setCategories(categories.map((cat) => (cat.id === categoryId ? { ...cat, enabled } : cat)))
    setHasChanges(true)
  }

  const updateRuleEnabled = (categoryId: string, ruleId: string, enabled: boolean) => {
    setCategories(
      categories.map((cat) =>
        cat.id === categoryId
          ? {
              ...cat,
              rules: cat.rules.map((rule) => (rule.id === ruleId ? { ...rule, enabled } : rule)),
            }
          : cat,
      ),
    )
    setHasChanges(true)
  }

  const updateRuleTime = (categoryId: string, ruleId: string, field: string, value: number | string) => {
    setCategories(
      categories.map((cat) =>
        cat.id === categoryId
          ? {
              ...cat,
              rules: cat.rules.map((rule) => (rule.id === ruleId ? { ...rule, [field]: value } : rule)),
            }
          : cat,
      ),
    )
    setHasChanges(true)
  }

  const updateRuleNotificationMethod = (categoryId: string, ruleId: string, method: string, enabled: boolean) => {
    setCategories(
      categories.map((cat) =>
        cat.id === categoryId
          ? {
              ...cat,
              rules: cat.rules.map((rule) => (rule.id === ruleId ? { ...rule, [method]: enabled } : rule)),
            }
          : cat,
      ),
    )
    setHasChanges(true)
  }

  const updateCustomSettings = (categoryId: string, setting: string, value: any) => {
    setCategories(
      categories.map((cat) =>
        cat.id === categoryId
          ? {
              ...cat,
              customSettings: { ...cat.customSettings, [setting]: value },
            }
          : cat,
      ),
    )
    setHasChanges(true)
  }

  const addNewRule = (categoryId: string) => {
    const newRule: NotificationRule = {
      id: `rule_${Date.now()}`,
      name: "تنبيه جديد",
      enabled: true,
      days: 1,
      hours: 9,
      minutes: 0,
      emailEnabled: true,
      smsEnabled: false,
      systemEnabled: true,
    }

    setCategories(categories.map((cat) => (cat.id === categoryId ? { ...cat, rules: [...cat.rules, newRule] } : cat)))
    setHasChanges(true)
  }

  const removeRule = (categoryId: string, ruleId: string) => {
    setCategories(
      categories.map((cat) =>
        cat.id === categoryId ? { ...cat, rules: cat.rules.filter((rule) => rule.id !== ruleId) } : cat,
      ),
    )
    setHasChanges(true)
  }

  const saveSettings = () => {
    // هنا سيتم حفظ الإعدادات في قاعدة البيانات
    console.log("حفظ إعدادات التنبيهات:", categories)
    setHasChanges(false)
    alert("تم حفظ الإعدادات بنجاح!")
  }

  const resetToDefaults = () => {
    if (confirm("هل أنت متأكد من إعادة تعيين جميع الإعدادات إلى القيم الافتراضية؟")) {
      // إعادة تحميل الإعدادات الافتراضية
      window.location.reload()
    }
  }

  const currentCategory = categories.find((cat) => cat.id === activeCategory)

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Settings className="w-6 h-6 text-blue-600" />
              <div>
                <CardTitle className="text-xl">إعدادات التنبيهات المتقدمة</CardTitle>
                <p className="text-sm text-gray-600 mt-1">تحكم كامل في مواعيد وطرق إرسال التنبيهات</p>
              </div>
            </div>
            <div className="flex gap-2">
              {hasChanges && <Badge className="bg-orange-100 text-orange-800">يوجد تغييرات غير محفوظة</Badge>}
              <Button variant="outline" size="sm" onClick={resetToDefaults}>
                <RotateCcw className="w-4 h-4 mr-2" />
                إعادة تعيين
              </Button>
              <Button size="sm" onClick={saveSettings} disabled={!hasChanges}>
                <Save className="w-4 h-4 mr-2" />
                حفظ الإعدادات
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <Tabs value={activeCategory} onValueChange={setActiveCategory}>
            <TabsList className="grid grid-cols-2 md:grid-cols-4 w-full">
              {categories.map((category) => (
                <TabsTrigger key={category.id} value={category.id} className="flex items-center gap-2">
                  {category.icon}
                  <span className="hidden md:inline">{category.name}</span>
                </TabsTrigger>
              ))}
            </TabsList>

            {categories.map((category) => (
              <TabsContent key={category.id} value={category.id} className="space-y-6 mt-6">
                {/* تفعيل/إلغاء الفئة */}
                <Card>
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        {category.icon}
                        <div>
                          <CardTitle className="text-lg">{category.name}</CardTitle>
                          <p className="text-sm text-gray-600">{category.description}</p>
                        </div>
                      </div>
                      <Switch
                        checked={category.enabled}
                        onCheckedChange={(enabled) => updateCategoryEnabled(category.id, enabled)}
                      />
                    </div>
                  </CardHeader>
                </Card>

                {category.enabled && (
                  <>
                    {/* قواعد التنبيهات */}
                    <Card>
                      <CardHeader>
                        <div className="flex items-center justify-between">
                          <CardTitle className="text-lg">قواعد التنبيهات</CardTitle>
                          <Button variant="outline" size="sm" onClick={() => addNewRule(category.id)}>
                            <Plus className="w-4 h-4 mr-2" />
                            إضافة قاعدة
                          </Button>
                        </div>
                      </CardHeader>
                      <CardContent className="space-y-4">
                        {category.rules.map((rule, index) => (
                          <Card key={rule.id} className="p-4">
                            <div className="space-y-4">
                              {/* اسم القاعدة وتفعيلها */}
                              <div className="flex items-center justify-between">
                                <div className="flex items-center gap-3">
                                  <Switch
                                    checked={rule.enabled}
                                    onCheckedChange={(enabled) => updateRuleEnabled(category.id, rule.id, enabled)}
                                  />
                                  <Input
                                    value={rule.name}
                                    onChange={(e) => updateRuleTime(category.id, rule.id, "name", e.target.value)}
                                    className="w-48"
                                  />
                                </div>
                                {category.rules.length > 1 && (
                                  <Button
                                    variant="ghost"
                                    size="sm"
                                    onClick={() => removeRule(category.id, rule.id)}
                                    className="text-red-600"
                                  >
                                    <X className="w-4 h-4" />
                                  </Button>
                                )}
                              </div>

                              {rule.enabled && (
                                <>
                                  {/* توقيت التنبيه */}
                                  <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                                    <div className="space-y-2">
                                      <Label>الأيام قبل الموعد</Label>
                                      <Input
                                        type="number"
                                        min="0"
                                        value={rule.days}
                                        onChange={(e) =>
                                          updateRuleTime(
                                            category.id,
                                            rule.id,
                                            "days",
                                            Number.parseInt(e.target.value) || 0,
                                          )
                                        }
                                      />
                                    </div>
                                    <div className="space-y-2">
                                      <Label>الساعة</Label>
                                      <Select
                                        value={rule.hours.toString()}
                                        onValueChange={(value) =>
                                          updateRuleTime(category.id, rule.id, "hours", Number.parseInt(value))
                                        }
                                      >
                                        <SelectTrigger>
                                          <SelectValue />
                                        </SelectTrigger>
                                        <SelectContent>
                                          {Array.from({ length: 24 }, (_, i) => (
                                            <SelectItem key={i} value={i.toString()}>
                                              {i.toString().padStart(2, "0")}:00
                                            </SelectItem>
                                          ))}
                                        </SelectContent>
                                      </Select>
                                    </div>
                                    <div className="space-y-2">
                                      <Label>الدقيقة</Label>
                                      <Select
                                        value={rule.minutes.toString()}
                                        onValueChange={(value) =>
                                          updateRuleTime(category.id, rule.id, "minutes", Number.parseInt(value))
                                        }
                                      >
                                        <SelectTrigger>
                                          <SelectValue />
                                        </SelectTrigger>
                                        <SelectContent>
                                          {[0, 15, 30, 45].map((minute) => (
                                            <SelectItem key={minute} value={minute.toString()}>
                                              {minute.toString().padStart(2, "0")}
                                            </SelectItem>
                                          ))}
                                        </SelectContent>
                                      </Select>
                                    </div>
                                    <div className="space-y-2">
                                      <Label>معاينة التوقيت</Label>
                                      <div className="p-2 bg-gray-50 rounded text-center text-sm">
                                        {rule.days} يوم، {rule.hours.toString().padStart(2, "0")}:
                                        {rule.minutes.toString().padStart(2, "0")}
                                      </div>
                                    </div>
                                  </div>

                                  {/* طرق التنبيه */}
                                  <div className="space-y-3">
                                    <Label>طرق التنبيه</Label>
                                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                      <div className="flex items-center space-x-2">
                                        <Switch
                                          id={`${rule.id}-system`}
                                          checked={rule.systemEnabled}
                                          onCheckedChange={(enabled) =>
                                            updateRuleNotificationMethod(category.id, rule.id, "systemEnabled", enabled)
                                          }
                                        />
                                        <Label htmlFor={`${rule.id}-system`} className="flex items-center gap-2">
                                          <Bell className="w-4 h-4" />
                                          تنبيه النظام
                                        </Label>
                                      </div>
                                      <div className="flex items-center space-x-2">
                                        <Switch
                                          id={`${rule.id}-email`}
                                          checked={rule.emailEnabled}
                                          onCheckedChange={(enabled) =>
                                            updateRuleNotificationMethod(category.id, rule.id, "emailEnabled", enabled)
                                          }
                                        />
                                        <Label htmlFor={`${rule.id}-email`} className="flex items-center gap-2">
                                          <Mail className="w-4 h-4" />
                                          بريد إلكتروني
                                        </Label>
                                      </div>
                                      <div className="flex items-center space-x-2">
                                        <Switch
                                          id={`${rule.id}-sms`}
                                          checked={rule.smsEnabled}
                                          onCheckedChange={(enabled) =>
                                            updateRuleNotificationMethod(category.id, rule.id, "smsEnabled", enabled)
                                          }
                                        />
                                        <Label htmlFor={`${rule.id}-sms`} className="flex items-center gap-2">
                                          <Smartphone className="w-4 h-4" />
                                          رسالة نصية
                                        </Label>
                                      </div>
                                    </div>
                                  </div>
                                </>
                              )}
                            </div>
                            {index < category.rules.length - 1 && <Separator className="mt-4" />}
                          </Card>
                        ))}
                      </CardContent>
                    </Card>

                    {/* الإعدادات المخصصة */}
                    <Card>
                      <CardHeader>
                        <CardTitle className="text-lg">إعدادات متقدمة</CardTitle>
                      </CardHeader>
                      <CardContent className="space-y-4">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                          <div className="space-y-4">
                            <div className="flex items-center justify-between">
                              <Label>أيام العمل فقط</Label>
                              <Switch
                                checked={category.customSettings.workingDaysOnly}
                                onCheckedChange={(checked) =>
                                  updateCustomSettings(category.id, "workingDaysOnly", checked)
                                }
                              />
                            </div>
                            <div className="flex items-center justify-between">
                              <Label>ساعات العمل فقط</Label>
                              <Switch
                                checked={category.customSettings.workingHoursOnly}
                                onCheckedChange={(checked) =>
                                  updateCustomSettings(category.id, "workingHoursOnly", checked)
                                }
                              />
                            </div>
                            <div className="flex items-center justify-between">
                              <Label>استبعاد عطل نهاية الأسبوع</Label>
                              <Switch
                                checked={category.customSettings.excludeWeekends}
                                onCheckedChange={(checked) =>
                                  updateCustomSettings(category.id, "excludeWeekends", checked)
                                }
                              />
                            </div>
                            <div className="flex items-center justify-between">
                              <Label>استبعاد العطل الرسمية</Label>
                              <Switch
                                checked={category.customSettings.excludeHolidays}
                                onCheckedChange={(checked) =>
                                  updateCustomSettings(category.id, "excludeHolidays", checked)
                                }
                              />
                            </div>
                          </div>

                          {category.customSettings.workingHoursOnly && (
                            <div className="space-y-4">
                              <div className="space-y-2">
                                <Label>بداية ساعات العمل</Label>
                                <Input
                                  type="time"
                                  value={category.customSettings.workingHoursStart}
                                  onChange={(e) =>
                                    updateCustomSettings(category.id, "workingHoursStart", e.target.value)
                                  }
                                />
                              </div>
                              <div className="space-y-2">
                                <Label>نهاية ساعات العمل</Label>
                                <Input
                                  type="time"
                                  value={category.customSettings.workingHoursEnd}
                                  onChange={(e) => updateCustomSettings(category.id, "workingHoursEnd", e.target.value)}
                                />
                              </div>
                            </div>
                          )}
                        </div>
                      </CardContent>
                    </Card>
                  </>
                )}
              </TabsContent>
            ))}
          </Tabs>
        </CardContent>
      </Card>
    </div>
  )
}
