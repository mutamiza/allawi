import { Card, CardContent } from "@/components/ui/card"
import type { LucideIcon } from "lucide-react"

interface StatCardProps {
  title: string
  value: string | number
  description?: string
  icon: LucideIcon
  trend?: "up" | "down" | "neutral"
  trendValue?: string
  iconColor?: string
  valuePrefix?: string
  valueSuffix?: string
}

export function StatCard({
  title,
  value,
  description,
  icon: Icon,
  trend,
  trendValue,
  iconColor = "text-blue-500",
  valuePrefix = "",
  valueSuffix = "",
}: StatCardProps) {
  return (
    <Card>
      <CardContent className="p-6">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-gray-500">{title}</p>
            <div className="flex items-baseline mt-1">
              <p className="text-2xl font-semibold">
                {valuePrefix}
                {value}
                {valueSuffix}
              </p>
              {trendValue && (
                <p
                  className={`mr-2 text-sm font-medium ${
                    trend === "up" ? "text-green-600" : trend === "down" ? "text-red-600" : "text-gray-500"
                  }`}
                >
                  {trendValue}
                </p>
              )}
            </div>
            {description && <p className="mt-1 text-xs text-gray-500">{description}</p>}
          </div>
          <div className={`p-3 rounded-full bg-opacity-10 ${iconColor.replace("text", "bg")}`}>
            <Icon className={`h-6 w-6 ${iconColor}`} />
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
