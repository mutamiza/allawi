"use client"

import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Edit, Eye, MoreHorizontal, Trash2 } from "lucide-react"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { formatCurrency } from "@/lib/utils"
import Link from "next/link"

export interface Payment {
  id: string
  contractId: string
  contractName?: string
  type: "rent" | "facilities" | "signage"
  amount: number
  paymentDate: string | null
  dueDate: string
  status: "paid" | "pending" | "overdue"
  paymentMethod?: string
  receiptNumber?: string
  notes?: string
  createdAt: string
}

interface PaymentsTableProps {
  payments: Payment[]
  onEdit?: (payment: Payment) => void
  onDelete?: (paymentId: string) => void
  showContract?: boolean
}

export function PaymentsTable({ payments, onEdit, onDelete, showContract = true }: PaymentsTableProps) {
  const getStatusColor = (status: string) => {
    switch (status) {
      case "paid":
        return "bg-green-100 text-green-800 hover:bg-green-200"
      case "pending":
        return "bg-yellow-100 text-yellow-800 hover:bg-yellow-200"
      case "overdue":
        return "bg-red-100 text-red-800 hover:bg-red-200"
      default:
        return "bg-gray-100 text-gray-800 hover:bg-gray-200"
    }
  }

  const getStatusText = (status: string) => {
    switch (status) {
      case "paid":
        return "مدفوع"
      case "pending":
        return "معلق"
      case "overdue":
        return "متأخر"
      default:
        return status
    }
  }

  const getTypeText = (type: string) => {
    switch (type) {
      case "rent":
        return "إيجار"
      case "facilities":
        return "مرافق"
      case "signage":
        return "لافتات"
      default:
        return type
    }
  }

  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            {showContract && <TableHead>العقد</TableHead>}
            <TableHead>النوع</TableHead>
            <TableHead>المبلغ</TableHead>
            <TableHead className="hidden md:table-cell">تاريخ الاستحقاق</TableHead>
            <TableHead className="hidden md:table-cell">تاريخ الدفع</TableHead>
            <TableHead>الحالة</TableHead>
            <TableHead>الإجراءات</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {payments.length === 0 ? (
            <TableRow>
              <TableCell colSpan={showContract ? 7 : 6} className="text-center py-8 text-gray-500">
                لا توجد دفعات لعرضها
              </TableCell>
            </TableRow>
          ) : (
            payments.map((payment) => (
              <TableRow key={payment.id}>
                {showContract && <TableCell>{payment.contractName}</TableCell>}
                <TableCell>{getTypeText(payment.type)}</TableCell>
                <TableCell>{formatCurrency(payment.amount)}</TableCell>
                <TableCell className="hidden md:table-cell">{payment.dueDate}</TableCell>
                <TableCell className="hidden md:table-cell">{payment.paymentDate || "-"}</TableCell>
                <TableCell>
                  <Badge className={getStatusColor(payment.status)}>{getStatusText(payment.status)}</Badge>
                </TableCell>
                <TableCell>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="icon">
                        <MoreHorizontal className="h-4 w-4" />
                        <span className="sr-only">فتح القائمة</span>
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem asChild>
                        <Link href={`/payments/${payment.id}`} className="flex items-center">
                          <Eye className="ml-2 h-4 w-4" />
                          <span>عرض التفاصيل</span>
                        </Link>
                      </DropdownMenuItem>
                      {onEdit && (
                        <DropdownMenuItem onClick={() => onEdit(payment)}>
                          <Edit className="ml-2 h-4 w-4" />
                          <span>تعديل</span>
                        </DropdownMenuItem>
                      )}
                      {onDelete && (
                        <DropdownMenuItem
                          onClick={() => onDelete(payment.id)}
                          className="text-red-600 focus:text-red-700"
                        >
                          <Trash2 className="ml-2 h-4 w-4" />
                          <span>حذف</span>
                        </DropdownMenuItem>
                      )}
                    </DropdownMenuContent>
                  </DropdownMenu>
                </TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>
    </div>
  )
}
