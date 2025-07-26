"use client";

import { useState } from "react";
import {
  Search,
  Eye,
  Trash2,
  Plus,
  Filter,
  Calendar,
  User,
  Package,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Separator } from "@/components/ui/separator";
import { format } from "date-fns";
import { es } from "date-fns/locale";
import Link from "next/link";

// Mock job orders data
const mockJobOrders = [
  {
    id: "JO-001",
    orderNumber: "JO-001",
    orderDate: "2024-01-15",
    employeeId: "1",
    employeeName: "Juan Pérez",
    status: "completed",
    paymentMethod: "credit_card",
    difficulty: 7,
    totalPrice: 850,
    materials: [
      {
        code: "MAT-001",
        name: "Tubo de Acero",
        brand: "MetalCorp",
        image: "/placeholder.svg?height=50&width=50",
      },
      {
        code: "MAT-003",
        name: "Tubo de PVC",
        brand: "PlásticosPro",
        image: "/placeholder.svg?height=50&width=50",
      },
    ],
    completionTime: 4.5,
    createdAt: "2024-01-15T10:00:00Z",
    completedAt: "2024-01-16T14:30:00Z",
  },
  {
    id: "JO-002",
    orderNumber: "JO-002",
    orderDate: "2024-01-16",
    employeeId: "2",
    employeeName: "María García",
    status: "in_progress",
    paymentMethod: "cash",
    difficulty: 5,
    totalPrice: 650,
    materials: [
      {
        code: "MAT-002",
        name: "Cable de Cobre",
        brand: "ElectroSuministros",
        image: "/placeholder.svg?height=50&width=50",
      },
    ],
    completionTime: null,
    createdAt: "2024-01-16T09:00:00Z",
    completedAt: null,
  },
  {
    id: "JO-003",
    orderNumber: "JO-003",
    orderDate: "2024-01-17",
    employeeId: "1",
    employeeName: "Juan Pérez",
    status: "completed",
    paymentMethod: "bank_transfer",
    difficulty: 8,
    totalPrice: 1200,
    materials: [
      {
        code: "MAT-001",
        name: "Tubo de Acero",
        brand: "MetalCorp",
        image: "/placeholder.svg?height=50&width=50",
      },
      {
        code: "MAT-002",
        name: "Cable de Cobre",
        brand: "ElectroSuministros",
        image: "/placeholder.svg?height=50&width=50",
      },
      {
        code: "MAT-004",
        name: "Lámina de Aluminio",
        brand: "MetalCorp",
        image: "/placeholder.svg?height=50&width=50",
      },
    ],
    completionTime: 6.1,
    createdAt: "2024-01-17T08:00:00Z",
    completedAt: "2024-01-18T14:06:00Z",
  },
  {
    id: "JO-004",
    orderNumber: "JO-004",
    orderDate: "2024-01-18",
    employeeId: "3",
    employeeName: "Roberto Martínez",
    status: "pending",
    paymentMethod: "credit_card",
    difficulty: 6,
    totalPrice: 750,
    materials: [
      {
        code: "MAT-005",
        name: "Mezcla de Cemento",
        brand: "ConstruPro",
        image: "/placeholder.svg?height=50&width=50",
      },
    ],
    completionTime: null,
    createdAt: "2024-01-18T11:00:00Z",
    completedAt: null,
  },
  {
    id: "JO-005",
    orderNumber: "JO-005",
    orderDate: "2024-01-19",
    employeeId: "2",
    employeeName: "María García",
    status: "cancelled",
    paymentMethod: "cash",
    difficulty: 4,
    totalPrice: 450,
    materials: [
      {
        code: "MAT-006",
        name: "Tabla de Madera",
        brand: "MaderaCorp",
        image: "/placeholder.svg?height=50&width=50",
      },
    ],
    completionTime: null,
    createdAt: "2024-01-19T13:00:00Z",
    completedAt: null,
  },
];

const statusColors = {
  pending: "bg-yellow-100 text-yellow-800",
  in_progress: "bg-blue-100 text-blue-800",
  completed: "bg-green-100 text-green-800",
  cancelled: "bg-red-100 text-red-800",
};

