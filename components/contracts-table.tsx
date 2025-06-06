"use client"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Edit, Eye, MoreHorizontal, Trash2 } from "lucide-react"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { formatCurrency } from "@/lib/utils"
import Link from "next/link"

export interface Contract {
  id: string
  contractNumber: string
  contractName: string
  startDate: string
  endDate: string
  totalRentValue: number
  contractStatus: string
  createdAt: string
}

interface ContractsTableProps {
  contracts: Contract[]
  onEdit?: (contract: Contract) => void
  onDelete?: (contractId: string) => void
}

export function ContractsTable({ contracts, onEdit, onDelete }: ContractsTableProps) {
  const getStatusColor = (status: string) => {
    switch (status) {
      case "نشط":
        return "bg-green-100 text-green-800 hover:bg-green-200"
      case "منتهي":
        return "bg-red-100 text-red-800 hover:bg-red-200"
      case "منتهي قريباً":
        return "bg-yellow-100 text-yellow-800 hover:bg-yellow-200"
      case "معلق":
        return "bg-gray-100 text-gray-800 hover:bg-gray-200"
      default:
        return "bg-blue-100 text-blue-800 hover:bg-blue-200"
    }
  }

  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>رقم العقد</TableHead>
            <TableHead>اسم العقد</TableHead>
            <TableHead className="hidden md:table-cell">تاريخ البداية</TableHead>
            <TableHead className="hidden md:table-cell">تاريخ النهاية</TableHead>
            <TableHead className="hidden md:table-cell">قيمة الإيجار</TableHead>
            <TableHead>الحالة</TableHead>
            <TableHead>الإجراءات</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {contracts.length === 0 ? (
            <TableRow>
              <TableCell colSpan={7} className="text-center py-8 text-gray-500">
                لا توجد عقود لعرضها
              </TableCell>
            </TableRow>
          ) : (
            contracts.map((contract) => (
              <TableRow key={contract.id}>
                <TableCell className="font-medium">{contract.contractNumber}</TableCell>
                <TableCell>{contract.contractName}</TableCell>
                <TableCell className="hidden md:table-cell">{contract.startDate}</TableCell>
                <TableCell className="hidden md:table-cell">{contract.endDate}</TableCell>
                <TableCell className="hidden md:table-cell">{formatCurrency(contract.totalRentValue)}</TableCell>
                <TableCell>
                  <Badge className={getStatusColor(contract.contractStatus)}>{contract.contractStatus}</Badge>
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
                        <Link href={`/contracts/${contract.id}`} className="flex items-center">
                          <Eye className="ml-2 h-4 w-4" />
                          <span>عرض التفاصيل</span>
                        </Link>
                      </DropdownMenuItem>
                      {onEdit && (
                        <DropdownMenuItem onClick={() => onEdit(contract)}>
                          <Edit className="ml-2 h-4 w-4" />
                          <span>تعديل</span>
                        </DropdownMenuItem>
                      )}
                      {onDelete && (
                        <DropdownMenuItem
                          onClick={() => onDelete(contract.id)}
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
