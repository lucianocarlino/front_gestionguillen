"use client";
import { useState } from "react";
import Image from "next/image";
import {
  ChevronLeft,
  ChevronRight,
  Trash2,
  Search,
  Plus,
  Minus,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { Package } from "lucide-react";

interface Material {
  code: string;
  name: string;
  brand: string;
  image?: string;
  price?: number;
  quantity?: number;
}

interface MaterialCarouselProps {
  materials: Material[];
  currentIndex: number;
  onIndexChange: (index: number) => void;
  onRemoveMaterial: (index: number) => void;
  onAddMaterial: (material: Material) => void;
  onUpdateQuantity?: (index: number, quantity: number) => void;
  form: unknown;
}

// Mock materials database (in a real app, this would come from your API)
const availableMaterials = [
  {
    id: "1",
    code: "MAT-001",
    name: "Tubo de Acero",
    brand: "MetalCorp",
    price: 100,
    description: "Tubo de acero de alta calidad para construcción",
    image: "/placeholder.svg?height=100&width=100",
  },
  {
    id: "2",
    code: "MAT-002",
    name: "Cable de Cobre",
    brand: "ElectroSuministros",
    price: 150,
    description: "Cable de cobre premium para trabajos eléctricos",
    image: "/placeholder.svg?height=100&width=100",
  },
  {
    id: "3",
    code: "MAT-003",
    name: "Tubo de PVC",
    brand: "PlásticosPro",
    price: 75,
    description: "Tubo de PVC duradero para instalaciones sanitarias",
    image: "/placeholder.svg?height=100&width=100",
  },
  {
    id: "4",
    code: "MAT-004",
    name: "Lámina de Aluminio",
    brand: "MetalCorp",
    price: 200,
    description: "Lámina de aluminio ligera",
    image: "/placeholder.svg?height=100&width=100",
  },
  {
    id: "5",
    code: "MAT-005",
    name: "Mezcla de Concreto",
    brand: "ConstruPro",
    price: 50,
    description: "Concreto premezclado",
    image: "/placeholder.svg?height=100&width=100",
  },
  {
    id: "6",
    code: "MAT-006",
    name: "Tabla de Madera",
    brand: "MaderaCorp",
    price: 80,
    description: "Tablas de madera premium",
    image: "/placeholder.svg?height=100&width=100",
  },
];

export default function MaterialCarousel({
  materials,
  currentIndex,
  onIndexChange,
  onRemoveMaterial,
  onAddMaterial,
  onUpdateQuantity,
}: MaterialCarouselProps) {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");

  const goToPrevious = () => {
    if (materials.length > 0) {
      onIndexChange(currentIndex > 0 ? currentIndex - 1 : materials.length - 1);
    }
  };

  const goToNext = () => {
    if (materials.length > 0) {
      onIndexChange(currentIndex < materials.length - 1 ? currentIndex + 1 : 0);
    }
  };

  const incrementQuantity = () => {
    if (!materials[currentIndex]) return;
    const newQuantity = (materials[currentIndex].quantity || 0) + 1;
    onUpdateQuantity?.(currentIndex, newQuantity);
  };

  const decrementQuantity = () => {
    if (!materials[currentIndex]) return;
    const currentQuantity = materials[currentIndex].quantity || 0;
    const newQuantity = Math.max(0, currentQuantity - 1);
    onUpdateQuantity?.(currentIndex, newQuantity);
  };

  const filteredMaterials = availableMaterials.filter(
    (material) =>
      material.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      material.code.toLowerCase().includes(searchTerm.toLowerCase()) ||
      material.brand.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleSelectMaterial = (
    selectedMaterial: (typeof availableMaterials)[0]
  ) => {
    const material: Material = {
      code: selectedMaterial.code,
      name: selectedMaterial.name,
      brand: selectedMaterial.brand,
      image: selectedMaterial.image,
      price: selectedMaterial.price,
    };
    onAddMaterial(material);
    setIsDialogOpen(false);
    setSearchTerm("");
  };

  if (materials.length === 0) {
    return (
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-medium">Materiales</h3>
          <Button type="button" onClick={() => setIsDialogOpen(true)}>
            <Plus className="h-4 w-4 mr-2" />
            Agregar Material
          </Button>
        </div>
        <div className="text-center py-8 text-muted-foreground">
          <p>Aún no se han agregado materiales.</p>
          <p className="text-sm mt-2">
            Haga clic en &quot;Agregar Material&quot; para seleccionar de los
            materiales disponibles.
          </p>
        </div>

        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Seleccionar Material</DialogTitle>
              <DialogDescription>
                Elija materiales de su inventario para agregar a esta orden de
                trabajo.
              </DialogDescription>
            </DialogHeader>

            <div className="space-y-4">
              <div className="flex items-center space-x-2">
                <Search className="h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Buscar materiales por nombre, código o marca..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>

              <div className="max-h-96 overflow-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Código</TableHead>
                      <TableHead>Nombre</TableHead>
                      <TableHead>Marca</TableHead>
                      <TableHead>Precio</TableHead>
                      <TableHead>Acción</TableHead>
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
                        <TableCell>
                          <Badge variant="secondary">${material.price}</Badge>
                        </TableCell>
                        <TableCell>
                          <Button
                            size="sm"
                            onClick={() => handleSelectMaterial(material)}
                          >
                            Seleccionar
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>
    );
  }

  const currentMaterial = materials[currentIndex];

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-medium">Materiales de Trabajo</h3>
        <div className="flex items-center gap-2">
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={() => setIsDialogOpen(true)}
          >
            <Plus className="h-4 w-4 mr-2" />
            Agregar Más
          </Button>
          <span className="text-sm text-muted-foreground">
            {currentIndex + 1} de {materials.length}
          </span>
          <div className="flex gap-1">
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={goToPrevious}
            >
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={goToNext}
            >
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>

      <Card>
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <CardTitle className="text-lg">
              Material #{currentIndex + 1}
            </CardTitle>
            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={() => onRemoveMaterial(currentIndex)}
            >
              <Trash2 className="h-4 w-4 text-destructive" />
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <div>
                <Label>Código de Material</Label>
                <div className="mt-1 p-3 bg-muted rounded-md">
                  <span className="font-medium">{currentMaterial.code}</span>
                </div>
              </div>

              <div>
                <Label>Nombre del Material</Label>
                <div className="mt-1 p-3 bg-muted rounded-md">
                  <span className="font-medium">{currentMaterial.name}</span>
                </div>
              </div>

              <div>
                <Label>Marca</Label>
                <div className="mt-1 p-3 bg-muted rounded-md">
                  <span className="font-medium">{currentMaterial.brand}</span>
                </div>
              </div>

              <div>
                <Label>Precio Unitario</Label>
                <div className="mt-1 p-3 bg-muted rounded-md">
                  <span className="font-medium">${currentMaterial.price}</span>
                </div>
              </div>

              <div>
                <Label>Usados</Label>
                <div className="mt-1 p-3 bg-muted rounded-md">
                  <div className="mt-1 flex items-center">
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={decrementQuantity}
                      disabled={(currentMaterial.quantity || 0) <= 0}
                    >
                      <Minus className="h-4 w-4" />
                    </Button>
                    <div className="flex-1 bg-muted rounded-md mx-2 text-center">
                      <span className="font-medium">
                        {currentMaterial.quantity}
                      </span>
                    </div>
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={incrementQuantity}
                    >
                      <Plus className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </div>
            </div>

            <div className="flex flex-col items-center justify-center">
              <Label>Imagen del Material</Label>
              <div className="mt-1 border rounded-md w-full aspect-square flex flex-col items-center justify-center overflow-hidden relative">
                {currentMaterial.image ? (
                  <Image
                    src={currentMaterial.image || "/placeholder.svg"}
                    alt="Vista previa del material"
                    fill
                    className="object-cover"
                  />
                ) : (
                  <div className="flex flex-col items-center justify-center text-muted-foreground p-4 text-center">
                    <Package className="h-8 w-8 mb-2" />
                    <p>Imagen no disponible</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Material indicators */}
      <div className="flex justify-center gap-2">
        {materials.map((_, index) => (
          <button
            key={index}
            type="button"
            onClick={() => onIndexChange(index)}
            className={cn(
              "w-2 h-2 rounded-full transition-colors",
              index === currentIndex ? "bg-blue-600" : "bg-gray-300"
            )}
          />
        ))}
      </div>

      {/* Material Selection Dialog */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="dialog-full-width">
          <DialogHeader>
            <DialogTitle>Seleccionar Material</DialogTitle>
            <DialogDescription>
              Elija materiales de su inventario para agregar a esta orden de
              trabajo.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4">
            <div className="flex items-center space-x-2">
              <Search className="h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Buscar materiales por nombre, código o marca..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>

            <div className="max-h-96 overflow-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Código</TableHead>
                    <TableHead>Nombre</TableHead>
                    <TableHead>Marca</TableHead>
                    <TableHead>Precio</TableHead>
                    <TableHead>Acción</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredMaterials.map((material) => {
                    const isAlreadySelected = materials.some(
                      (m) => m.code === material.code
                    );
                    return (
                      <TableRow key={material.id}>
                        <TableCell className="font-medium">
                          {material.code}
                        </TableCell>
                        <TableCell>{material.name}</TableCell>
                        <TableCell>{material.brand}</TableCell>
                        <TableCell>
                          <Badge variant="secondary">${material.price}</Badge>
                        </TableCell>
                        <TableCell>
                          <Button
                            size="sm"
                            onClick={() => handleSelectMaterial(material)}
                            disabled={isAlreadySelected}
                          >
                            {isAlreadySelected ? "Seleccionado" : "Seleccionar"}
                          </Button>
                        </TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
