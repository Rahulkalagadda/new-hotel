
"use client"

import { ColumnDef } from "@tanstack/react-table"
import type { User } from "@/lib/types"
import { ArrowUpDown, MoreHorizontal, Shield, User as UserIcon, Briefcase } from "lucide-react"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Badge } from "@/components/ui/badge"
import { format } from "date-fns"
import { Timestamp } from "firebase/firestore"

const roleIcons = {
    admin: <Shield className="mr-2 h-4 w-4 text-red-500" />,
    owner: <Briefcase className="mr-2 h-4 w-4 text-blue-500" />,
    user: <UserIcon className="mr-2 h-4 w-4 text-gray-500" />,
}

export const columns: ColumnDef<User>[] = [
  {
    accessorKey: "name",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          User
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      )
    },
    cell: ({ row }) => {
        const user = row.original
        return (
            <div>
                <div className="font-medium">{user.name}</div>
                <div className="text-xs text-muted-foreground">{user.email}</div>
            </div>
        )
    },
  },
  {
    accessorKey: "role",
    header: "Role",
    cell: ({ row }) => {
      const role = row.getValue("role") as string
      
      const variant = role === "admin" ? "destructive" : role === 'owner' ? 'default' : 'secondary';

      return <Badge variant={variant} className="capitalize flex items-center w-fit">
          {roleIcons[role as keyof typeof roleIcons]}
          {role}
        </Badge>
    },
  },
  {
    accessorKey: "createdAt",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Registration Date
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      )
    },
    cell: ({ row }) => {
        const value = row.getValue("createdAt");
        if (!value) return null;
        const date = value instanceof Timestamp ? value.toDate() : (value as Date);
        try {
            return <div>{format(date, "LLL dd, yyyy")}</div>
        } catch (e) {
            console.error("Invalid date format:", date);
            return <div>Invalid Date</div>
        }
    }
  },
  {
    id: "actions",
    cell: ({ row }) => {
      const user = row.original

      return (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="h-8 w-8 p-0">
              <span className="sr-only">Open menu</span>
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuLabel>Actions</DropdownMenuLabel>
            <DropdownMenuItem
              onClick={() => navigator.clipboard.writeText(user.id)}
            >
              Copy user ID
            </DropdownMenuItem>
             <DropdownMenuItem>
                View Details
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      )
    },
  },
]
