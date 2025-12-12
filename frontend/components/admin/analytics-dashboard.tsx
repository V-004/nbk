"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import {
  BarChart,
  Bar,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts"

const userGrowthData = [
  { month: "Jan", users: 1200 },
  { month: "Feb", users: 1800 },
  { month: "Mar", users: 2400 },
  { month: "Apr", users: 3200 },
  { month: "May", users: 4100 },
  { month: "Jun", users: 5300 },
]

const transactionVolumeData = [
  { day: "Mon", volume: 125000 },
  { day: "Tue", volume: 145000 },
  { day: "Wed", volume: 165000 },
  { day: "Thu", volume: 155000 },
  { day: "Fri", volume: 185000 },
  { day: "Sat", volume: 95000 },
  { day: "Sun", volume: 75000 },
]

const fraudDetectionData = [
  { week: "Week 1", detected: 12, prevented: 8 },
  { week: "Week 2", detected: 18, prevented: 15 },
  { week: "Week 3", detected: 14, prevented: 12 },
  { week: "Week 4", detected: 22, prevented: 19 },
]

export function AnalyticsDashboard() {
  return (
    <div className="space-y-6">
      <div className="grid md:grid-cols-3 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Total Users</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold">5,340</p>
            <p className="text-xs text-green-600 mt-1">↑ 12% from last month</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Monthly Transactions</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold">18.5M</p>
            <p className="text-xs text-green-600 mt-1">↑ 8% from last month</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Fraud Detection Rate</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold">98.5%</p>
            <p className="text-xs text-green-600 mt-1">↑ 2% from last month</p>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>User Growth Trend</CardTitle>
          <CardDescription>Monthly active users over the past 6 months</CardDescription>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={userGrowthData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Line type="monotone" dataKey="users" stroke="#3B82F6" strokeWidth={2} />
            </LineChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Daily Transaction Volume</CardTitle>
          <CardDescription>Transaction volume by day of week</CardDescription>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={transactionVolumeData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="day" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="volume" fill="#A85CF9" />
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Fraud Detection & Prevention</CardTitle>
          <CardDescription>Fraudulent transactions detected and prevented</CardDescription>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={fraudDetectionData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="week" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar dataKey="detected" fill="#EF4444" />
              <Bar dataKey="prevented" fill="#10B981" />
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>
    </div>
  )
}
