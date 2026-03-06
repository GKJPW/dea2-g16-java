import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Pencil, PackagePlus, Trash2 } from "lucide-react";
import type { InventoryItem } from "@/types/inventory";

interface InventoryTableProps {
  items: InventoryItem[];
  onEdit: (item: InventoryItem) => void;
  onRestock: (item: InventoryItem) => void;
  onDelete: (item: InventoryItem) => void;
}

const InventoryTable = ({ items, onEdit, onRestock, onDelete }: InventoryTableProps) => (
  <div className="overflow-x-auto rounded-lg border border-border">
    <Table>
      <TableHeader>
        <TableRow className="bg-muted/50">
          <TableHead className="w-16">ID</TableHead>
          <TableHead>Product ID</TableHead>
          <TableHead>Product Name</TableHead>
          <TableHead className="text-right">Quantity</TableHead>
          <TableHead>Last Updated</TableHead>
          <TableHead className="text-right">Actions</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {items.length === 0 ? (
          <TableRow>
            <TableCell colSpan={6} className="text-center py-12 text-muted-foreground">
              No inventory items found. Add one to get started.
            </TableCell>
          </TableRow>
        ) : (
          items.map((item) => (
            <TableRow key={item.id} className="hover:bg-muted/30 transition-colors">
              <TableCell className="font-mono text-xs text-muted-foreground">{item.id}</TableCell>
              <TableCell className="font-medium">{item.productId}</TableCell>
              <TableCell>{item.productName}</TableCell>
              <TableCell className="text-right font-semibold tabular-nums">{item.quantity}</TableCell>
              <TableCell className="text-muted-foreground text-sm">
                {new Date(item.lastUpdated).toLocaleString()}
              </TableCell>
              <TableCell className="text-right">
                <div className="flex justify-end gap-1">
                  <Button variant="ghost" size="icon" onClick={() => onEdit(item)} title="Edit">
                    <Pencil className="h-4 w-4" />
                  </Button>
                  <Button variant="ghost" size="icon" onClick={() => onRestock(item)} title="Restock" className="text-accent hover:text-accent">
                    <PackagePlus className="h-4 w-4" />
                  </Button>
                  <Button variant="ghost" size="icon" onClick={() => onDelete(item)} title="Delete" className="text-destructive hover:text-destructive">
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </TableCell>
            </TableRow>
          ))
        )}
      </TableBody>
    </Table>
  </div>
);

export default InventoryTable;
