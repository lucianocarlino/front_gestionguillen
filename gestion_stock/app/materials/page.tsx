"use client";

import type React from "react";

import { useState } from "react";
import Image from "next/image";
import { Plus, Search, Edit, Trash2, Upload, ImageIcon } from "lucide-react";
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
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";

const initialMaterials = [
  {
    id: "1",
    code: "MAT-001",
    name: "Tubo de Acero",
    brand: "MetalCorp",
    price: 100,
    stock: 50,
    description: "Tubo de acero de alta calidad para construcción",
    image: "/placeholder.svg?height=100&width=100",
  },
  {
    id: "2",
    code: "MAT-002",
    name: "Cable de Cobre",
    brand: "ElectroSuministros",
    price: 150,
    stock: 30,
    description: "Cable de cobre premium para trabajos eléctricos",
    image: "/placeholder.svg?height=100&width=100",
  },
  {
    id: "3",
    code: "MAT-003",
    name: "Tubo de PVC",
    brand: "PlásticosPro",
    price: 75,
    stock: 100,
    description: "Tubo de PVC duradero para instalaciones sanitarias",
    image: "/placeholder.svg?height=100&width=100",
  },
];

const materialSchema = z.object({
  code: z.string().min(1, "El código del material es obligatorio"),
  name: z.string().min(1, "El nombre del material es obligatorio"),
  brand: z.string().min(1, "La marca es obligatoria"),
  price: z.number().min(0, "El precio debe ser positivo"),
  stock: z.number().min(0, "El stock debe ser cero o positivo"),
  description: z.string().optional(),
  image: z.string().optional(),
});

type MaterialFormValues = z.infer<typeof materialSchema>;

