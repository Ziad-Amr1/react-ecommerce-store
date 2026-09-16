import { Badge } from "@/components/ui/badge";

export default function OrderStatusBadge({ status }){
  const statusConfig = {
    pending: {
      label: "Pending",
      variant: "secondary",
    },
    confirmed: {
      label: "Confirmed",
      variant: "secondary",
    },
    processing: {
      label: "Processing",
      variant: "secondary",
    },
    shipped: {
      label: "Shipped",
      variant: "secondary",
    },
    delivered: {
      label: "Delivered",
      variant: "secondary",
    },
    cancelled: {
      label: "Cancelled",
      variant: "destructive",
    },
  };

  const config = statusConfig[status] || {
    label: status || "Unknown",
    variant: "secondary",
  };

  return <Badge variant={config.variant}>{config.label}</Badge>;
} 