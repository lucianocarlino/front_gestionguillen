"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  FileText,
  Package,
  Users,
  BarChart3,
  ChevronLeft,
  ChevronRight,
  List,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

const navigation = [
  {
    name: "Crear Orden de Trabajo",
    href: "/job_orders/create",
    icon: FileText,
    disabled: false,
  },
  { name: "Materiales", href: "/materials", icon: Package, disabled: false },
  { name: "Empleados", href: "/employees", icon: Users, disabled: false },
  {
    name: "Lista de Órdenes de Trabajo",
    href: "/job_orders/list",
    icon: List,
    disabled: false,
  },
  { name: "Estadisticas", href: "/dashboard", icon: BarChart3, disabled: true },
];

export default function SideNav() {
  const [collapsed, setCollapsed] = useState(false);
  const pathname = usePathname();

  return (
    <div
      className={cn(
        "bg-white border-r border-gray-200 transition-all duration-300 flex flex-col",
        collapsed ? "w-20" : "w-64"
      )}
    >
      <div className="p-4 border-b border-gray-200">
        <div className="flex flex-row items-center justify-between">
          {!collapsed && (
            <h2 className="text-lg font-semibold text-gray-900">
              Gestión de Trabajos
            </h2>
          )}
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setCollapsed(!collapsed)}
            className="p-2"
          >
            {collapsed ? (
              <ChevronRight className="h-4 w-4" />
            ) : (
              <ChevronLeft className="h-4 w-4" />
            )}
          </Button>
        </div>
      </div>

      <nav className="flex-1 p-4">
        <ul className="space-y-2">
          {navigation.map((item) => {
            const isActive = pathname === item.href;
            const isDisabled = item.disabled;
            return (
              <li key={item.name}>
                {isDisabled ? (
                  <div
                    className={cn(
                      "flex items-center px-3 py-2 text-sm font-medium rounded-md transition-colors",
                      "text-gray-400 cursor-not-allowed"
                    )}
                  >
                    <item.icon className="h-5 w-5 flex-shrink-0 opacity-50" />
                    {!collapsed && <span className="ml-3">{item.name}</span>}
                  </div>
                ) : (
                  <Link
                    href={item.href}
                    className={cn(
                      "flex items-center px-3 py-2 text-sm font-medium rounded-md transition-colors",
                      isActive
                        ? "bg-blue-100 text-blue-700"
                        : "text-gray-600 hover:bg-gray-100 hover:text-gray-900"
                    )}
                  >
                    <item.icon className="h-5 w-5 flex-shrink-0" />
                    {!collapsed && <span className="ml-3">{item.name}</span>}
                  </Link>
                )}
              </li>
            );
          })}
        </ul>
      </nav>
    </div>
  );
}
