"use client";

import type React from "react";

import { useState } from "react";
import { Plus, Search, Edit, Trash2, Mail, Phone } from "lucide-react";
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
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";

const employeeSchema = z.object({
  name: z.string().min(1, "El nombre es requerido"),
  email: z.string().email("Dirección de correo inválida"),
  phone: z.string().min(1, "El número de teléfono es requerido"),
  status: z.enum(["active", "inactive"], {
    message: "Por favor seleccione un estado",
  }),
});

type EmployeeFormValues = z.infer<typeof employeeSchema>;

// Mock employees data
const initialEmployees = [
  {
    id: "1",
    name: "Juan Pérez",
    email: "juan.perez@empresa.com",
    phone: "+54 (341) 123-4567",
    status: "active" as const,
  },
  {
    id: "2",
    name: "María García",
    email: "maria.garcia@empresa.com",
    phone: "+54 (341) 234-5678",
    status: "active" as const,
  },
  {
    id: "3",
    name: "Roberto Martínez",
    email: "roberto.martinez@empresa.com",
    phone: "+54 (341) 345-6789",
    status: "active" as const,
  },
  {
    id: "4",
    name: "Ana López",
    email: "ana.lopez@empresa.com",
    phone: "+54 (341) 456-7890",
    status: "inactive" as const,
  },
];

export default function Page() {
  const [employees, setEmployees] = useState(initialEmployees);
  const [searchTerm, setSearchTerm] = useState("");
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingEmployee, setEditingEmployee] = useState<
    (typeof initialEmployees)[0] | null
  >(null);

  const form = useForm<EmployeeFormValues>({
    resolver: zodResolver(employeeSchema),
    defaultValues: {
      name: "",
      email: "",
      phone: "",
      status: "active",
    },
  });

  const filteredEmployees = employees.filter(
    (employee) =>
      employee.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      employee.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleAddEmployee = () => {
    setEditingEmployee(null);
    form.reset();
    setIsDialogOpen(true);
  };

  const handleEditEmployee = (employee: (typeof initialEmployees)[0]) => {
    setEditingEmployee(employee);
    form.reset({
      name: employee.name,
      email: employee.email,
      phone: employee.phone,
      status: employee.status,
    });
    setIsDialogOpen(true);
  };

  const handleDeleteEmployee = (id: string) => {
    setEmployees(employees.filter((employee) => employee.id !== id));
  };

  const onSubmit = (data: EmployeeFormValues) => {
    if (editingEmployee) {
      // Update existing employee
      setEmployees(
        employees.map((employee) =>
          employee.id === editingEmployee.id
            ? { ...employee, ...data }
            : employee
        )
      );
    } else {
      // Add new employee
      const newEmployee = {
        id: Date.now().toString(),
        name: data.name,
        email: data.email,
        phone: data.phone,
        status: data.status,
      };
      setEmployees([...employees, newEmployee]);
    }
    setIsDialogOpen(false);
    form.reset();
  };
  return (
    <div className="flex h-screen bg-gray-50">
      <div className="flex-1 overflow-auto">
        <div className="container mx-auto py-10">
          <Card className="max-w-7xl mx-auto">
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="text-2xl">
                    Gestión de Empleados
                  </CardTitle>
                  <CardDescription>
                    Administra los miembros de tu equipo y su información.
                  </CardDescription>
                </div>
                <Button onClick={handleAddEmployee}>
                  <Plus className="h-4 w-4 mr-2" />
                  Agregar Empleado
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="flex items-center space-x-2 mb-6">
                <Search className="h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Buscar empleados..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="max-w-sm"
                />
              </div>

              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Empleado</TableHead>
                    <TableHead>Contacto</TableHead>
                    <TableHead>Estado</TableHead>
                    <TableHead>Acciones</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredEmployees.map((employee) => (
                    <TableRow key={employee.id}>
                      <TableCell>
                        <div className="flex items-center space-x-3">
                          <div>
                            <div className="font-medium">{employee.name}</div>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="space-y-1">
                          <div className="flex items-center text-sm">
                            <Mail className="h-3 w-3 mr-1" />
                            {employee.email}
                          </div>
                          <div className="flex items-center text-sm">
                            <Phone className="h-3 w-3 mr-1" />
                            {employee.phone}
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge
                          variant={
                            employee.status === "active"
                              ? "default"
                              : "secondary"
                          }
                        >
                          {employee.status === "active" ? "Activo" : "Inactivo"}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleEditEmployee(employee)}
                          >
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleDeleteEmployee(employee.id)}
                          >
                            <Trash2 className="h-4 w-4 text-destructive" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </div>
      </div>

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>
              {editingEmployee ? "Editar Empleado" : "Agregar Nuevo Empleado"}
            </DialogTitle>
            <DialogDescription>
              {editingEmployee
                ? "Actualiza la información del empleado."
                : "Agrega un nuevo empleado a tu equipo."}
            </DialogDescription>
          </DialogHeader>

          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Nombre Completo</FormLabel>
                      <FormControl>
                        <Input placeholder="Juan Pérez" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Correo Electrónico</FormLabel>
                      <FormControl>
                        <Input
                          type="email"
                          placeholder="juan.perez@empresa.com"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="phone"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Teléfono</FormLabel>
                      <FormControl>
                        <Input placeholder="+54 (341) 123-4567" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="status"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Estado</FormLabel>
                      <Select
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Seleccionar estado" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="active">Activo</SelectItem>
                          <SelectItem value="inactive">Inactivo</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              <div className="flex justify-end gap-4">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setIsDialogOpen(false)}
                >
                  Cancelar
                </Button>
                <Button type="submit">
                  {editingEmployee ? "Actualizar Empleado" : "Agregar Empleado"}
                </Button>
              </div>
            </form>
          </Form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