const paymentMethodLabels = {
  credit_card: "Tarjeta de Crédito",
  cash: "Efectivo",
  bank_transfer: "Transferencia Bancaria",
};

export default function Page() {
  const [jobOrders, setJobOrders] = useState(mockJobOrders);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [selectedJobOrder, setSelectedJobOrder] = useState<
    (typeof mockJobOrders)[0] | null
  >(null);
  const [isViewDialogOpen, setIsViewDialogOpen] = useState(false);

  const filteredJobOrders = jobOrders.filter((order) => {
    const matchesSearch =
      order.orderNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.employeeName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.materials.some((material) =>
        material.name.toLowerCase().includes(searchTerm.toLowerCase())
      );

    const matchesStatus =
      statusFilter === "all" || order.status === statusFilter;

    return matchesSearch && matchesStatus;
  });

  const handleViewJobOrder = (jobOrder: (typeof mockJobOrders)[0]) => {
    setSelectedJobOrder(jobOrder);
    setIsViewDialogOpen(true);
  };

  const handleDeleteJobOrder = (id: string) => {
    if (
      confirm("¿Estás seguro de que deseas eliminar esta orden de trabajo?")
    ) {
      setJobOrders(jobOrders.filter((order) => order.id !== id));
    }
  };

  const getStatusBadge = (status: string) => {
    const statusTexts: Record<string, string> = {
      pending: "PENDIENTE",
      in_progress: "EN PROCESO",
      completed: "COMPLETADA",
      cancelled: "CANCELADA",
    };

    return (
      <Badge
        className={statusColors[status as keyof typeof statusColors]}
        variant="secondary"
      >
        {statusTexts[status] || status.toUpperCase()}
      </Badge>
    );
  };

  return (
    <div className="flex h-screen bg-gray-50">
      <div className="flex-1 overflow-auto">
        <div className="container mx-auto py-10">
          <Card className="max-w-7xl mx-auto">
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="text-2xl">Órdenes de Trabajo</CardTitle>
                  <CardDescription>
                    Gestiona y realiza seguimiento de todas las órdenes de
                    trabajo en tu sistema.
                  </CardDescription>
                </div>
                <Link href="/job_orders/create">
                  <Button>
                    <Plus className="h-4 w-4 mr-2" />
                    Crear Orden de Trabajo
                  </Button>
                </Link>
              </div>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between mb-6 gap-4">
                <div className="flex items-center space-x-2 flex-1">
                  <Search className="h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Buscar por número de orden, empleado o materiales"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="max-w-sm"
                  />
                </div>
                <div className="flex items-center space-x-2">
                  <Filter className="h-4 w-4 text-muted-foreground" />
                  <Select value={statusFilter} onValueChange={setStatusFilter}>
                    <SelectTrigger className="w-[170px]">
                      <SelectValue placeholder="Filtrar por estado" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">Todos los Estados</SelectItem>
                      <SelectItem value="pending">Pendiente</SelectItem>
                      <SelectItem value="in_progress">En Proceso</SelectItem>
                      <SelectItem value="completed">Completada</SelectItem>
                      <SelectItem value="cancelled">Cancelada</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="rounded-md border">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>N° Orden</TableHead>
                      <TableHead>Empleado</TableHead>
                      <TableHead>Materiales</TableHead>
                      <TableHead>Estado</TableHead>
                      <TableHead>Precio Total</TableHead>
                      <TableHead>Fecha</TableHead>
                      <TableHead>Acciones</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredJobOrders.map((order) => (
                      <TableRow key={order.id}>
                        <TableCell className="font-medium">
                          {order.orderNumber}
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center space-x-2">
                            <User className="h-4 w-4 text-muted-foreground" />
                            <span>{order.employeeName}</span>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center space-x-1">
                            <Package className="h-4 w-4 text-muted-foreground" />
                            <span className="text-sm">
                              {order.materials.length} elementos
                            </span>
                          </div>
                        </TableCell>
                        <TableCell>{getStatusBadge(order.status)}</TableCell>
                        <TableCell className="font-medium">
                          ${order.totalPrice.toLocaleString()}
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center space-x-1">
                            <Calendar className="h-4 w-4 text-muted-foreground" />
                            <span className="text-sm">
                              {format(
                                new Date(order.orderDate),
                                "dd MMM yyyy",
                                { locale: es }
                              )}
                            </span>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleViewJobOrder(order)}
                            >
                              <Eye className="h-4 w-4" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleDeleteJobOrder(order.id)}
                              className="text-destructive hover:text-destructive"
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

              {filteredJobOrders.length === 0 && (
                <div className="text-center py-8 text-muted-foreground">
                  <p>
                    No se encontraron órdenes de trabajo que coincidan con tu
                    criterio.
                  </p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Job Order Details Dialog */}
      <Dialog open={isViewDialogOpen} onOpenChange={setIsViewDialogOpen}>
        <DialogContent className="max-w-4xl">
          <DialogHeader>
            <DialogTitle>Detalles de la Orden de Trabajo</DialogTitle>
            <DialogDescription>
              Información completa para {selectedJobOrder?.orderNumber}
            </DialogDescription>
          </DialogHeader>

          {selectedJobOrder && (
            <div className="space-y-6">
              {/* Basic Information */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div>
                  <h4 className="text-sm font-medium text-muted-foreground">
                    Número de Orden
                  </h4>
                  <p className="text-lg font-semibold">
                    {selectedJobOrder.orderNumber}
                  </p>
                </div>
                <div>
                  <h4 className="text-sm font-medium text-muted-foreground">
                    Estado
                  </h4>
                  <div className="mt-1">
                    {getStatusBadge(selectedJobOrder.status)}
                  </div>
                </div>
                <div>
                  <h4 className="text-sm font-medium text-muted-foreground">
                    Empleado
                  </h4>
                  <p className="text-lg font-semibold">
                    {selectedJobOrder.employeeName}
                  </p>
                </div>
                <div>
                  <h4 className="text-sm font-medium text-muted-foreground">
                    Precio Total
                  </h4>
                  <p className="text-lg font-semibold text-green-600">
                    ${selectedJobOrder.totalPrice.toLocaleString()}
                  </p>
                </div>
              </div>

              <Separator />

              {/* Order Details */}
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                <div>
                  <h4 className="text-sm font-medium text-muted-foreground">
                    Fecha de Orden
                  </h4>
                  <p>
                    {format(
                      new Date(selectedJobOrder.orderDate),
                      "d 'de' MMMM 'de' yyyy",
                      { locale: es }
                    )}
                  </p>
                </div>
                <div>
                  <h4 className="text-sm font-medium text-muted-foreground">
                    Método de Pago
                  </h4>
                  <p>
                    {
                      paymentMethodLabels[
                        selectedJobOrder.paymentMethod as keyof typeof paymentMethodLabels
                      ]
                    }
                  </p>
                </div>
              </div>

              <Separator />

              {/* Materials */}
              <div>
                <h4 className="text-lg font-medium mb-4">
                  Materiales Utilizados
                </h4>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {selectedJobOrder.materials.map((material, index) => (
                    <Card key={index}>
                      <CardContent className="p-4">
                        <div className="flex items-center space-x-3">
                          <div className="flex-1">
                            <p className="font-medium">{material.name}</p>
                            <p className="text-sm text-muted-foreground">
                              {material.code}
                            </p>
                            <p className="text-sm text-muted-foreground">
                              {material.brand}
                            </p>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </div>

              <Separator />

              {/* Timeline */}
              <div>
                <h4 className="text-lg font-medium mb-4">Línea de Tiempo</h4>
                <div className="space-y-2">
                  <div className="flex items-center space-x-2">
                    <div className="w-2 h-2 bg-blue-600 rounded-full"></div>
                    <span className="text-sm">
                      Creada:{" "}
                      {format(
                        new Date(selectedJobOrder.createdAt),
                        "d 'de' MMMM 'de' yyyy 'a las' HH:mm",
                        { locale: es }
                      )}
                    </span>
                  </div>
                  {selectedJobOrder.completedAt && (
                    <div className="flex items-center space-x-2">
                      <div className="w-2 h-2 bg-green-600 rounded-full"></div>
                      <span className="text-sm">
                        Completada:{" "}
                        {format(
                          new Date(selectedJobOrder.completedAt),
                          "d 'de' MMMM 'de' yyyy 'a las' HH:mm",
                          { locale: es }
                        )}
                      </span>
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
