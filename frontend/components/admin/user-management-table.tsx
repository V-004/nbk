"use client"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Lock, Unlock, Trash2, Eye } from "lucide-react"

interface User {
  id: string
  name: string
  email: string
  accountStatus: "active" | "suspended" | "inactive"
  kycStatus: "pending" | "verified" | "rejected"
  joinDate: string
  totalTransactions: number
  totalBalance: number
  lastActive: string
}

interface UserManagementTableProps {
  users?: User[]
  onBlockUser?: (userId: string) => void
  onUnblockUser?: (userId: string) => void
  onViewUser?: (userId: string) => void
  onDeleteUser?: (userId: string) => void
}

export function UserManagementTable({
  users,
  onBlockUser,
  onUnblockUser,
  onViewUser,
  onDeleteUser,
}: UserManagementTableProps) {
  const mockUsers: User[] = [
    {
      id: "usr001",
      name: "John Doe",
      email: "john@example.com",
      accountStatus: "active",
      kycStatus: "verified",
      joinDate: "2024-01-15",
      totalTransactions: 45,
      totalBalance: 250000,
      lastActive: "5 minutes ago",
    },
    {
      id: "usr002",
      name: "Jane Smith",
      email: "jane@example.com",
      accountStatus: "active",
      kycStatus: "verified",
      joinDate: "2024-02-10",
      totalTransactions: 32,
      totalBalance: 180000,
      lastActive: "2 hours ago",
    },
    {
      id: "usr003",
      name: "Rajesh Kumar",
      email: "rajesh@example.com",
      accountStatus: "suspended",
      kycStatus: "verified",
      joinDate: "2024-01-05",
      totalTransactions: 67,
      totalBalance: 420000,
      lastActive: "3 days ago",
    },
    {
      id: "usr004",
      name: "Priya Patel",
      email: "priya@example.com",
      accountStatus: "active",
      kycStatus: "pending",
      joinDate: "2024-03-01",
      totalTransactions: 8,
      totalBalance: 50000,
      lastActive: "1 hour ago",
    },
    {
      id: "usr005",
      name: "Amit Singh",
      email: "amit@example.com",
      accountStatus: "inactive",
      kycStatus: "verified",
      joinDate: "2023-11-20",
      totalTransactions: 112,
      totalBalance: 750000,
      lastActive: "2 months ago",
    },
  ]

  const displayUsers = users || mockUsers

  const getStatusColor = (status: string) => {
    switch (status) {
      case "active":
        return "bg-green-100 text-green-800"
      case "suspended":
        return "bg-red-100 text-red-800"
      case "inactive":
        return "bg-gray-100 text-gray-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  const getKYCColor = (status: string) => {
    switch (status) {
      case "verified":
        return "bg-green-100 text-green-800"
      case "pending":
        return "bg-yellow-100 text-yellow-800"
      case "rejected":
        return "bg-red-100 text-red-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  return (
    <div className="overflow-x-auto">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>User</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>KYC</TableHead>
            <TableHead>Transactions</TableHead>
            <TableHead>Balance</TableHead>
            <TableHead>Joined</TableHead>
            <TableHead>Last Active</TableHead>
            <TableHead>Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {displayUsers.map((user) => (
            <TableRow key={user.id}>
              <TableCell>
                <div>
                  <p className="font-semibold text-sm">{user.name}</p>
                  <p className="text-xs text-muted-foreground">{user.email}</p>
                </div>
              </TableCell>
              <TableCell>
                <Badge className={getStatusColor(user.accountStatus)}>
                  {user.accountStatus.charAt(0).toUpperCase() + user.accountStatus.slice(1)}
                </Badge>
              </TableCell>
              <TableCell>
                <Badge className={getKYCColor(user.kycStatus)}>
                  {user.kycStatus.charAt(0).toUpperCase() + user.kycStatus.slice(1)}
                </Badge>
              </TableCell>
              <TableCell>{user.totalTransactions}</TableCell>
              <TableCell>₹{user.totalBalance.toLocaleString()}</TableCell>
              <TableCell className="text-sm text-muted-foreground">{user.joinDate}</TableCell>
              <TableCell className="text-sm text-muted-foreground">{user.lastActive}</TableCell>
              <TableCell>
                <div className="flex gap-2">
                  <Button size="sm" variant="ghost" onClick={() => onViewUser?.(user.id)}>
                    <Eye className="h-4 w-4" />
                  </Button>
                  {user.accountStatus === "active" ? (
                    <Button
                      size="sm"
                      variant="ghost"
                      className="text-red-600 hover:text-red-700"
                      onClick={() => onBlockUser?.(user.id)}
                    >
                      <Lock className="h-4 w-4" />
                    </Button>
                  ) : (
                    <Button
                      size="sm"
                      variant="ghost"
                      className="text-green-600 hover:text-green-700"
                      onClick={() => onUnblockUser?.(user.id)}
                    >
                      <Unlock className="h-4 w-4" />
                    </Button>
                  )}
                  <Button
                    size="sm"
                    variant="ghost"
                    className="text-destructive hover:text-red-700"
                    onClick={() => onDeleteUser?.(user.id)}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  )
}
