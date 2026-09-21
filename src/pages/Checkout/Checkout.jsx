import { useRef, useState } from "react";
import { Link, useNavigate } from "react-router";
import { useTranslation } from "react-i18next";
import { toast } from "sonner";
import {
  CreditCard,
  Globe,
  Home,
  LoaderCircle,
  Lock,
  MapPin,
  PackageOpen,
  Phone,
  ShoppingBag,
  User,
  WalletCards,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Empty,
  EmptyContent,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from "@/components/ui/empty";
import useCart from "@/hooks/useCart";
import { cn } from "@/lib/utils";
import { formatCurrency, ORDER_CURRENCY } from "@/utils/formatCurrency";
import SEO from "@/components/SEO/SEO";
import { getApiErrorMessage } from "@/features/auth/utils/getApiErrorMessage";
import { createOrder } from "@/features/checkout/checkout.service";
import {
  INITIAL_SHIPPING_ADDRESS,
  validateShippingForm,
} from "@/features/checkout/checkoutValidation";

function FieldError({ id, message }) {
  if (!message) {
    return null;
  }

  return (
    <p id={id} role="alert" className="mt-1 text-sm text-(--color-error)">
      {message}
    </p>
  );
}

function Field({ htmlFor, label, optional, error, errorId, children }) {
  return (
    <div>
      <label
        htmlFor={htmlFor}
        className="mb-1.5 flex items-center gap-1.5 text-sm font-medium text-(--color-text-primary)"
      >
        {label}
        {optional && (
          <span className="text-xs font-normal text-muted-foreground">
            {optional}
          </span>
        )}
      </label>
      {children}
      <FieldError id={errorId} message={error} />
    </div>
  );
}

function IconInput({ id, icon: Icon, error, errorId, ...props }) {
  return (
    <div className="relative">
      <Icon
        className="pointer-events-none absolute start-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground"
        aria-hidden="true"
      />
      <Input
        id={id}
        className="ps-9"
        aria-invalid={error ? true : undefined}
        aria-describedby={error ? errorId : undefined}
        {...props}
      />
    </div>
  );
}

const SHIPPING_FIELDS = [
  {
    name: "fullName",
    icon: User,
    labelKey: "fullNameLabel",
    placeholderKey: "fullNamePlaceholder",
    autoComplete: "name",
  },
  {
    name: "phone",
    icon: Phone,
    labelKey: "phoneLabel",
    placeholderKey: "phonePlaceholder",
    autoComplete: "tel",
    type: "tel",
  },
  {
    name: "country",
    icon: Globe,
    labelKey: "countryLabel",
    placeholderKey: "countryPlaceholder",
    autoComplete: "country-name",
  },
  {
    name: "city",
    icon: MapPin,
    labelKey: "cityLabel",
    placeholderKey: "cityPlaceholder",
    autoComplete: "address-level2",
  },
  {
    name: "address",
    icon: Home,
    labelKey: "addressLabel",
    placeholderKey: "addressPlaceholder",
    autoComplete: "street-address",
    multiline: true,
  },
  {
    name: "postalCode",
    icon: MapPin,
    labelKey: "postalCodeLabel",
    placeholderKey: "postalCodePlaceholder",
    autoComplete: "postal-code",
    optional: true,
  },
];

export default function Checkout() {
  const { t, i18n } = useTranslation();
  const navigate = useNavigate();
  const { cart, isLoading: isCartLoading, clear } = useCart();
  const abortRef = useRef(null);

  const [shippingAddress, setShippingAddress] = useState(
    INITIAL_SHIPPING_ADDRESS,
  );
  const [customerNote, setCustomerNote] = useState("");
  const [paymentMethod, setPaymentMethod] = useState("cash");
  const [errors, setErrors] = useState({});
  const [apiError, setApiError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const locale = i18n.language || "en-US";
  const money = (value) => formatCurrency(value, ORDER_CURRENCY, locale);
  const isCartEmpty = !isCartLoading && cart.items.length === 0;

  const handleChange = (name) => (event) => {
    const { value } = event.target;

    setShippingAddress((current) => ({ ...current, [name]: value }));
    setErrors((current) =>
      current[name] ? { ...current, [name]: "" } : current,
    );
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (isSubmitting) {
      return;
    }

    if (isCartEmpty) {
      toast.error(t("checkout.emptyCartError"));
      return;
    }

    const nextErrors = validateShippingForm(shippingAddress, paymentMethod, t);

    if (Object.keys(nextErrors).length > 0) {
      setErrors(nextErrors);
      toast.error(t("checkout.validationError"));
      return;
    }

    setErrors({});
    setApiError("");
    setIsSubmitting(true);

    const controller = new AbortController();
    abortRef.current = controller;

    try {
      const response = await createOrder(
        {
          shippingAddress: {
            ...shippingAddress,
            fullName: shippingAddress.fullName.trim(),
            phone: shippingAddress.phone.trim(),
            country: shippingAddress.country.trim(),
            city: shippingAddress.city.trim(),
            address: shippingAddress.address.trim(),
            postalCode: shippingAddress.postalCode.trim(),
          },
          paymentMethod,
          customerNote: customerNote.trim(),
        },
        controller.signal,
      );

      if (controller.signal.aborted) {
        return;
      }

      // The order already exists at this point; a failed cart reset must not
      // block the confirmation screen.
      try {
        await clear();
      } catch {
        // ignored on purpose
      }

      toast.success(t("checkout.orderSuccessToast"));
      navigate("/order-success", {
        replace: true,
        state: { fromCheckout: true, orderId: response?.order?._id ?? null },
      });
    } catch (error) {
      if (controller.signal.aborted) {
        return;
      }

      const message = getApiErrorMessage(error, t("checkout.genericError"));
      setApiError(message);
      toast.error(message);
    } finally {
      if (!controller.signal.aborted) {
        setIsSubmitting(false);
      }
    }
  };

  return (
    <div className="mx-auto max-w-6xl py-8">
      <SEO
        title={t("checkout.title")}
        description={t("checkout.subtitle")}
        url="/checkout"
        noindex
      />
      <header className="max-w-2xl">
        <h1 className="font-display text-2xl font-bold text-foreground sm:text-3xl">
          {t("checkout.title")}
        </h1>
        <p className="mt-2 text-sm text-muted-foreground">
          {t("checkout.subtitle")}
        </p>
      </header>

      {isCartLoading ? (
        <div
          role="status"
          className="mt-8 flex flex-col items-center justify-center gap-3 py-16 text-muted-foreground"
        >
          <LoaderCircle
            className="size-6 animate-spin text-(--color-primary)"
            aria-hidden="true"
          />
          <span className="text-sm">{t("common.loading")}</span>
        </div>
      ) : isCartEmpty ? (
        <Empty className="mt-6 border border-dashed">
          <EmptyHeader>
            <EmptyMedia variant="icon">
              <ShoppingBag className="size-6" aria-hidden="true" />
            </EmptyMedia>
            <EmptyTitle>{t("checkout.emptyCartTitle")}</EmptyTitle>
            <EmptyDescription>
              {t("checkout.emptyCartDescription")}
            </EmptyDescription>
          </EmptyHeader>
          <EmptyContent>
            <Button asChild>
              <Link to="/cart">{t("checkout.backToCart")}</Link>
            </Button>
          </EmptyContent>
        </Empty>
      ) : (
        <form
          onSubmit={handleSubmit}
          noValidate
          className="mt-8 grid gap-6 lg:grid-cols-[minmax(0,1.5fr)_minmax(0,1fr)] lg:items-start"
        >
          <div className="space-y-6">
            <section className="rounded-xl border border-(--color-border) bg-(--color-surface-primary) p-5 sm:p-6">
              <div className="mb-5">
                <h2 className="font-display text-lg font-semibold text-foreground">
                  {t("checkout.shipping.title")}
                </h2>
                <p className="mt-1 text-sm text-muted-foreground">
                  {t("checkout.shipping.subtitle")}
                </p>
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                {SHIPPING_FIELDS.map((field) => {
                  const Icon = field.icon;
                  const errorId = `checkout-${field.name}-error`;
                  const error = errors[field.name];

                  return (
                    <div
                      key={field.name}
                      className={cn(field.multiline && "sm:col-span-2")}
                    >
                      <Field
                        htmlFor={`checkout-${field.name}`}
                        label={t(`checkout.shipping.${field.labelKey}`)}
                        optional={
                          field.optional ? t("checkout.optional") : undefined
                        }
                        error={error}
                        errorId={errorId}
                      >
                        {field.multiline ? (
                          <div className="relative">
                            <Home
                              className="pointer-events-none absolute start-3 top-3 size-4 text-muted-foreground"
                              aria-hidden="true"
                            />
                            <Textarea
                              id={`checkout-${field.name}`}
                              className="ps-9"
                              rows={3}
                              autoComplete={field.autoComplete}
                              placeholder={t(
                                `checkout.shipping.${field.placeholderKey}`,
                              )}
                              value={shippingAddress[field.name]}
                              onChange={handleChange(field.name)}
                              aria-invalid={error ? true : undefined}
                              aria-describedby={error ? errorId : undefined}
                            />
                          </div>
                        ) : (
                          <IconInput
                            id={`checkout-${field.name}`}
                            icon={Icon}
                            type={field.type || "text"}
                            autoComplete={field.autoComplete}
                            placeholder={t(
                              `checkout.shipping.${field.placeholderKey}`,
                            )}
                            value={shippingAddress[field.name]}
                            onChange={handleChange(field.name)}
                            error={error}
                            errorId={errorId}
                          />
                        )}
                      </Field>
                    </div>
                  );
                })}

                <div className="sm:col-span-2">
                  <Field
                    htmlFor="checkout-customerNote"
                    label={t("checkout.shipping.customerNoteLabel")}
                    optional={t("checkout.optional")}
                  >
                    <Textarea
                      id="checkout-customerNote"
                      rows={3}
                      placeholder={t(
                        "checkout.shipping.customerNotePlaceholder",
                      )}
                      value={customerNote}
                      onChange={(event) => setCustomerNote(event.target.value)}
                    />
                  </Field>
                </div>
              </div>
            </section>

            <fieldset className="rounded-xl border border-(--color-border) bg-(--color-surface-primary) p-5 sm:p-6">
              <legend className="px-1 font-display text-lg font-semibold text-foreground">
                {t("checkout.payment.title")}
              </legend>
              <p className="mt-1 text-sm text-muted-foreground">
                {t("checkout.payment.subtitle")}
              </p>

              <div className="mt-4 space-y-3">
                <label
                  className={cn(
                    "flex cursor-pointer items-start gap-3 rounded-lg border p-4 transition-colors",
                    paymentMethod === "cash"
                      ? "border-(--color-primary) bg-(--color-primary)/5"
                      : "border-(--color-border) hover:border-(--color-primary)",
                  )}
                >
                  <input
                    type="radio"
                    name="paymentMethod"
                    value="cash"
                    checked={paymentMethod === "cash"}
                    onChange={() => setPaymentMethod("cash")}
                    className="mt-0.5 size-4 accent-(--color-primary)"
                  />
                  <span className="flex-1">
                    <span className="flex items-center gap-2 font-medium text-foreground">
                      <WalletCards
                        className="size-4 text-(--color-primary)"
                        aria-hidden="true"
                      />
                      {t("checkout.payment.cash")}
                    </span>
                    <span className="mt-1 block text-sm text-muted-foreground">
                      {t("checkout.payment.cashDescription")}
                    </span>
                  </span>
                </label>

                <label className="flex items-start gap-3 rounded-lg border border-dashed border-(--color-border) p-4 opacity-60">
                  <input
                    type="radio"
                    name="paymentMethod"
                    value="stripe"
                    disabled
                    className="mt-0.5 size-4"
                  />
                  <span className="flex-1">
                    <span className="flex flex-wrap items-center gap-2 font-medium text-foreground">
                      <CreditCard
                        className="size-4 text-muted-foreground"
                        aria-hidden="true"
                      />
                      {t("checkout.payment.stripe")}
                      <span className="rounded-full bg-(--color-surface-muted) px-2 py-0.5 text-xs font-normal text-muted-foreground">
                        {t("checkout.payment.stripeUnavailable")}
                      </span>
                    </span>
                  </span>
                </label>
              </div>

              <p className="mt-4 flex items-center gap-2 text-xs text-muted-foreground">
                <Lock className="size-3.5" aria-hidden="true" />
                {t("checkout.payment.secureNote")}
              </p>
            </fieldset>
          </div>

          <aside className="rounded-xl border border-(--color-border) bg-(--color-surface-primary) p-5 sm:p-6 lg:sticky lg:top-24">
            <h2 className="font-display text-lg font-semibold text-foreground">
              {t("checkout.summary.title")}
            </h2>
            <p className="mt-1 text-sm text-muted-foreground">
              {t("checkout.summary.subtitle")}
            </p>

            <ul className="mt-4 divide-y divide-(--color-border)">
              {cart.items.map((item) => (
                <li key={item.id} className="flex gap-3 py-3">
                  <div className="size-14 shrink-0 overflow-hidden rounded-lg bg-(--color-surface-secondary)">
                    {item.image ? (
                      <img
                        src={item.image}
                        alt={item.name}
                        className="h-full w-full object-cover"
                      />
                    ) : (
                      <div className="flex h-full w-full items-center justify-center">
                        <PackageOpen
                          className="size-4 text-(--color-text-disabled)"
                          aria-hidden="true"
                        />
                      </div>
                    )}
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="line-clamp-2 text-sm font-medium text-(--color-text-primary)">
                      {item.name}
                    </p>
                    <p className="mt-0.5 text-xs text-muted-foreground">
                      {t("checkout.summary.quantity", {
                        quantity: item.quantity,
                      })}
                    </p>
                  </div>
                  <span className="text-sm font-medium tabular-nums text-foreground">
                    {money(item.price * item.quantity)}
                  </span>
                </li>
              ))}
            </ul>

            <dl className="mt-2 space-y-3 border-t border-(--color-border) pt-4 text-sm">
              <div className="flex items-center justify-between">
                <dt className="text-muted-foreground">
                  {t("checkout.summary.subtotal")}
                </dt>
                <dd className="font-medium tabular-nums text-foreground">
                  {money(cart.subtotal)}
                </dd>
              </div>

              {cart.discountAmount > 0 && (
                <div className="flex items-center justify-between">
                  <dt className="text-(--color-success)">
                    {t("checkout.summary.discount")}
                  </dt>
                  <dd className="tabular-nums text-(--color-success)">
                    -{money(cart.discountAmount)}
                  </dd>
                </div>
              )}

              <div className="flex items-center justify-between border-t border-(--color-border) pt-3">
                <dt className="font-medium text-foreground">
                  {t("checkout.summary.total")}
                </dt>
                <dd className="font-display text-xl font-bold tabular-nums text-foreground">
                  {money(cart.total)}
                </dd>
              </div>
            </dl>

            {apiError && (
              <p role="alert" className="mt-4 text-sm text-(--color-error)">
                {apiError}
              </p>
            )}

            <Button
              type="submit"
              disabled={isSubmitting}
              className="mt-5 w-full bg-(--color-primary) text-primary-foreground hover:bg-(--color-secondary)"
            >
              {isSubmitting ? (
                <>
                  <LoaderCircle
                    className="size-4 animate-spin"
                    aria-hidden="true"
                  />
                  {t("checkout.payment.placingOrder")}
                </>
              ) : (
                t("checkout.payment.placeOrder")
              )}
            </Button>

            <Button
              asChild
              variant="ghost"
              className="mt-2 w-full text-muted-foreground"
            >
              <Link to="/cart">{t("checkout.backToCart")}</Link>
            </Button>
          </aside>
        </form>
      )}
    </div>
  );
}
