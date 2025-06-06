"use client"

import { useState } from "react"
import { ContractsTable, type Contract } from "@/components/contracts-table"
import { AddContractModal } from "@/components/add-contract-modal"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Search } from "lucide-react"
import { generateId } from "@/lib/utils"

// بيانات تجريبية للعقود
const initialContracts: Contract[] = [
  {
    id: "C001",
    contractNumber: "CONT-2024-001",
    contractName: "عقد إيجار مبنى تجاري",
    startDate: "2024-01-01",
    endDate: "2025-12-31",
    totalRentValue: 500000,
    contractStatus: "نشط",
    createdAt: "2024-01-01",
  },
  {
    id: "C002",
    contractNumber: "CONT-2024-002",
    contractName: "عقد إيجار مكاتب إدارية",
    startDate: "2024-02-01",
    endDate: "2026-01-31",
    totalRentValue: 300000,
    contractStatus: "نشط",
    createdAt: "2024-02-01",
  },
  {
    id: "C003",
    contractNumber: "CONT-2024-003",
    contractName: "عقد إيجار محلات تجارية",
    startDate: "2024-03-01",
    endDate: "2024-08-31",
    totalRentValue: 120000,
    contractStatus: "منتهي قريباً",
    createdAt: "2024-03-01",
  },
  {
    id: "C004",
    contractNumber: "CONT-2024-004",
    contractName: "عقد إيجار مستودع",
    startDate: "2023-10-01",
    endDate: "2024-09-30",
    totalRentValue: 200000,
    contractStatus: "نشط",
    createdAt: "2023-10-01",
  },
  {
    id: "C005",
    contractNumber: "CONT-2024-005",
    contractName: "عقد إيجار أرض",
    startDate: "2023-05-01",
    endDate: "2024-04-30",
    totalRentValue: 150000,
    contractStatus: "منتهي",
    createdAt: "2023-05-01",
  },
]

export default function ContractsPage() {
  const [contracts, setContracts] = useState<Contract[]>(initialContracts)
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState("all")

  // إضافة عقد جديد
  const handleAddContract = (contractData: any) => {
    const newContract: Contract = {
      id: generateId("C"),
      contractNumber: contractData.contractNumber,
      contractName: contractData.contractName,
      startDate: contractData.startDate,
      endDate: contractData.endDate,
      totalRentValue: contractData.totalRentValue,
      contractStatus: contractData.contractStatus,
      createdAt: new Date().toISOString().split("T")[0],
    }

    setContracts([...contracts, newContract])
  }

  // تصفية العقود حسب البحث والحالة
  const filteredContracts = contracts.filter((contract) => {
    const matchesSearch = contract.contractName.includes(searchTerm) || contract.contractNumber.includes(searchTerm)

    const matchesStatus = statusFilter === "all" || contract.contractStatus === statusFilter

    return matchesSearch && matchesStatus
  })

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">العقود</h1>
          <p className="text-gray-500">إدارة عقود الاستثمار</p>
        </div>
        <AddContractModal onAddContract={handleAddContract} />
      </div>

      <Card>
        <CardHeader>
          <CardTitle>قائمة العقود</CardTitle>
          <CardDescription>عرض وإدارة جميع العقود في النظام</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col md:flex-row gap-4 mb-6">
            <div className="flex-1 relative">
              <Search className="absolute right-3 top-2.5 h-4 w-4 text-gray-500" />
              <Input
                placeholder="بحث عن عقد..."
                className="pr-9"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <div className="w-full md:w-64">
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger>
                  <SelectValue placeholder="تصفية حسب الحالة" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">جميع الحالات</SelectItem>
                  <SelectItem value="نشط">نشط</SelectItem>
                  <SelectItem value="منتهي قريباً">منتهي قريباً</SelectItem>
                  <SelectItem value="منتهي">منتهي</SelectItem>
                  <SelectItem value="معلق">معلق</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <ContractsTable
            contracts={filteredContracts}
            onEdit={(contract) => console.log("تعديل العقد:", contract)}
            onDelete={(id) => {
              if (confirm("هل أنت متأكد من حذف هذا العقد؟")) {
                setContracts(contracts.filter((c) => c.id !== id))
              }
            }}
          />
        </CardContent>
      </Card>
    </div>
  )
}
