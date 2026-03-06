import { useState, useEffect, useCallback } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Plus, Package, RefreshCw, Loader2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

import InventoryTable from "@/components/InventoryTable";
import InventoryForm from "@/components/InventoryForm";
import RestockModal from "@/components/RestockModal";
import ConfirmDeleteDialog from "@/components/ConfirmDeleteDialog";

import * as api from "@/services/inventoryApi";
import type { InventoryItem } from "@/types/inventory";

const InventoryDashboard = () => {
  const { toast } = useToast();

  const [items, setItems] = useState<InventoryItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(false);

  const [formOpen, setFormOpen] = useState(false);
  const [editItem, setEditItem] = useState<InventoryItem | null>(null);
  const [restockItem, setRestockItem] = useState<InventoryItem | null>(null);
  const [deleteItem, setDeleteItem] = useState<InventoryItem | null>(null);

  const fetchItems = useCallback(async () => {
    setLoading(true);

    try {
      const data = await api.getAllInventory();

      if (Array.isArray(data)) {
        setItems(data);
      } else {
        console.warn("Unexpected inventory response:", data);
        setItems([]);
      }

    } catch (error) {

      console.error(error);

      toast({
        title: "Error",
        description: "Failed to fetch inventory",
        variant: "destructive"
      });

      setItems([]);

    } finally {
      setLoading(false);
    }

  }, [toast]);

  useEffect(() => {
    fetchItems();
  }, [fetchItems]);

  const handleAdd = async (data: { productId: string; productName: string; quantity: number }) => {

    setActionLoading(true);

    try {

      await api.addInventory(data);

      toast({
        title: "Success",
        description: "Item added successfully"
      });

      setFormOpen(false);
      fetchItems();

    } catch {

      toast({
        title: "Error",
        description: "Failed to add item",
        variant: "destructive"
      });

    } finally {
      setActionLoading(false);
    }
  };

  const handleUpdate = async (data: { productId: string; productName: string; quantity: number }) => {

    if (!editItem) return;

    setActionLoading(true);

    try {

      await api.updateInventory(editItem.id, data);

      toast({
        title: "Success",
        description: "Item updated successfully"
      });

      setEditItem(null);
      fetchItems();

    } catch {

      toast({
        title: "Error",
        description: "Failed to update item",
        variant: "destructive"
      });

    } finally {
      setActionLoading(false);
    }
  };

  const handleRestock = async (quantity: number) => {

    if (!restockItem) return;

    setActionLoading(true);

    try {

      await api.restockInventory(restockItem.id, quantity);

      toast({
        title: "Success",
        description: `Restocked ${restockItem.productName}`
      });

      setRestockItem(null);
      fetchItems();

    } catch {

      toast({
        title: "Error",
        description: "Failed to restock item",
        variant: "destructive"
      });

    } finally {
      setActionLoading(false);
    }
  };

  const handleDelete = async () => {

    if (!deleteItem) return;

    setActionLoading(true);

    try {

      await api.deleteInventory(deleteItem.id);

      toast({
        title: "Success",
        description: `Deleted ${deleteItem.productName}`
      });

      setDeleteItem(null);
      fetchItems();

    } catch {

      toast({
        title: "Error",
        description: "Failed to delete item",
        variant: "destructive"
      });

    } finally {
      setActionLoading(false);
    }
  };

  const totalItems = items.length;

  const totalQuantity = items.reduce((sum, item) => sum + (item.quantity || 0), 0);

  const lowStock = items.filter(item => item.quantity < 10).length;

  return (
    <div className="min-h-screen bg-background">

      {/* Header */}
      <header className="border-b border-border bg-card">
        <div className="container mx-auto flex items-center justify-between py-4 px-4">

          <div className="flex items-center gap-3">

            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary">
              <Package className="h-5 w-5 text-primary-foreground" />
            </div>

            <div>
              <h1 className="text-xl font-bold">Inventory Manager</h1>
              <p className="text-xs text-muted-foreground">
                Track and manage your stock
              </p>
            </div>

          </div>

          <div className="flex gap-2">

            <Button
              variant="outline"
              size="sm"
              onClick={fetchItems}
              disabled={loading}
            >
              <RefreshCw className={`h-4 w-4 mr-1 ${loading ? "animate-spin" : ""}`} />
              Refresh
            </Button>

            <Button
              size="sm"
              onClick={() => {
                setEditItem(null);
                setFormOpen(true);
              }}
            >
              <Plus className="h-4 w-4 mr-1" />
              Add Item
            </Button>

          </div>

        </div>
      </header>

      {/* Stats */}
      <div className="container mx-auto px-4 py-6">

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm text-muted-foreground">
                Total Items
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-2xl font-bold">{totalItems}</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm text-muted-foreground">
                Total Quantity
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-2xl font-bold">{totalQuantity}</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm text-muted-foreground">
                Low Stock (&lt;10)
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-2xl font-bold text-destructive">{lowStock}</p>
            </CardContent>
          </Card>

        </div>

        {/* Table */}
        <Card>

          <CardHeader>
            <CardTitle>Inventory Items</CardTitle>
          </CardHeader>

          <CardContent>

            {loading ? (

              <div className="flex items-center justify-center py-16">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
              </div>

            ) : (

              <InventoryTable
                items={items}
                onEdit={(item) => setEditItem(item)}
                onRestock={(item) => setRestockItem(item)}
                onDelete={(item) => setDeleteItem(item)}
              />

            )}

          </CardContent>

        </Card>

      </div>

      {/* Forms / Modals */}

      <InventoryForm
        open={formOpen}
        onClose={() => setFormOpen(false)}
        onSubmit={handleAdd}
        loading={actionLoading}
      />

      <InventoryForm
        open={!!editItem}
        onClose={() => setEditItem(null)}
        onSubmit={handleUpdate}
        initialData={editItem}
        loading={actionLoading}
      />

      <RestockModal
        open={!!restockItem}
        onClose={() => setRestockItem(null)}
        onSubmit={handleRestock}
        productName={restockItem?.productName}
        loading={actionLoading}
      />

      <ConfirmDeleteDialog
        open={!!deleteItem}
        onClose={() => setDeleteItem(null)}
        onConfirm={handleDelete}
        productName={deleteItem?.productName}
        loading={actionLoading}
      />

    </div>
  );
};

export default InventoryDashboard;