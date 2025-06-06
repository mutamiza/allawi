"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Search, Plus, Eye, Edit, Trash2, Shield, UserPlus, RefreshCw, Loader2 } from "lucide-react"
import { AddUserForm } from "./add-user-form"
import { EditUserForm } from "./edit-user-form"
import { useDatabase } from "@/hooks/use-database"

interface User {
  id: string
  name: string
  email: string
  role: string
  department: string
  status: "active" | "inactive"
  username?: string
  fullName?: string
  createdAt: string
  updatedAt: string
}

export function UsersTable() {
  const { getUsers, deleteUser, updateUser } = useDatabase()
  const [users, setUsers] = useState<User[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [searchTerm, setSearchTerm] = useState("")
  const [showAddForm, setShowAddForm] = useState(false)
  const [editingUser, setEditingUser] = useState<User | null>(null)

  // تحميل المستخدمين
  const loadUsers = async () => {
    try {
      setLoading(true)
      setError(null)
      const usersData = await getUsers()
      setUsers(usersData || [])
    } catch (err: any) {
      console.error("خطأ في تحميل المستخدمين:", err)
      setError(err.message || "حدث خطأ في تحميل المستخدمين")
      setUsers([])
    } finally {
      setLoading(false)
    }
  }

  // تحميل البيانات عند بدء تشغيل المكون
  useEffect(() => {
    loadUsers()
  }, [])

  const getRoleBadge = (role: string) => {
    switch (role) {
      case "مدير النظام":
        return <Badge className="bg-red-100 text-red-800">مدير النظام</Badge>
      case "مدير العقود":
        return <Badge className="bg-blue-100 text-blue-800">مدير العقود</Badge>
      case "محاسب":
        return <Badge className="bg-green-100 text-green-800">محاسب</Badge>
      case "مراقب":
        return <Badge className="bg-gray-100 text-gray-800">مراقب</Badge>
      case "مدير":
        return <Badge className="bg-purple-100 text-purple-800">مدير</Badge>
      default:
        return <Badge variant="outline">{role}</Badge>
    }
  }

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "active":
        return <Badge className="bg-green-100 text-green-800">نشط</Badge>
      case "inactive":
        return <Badge className="bg-gray-100 text-gray-800">غير نشط</Badge>
      case "معلق":
        return <Badge className="bg-yellow-100 text-yellow-800">معلق</Badge>
      default:
        return <Badge variant="outline">{status}</Badge>
    }
  }

  const handleEditUser = (user: User) => {
    setEditingUser(user)
  }

  const handleDeleteUser = async (userId: string) => {
    if (confirm("هل أنت متأكد من حذف هذا المستخدم؟")) {
      try {
        await deleteUser(userId)
        await loadUsers() // إعادة تحميل البيانات
        alert("تم حذف المستخدم بنجاح!")
      } catch (error) {
        console.error("خطأ في حذف المستخدم:", error)
        alert("حدث خطأ أثناء حذف المستخدم")
      }
    }
  }

  const handleToggleStatus = async (userId: string, currentStatus: string) => {
    const newStatus = currentStatus === "active" ? "inactive" : "active"
    try {
      await updateUser(userId, { status: newStatus })
      await loadUsers() // إعادة تحميل البيانات
      alert(`تم تغيير حالة المستخدم إلى: ${newStatus === "active" ? "نشط" : "غير نشط"}`)
    } catch (error) {
      console.error("خطأ في تغيير حالة المستخدم:", error)
      alert("حدث خطأ أثناء تغيير حالة المستخدم")
    }
  }

  const handleFormClose = async () => {
    setShowAddForm(false)
    setEditingUser(null)
    await loadUsers() // إعادة تحميل البيانات بعد إغلاق النموذج
  }

  // تصفية المستخدمين بناءً على البحث
  const filteredUsers = (users || []).filter((user) => {
    const searchLower = searchTerm.toLowerCase()
    return (
      (user?.name || "").toLowerCase().includes(searchLower) ||
      (user?.email || "").toLowerCase().includes(searchLower) ||
      (user?.role || "").toLowerCase().includes(searchLower) ||
      (user?.department || "").toLowerCase().includes(searchLower) ||
      (user?.username || "").toLowerCase().includes(searchLower) ||
      (user?.fullName || "").toLowerCase().includes(searchLower)
    )
  })

  if (loading) {
    return (
      <div className="flex items-center justify-center p-8">
        <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
        <span className="mr-2 text-gray-600">جاري تحميل المستخدمين...</span>
      </div>
    )
  }

  if (error) {
    return (
      <div className="text-center p-8">
        <div className="text-red-600 mb-4">{error}</div>
        <Button onClick={loadUsers} variant="outline">
          <RefreshCw className="w-4 h-4 mr-2" />
          إعادة المحاولة
        </Button>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>إدارة المستخدمين والصلاحيات ({users.length} مستخدم)</CardTitle>
            <div className="flex gap-2">
              <Button variant="outline" onClick={loadUsers} size="sm">
                <RefreshCw className="w-4 h-4 mr-2" />
                تحديث
              </Button>
              <Button className="bg-blue-600 hover:bg-blue-700" onClick={() => setShowAddForm(true)}>
                <Plus className="w-4 h-4 mr-2" />
                مستخدم جديد
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {/* شريط البحث */}
          <div className="flex items-center gap-4 mb-6">
            <div className="relative flex-1">
              <Search className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <Input
                placeholder="البحث في المستخدمين..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pr-10"
              />
            </div>
          </div>

          {/* إحصائيات سريعة */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
            <Card className="p-4">
              <div className="text-center">
                <div className="text-2xl font-bold text-blue-600">{users.length}</div>
                <div className="text-sm text-gray-600">إجمالي المستخدمين</div>
              </div>
            </Card>
            <Card className="p-4">
              <div className="text-center">
                <div className="text-2xl font-bold text-green-600">
                  {users.filter((u) => u.status === "active").length}
                </div>
                <div className="text-sm text-gray-600">مستخدمين نشطين</div>
              </div>
            </Card>
            <Card className="p-4">
              <div className="text-center">
                <div className="text-2xl font-bold text-red-600">
                  {users.filter((u) => u.role === "مدير النظام" || u.role === "مدير").length}
                </div>
                <div className="text-sm text-gray-600">مديري النظام</div>
              </div>
            </Card>
            <Card className="p-4">
              <div className="text-center">
                <div className="text-2xl font-bold text-gray-600">
                  {users.filter((u) => u.status === "inactive").length}
                </div>
                <div className="text-sm text-gray-600">مستخدمين معطلين</div>
              </div>
            </Card>
          </div>

          {/* جدول المستخدمين */}
          <div className="border rounded-lg">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="text-right">الاسم</TableHead>
                  <TableHead className="text-right">البريد الإلكتروني</TableHead>
                  <TableHead className="text-right">الدور</TableHead>
                  <TableHead className="text-right">القسم</TableHead>
                  <TableHead className="text-right">الحالة</TableHead>
                  <TableHead className="text-right">الإجراءات</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredUsers.map((user) => (
                  <TableRow key={user.id}>
                    <TableCell className="font-medium">{user.name || user.fullName || "غير محدد"}</TableCell>
                    <TableCell>{user.email || "غير محدد"}</TableCell>
                    <TableCell>{getRoleBadge(user.role)}</TableCell>
                    <TableCell>{user.department || "غير محدد"}</TableCell>
                    <TableCell>{getStatusBadge(user.status)}</TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <Button variant="ghost" size="sm" title="عرض التفاصيل">
                          <Eye className="w-4 h-4" />
                        </Button>
                        <Button variant="ghost" size="sm" onClick={() => handleEditUser(user)} title="تعديل">
                          <Edit className="w-4 h-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleToggleStatus(user.id, user.status)}
                          title="تغيير الحالة"
                        >
                          <Shield className="w-4 h-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          className="text-red-600"
                          onClick={() => handleDeleteUser(user.id)}
                          title="حذف"
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>

          {filteredUsers.length === 0 && !loading && (
            <div className="text-center py-8">
              <UserPlus className="w-12 h-12 text-gray-300 mx-auto mb-3" />
              <p className="text-gray-500">
                {searchTerm ? "لا توجد مستخدمين يطابقون البحث" : "لا توجد مستخدمين مسجلين"}
              </p>
              {!searchTerm && (
                <Button className="mt-4" onClick={() => setShowAddForm(true)}>
                  <Plus className="w-4 h-4 mr-2" />
                  إضافة أول مستخدم
                </Button>
              )}
            </div>
          )}
        </CardContent>
      </Card>

      {/* نموذج إضافة مستخدم جديد */}
      {showAddForm && <AddUserForm onClose={handleFormClose} />}

      {/* نموذج تعديل مستخدم */}
      {editingUser && <EditUserForm user={editingUser} onClose={handleFormClose} />}
    </div>
  )
}
