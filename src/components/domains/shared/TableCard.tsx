import { type ReactNode } from 'react'
import TablePagination from './TablePagination'

interface TableCardProps {
  children: ReactNode
  /** When provided, pagination footer is rendered */
  pagination?: {
    start: number
    end: number
    total: number
    page: number
    totalPages: number
    onPageChange: (page: number) => void
    showPageSelect?: boolean
  }
}

export default function TableCard({ children, pagination }: TableCardProps) {
  return (
    <div className="figma-card-base overflow-hidden rounded-lg">
      <div className="overflow-x-auto">{children}</div>
      {pagination && (
        <TablePagination
          start={pagination.start}
          end={pagination.end}
          total={pagination.total}
          page={pagination.page}
          totalPages={pagination.totalPages}
          onPageChange={pagination.onPageChange}
          showPageSelect={pagination.showPageSelect}
        />
      )}
    </div>
  )
}
