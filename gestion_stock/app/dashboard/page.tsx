"use client";

import { useState } from "react";
import {
  FileText,
  Users,
  Package,
  DollarSign,
  TrendingUp,
  Clock,
  Award,
  Target,
  CheckCircle,
  AlertCircle,
  XCircle,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import SideNav from "@/components/side-nav";
import StatCard from "@/components/stat-card";
import ChartCard from "@/components/chart-card";

// Mock data for statistics
const mockJobOrders = [
  {
    id: "JO-001",
    employeeId: "1",
    employeeName: "John Doe",
    status: "completed",
    difficulty: 7,
    totalPrice: 850,
    materials: ["MAT-001", "MAT-003"],
    completionTime: 4.5, // hours
    createdAt: "2024-01-15",
    completedAt: "2024-01-16",
  },
  {
    id: "JO-002",
    employeeId: "2",
    employeeName: "Jane Smith",
    status: "completed",
    difficulty: 5,
    totalPrice: 650,
    materials: ["MAT-002"],
    completionTime: 3.2,
    createdAt: "2024-01-16",
    completedAt: "2024-01-16",
  },
  {
    id: "JO-003",
    employeeId: "1",
    employeeName: "John Doe",
    status: "completed",
    difficulty: 8,
    totalPrice: 1200,
    materials: ["MAT-001", "MAT-002", "MAT-003"],
    completionTime: 6.1,
    createdAt: "2024-01-17",
    completedAt: "2024-01-18",
  },
  {
    id: "JO-004",
    employeeId: "3",
    employeeName: "Robert Johnson",
    status: "in_progress",
    difficulty: 6,
    totalPrice: 750,
    materials: ["MAT-001"],
    completionTime: null,
    createdAt: "2024-01-18",
    completedAt: null,
  },
  {
    id: "JO-005",
    employeeId: "2",
    employeeName: "Jane Smith",
    status: "completed",
    difficulty: 4,
    totalPrice: 450,
    materials: ["MAT-003"],
    completionTime: 2.8,
    createdAt: "2024-01-19",
    completedAt: "2024-01-19",
  },
  {
    id: "JO-006",
    employeeId: "4",
    employeeName: "Emily Davis",
    status: "cancelled",
    difficulty: 3,
    totalPrice: 300,
    materials: ["MAT-002"],
    completionTime: null,
    createdAt: "2024-01-20",
    completedAt: null,
  },
];

const mockMaterials = [
  { code: "MAT-001", name: "Steel Pipe", price: 100 },
  { code: "MAT-002", name: "Copper Wire", price: 150 },
  { code: "MAT-003", name: "PVC Pipe", price: 75 },
];

const mockEmployees = [
  { id: "1", name: "John Doe", position: "Senior Technician" },
  { id: "2", name: "Jane Smith", position: "Project Manager" },
  { id: "3", name: "Robert Johnson", position: "Electrician" },
  { id: "4", name: "Emily Davis", position: "Quality Inspector" },
];

export default function DashboardPage() {
  const [timeRange, setTimeRange] = useState("30");

  // Calculate statistics
  const totalJobOrders = mockJobOrders.length;
  const completedJobOrders = mockJobOrders.filter(
    (jo) => jo.status === "completed"
  ).length;
  const inProgressJobOrders = mockJobOrders.filter(
    (jo) => jo.status === "in_progress"
  ).length;
  const cancelledJobOrders = mockJobOrders.filter(
    (jo) => jo.status === "cancelled"
  ).length;

  const totalRevenue = mockJobOrders
    .filter((jo) => jo.status === "completed")
    .reduce((sum, jo) => sum + jo.totalPrice, 0);

  const avgCompletionTime =
    mockJobOrders
      .filter((jo) => jo.completionTime)
      .reduce((sum, jo) => sum + (jo.completionTime || 0), 0) /
    mockJobOrders.filter((jo) => jo.completionTime).length;

  // Employee statistics
  const employeeStats = mockEmployees.map((employee) => {
    const employeeJobs = mockJobOrders.filter(
      (jo) => jo.employeeId === employee.id
    );
    const completedJobs = employeeJobs.filter(
      (jo) => jo.status === "completed"
    );
    const totalRevenue = completedJobs.reduce(
      (sum, jo) => sum + jo.totalPrice,
      0
    );
    const avgTime = completedJobs.length
      ? completedJobs.reduce((sum, jo) => sum + (jo.completionTime || 0), 0) /
        completedJobs.length
      : 0;

    return {
      ...employee,
      totalJobs: employeeJobs.length,
      completedJobs: completedJobs.length,
      totalRevenue,
      avgCompletionTime: avgTime,
      completionRate: employeeJobs.length
        ? (completedJobs.length / employeeJobs.length) * 100
        : 0,
    };
  });

  // Material usage statistics
  const materialUsage = mockMaterials.map((material) => {
    const usage = mockJobOrders.filter((jo) =>
      jo.materials.includes(material.code)
    ).length;
    return {
      ...material,
      usage,
      revenue: usage * material.price,
    };
  });

  // Find best performers
  const bestEmployee = employeeStats.reduce((best, current) =>
    current.totalRevenue > best.totalRevenue ? current : best
  );

  const fastestEmployee = employeeStats
    .filter((emp) => emp.avgCompletionTime > 0)
    .reduce((fastest, current) =>
      current.avgCompletionTime < fastest.avgCompletionTime ? current : fastest
    );

  const mostUsedMaterial = materialUsage.reduce((most, current) =>
    current.usage > most.usage ? current : most
  );

  return (
    <div className="flex h-screen bg-gray-50">
      <SideNav />

      <div className="flex-1 overflow-auto">
        <div className="container mx-auto py-10">
          <div className="max-w-7xl mx-auto space-y-8">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
                <p className="text-muted-foreground">
                  Overview of your job orders, employees, and materials.
                </p>
              </div>
              <Select value={timeRange} onValueChange={setTimeRange}>
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Select time range" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="7">Last 7 days</SelectItem>
                  <SelectItem value="30">Last 30 days</SelectItem>
                  <SelectItem value="90">Last 90 days</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Overview Stats */}
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
              <StatCard
                title="Total Job Orders"
                value={totalJobOrders}
                description="All time job orders"
                icon={FileText}
                trend={{ value: 12, isPositive: true }}
              />
              <StatCard
                title="Total Revenue"
                value={`$${totalRevenue.toLocaleString()}`}
                description="From completed orders"
                icon={DollarSign}
                trend={{ value: 8, isPositive: true }}
              />
              <StatCard
                title="Avg Completion Time"
                value={`${avgCompletionTime.toFixed(1)}h`}
                description="Average time per job"
                icon={Clock}
                trend={{ value: -5, isPositive: true }}
              />
              <StatCard
                title="Completion Rate"
                value={`${((completedJobOrders / totalJobOrders) * 100).toFixed(
                  1
                )}%`}
                description="Successfully completed"
                icon={Target}
                trend={{ value: 3, isPositive: true }}
              />
            </div>

            {/* Job Orders Status */}
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">
                    Completed Orders
                  </CardTitle>
                  <CheckCircle className="h-4 w-4 text-green-600" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-green-600">
                    {completedJobOrders}
                  </div>
                  <Progress
                    value={(completedJobOrders / totalJobOrders) * 100}
                    className="mt-2"
                  />
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">
                    In Progress
                  </CardTitle>
                  <AlertCircle className="h-4 w-4 text-yellow-600" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-yellow-600">
                    {inProgressJobOrders}
                  </div>
                  <Progress
                    value={(inProgressJobOrders / totalJobOrders) * 100}
                    className="mt-2"
                  />
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">
                    Cancelled
                  </CardTitle>
                  <XCircle className="h-4 w-4 text-red-600" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-red-600">
                    {cancelledJobOrders}
                  </div>
                  <Progress
                    value={(cancelledJobOrders / totalJobOrders) * 100}
                    className="mt-2"
                  />
                </CardContent>
              </Card>
            </div>

            {/* Top Performers */}
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              <ChartCard
                title="Best Employee"
                description="Highest revenue generated"
              >
                <div className="flex items-center space-x-4">
                  <div className="w-12 h-12 relative rounded-full overflow-hidden bg-blue-100 flex items-center justify-center">
                    <Award className="h-6 w-6 text-blue-600" />
                  </div>
                  <div className="flex-1">
                    <p className="font-medium">{bestEmployee.name}</p>
                    <p className="text-sm text-muted-foreground">
                      {bestEmployee.position}
                    </p>
                    <p className="text-lg font-bold text-green-600">
                      ${bestEmployee.totalRevenue.toLocaleString()}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {bestEmployee.completedJobs} completed jobs
                    </p>
                  </div>
                </div>
              </ChartCard>

              <ChartCard
                title="Fastest Employee"
                description="Lowest average completion time"
              >
                <div className="flex items-center space-x-4">
                  <div className="w-12 h-12 relative rounded-full overflow-hidden bg-green-100 flex items-center justify-center">
                    <TrendingUp className="h-6 w-6 text-green-600" />
                  </div>
                  <div className="flex-1">
                    <p className="font-medium">{fastestEmployee.name}</p>
                    <p className="text-sm text-muted-foreground">
                      {fastestEmployee.position}
                    </p>
                    <p className="text-lg font-bold text-blue-600">
                      {fastestEmployee.avgCompletionTime.toFixed(1)}h avg
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {fastestEmployee.completedJobs} completed jobs
                    </p>
                  </div>
                </div>
              </ChartCard>

              <ChartCard
                title="Most Used Material"
                description="Highest usage frequency"
              >
                <div className="flex items-center space-x-4">
                  <div className="w-12 h-12 relative rounded-full overflow-hidden bg-purple-100 flex items-center justify-center">
                    <Package className="h-6 w-6 text-purple-600" />
                  </div>
                  <div className="flex-1">
                    <p className="font-medium">{mostUsedMaterial.name}</p>
                    <p className="text-sm text-muted-foreground">
                      {mostUsedMaterial.code}
                    </p>
                    <p className="text-lg font-bold text-purple-600">
                      {mostUsedMaterial.usage} times used
                    </p>
                    <p className="text-xs text-muted-foreground">
                      ${mostUsedMaterial.revenue} total revenue
                    </p>
                  </div>
                </div>
              </ChartCard>
            </div>

            {/* Employee Performance */}
            <ChartCard
              title="Employee Performance"
              description="Detailed breakdown of employee statistics"
            >
              <div className="space-y-4">
                {employeeStats.map((employee) => (
                  <div
                    key={employee.id}
                    className="flex items-center justify-between p-4 border rounded-lg"
                  >
                    <div className="flex items-center space-x-4">
                      <div className="w-10 h-10 relative rounded-full overflow-hidden bg-gray-100 flex items-center justify-center">
                        <Users className="h-5 w-5 text-gray-600" />
                      </div>
                      <div>
                        <p className="font-medium">{employee.name}</p>
                        <p className="text-sm text-muted-foreground">
                          {employee.position}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-6 text-sm">
                      <div className="text-center">
                        <p className="font-medium">{employee.totalJobs}</p>
                        <p className="text-muted-foreground">Total Jobs</p>
                      </div>
                      <div className="text-center">
                        <p className="font-medium">{employee.completedJobs}</p>
                        <p className="text-muted-foreground">Completed</p>
                      </div>
                      <div className="text-center">
                        <p className="font-medium">
                          ${employee.totalRevenue.toLocaleString()}
                        </p>
                        <p className="text-muted-foreground">Revenue</p>
                      </div>
                      <div className="text-center">
                        <p className="font-medium">
                          {employee.avgCompletionTime.toFixed(1)}h
                        </p>
                        <p className="text-muted-foreground">Avg Time</p>
                      </div>
                      <div className="text-center">
                        <Badge
                          variant={
                            employee.completionRate >= 80
                              ? "default"
                              : "secondary"
                          }
                        >
                          {employee.completionRate.toFixed(0)}%
                        </Badge>
                        <p className="text-muted-foreground">Success Rate</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </ChartCard>

            {/* Material Usage */}
            <ChartCard
              title="Material Usage Statistics"
              description="Most frequently used materials"
            >
              <div className="space-y-4">
                {materialUsage
                  .sort((a, b) => b.usage - a.usage)
                  .map((material) => (
                    <div
                      key={material.code}
                      className="flex items-center justify-between p-4 border rounded-lg"
                    >
                      <div className="flex items-center space-x-4">
                        <div className="w-10 h-10 relative rounded-full overflow-hidden bg-gray-100 flex items-center justify-center">
                          <Package className="h-5 w-5 text-gray-600" />
                        </div>
                        <div>
                          <p className="font-medium">{material.name}</p>
                          <p className="text-sm text-muted-foreground">
                            {material.code}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center space-x-6 text-sm">
                        <div className="text-center">
                          <p className="font-medium">{material.usage}</p>
                          <p className="text-muted-foreground">Times Used</p>
                        </div>
                        <div className="text-center">
                          <p className="font-medium">${material.price}</p>
                          <p className="text-muted-foreground">Unit Price</p>
                        </div>
                        <div className="text-center">
                          <p className="font-medium">${material.revenue}</p>
                          <p className="text-muted-foreground">Total Revenue</p>
                        </div>
                        <div className="w-24">
                          <Progress
                            value={
                              (material.usage /
                                Math.max(
                                  ...materialUsage.map((m) => m.usage)
                                )) *
                              100
                            }
                          />
                        </div>
                      </div>
                    </div>
                  ))}
              </div>
            </ChartCard>
          </div>
        </div>
      </div>
    </div>
  );
}
