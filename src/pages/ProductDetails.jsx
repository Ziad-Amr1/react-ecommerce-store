import { useState } from "react";
import { Link, useLocation, useNavigate, useParams } from "react-router";
import { useTranslation } from "react-i18next";
import { toast } from "sonner";
import {
  ChevronRight,
  ChevronLeft,
  Heart,
  Share2,
  Zap,
  ShoppingCart,
  Maximize2,
  Check,
  Truck,
  ShieldCheck,
  RotateCcw,
  TriangleAlert,
  CircleCheck,
  CircleX,
  LoaderCircle,
  ChevronDown,
  ChevronUp,
  Cpu,
  Monitor,
  Network,
  Usb,
  CreditCard,
  Layers,
  Laptop,
  Shield,
  MessageSquare,
  Minus,
  Plus,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";

import { formatCurrency } from "@/utils/formatCurrency";

import useProductDetails from "@/features/products/useProductDetails";
import useRelatedProducts from "@/features/products/useRelatedProducts";
import useCart from "@/hooks/useCart";
import useAuth from "@/hooks/useAuth";
import useWishlist from "@/hooks/useWishlist";

import Stars from "@/features/products/components/ProductRating";
import ProductSkeleton from "@/features/products/components/ProductCardSkeleton";
import ProductCard from "@/features/products/components/ProductCard";
import SEO from "@/components/SEO/SEO";

export default function ProductDetails() {
  const navigate = useNavigate();
  const { t } = useTranslation();
  const { id } = useParams();
  const location = useLocation();

  const { product, isLoading, error, retry } = useProductDetails(id);
  const { addItem } = useCart();
  const { isAuthenticated } = useAuth();
  const { isInWishlist, addToWishlist, removeFromWishlist } = useWishlist();

  const [selectedImage, setSelectedImage] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [isAdding, setIsAdding] = useState(false);
  const [isBuying, setIsBuying] = useState(false);
  const [isWishlistLoading, setIsWishlistLoading] = useState(false);
  const [isLightboxOpen, setIsLightboxOpen] = useState(false);
  const [isDescriptionExpanded, setIsDescriptionExpanded] = useState(false);

  const {
    similarProducts,
    recommendedProducts,
    isLoading: isRelatedLoading,
  } = useRelatedProducts(product);

  const productId = product?._id || product?.id || id;
  const isFavorite = productId ? isInWishlist(productId) : false;

  const handleWishlistToggle = async () => {
    if (isWishlistLoading || !productId) return;

    if (!isAuthenticated) {
      toast.info(t("wishlist.signInRequired"));
      navigate("/login", {
        state: { from: location.pathname + location.search },
      });
      return;
    }

    setIsWishlistLoading(true);

    try {
      if (isFavorite) {
        await removeFromWishlist(productId);
        toast.success(t("wishlist.removed"));
      } else {
        await addToWishlist(product);
        toast.success(t("wishlist.added"));
      }
    } catch {
      toast.error(t("wishlist.updateError"));
    } finally {
      setIsWishlistLoading(false);
    }
  };

  const handleShare = () => {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(window.location.href);
      toast.success(t("productDetails.linkCopied", "Product link copied to clipboard"));
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen text-foreground font-body transition-colors duration-300">
        <div className="mx-auto max-w-6xl space-y-8 py-8 px-4 sm:px-6">
          <div className="h-6 w-64 animate-pulse rounded-lg bg-muted" />

          <div className="grid gap-8 lg:grid-cols-2">
            <ProductSkeleton />

            <div className="space-y-4">
              <div className="h-8 w-3/4 animate-pulse rounded-lg bg-muted" />
              <div className="h-4 w-1/2 animate-pulse rounded-lg bg-muted" />
              <div className="h-12 w-full animate-pulse rounded-2xl bg-muted" />
              <div className="h-28 w-full animate-pulse rounded-2xl bg-muted" />
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen text-foreground font-body transition-colors duration-300">
        <div className="mx-auto max-w-6xl py-8 px-4 sm:px-6">
          <div className="flex flex-col items-center justify-center rounded-2xl border border-border bg-card py-20">
            <div className="mb-3 flex size-14 items-center justify-center rounded-full bg-destructive/10">
              <TriangleAlert
                className="size-7 text-destructive"
                aria-hidden="true"
              />
            </div>

            <h2 className="font-display text-lg font-semibold text-foreground">
              {t("products.loadErrorTitle")}
            </h2>

            <p className="mt-1 text-sm text-muted-foreground">
              {t("products.loadProductFailed")}
            </p>

            <Button className="mt-4 rounded-xl" onClick={retry}>
              {t("products.retry")}
            </Button>
          </div>
        </div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="min-h-screen text-foreground font-body transition-colors duration-300">
        <div className="mx-auto w-full max-w-6xl px-4 py-8 sm:px-6">
          <div className="flex flex-col items-center justify-center rounded-2xl border border-border bg-card py-20">
            <h2 className="font-display text-lg font-semibold text-foreground">
              {t("products.notFound")}
            </h2>

            <Button
              variant="outline"
              className="mt-4 rounded-xl"
              onClick={() => navigate("/products")}
            >
              {t("products.backToList")}
            </Button>
          </div>
        </div>
      </div>
    );
  }

  const productName = product.name || t("shop.untitledProduct");
  const images = product.images?.filter((image) => image?.url) ?? [];
  const currentImage = images[selectedImage]?.url || (images.length > 0 ? images[0]?.url : null);

  const hasDiscount =
    product.discountPrice != null &&
    product.discountPrice > 0 &&
    product.discountPrice < product.price;

  const displayPrice = product.discountPrice || product.price;

  const salePercentage = hasDiscount
    ? Math.round(
        ((product.price - product.discountPrice) / product.price) * 100,
      )
    : null;

  const rating = Number(product.averageRating) || 4.8;
  const reviewsCount = Number(product.numReviews) || 320;
  const isOutOfStock = product.stock === 0;

  const handleAddToCart = async () => {
    if (isOutOfStock || isAdding) return;

    setIsAdding(true);
    try {
      for (let i = 0; i < quantity; i++) {
        await addItem(product);
      }
      toast.success(
        t("cart.added", {
          name: productName,
        }),
      );
    } catch {
      toast.error(t("cart.addFailed"));
    } finally {
      setIsAdding(false);
    }
  };

  const handleBuyNow = async () => {
    if (isOutOfStock || isBuying) return;

    setIsBuying(true);
    try {
      for (let i = 0; i < quantity; i++) {
        await addItem(product);
      }
      navigate("/cart");
    } catch {
      toast.error(t("cart.addFailed"));
    } finally {
      setIsBuying(false);
    }
  };

  const handlePrevImage = () => {
    if (images.length === 0) return;
    setSelectedImage((prev) => (prev > 0 ? prev - 1 : images.length - 1));
  };

  const handleNextImage = () => {
    if (images.length === 0) return;
    setSelectedImage((prev) => (prev < images.length - 1 ? prev + 1 : 0));
  };

  // 8 Key feature items
  const keyFeatures = [
    {
      icon: Cpu,
      title: t("productDetails.powerDelivery", "Power Delivery"),
      value: "98W",
    },
    {
      icon: Monitor,
      title: t("productDetails.displaySupport", "Display Support"),
      value: "Dual 4K / 8K",
    },
    {
      icon: Network,
      title: t("productDetails.ethernet", "Ethernet"),
      value: "2.5GbE",
    },
    {
      icon: Usb,
      title: t("productDetails.usbPorts", "USB Ports"),
      value: "8x USB Ports",
      desc: "(USB-A & USB-C)",
    },
    {
      icon: CreditCard,
      title: t("productDetails.sdCard", "SD/microSD"),
      value: "SD/microSD",
      desc: "UHS-II",
    },
    {
      icon: Layers,
      title: t("productDetails.totalPorts", "Ports Total"),
      value: "18 Ports",
      desc: "Total",
    },
    {
      icon: Laptop,
      title: t("productDetails.osCompatibility", "Mac & Windows"),
      value: "Mac & Windows",
      desc: t("productDetails.osCompatible", "Compatible"),
    },
    {
      icon: Shield,
      title: t("productDetails.premiumBuild", "Premium Build"),
      value: "Premium Build",
      desc: t("productDetails.aluminumChassis", "Aluminum chassis"),
    },
  ];

  // Description checkmark points
  const bulletSpecs = [
    "18 versatile ports for maximum connectivity",
    "Up to 98W Power Delivery to charge your laptop",
    "2.5 Gigabit Ethernet for ultra-fast networking",
    "Supports dual 4K or one 8K display",
    "SD and microSD UHS-II card readers",
    "Compatible with macOS and Windows",
  ];

  const visibleBullets = isDescriptionExpanded ? bulletSpecs : bulletSpecs.slice(0, 3);

  return (
    <div className="min-h-screen text-foreground font-body transition-colors duration-300 py-6 sm:py-8">
      <SEO
        title={productName}
        description={product.description || t("productDetails.seoDescription")}
        keywords={[product.category, product.brand, ...bulletSpecs]
          .filter(Boolean)
          .join(", ")}
        image={currentImage || undefined}
        url={`/products/${productId}`}
        type="product"
      />
      <div className="mx-auto max-w-6xl space-y-6 px-4 sm:px-6">
        {/* Breadcrumb Bar */}
        <nav aria-label="Breadcrumb" className="flex items-center gap-1.5 text-xs text-muted-foreground flex-wrap mb-2">
          <Link to="/" className="hover:text-foreground transition-colors">
            {t("store.header.nav.home", "Home")}
          </Link>
          <ChevronRight className="size-3.5 rtl:rotate-180" />
          <Link to="/products" className="hover:text-foreground transition-colors">
            {t("store.header.nav.shop", "Shop")}
          </Link>
          {product.category && (
            <>
              <ChevronRight className="size-3.5 rtl:rotate-180" />
              <Link
                to={`/products?category=${encodeURIComponent(product.category)}`}
                className="hover:text-foreground capitalize transition-colors"
              >
                {product.category}
              </Link>
            </>
          )}
          {product.subcategory && (
            <>
              <ChevronRight className="size-3.5 rtl:rotate-180" />
              <span className="capitalize">{product.subcategory}</span>
            </>
          )}
          <ChevronRight className="size-3.5 rtl:rotate-180" />
          <span className="text-foreground font-medium truncate max-w-[200px] sm:max-w-xs">
            {productName}
          </span>
        </nav>

        {/* Top Product Section (2 Columns) */}
        <div className="grid gap-8 lg:grid-cols-2 items-start">
          {/* LEFT COLUMN: Gallery & Key Features */}
          <div className="space-y-6">
            {/* Gallery Box */}
            <div className="flex gap-4">
              {/* Vertical Thumbnail Strip (ONLY shown if images.length > 1) */}
              {images.length > 1 && (
                <div className="flex flex-col gap-3 shrink-0">
                  {images.map((image, index) => (
                    <button
                      key={index}
                      type="button"
                      onClick={() => setSelectedImage(index)}
                      className={`relative size-14 sm:size-16 overflow-hidden rounded-xl border bg-card transition-all cursor-pointer ${
                        index === selectedImage
                          ? "border-primary ring-2 ring-primary/20 shadow-xs"
                          : "border-border opacity-70 hover:opacity-100"
                      }`}
                    >
                      <img
                        src={image.url}
                        alt=""
                        className="size-full object-cover"
                      />
                    </button>
                  ))}
                </div>
              )}

              {/* Main Image Container */}
              <div className="relative flex-1 aspect-square overflow-hidden rounded-3xl border border-border/60 bg-muted/30 dark:bg-muted/10 shadow-xs group flex items-center justify-center">
                {currentImage ? (
                  <img
                    src={currentImage}
                    alt={productName}
                    className="size-full object-contain p-6 transition-transform duration-300"
                  />
                ) : (
                  <div className="text-sm text-muted-foreground">
                    {t("products.noImage", "No image")}
                  </div>
                )}

                {/* Carousel Controls (Only shown if multiple images) */}
                {images.length > 1 && (
                  <>
                    <button
                      type="button"
                      onClick={handlePrevImage}
                      className="absolute start-3 top-1/2 -translate-y-1/2 flex size-9 items-center justify-center rounded-full bg-background/80 text-foreground border border-border shadow-md backdrop-blur-xs transition-transform hover:scale-105 cursor-pointer"
                      aria-label="Previous image"
                    >
                      <ChevronLeft className="size-5 rtl:rotate-180" />
                    </button>
                    <button
                      type="button"
                      onClick={handleNextImage}
                      className="absolute end-3 top-1/2 -translate-y-1/2 flex size-9 items-center justify-center rounded-full bg-background/80 text-foreground border border-border shadow-md backdrop-blur-xs transition-transform hover:scale-105 cursor-pointer"
                      aria-label="Next image"
                    >
                      <ChevronRight className="size-5 rtl:rotate-180" />
                    </button>
                  </>
                )}

                {/* Lightbox Trigger */}
                {currentImage && (
                  <button
                    type="button"
                    onClick={() => setIsLightboxOpen(true)}
                    className="absolute end-3 bottom-3 flex size-9 items-center justify-center rounded-full bg-background/80 text-foreground border border-border shadow-md backdrop-blur-xs transition-transform hover:scale-105 cursor-pointer"
                    aria-label="Expand image"
                  >
                    <Maximize2 className="size-4" />
                  </button>
                )}
              </div>
            </div>

            {/* Key Features Section */}
            <Card className="rounded-3xl border border-border/80 bg-card shadow-xs py-0 gap-0">
              <CardContent className="p-5 sm:p-6 space-y-4">
                <h3 className="font-display text-lg font-bold text-foreground">
                  {t("productDetails.keyFeatures", "Key Features")}
                </h3>

                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                  {keyFeatures.map((feat, i) => {
                    const IconComp = feat.icon;
                    return (
                      <div
                        key={i}
                        className="flex flex-col items-center justify-center p-3.5 text-center rounded-2xl border border-border/60 bg-muted/20 hover:bg-muted/40 transition-colors"
                      >
                        <div className="mb-2 flex size-9 items-center justify-center rounded-xl bg-background border border-border/50 text-foreground shadow-2xs">
                          <IconComp className="size-4" />
                        </div>
                        <span className="font-display font-bold text-sm text-foreground leading-tight">
                          {feat.value}
                        </span>
                        <span className="text-[11px] text-muted-foreground mt-0.5 leading-tight">
                          {feat.desc || feat.title}
                        </span>
                      </div>
                    );
                  })}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* RIGHT COLUMN: Product Info & Purchasing */}
          <div className="space-y-6">
            <Card className="rounded-3xl border border-border/80 bg-card shadow-xs py-0 gap-0">
              <CardContent className="p-6 sm:p-7 space-y-5">
                {/* Brand & Action Links Bar */}
                <div className="flex items-center justify-between gap-2">
                  {product.brand ? (
                    <Badge className="rounded-full bg-blue-600/10 text-blue-600 dark:bg-blue-500/20 dark:text-blue-400 hover:bg-blue-600/15 border-none font-semibold px-3 py-1 text-xs">
                      {product.brand}
                    </Badge>
                  ) : (
                    <Badge variant="secondary" className="rounded-full px-3 py-1 text-xs">
                      {product.category || "Store"}
                    </Badge>
                  )}

                  <div className="flex items-center gap-4 text-xs text-muted-foreground">
                    <button
                      type="button"
                      onClick={handleWishlistToggle}
                      disabled={isWishlistLoading}
                      className="flex items-center gap-1.5 hover:text-foreground transition-colors cursor-pointer"
                    >
                      <Heart
                        className={`size-4 ${isFavorite ? "fill-destructive text-destructive" : ""}`}
                      />
                      <span>{t("store.header.nav.wishlist", "Wishlist")}</span>
                    </button>

                    <button
                      type="button"
                      onClick={handleShare}
                      className="flex items-center gap-1.5 hover:text-foreground transition-colors cursor-pointer"
                    >
                      <Share2 className="size-4" />
                      <span>{t("productDetails.share", "Share")}</span>
                    </button>
                  </div>
                </div>

                {/* Product Title & Subtitle */}
                <div className="space-y-1">
                  <h1 className="font-display text-2xl sm:text-3xl font-bold tracking-tight text-foreground">
                    {productName}
                  </h1>
                  {product.shortDescription && (
                    <p className="text-sm text-muted-foreground leading-relaxed">
                      {product.shortDescription}
                    </p>
                  )}
                </div>

                {/* Rating & Questions Row */}
                <div className="flex flex-wrap items-center gap-3 text-xs text-muted-foreground pt-1">
                  <div className="flex items-center gap-1.5">
                    <Stars value={rating} />
                    <span className="font-bold text-foreground">{rating.toFixed(1)}</span>
                    <span>({reviewsCount} reviews)</span>
                  </div>
                  <span className="text-border">|</span>
                  <div className="flex items-center gap-1.5">
                    <MessageSquare className="size-3.5" />
                    <span>
                      {t("productDetails.answeredQuestions", {
                        count: 12,
                        defaultValue: "12 answered questions",
                      })}
                    </span>
                  </div>
                </div>

                {/* Pricing, Discount & Stock Status */}
                <div className="flex flex-wrap items-center justify-between gap-4 pt-3 border-t border-border/60">
                  <div className="flex items-baseline gap-2.5">
                    <span className="font-display text-3xl font-bold tabular-nums text-foreground">
                      {formatCurrency(displayPrice)}
                    </span>
                    {hasDiscount && (
                      <span className="text-base text-muted-foreground line-through tabular-nums">
                        {formatCurrency(product.price)}
                      </span>
                    )}
                    {hasDiscount && (
                      <Badge className="bg-red-500 text-white text-xs font-bold px-2.5 py-0.5 rounded-full border-none">
                        {salePercentage}% off
                      </Badge>
                    )}
                  </div>

                  <div className="flex items-center gap-2">
                    {isOutOfStock ? (
                      <Badge variant="outline" className="text-destructive border-destructive/30 rounded-full px-3 py-1">
                        <CircleX className="size-3.5 me-1" />
                        {t("shop.outOfStock", "Out of Stock")}
                      </Badge>
                    ) : (
                      <div className="flex flex-col items-end">
                        <Badge className="bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-none rounded-full px-3 py-1 text-xs font-semibold">
                          <CircleCheck className="size-3.5 me-1" />
                          {t("shop.inStock", "In Stock")}
                        </Badge>
                        <span className="text-[11px] text-muted-foreground mt-0.5">
                          {t("productDetails.shipsWithin", "Ships within 1–2 business days")}
                        </span>
                      </div>
                    )}
                  </div>
                </div>

                {/* Quantity & Purchasing CTAs */}
                <div className="space-y-3 pt-2">
                  <div className="flex items-center gap-3">
                    {/* Quantity Stepper */}
                    <div className="flex items-center rounded-xl border border-border bg-card p-1">
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        className="size-8 rounded-lg"
                        onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                        disabled={quantity <= 1 || isOutOfStock}
                      >
                        <Minus className="size-3.5" />
                      </Button>
                      <span className="w-10 text-center text-sm font-semibold tabular-nums">
                        {quantity}
                      </span>
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        className="size-8 rounded-lg"
                        onClick={() => setQuantity((q) => Math.min(q + 1, product.stock || 99))}
                        disabled={isOutOfStock || quantity >= (product.stock || 99)}
                      >
                        <Plus className="size-3.5" />
                      </Button>
                    </div>

                    {/* Add to Cart Button */}
                    <Button
                      className="flex-1 h-11 rounded-xl bg-foreground text-background hover:bg-foreground/90 font-semibold cursor-pointer"
                      onClick={handleAddToCart}
                      disabled={isAdding || isOutOfStock}
                    >
                      {isAdding ? (
                        <LoaderCircle className="size-4 animate-spin me-2" />
                      ) : (
                        <ShoppingCart className="size-4 me-2" />
                      )}
                      {t("shop.addToCart", "Add to Cart")}
                    </Button>
                  </div>

                  {/* Buy Now Button */}
                  <Button
                    variant="outline"
                    className="w-full h-11 rounded-xl border-border bg-muted/40 hover:bg-muted font-semibold text-foreground cursor-pointer"
                    onClick={handleBuyNow}
                    disabled={isBuying || isOutOfStock}
                  >
                    {isBuying ? (
                      <LoaderCircle className="size-4 animate-spin me-2" />
                    ) : (
                      <Zap className="size-4 me-2 text-primary" />
                    )}
                    {t("productDetails.buyNow", "Buy Now")}
                  </Button>
                </div>

                {/* Value Props / Trust Card */}
                <div className="grid grid-cols-3 gap-2 p-4 rounded-2xl border border-border/60 bg-muted/20 text-center">
                  <div className="flex flex-col items-center space-y-1">
                    <Truck className="size-5 text-muted-foreground" />
                    <span className="font-semibold text-xs text-foreground">
                      {t("productDetails.freeShipping", "Free shipping")}
                    </span>
                    <span className="text-[11px] text-muted-foreground">
                      {t("productDetails.freeShippingDesc", "on orders over $100")}
                    </span>
                  </div>

                  <div className="flex flex-col items-center space-y-1 border-x border-border/60 px-2">
                    <ShieldCheck className="size-5 text-muted-foreground" />
                    <span className="font-semibold text-xs text-foreground">
                      {t("productDetails.officialWarranty", "1 year warranty")}
                    </span>
                    <span className="text-[11px] text-muted-foreground">
                      {t("productDetails.officialWarrantyDesc", "Official warranty")}
                    </span>
                  </div>

                  <div className="flex flex-col items-center space-y-1">
                    <RotateCcw className="size-5 text-muted-foreground" />
                    <span className="font-semibold text-xs text-foreground">
                      {t("productDetails.easyReturns", "Easy returns")}
                    </span>
                    <span className="text-[11px] text-muted-foreground">
                      {t("productDetails.easyReturnsDesc", "30-day return policy")}
                    </span>
                  </div>
                </div>

                {/* Product Metadata Bar */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 p-4 rounded-2xl border border-border/60 bg-card text-xs">
                  <div>
                    <span className="text-muted-foreground block">{t("products.fields.category", "Category")}</span>
                    <span className="font-bold text-foreground capitalize mt-0.5 block truncate">
                      {product.category || "—"}
                    </span>
                  </div>

                  <div>
                    <span className="text-muted-foreground block">{t("products.fields.subcategory", "Subcategory")}</span>
                    <span className="font-bold text-foreground capitalize mt-0.5 block truncate">
                      {product.subcategory || "—"}
                    </span>
                  </div>

                  <div>
                    <span className="text-muted-foreground block">{t("products.fields.brand", "Brand")}</span>
                    <span className="font-bold text-foreground capitalize mt-0.5 block truncate">
                      {product.brand || "—"}
                    </span>
                  </div>

                  <div>
                    <span className="text-muted-foreground block">{t("products.fields.sku", "SKU")}</span>
                    <span className="font-bold text-foreground uppercase mt-0.5 block truncate font-mono">
                      {product.sku || `ACC-${productName.slice(0, 4).toUpperCase()}-01`}
                    </span>
                  </div>
                </div>

                {/* Description & Bullet Specs */}
                <div className="pt-3 border-t border-border/60 space-y-3">
                  <h2 className="font-display text-base font-bold text-foreground">
                    {t("products.sections.description", "Description")}
                  </h2>

                  <p className={`text-sm text-muted-foreground leading-relaxed ${!isDescriptionExpanded ? "line-clamp-2" : ""}`}>
                    {product.description ||
                      "The titan of Thunderbolt docks. Offering 18 ports of unmatched connectivity for professional Mac and Windows workstations. Power your devices, connect multiple displays, transfer data at blazing speeds, and streamline your workspace with a single cable."}
                  </p>

                  <ul className="space-y-2 pt-1 text-sm text-foreground">
                    {visibleBullets.map((item, idx) => (
                      <li key={idx} className="flex items-start gap-2 text-xs sm:text-sm">
                        <Check className="size-4 text-foreground shrink-0 mt-0.5" />
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>

                  <button
                    type="button"
                    onClick={() => setIsDescriptionExpanded(!isDescriptionExpanded)}
                    className="inline-flex items-center gap-1 text-xs font-semibold text-foreground hover:text-primary transition-colors mt-2 cursor-pointer"
                  >
                    <span>
                      {isDescriptionExpanded
                        ? t("productDetails.showLess", "Show less")
                        : t("productDetails.showMore", "Show more")}
                    </span>
                    {isDescriptionExpanded ? (
                      <ChevronUp className="size-3.5" />
                    ) : (
                      <ChevronDown className="size-3.5" />
                    )}
                  </button>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Similar Products */}
        {!isRelatedLoading && similarProducts.length > 0 && (
          <section className="space-y-5 border-t border-border pt-10">
            <div>
              <p className="text-xs font-semibold uppercase tracking-wider text-primary">
                {t("products.similarProducts")}
              </p>
              <h2 className="mt-1 font-display text-2xl font-bold text-foreground">
                {t("products.youMayAlsoLike")}
              </h2>
            </div>

            <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
              {similarProducts.map((item) => (
                <ProductCard key={item._id} product={item} viewMode="grid" />
              ))}
            </div>
          </section>
        )}

        {/* Recommended Products */}
        {!isRelatedLoading && recommendedProducts.length > 0 && (
          <section className="space-y-5 border-t border-border pt-10">
            <div>
              <p className="text-xs font-semibold uppercase tracking-wider text-primary">
                {t("products.recommended")}
              </p>
              <h2 className="mt-1 font-display text-2xl font-bold text-foreground">
                {t("products.recommendedForYou")}
              </h2>
            </div>

            <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
              {recommendedProducts.map((item) => (
                <ProductCard key={item._id} product={item} viewMode="grid" />
              ))}
            </div>
          </section>
        )}
      </div>

      {/* Lightbox Dialog */}
      <Dialog open={isLightboxOpen} onOpenChange={setIsLightboxOpen}>
        <DialogContent className="max-w-4xl p-0 overflow-hidden bg-background border-border">
          <DialogTitle className="sr-only">{productName} image viewer</DialogTitle>
          <div className="relative aspect-square sm:aspect-video w-full flex items-center justify-center p-8 bg-muted/20">
            {currentImage && (
              <img
                src={currentImage}
                alt={productName}
                className="size-full object-contain"
              />
            )}
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}