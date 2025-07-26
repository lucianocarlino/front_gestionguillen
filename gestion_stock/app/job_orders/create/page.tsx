"use client";

import type React from "react";

import { useEffect, useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { CalendarIcon, CreditCard, Wallet, Banknote } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { format } from "date-fns";
import { es } from "date-fns/locale";
import { cn } from "@/lib/utils";
import MaterialCarousel from "@/components/material_carrousel";
import { redirect } from "next/navigation";

const formSchema = z.object({
  orderNumber: z.string().min(1, "El número de orden es obligatorio"),
  orderDate: z.date(),
  employeeId: z.string().min(1, "El empleado es obligatorio"),
  paymentMethod: z.enum(["credit_card", "cash", "bank_transfer"], {
    message: "Por favor seleccione un método de pago",
  }),
  materials: z
    .array(
      z.object({
        code: z.string(),
        name: z.string(),
        brand: z.string(),
        image: z.string().optional(),
        price: z.number().min(0, "El precio debe ser al menos 0"),
        quantity: z.number().min(1, "La cantidad debe ser al menos 1"),
      })
    )
    .min(1, "Se requiere al menos un material"),
  Price: z.number(),
  totalPrice: z.string(),
});

type FormValues = z.infer<typeof formSchema>;

// Mock data for employees
const employees = [
  { id: "1", name: "Juan Pérez" },
  { id: "2", name: "María González" },
  { id: "3", name: "Roberto Rodríguez" },
  { id: "4", name: "Elena Martínez" },
];

// Mock material base prices (in a real app, these would come from a database)
const materialBasePrices: Record<string, number> = {
  "MAT-001": 100,
  "MAT-002": 150,
  "MAT-003": 200,
  "MAT-004": 250,
  "MAT-005": 300,
};

export type Material = {
  code: string;
  name: string;
  brand: string;
  image?: string;
  price?: number;
  quantity?: number;
};

export default function Page() {
  const [materialImages, setMaterialImages] = useState<{
    [key: number]: string;
  }>({});
  const [currentMaterialIndex, setCurrentMaterialIndex] = useState(0);

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      orderNumber: "",
      orderDate: new Date(),
      employeeId: "",
      paymentMethod: "credit_card",
      materials: [],
      Price: 0,
      totalPrice: "$0",
    },
  });

  const materials = form.watch("materials");
  const Price = form.watch("Price");

  // Calculate total price based on materials and difficulty rate
  useEffect(() => {
    // Base price calculation (in a real app, this would be more sophisticated)
    let basePrice = 0;

    // Add price for each material
    materials.forEach((material) => {
      if (material.code in materialBasePrices) {
        basePrice += materialBasePrices[material.code] * material.quantity;
      } else if (material.code) {
        // If code doesn't match our mock data but exists, add a default price
        basePrice += 100;
      }
    });

    // Apply difficulty multiplier (higher difficulty = higher price)
    const finalPrice = Math.round(basePrice + Price);

    // Format as currency
    const formattedPrice = new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(finalPrice);

    form.setValue("totalPrice", formattedPrice);
  }, [materials, Price, form]);

  // Handle form submission
  function onSubmit(data: FormValues) {
    console.log("Form submitted:", data);
    // Here you would typically send the data to your API
    alert("Orden de trabajo enviada con éxito!");
    redirect("create");
  }

  // Handle adding a new material
  function addMaterial(material: Material) {
    const materials = form.getValues("materials");
    form.setValue("materials", [
      ...materials,
      {
        code: material.code,
        name: material.name,
        brand: material.brand,
        image: material.image,
        price: material.price || 0,
        quantity: 1,
      },
    ]);
    setCurrentMaterialIndex(materials.length); // Navigate to the new material
  }

  // Handle removing a material
  function removeMaterial(index: number) {
    const materials = form.getValues("materials");
    console.log("Removing material at index:", index);
    form.setValue(
      "materials",
      materials.filter((_, i) => i !== index)
    );

    // Also remove the image
    const newMaterialImages = { ...materialImages };
    delete newMaterialImages[index];
    setMaterialImages(newMaterialImages);

    // Adjust current index if necessary
    if (currentMaterialIndex >= materials.length - 1) {
      setCurrentMaterialIndex(Math.max(0, materials.length - 2));
    }
  }

  function handleUpdateQuantity(index: number, quantity: number) {
    const materials = [...form.getValues("materials")];
    materials[index] = {
      ...materials[index],
      quantity: quantity,
    };
    form.setValue("materials", materials);
  }

  return (
    <div className="flex-1 overflow-auto">
      <div className="container mx-auto py-10">
        <Card className="max-w-7xl mx-auto">
          <CardHeader>
            <CardTitle className="text-2xl">Crear Orden de Trabajo</CardTitle>
            <CardDescription>
              Ingrese los detalles de la orden de trabajo.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Form {...form}>
              <form
                onSubmit={form.handleSubmit(onSubmit)}
                className="space-y-8"
              >
                <div className="flex flex-col lg:flex-row gap-6">
                  <div className="flex-grow lg:w-2/3 space-y-8">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <FormField
                        control={form.control}
                        name="orderNumber"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Número de Orden</FormLabel>
                            <FormControl>
                              <Input placeholder="OT-12345" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name="orderDate"
                        render={({ field }) => (
                          <FormItem className="flex flex-col">
                            <FormLabel>Fecha</FormLabel>
                            <Popover>
                              <PopoverTrigger asChild>
                                <FormControl>
                                  <Button
                                    variant={"outline"}
                                    className={cn(
                                      "w-full pl-3 text-left font-normal",
                                      !field.value && "text-muted-foreground"
                                    )}
                                  >
                                    {field.value ? (
                                      format(field.value, "PPP", { locale: es })
                                    ) : (
                                      <span>Seleccionar fecha</span>
                                    )}
                                    <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                                  </Button>
                                </FormControl>
                              </PopoverTrigger>
                              <PopoverContent
                                className="w-auto p-0"
                                align="start"
                              >
                                <Calendar
                                  mode="single"
                                  selected={field.value}
                                  onSelect={field.onChange}
                                  initialFocus
                                  locale={es}
                                />
                              </PopoverContent>
                            </Popover>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <FormField
                        control={form.control}
                        name="employeeId"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Empleado</FormLabel>
                            <Select
                              onValueChange={field.onChange}
                              defaultValue={field.value}
                            >
                              <FormControl>
                                <SelectTrigger>
                                  <SelectValue placeholder="Seleccionar un empleado" />
                                </SelectTrigger>
                              </FormControl>
                              <SelectContent>
                                {employees.map((employee) => (
                                  <SelectItem
                                    key={employee.id}
                                    value={employee.id}
                                  >
                                    {employee.name}
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name="paymentMethod"
                        render={({ field }) => (
                          <FormItem className="space-y-3">
                            <FormLabel>Método de Pago</FormLabel>
                            <FormControl>
                              <RadioGroup
                                onValueChange={field.onChange}
                                defaultValue={field.value}
                                className="flex space-x-2"
                              >
                                <FormItem className="flex items-center space-y-0">
                                  <FormControl>
                                    <RadioGroupItem value="credit_card" />
                                  </FormControl>
                                  <FormLabel className="font-normal flex items-center">
                                    <CreditCard className="h-4 w-4" />
                                    Crédito
                                  </FormLabel>
                                </FormItem>
                                <FormItem className="flex items-center space-y-0">
                                  <FormControl>
                                    <RadioGroupItem value="cash" />
                                  </FormControl>
                                  <FormLabel className="font-normal flex items-center">
                                    <Banknote className="h-4 w-4 mr-1" />
                                    Efectivo
                                  </FormLabel>
                                </FormItem>
                                <FormItem className="flex items-center space-y-0">
                                  <FormControl>
                                    <RadioGroupItem value="bank_transfer" />
                                  </FormControl>
                                  <FormLabel className="font-normal flex items-center">
                                    <Wallet className="h-4 w-4 mr-1" />
                                    Transferencia
                                  </FormLabel>
                                </FormItem>
                              </RadioGroup>
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>

                    <div className="space-y-6">
                      <MaterialCarousel
                        materials={materials}
                        currentIndex={currentMaterialIndex}
                        onIndexChange={setCurrentMaterialIndex}
                        onRemoveMaterial={removeMaterial}
                        onAddMaterial={addMaterial}
                        onUpdateQuantity={handleUpdateQuantity}
                        form={form}
                      />
                    </div>
                  </div>

                  <div className="lg:w-1/3 space-y-6">
                    <Card>
                      <CardHeader>
                        <CardTitle className="text-lg">
                          Lista de Materiales
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
                        {materials.length === 0 ? (
                          <p className="text-sm text-muted-foreground">
                            Aún no se han agregado materiales.
                          </p>
                        ) : (
                          <ul className="list-disc pl-5 space-y-1">
                            {materials.map((material, index) => (
                              <li key={index} className="text-sm">
                                {material.name || `Material #${index + 1}`}
                                {material.code ? ` (${material.code})` : ""}
                              </li>
                            ))}
                          </ul>
                        )}
                      </CardContent>
                    </Card>

                    <Card>
                      <CardHeader>
                        <CardTitle className="text-lg">
                          Resumen de la Orden
                        </CardTitle>
                      </CardHeader>
                      <CardContent className="space-y-4">
                        <FormField
                          control={form.control}
                          name="Price"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Mano de obra</FormLabel>
                              <FormControl>
                                <Input
                                  type="number"
                                  {...field}
                                  onChange={(e) => {
                                    const value =
                                      e.target.value === ""
                                        ? 0
                                        : Number.parseInt(e.target.value);
                                    field.onChange(value);
                                  }}
                                />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />

                        <FormField
                          control={form.control}
                          name="totalPrice"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Precio Total (Calculado)</FormLabel>
                              <FormControl>
                                <Input
                                  {...field}
                                  readOnly
                                  className="bg-muted-foreground/10 font-medium"
                                />
                              </FormControl>
                              <FormMessage />
                              <p className="text-sm text-muted-foreground mt-1">
                                Auto-calculado en base a los materiales
                              </p>
                            </FormItem>
                          )}
                        />
                      </CardContent>
                    </Card>
                  </div>
                </div>

                <div className="flex justify-end gap-4">
                  <Button type="button" variant="outline">
                    Cancelar
                  </Button>
                  <Button type="submit">Enviar Orden de Trabajo</Button>
                </div>
              </form>
            </Form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
