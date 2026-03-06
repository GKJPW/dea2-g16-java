import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import type { InventoryItem } from "@/types/inventory";

interface InventoryFormProps {
  open: boolean;
  onClose: () => void;
  onSubmit: (data: { productId: string; productName: string; quantity: number }) => void;
  initialData?: InventoryItem | null;
  loading?: boolean;
}

const InventoryForm = ({ open, onClose, onSubmit, initialData, loading }: InventoryFormProps) => {
  const [productId, setProductId] = useState(initialData?.productId ?? "");
  const [productName, setProductName] = useState(initialData?.productName ?? "");
  const [quantity, setQuantity] = useState(initialData?.quantity ?? 0);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit({ productId, productName, quantity });
  };

  // Reset fields when dialog opens with new data
  const handleOpenChange = (isOpen: boolean) => {
    if (isOpen) {
      setProductId(initialData?.productId ?? "");
      setProductName(initialData?.productName ?? "");
      setQuantity(initialData?.quantity ?? 0);
    }
    if (!isOpen) onClose();
  };

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>{initialData ? "Edit Inventory Item" : "Add Inventory Item"}</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="productId">Product ID</Label>
            <Input id="productId" value={productId} onChange={(e) => setProductId(e.target.value)} required />
          </div>
          <div className="space-y-2">
            <Label htmlFor="productName">Product Name</Label>
            <Input id="productName" value={productName} onChange={(e) => setProductName(e.target.value)} required />
          </div>
          <div className="space-y-2">
            <Label htmlFor="quantity">Quantity</Label>
            <Input id="quantity" type="number" min={0} value={quantity} onChange={(e) => setQuantity(Number(e.target.value))} required />
          </div>
          <DialogFooter>
            <Button type="button" variant="outline" onClick={onClose}>Cancel</Button>
            <Button type="submit" disabled={loading}>{loading ? "Saving..." : "Save"}</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default InventoryForm;
