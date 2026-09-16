import { useEffect, useState } from "react";
import { useParams } from "react-router";
import { ArrowLeft, Package, MapPin, CreditCard } from "lucide-react";
import { getMyOrderById, cancelMyOrder } from "@/features/my-orders/api/ordersApi";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";

export default function OrderDetails(){
  const { id } = useParams();
  const [order, setOrder] = useState(null);
  const [status, setStatus] = useState("loading");
  const [isCancelling, setIsCancelling] = useState(false);
  const [cancelError, setCancelError] = useState(null);

  useEffect(() => {
    const controller = new AbortController();

    async function fetchOrder(){
      try {
        const response = await getMyOrderById(id, controller.signal);
        if (controller.signal.aborted) return;
        setOrder(response.data.order);
        setStatus("success");
      } catch {
        if (controller.signal.aborted) return;
          setStatus("error");
      }
    }

    fetchOrder();
    return () => controller.abort();
  }, [id]);

  async function handleCancelOrder(){
    const controller = new AbortController();

    try {
      setIsCancelling(true);
      setCancelError(null);
      const response = await cancelMyOrder(id, controller.signal);
      if (controller.signal.aborted) return;
      setOrder(response.data.order);
    } catch (error){
      if (controller.signal.aborted) return;
      setCancelError(error.response?.data?.message || "Failed to cancel order.");
    } finally {
      if (!controller.signal.aborted){
        setIsCancelling(false);
      }
    }
  }

  if(status === "loading"){
    return (
      <main className="mx-auto w-full max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
        <p className="text-[var(--color-text-secondary)]">Loading...</p>
      </main>
    );
  }

  if(status === "error"){
    return (
      <main className="mx-auto w-full max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
        <Card className="border-[var(--color-border)] bg-[var(--color-surface)]">
          <CardContent className="p-6">
            <p className="text-[var(--color-error)]">Failed to load order.</p>
          </CardContent>
        </Card>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-[var(--color-background)]">
      <div className="mx-auto w-full max-w-7xl space-y-6 px-4 py-10 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="font-mono text-xs text-[var(--color-text-secondary)]">ORDER</p>
            <h1 className="mt-1 font-display text-2xl font-bold text-[var(--color-text-primary)]">Order Details </h1>
            <p className="mt-1 font-mono text-xs text-[var(--color-text-secondary)]">#{order._id}</p>
            <p className="mt-2 text-sm text-[var(--color-text-secondary)]">
              Ordered on{" "}
              {new Date(order.createdAt).toLocaleDateString("en-US", {
                year: "numeric",
                month: "long",
                day: "numeric",
              })}
            </p>
          </div>

          <Badge variant="outline" className="w-fit border-transparent bg-[var(--color-success-bg)] text-[var(--color-success)]">
            {order.status}
          </Badge>
        </div>

        {/* Order Items */}
        <Card className="border-[var(--color-border)] bg-[var(--color-surface)]">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 font-display">
              <Package className="size-5" aria-hidden="true" />
              Order Items
            </CardTitle>
          </CardHeader>

          <CardContent className="space-y-4">
            {order.items.map((item) => (
              <div key={item.product} className="flex flex-wrap items-center gap-4">
                <div className="flex size-20 shrink-0 items-center justify-center overflow-hidden rounded-xl bg-[var(--color-surface-secondary)]">
                  <img src={item.image} alt={item.name} className="size-full object-cover" />
                </div>

                <div className="min-w-0 flex-1">
                  <p className="font-medium text-[var(--color-text-primary)]">{item.name}</p>
                  <p className="mt-1 text-sm text-[var(--color-text-secondary)]">Quantity: {item.quantity}</p>
                </div>
                <p className="font-display font-semibold text-[var(--color-text-primary)]">{item.price} EGP</p>
              </div> 
            ))}
          </CardContent>
        </Card>

        <div className="grid gap-6 lg:grid-cols-2">
          {/* Shipping */}
          <Card className="border-[var(--color-border)] bg-[var(--color-surface)]">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 font-display">
                <MapPin className="size-5" aria-hidden="true" />
                Shipping Address
              </CardTitle>
            </CardHeader>

            <CardContent className="space-y-2 text-sm">
              <p className="font-medium">{order.shippingAddress.fullName}</p>
              <p className="text-[var(--color-text-secondary)]">{order.shippingAddress.phone}</p>
              <p className="text-[var(--color-text-secondary)]">{order.shippingAddress.address}</p>
              <p className="text-[var(--color-text-secondary)]">
                {order.shippingAddress.city}, {order.shippingAddress.country}
              </p>
              <p className="text-[var(--color-text-secondary)]">
                {order.shippingAddress.postalCode}
              </p>
            </CardContent>
          </Card>

          {/* Payment */}
          <Card className="border-[var(--color-border)] bg-[var(--color-surface)]">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 font-display">
                <CreditCard className="size-5" aria-hidden="true" />
                Payment
              </CardTitle>
            </CardHeader>

            <CardContent className="space-y-3">
              <div className="flex justify-between gap-4">
                <span className="text-sm text-[var(--color-text-secondary)]">Method</span>
                <span className="text-sm font-medium capitalize">{order.paymentMethod}</span>
              </div>

              <div className="flex justify-between gap-4">
                <span className="text-sm text-[var(--color-text-secondary)]">Payment Status</span>
                <span className="text-sm font-medium capitalize">{order.paymentStatus}</span>
              </div>

              <Separator />

              <div className="flex justify-between gap-4">
                <span className="text-sm text-[var(--color-text-secondary)]">Subtotal</span>
                <span className="text-sm font-medium">{order.subtotal} EGP</span>
              </div>

              <div className="flex justify-between gap-4">
                <span className="text-sm text-[var(--color-text-secondary)]">Shipping</span>
                <span className="text-sm font-medium">{order.shippingFee} EGP</span>
              </div>

              <div className="flex justify-between gap-4">
                <span className="text-sm text-[var(--color-text-secondary)]">Tax</span>
                <span className="text-sm font-medium">{order.tax} EGP</span>
              </div>

              <Separator />

              <div className="flex justify-between gap-4">
                <span className="font-display font-semibold">Total</span>
                <span className="font-display text-xl font-bold text-[var(--color-primary)]">{order.totalPrice} EGP</span>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Cancel Error */}
        {cancelError && <p className="text-sm text-[var(--color-error)]">{cancelError}</p>}

        {/* Actions */}
        <div className="flex flex-wrap items-center gap-3">
          <Button variant="outline" onClick={() => window.history.back()} className="border-[var(--color-supporting)] hover:bg-[var(--color-accent)]">
            <ArrowLeft aria-hidden="true" />
            Back to My Orders
          </Button>

          {order.status !== "cancelled" && (
            <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button variant="destructive">Cancel Order</Button>
              </AlertDialogTrigger>

              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>Cancel order?</AlertDialogTitle>
                  <AlertDialogDescription>Are you sure you want to cancel this order?</AlertDialogDescription>
                </AlertDialogHeader>

                <AlertDialogFooter>
                  <AlertDialogCancel disabled={isCancelling}>Keep order</AlertDialogCancel>
                  <AlertDialogAction variant="destructive" onClick={handleCancelOrder} disabled={isCancelling}>
                    {isCancelling ? "Cancelling..." : "Cancel order"}
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          )}
        </div>
      </div>
    </main>
  );
} 