export default function Page() {
  const [materials, setMaterials] = useState(initialMaterials);
  const [searchTerm, setSearchTerm] = useState("");
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isImageDialogOpen, setIsImageDialogOpen] = useState(false);
  const [currentImageUrl, setCurrentImageUrl] = useState("");
  const [editingMaterial, setEditingMaterial] = useState<
    (typeof initialMaterials)[0] | null
  >(null);
  const [materialImage, setMaterialImage] = useState<string>("");

  const form = useForm<MaterialFormValues>({
    resolver: zodResolver(materialSchema),
    defaultValues: {
      code: "",
      name: "",
      brand: "",
      price: 0,
      description: "",
      image: "",
      stock: 0,
    },
  });

  const filteredMaterials = materials.filter(
    (material) =>
      material.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      material.code.toLowerCase().includes(searchTerm.toLowerCase()) ||
      material.brand.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleAddMaterial = () => {
    setEditingMaterial(null);
    form.reset();
    setMaterialImage("");
    setIsDialogOpen(true);
  };

  const handleEditMaterial = (material: (typeof initialMaterials)[0]) => {
    setEditingMaterial(material);
    form.reset({
      code: material.code,
      name: material.name,
      brand: material.brand,
      price: material.price,
      stock: material.stock || 0,
      description: material.description || "",
      image: material.image || "",
    });
    setMaterialImage(material.image || "");
    setIsDialogOpen(true);
  };

  const handleDeleteMaterial = (id: string) => {
    setMaterials(materials.filter((material) => material.id !== id));
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        if (event.target?.result) {
          const imageUrl = event.target.result as string;
          setMaterialImage(imageUrl);
          form.setValue("image", imageUrl);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const onSubmit = (data: MaterialFormValues) => {
    if (editingMaterial) {
      // Update existing material
      setMaterials(
        materials.map((material) =>
          material.id === editingMaterial.id
            ? { ...material, ...data, image: materialImage }
            : material
        )
      );
    } else {
      // Add new material
      const newMaterial = {
        id: Date.now().toString(),
        code: data.code,
        name: data.name,
        brand: data.brand,
        price: data.price,
        stock: data.stock,
        description: data.description || "",
        image: materialImage || "",
      };
      setMaterials([...materials, newMaterial]);
    }
    setIsDialogOpen(false);
    form.reset();
    setMaterialImage("");
  };

  const showImage = (imageUrl: string) => {
    setCurrentImageUrl(imageUrl);
    setIsImageDialogOpen(true);
  };

  return (
    <div className="flex h-screen bg-gray-50">
      <div className="flex-1 overflow-auto">
        <div className="container mx-auto py-10">
          <Card className="max-w-6xl mx-auto">
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="text-2xl">
                    Gestión de Materiales
                  </CardTitle>
                  <CardDescription>
                    Administre su inventario de materiales y precios.
                  </CardDescription>
                </div>
                <Button onClick={handleAddMaterial}>
                  <Plus className="h-4 w-4 mr-2" />
                  Agregar Material
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="flex items-center space-x-2 mb-6">
                <Search className="h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Buscar materiales"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="max-w-sm"
                />
              </div>

              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Código</TableHead>
                    <TableHead>Nombre</TableHead>
                    <TableHead>Marca</TableHead>
                    <TableHead>Precio</TableHead>
                    <TableHead>Stock</TableHead>
                    <TableHead>Descripción</TableHead>
                    <TableHead>Acciones</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredMaterials.map((material) => (
                    <TableRow key={material.id}>
                      <TableCell className="font-medium">
                        {material.code}
                      </TableCell>
                      <TableCell>{material.name}</TableCell>
                      <TableCell>{material.brand}</TableCell>
                      <TableCell>${material.price}</TableCell>
                      <TableCell>{material.stock}</TableCell>
                      <TableCell className="max-w-xs truncate">
                        {material.description}
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => showImage(material.image)}
                          >
                            <ImageIcon className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleEditMaterial(material)}
                          >
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleDeleteMaterial(material.id)}
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
              {editingMaterial ? "Editar Material" : "Agregar Nuevo Material"}
            </DialogTitle>
            <DialogDescription>
              {editingMaterial
                ? "Actualice la información del material."
                : "Agregue un nuevo material a su inventario."}
            </DialogDescription>
          </DialogHeader>

          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <div className="grid grid-cols-1 gap-4">
                <FormField
                  control={form.control}
                  name="code"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Código de Material</FormLabel>
                      <FormControl>
                        <Input placeholder="MAT-001" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="price"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Precio ($)</FormLabel>
                      <FormControl>
                        <Input type="number" placeholder="100" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="stock"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Stock</FormLabel>
                      <FormControl>
                        <Input type="number" placeholder="0" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Nombre del Material</FormLabel>
                      <FormControl>
                        <Input placeholder="Tubo de Acero" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="brand"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Marca</FormLabel>
                      <FormControl>
                        <Input placeholder="MetalCorp" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <FormField
                control={form.control}
                name="description"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Descripción</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="Descripción del material..."
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="image"
                render={() => (
                  <FormItem>
                    <FormLabel>Imagen del Material</FormLabel>
                    <FormControl>
                      <div className="border rounded-md w-full h-32 flex flex-col items-center justify-center overflow-hidden relative">
                        {materialImage ? (
                          <Image
                            src={materialImage || "/placeholder.svg"}
                            alt="Vista previa del material"
                            fill
                            className="object-cover"
                          />
                        ) : (
                          <div className="flex flex-col items-center justify-center text-muted-foreground p-4 text-center">
                            <Upload className="h-8 w-8 mb-2" />
                            <p>Subir una imagen</p>
                          </div>
                        )}
                        <Input
                          type="file"
                          accept="image/*"
                          className="absolute inset-0 opacity-0 cursor-pointer"
                          onChange={handleImageUpload}
                        />
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="flex justify-end gap-4">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setIsDialogOpen(false)}
                >
                  Cancelar
                </Button>
                <Button type="submit">
                  {editingMaterial ? "Actualizar Material" : "Agregar Material"}
                </Button>
              </div>
            </form>
          </Form>
        </DialogContent>
      </Dialog>
      <Dialog open={isImageDialogOpen} onOpenChange={setIsImageDialogOpen}>
        <DialogContent className="max-w-3xl p-0 overflow-hidden">
          <DialogHeader className="p-4 absolute top-0 left-0 right-0 bg-background/80 backdrop-blur-sm z-10">
            <DialogTitle className="text-lg">Imagen del material</DialogTitle>
          </DialogHeader>
          <div className="relative w-full h-[70vh]">
            <Image
              src={currentImageUrl}
              alt="Vista previa del material"
              fill
              className="object-contain"
              priority
            />
          </div>
          <div className="p-4 flex justify-end">
            <Button
              onClick={() => setIsImageDialogOpen(false)}
              variant="outline"
            >
              Cerrar
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
