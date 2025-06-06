"use client"

import type React from "react"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { X, UserPlus, Loader2 } from "lucide-react"
import { useDatabase } from "@/hooks/use-database"

interface AddUserFormProps {
  onClose: () => void
}

export function AddUserForm({ onClose }: AddUserFormProps) {
  const { addUser } = useDatabase()
  const [loading, setLoading] = useState(false)
  const [formData, setFormData] = useState({
    username: "",
    fullName: "",
    email: "",
    role: "مستخدم",
    department: "",
    status: "active",
    permissions: ["قراءة"],
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      await addUser({
        ...formData,
        name: formData.fullName, // للتوافق مع واجهة المستخدم
      })
      alert("تم إضافة المستخدم بنجاح!")
      onClose()
    } catch (error) {
      console.error("خطأ في إضافة المستخدم:", error)
      alert("حدث خطأ أثناء إضافة المستخدم")
    } finally {
      setLoading(false)
    }
  }

  const handleInputChange = (field: string, value: any) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }))
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <Card className="w-full max-w-md">
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>إضافة مستخدم جديد</CardTitle>
            <Button variant="ghost" size="sm" onClick={onClose}>
              <X className="w-4 h-4" />
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            {/* اسم المستخدم */}
            <div className="space-y-2">
              <Label htmlFor="username">اسم المستخدم</Label>
              <Input
                id="username"
                value={formData.username}
                onChange={(e) => handleInputChange("username", e.target.value)}
                placeholder="أدخل اسم المستخدم"
                required
              />
            </div>

            {/* الاسم الكامل */}
            <div className="space-y-2">
              <Label htmlFor="fullName">الاسم الكامل</Label>
              <Input
                id="fullName"
                value={formData.fullName}
                onChange={(e) => handleInputChange("fullName", e.target.value)}
                placeholder="أدخل الاسم الكامل"
                required
              />
            </div>

            {/* البريد الإلكتروني */}
            <div className="space-y-2">
              <Label htmlFor="email">البريد الإلكتروني</Label>
              <Input
                id="email"
                type="email"
                value={formData.email}
                onChange={(e) => handleInputChange("email", e.target.value)}
                placeholder="example@company.com"
                required
              />
            </div>

            {/* القسم */}
            <div className="space-y-2">
              <Label htmlFor="department">القسم</Label>
              <Input
                id="department"
                value={formData.department}
                onChange={(e) => handleInputChange("department", e.target.value)}
                placeholder="أدخل اسم القسم"
              />
            </div>

            {/* الدور */}
            <div className="space-y-2">
              <Label htmlFor="role">الدور</Label>
              <Select value={formData.role} onValueChange={(value) => handleInputChange("role", value)}>
                <SelectTrigger>
                  <SelectValue placeholder="اختر الدور" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="مدير النظام">مدير النظام</SelectItem>
                  <SelectItem value="مدير العقود">مدير العقود</SelectItem>
                  <SelectItem value="محاسب">محاسب</SelectItem>
                  <SelectItem value="مستخدم">مستخدم</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* الحالة */}
            <div className="space-y-2">
              <Label htmlFor="status">الحالة</Label>
              <Select value={formData.status} onValueChange={(value) => handleInputChange("status", value)}>
                <SelectTrigger>
                  <SelectValue placeholder="اختر الحالة" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="active">نشط</SelectItem>
                  <SelectItem value="inactive">غير نشط</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* أزرار الإجراءات */}
            <div className="flex gap-4 pt-4">
              <Button type="submit" disabled={loading} className="flex-1">
                {loading ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    جاري الإضافة...
                  </>
                ) : (
                  <>
                    <UserPlus className="w-4 h-4 mr-2" />
                    إضافة المستخدم
                  </>
                )}
              </Button>
              <Button type="button" variant="outline" onClick={onClose} disabled={loading}>
                إلغاء
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}
