import { useRef, useState } from "react";
import { Link, useNavigate } from "react-router";
import { useTranslation } from "react-i18next";
import { toast } from "sonner";
import axios from "axios";
import {
    Truck,
    ShoppingBag,
    CreditCard,
    User,
    Phone,
    Globe,
    MapPin,
    Home,
    FileText,
    Lock,
    Hash,
    ArrowRight,
    WalletCards,
    ShieldCheck,
    Loader2,
    PackageOpen,
} from "lucide-react"
import useCart from "@/hooks/useCart";
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
import { formatCurrency, ORDER_CURRENCY } from "@/utils/formatCurrency";
import { getApiErrorMessage } from "@/features/auth/utils/getApiErrorMessage";
import { validateShippingForm } from "@/features/checkout/checkoutValidation";
import { createOrder } from "@/features/checkout/checkout.service";

const INITIAL_SHIPPING_ADDRESS = {
    fullName: "",
    phone: "",
    country: "",
    city: "",
    address: "",
    postalCode: "",
};

function FieldError({ id, message }) {
    if (!message) return null;
    return (
        <p id={id} role="alert" className="mt-1 text-sm text-(--color-error)">
            {message}
        </p>
    );
}

export default function Checkout() {
    const { t, i18n } = useTranslation();
    const navigate = useNavigate();
    const locale = i18n.language || "en-US";

    const { cart, isLoading: isCartLoading, clear } = useCart();

    const [shippingAddress, setShippingAddress] = useState(INITIAL_SHIPPING_ADDRESS);
    // The email input in the design is not part of the /orders backend
    // contract (see admin order details: shippingAddress has no email field),
    // so it is kept local-only and never sent to the API.
    const [email, setEmail] = useState("");
    const [customerNote, setCustomerNote] = useState("");
    const [paymentMethod, setPaymentMethod] = useState("cash");
    const [errors, setErrors] = useState({});
    const [apiError, setApiError] = useState("");
    const [isSubmitting, setIsSubmitting] = useState(false);

    const abortRef = useRef(null);
    const money = (value) => formatCurrency(value, ORDER_CURRENCY, locale);

    const isCartEmpty = !isCartLoading && cart.items.length === 0;

    const updateField = (field, value) => {
        setShippingAddress((prev) => ({ ...prev, [field]: value }));
        setErrors((prev) => (prev[field] ? { ...prev, [field]: "" } : prev));
        setApiError("");
    };

    const handlePaymentMethodChange = (value) => {
        setPaymentMethod(value);
        setErrors((prev) => (prev.paymentMethod ? { ...prev, paymentMethod: "" } : prev));
        setApiError("");
    };

    const handleSubmit = async (event) => {
        event.preventDefault();

        if (isSubmitting) {
            // Prevent duplicate submissions from double clicks.
            return;
        }

        if (isCartEmpty) {
            toast.error(t("checkout.emptyCartError"));
            return;
        }

        const validationErrors = validateShippingForm(shippingAddress, paymentMethod, t);
        setErrors(validationErrors);

        if (Object.keys(validationErrors).length > 0) {
            toast.error(t("checkout.validationError"));
            return;
        }

        abortRef.current?.abort();
        const controller = new AbortController();
        abortRef.current = controller;

        setApiError("");
        setIsSubmitting(true);

        try {
            const response = await createOrder(
                {
                    shippingAddress,
                    paymentMethod,
                    customerNote,
                },
                controller.signal,
            );

            const order = response.data;

            // Only clear the cart after the backend confirms the order was
            // created successfully.
            try {
                await clear();
            } catch {
                // Non-fatal: the order already succeeded on the backend, so we
                // still send the customer to the success page even if the
                // cart reset locally fails.
            }

            toast.success(t("checkout.orderSuccessToast"));

            navigate("/order-success", {
                replace: true,
                state: {
                    fromCheckout: true,
                    orderId: order?._id || order?.id || null,
                },
            });
        } catch (error) {
            if (axios.isCancel(error)) {
                return;
            }
            setApiError(getApiErrorMessage(error, t("checkout.genericError")));
            toast.error(getApiErrorMessage(error, t("checkout.genericError")));
        } finally {
            if (!controller.signal.aborted) {
                setIsSubmitting(false);
            }
        }
    };

    return (
        <div className="p-6 w-[90%] m-auto">
            <div className="flex flex-col gap-6  lg:flex-row lg:items-center  ">

  <div className="">

                <h1 className="text-3xl font-bold ">{t("checkout.title")}</h1>
                <p className="text-sm text-muted-foreground">{t("checkout.subtitle")}</p>
            </div>
            {/* checkout steps */}
            <div className="flex justify-center items-center gap-2 m-auto ">
                <div className="flex flex-col items-center">
                    <div className="flex size-9 items-center justify-center rounded-full bg-primary text-(--color-surface)">1</div>
                    <span className="mt-1 text-sm">{t("checkout.steps.information")}</span>
                </div>
                <div className="h-px w-12 bg-border"></div>
                <div className="flex flex-col items-center">
                    <div className="flex size-9 items-center justify-center rounded-full  bg-(--color-surface)">2</div>
                    <span className="mt-1 text-sm">{t("checkout.steps.payment")}</span>
                </div>
                <div className="h-px w-12 bg-border"></div>
                <div className="flex flex-col items-center">
                    <div className="flex size-9 items-center justify-center rounded-full bg-(--color-surface)">3</div>
                    <span className="mt-1 text-sm">{t("checkout.steps.review")}</span>
                </div>
             
            </div>
            {/* end checkout steps */}

            </div>

            {isCartEmpty ? (
                <Empty className="mt-10 border border-dashed">
                    <EmptyHeader>
                        <EmptyMedia variant="icon">
                            <PackageOpen className="size-6" aria-hidden="true" />
                        </EmptyMedia>
                        <EmptyTitle>{t("checkout.emptyCartTitle")}</EmptyTitle>
                        <EmptyDescription>{t("checkout.emptyCartDescription")}</EmptyDescription>
                    </EmptyHeader>
                    <EmptyContent>
                        <Button asChild>
                            <Link to="/cart">{t("checkout.backToCart")}</Link>
                        </Button>
                    </EmptyContent>
                </Empty>
            ) : (
            <form onSubmit={handleSubmit} noValidate aria-busy={isSubmitting}>
            <div className="grid grid-cols-1 lg:grid-cols-[1.4fr_1fr] gap-4 mt-10">
                <div className="bg-(--color-surface) w-full p-4 sm:p-6  md:p-8 m-auto rounded-2xl">

                   <div className="flex items-center gap-2">
    <Truck className="size-9 text-primary bg-primary/10 rounded-full p-2" />
    <h2 className="text-2xl">{t("checkout.shipping.title")}</h2>
</div>
<p className="text-sm text-muted-foreground">
    {t("checkout.shipping.subtitle")}
</p>
                    {/* start Shipping Information  */}
                    <div className=" grid grid-cols-1 sm:grid-cols-2 gap-3">

                        <div className="flex flex-col mt-4">
                            <label htmlFor="checkout-fullName" className="mb-1">{t("checkout.shipping.fullNameLabel")}</label>
                         <div className="relative">
                            <User  className="absolute start-3 top-1/2  -translate-y-1/2 size-4 text-muted-foreground"/>
                               <Input
                                id="checkout-fullName"
                                name="fullName"
                                type="text"
                                className=" w-full ps-9"
                               placeholder={t("checkout.shipping.fullNamePlaceholder")}
                                value={shippingAddress.fullName}
                                onChange={(e) => updateField("fullName", e.target.value)}
                                aria-invalid={Boolean(errors.fullName)}
                                aria-describedby={errors.fullName ? "checkout-fullName-error" : undefined}
                            />
                         </div>
                            <FieldError id="checkout-fullName-error" message={errors.fullName} />
                        </div>
                        <div className="flex flex-col mt-4">
                            <label htmlFor="checkout-phone" className="mb-1" >{t("checkout.shipping.phoneLabel")}</label>
                             <div className="relative">
                            <Phone  className="absolute start-3 top-1/2  -translate-y-1/2 size-4 text-muted-foreground"/>
                            <Input
                                id="checkout-phone"
                                name="phone"
                                type="tel"
                                className=" w-full ps-9"
                                    placeholder={t("checkout.shipping.phonePlaceholder")}
                                value={shippingAddress.phone}
                                onChange={(e) => updateField("phone", e.target.value)}
                                aria-invalid={Boolean(errors.phone)}
                                aria-describedby={errors.phone ? "checkout-phone-error" : undefined}
                            />
                            </div>
                            <FieldError id="checkout-phone-error" message={errors.phone} />
                        </div>
                    </div>
                     <div className="flex flex-col mt-4">
                            <label htmlFor="checkout-email" className="mb-1" >{t("checkout.shipping.emailLabel")} <span className="text-muted-foreground">({t("checkout.optional")})</span></label>
                             <div className="relative">
                            <Input
                                id="checkout-email"
                                name="email"
                                type="email"
                                className=" w-full"
                                placeholder={t("checkout.shipping.emailPlaceholder")}
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                            />
                            </div>
                        </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        <div className="flex flex-col mt-4">
                            <label htmlFor="checkout-country" className="mb-1" >{t("checkout.shipping.countryLabel")}</label>
                                  <div className="relative">
                            <Globe  className="absolute start-3 top-1/2  -translate-y-1/2 size-4 text-muted-foreground"/>
                            <Input
                                id="checkout-country"
                                name="country"
                                type="text"
                                className=" w-full ps-9"
                                placeholder={t("checkout.shipping.countryPlaceholder")}
                                value={shippingAddress.country}
                                onChange={(e) => updateField("country", e.target.value)}
                                aria-invalid={Boolean(errors.country)}
                                aria-describedby={errors.country ? "checkout-country-error" : undefined}
                            />
                              </div>
                            <FieldError id="checkout-country-error" message={errors.country} />
                        </div>
                        <div className="flex flex-col mt-4">
                            <label htmlFor="checkout-city" className="mb-1">{t("checkout.shipping.cityLabel")}</label>
                                   <div className="relative">
                            <MapPin  className="absolute start-3 top-1/2  -translate-y-1/2 size-4 text-muted-foreground"/>
                            <Input
                                id="checkout-city"
                                name="city"
                                type="text"
                                className=" w-full ps-9"
                                placeholder={t("checkout.shipping.cityPlaceholder")}
                                value={shippingAddress.city}
                                onChange={(e) => updateField("city", e.target.value)}
                                aria-invalid={Boolean(errors.city)}
                                aria-describedby={errors.city ? "checkout-city-error" : undefined}
                            />
                            </div>
                            <FieldError id="checkout-city-error" message={errors.city} />
                        </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        <div className="flex flex-col mt-4">
                            <label htmlFor="checkout-address" className="mb-1">{t("checkout.shipping.addressLabel")}</label>
                                   <div className="relative">
                            <Home className="absolute start-3 top-1/2  -translate-y-1/2 size-4 text-muted-foreground"/>
                            <Input
                                id="checkout-address"
                                name="address"
                                type="text"
                                className=" w-full ps-9"
                                placeholder={t("checkout.shipping.addressPlaceholder")}
                                value={shippingAddress.address}
                                onChange={(e) => updateField("address", e.target.value)}
                                aria-invalid={Boolean(errors.address)}
                                aria-describedby={errors.address ? "checkout-address-error" : undefined}
                            />
                            </div>
                            <FieldError id="checkout-address-error" message={errors.address} />
                        </div>
                        <div className="flex flex-col mt-4">
                            <label htmlFor="checkout-postalCode" className="mb-1" >{t("checkout.shipping.postalCodeLabel")}</label>
                             <div className="relative">
                            <Hash className="absolute start-3 top-1/2  -translate-y-1/2 size-4 text-muted-foreground"/>
                            <Input
                                id="checkout-postalCode"
                                name="postalCode"
                                type="text"
                                className=" w-full ps-9"
                                placeholder={t("checkout.shipping.postalCodePlaceholder")}
                                value={shippingAddress.postalCode}
                                onChange={(e) => updateField("postalCode", e.target.value)}
                                aria-invalid={Boolean(errors.postalCode)}
                                aria-describedby={errors.postalCode ? "checkout-postalCode-error" : undefined}
                            />
                           </div>
                            <FieldError id="checkout-postalCode-error" message={errors.postalCode} />
                        </div>

                    </div>
                    {/* customer note */}
                    <div className=" flex flex-col mt-4">
                        <label htmlFor="checkout-customerNote" className="mb-1">{t("checkout.shipping.customerNoteLabel")} <span className="text-muted-foreground">({t("checkout.optional")})</span></label>
                               <div className="relative">
                            <FileText  className="absolute start-3 top-3  size-4 text-muted-foreground"/>
                        <Textarea
                            id="checkout-customerNote"
                            name="customerNote"
                            className="w-full min-h-[130px] ps-9"
                            value={customerNote}
                            placeholder={t("checkout.shipping.customerNotePlaceholder")}
                            onChange={(e) => setCustomerNote(e.target.value)}
                        />
                        </div>
                    </div>
                    {/* End Shipping Information */}

                </div>
                {/* left */}
                <div>


                    {/* start order Summary */}
                    <div className=" mt-4 bg-(--color-surface) m-auto rounded-2xl w-full max-w-[500px] p-4 flex flex-col ">
                    <div className="flex items-center gap-2 ">
    <ShoppingBag   className="size-9 text-primary bg-primary/10 rounded-full p-2" />
                    <h2 className="text-2xl ">{t("checkout.summary.title")}</h2>
                      
            </div>
                        <p className="text-sm text-muted-foreground">{t("checkout.summary.subtitle")}</p>
                       <div className="max-h-[250px] overflow-y-auto">
                        {cart.items.map((item) => (
                            <div key={item.id} className="flex items-center gap-4 p-2  ">
                                <img
                                    src={item.image}
                                    alt={item.name}
                                    className="w-16 h-16 object-cover rounded mt-2"
                                />

                                <div>
                                    <p>{item.name}</p>
                                    <p>
                                        {money(item.price)} × {item.quantity}
                                    </p>
                                </div>

                            </div>
                         
            
                        ))}
                          </div>
                        {/* price details */}
                        <div className="border-t mt-3">
                            {/* subtotal */}
                            <div className="flex justify-between mt-3">
                                <span>{t("checkout.summary.subtotal")}</span>
                                <span>{money(cart.subtotal)}</span>
                            </div>
                            {/* discount */}
                            {cart.discountAmount > 0 && (
                                <div className="flex justify-between mt-3">
                                    <span>{t("checkout.summary.discount")}</span>
                                    <span>-{money(cart.discountAmount)}</span>
                                </div>


                            )}

                            {/* total*/}
                            <div className="flex justify-between mt-3 font-semibold">
                                <span>{t("checkout.summary.total")}</span>
                                <span>{money(cart.total)}</span>
                            </div>
                        
                        </div>

                    </div>
                    {/* End order Summary */}
                      {/* start payment method */}
                    <fieldset className="mt-4 bg-(--color-surface) p-6 m-auto rounded-2xl w-full max-w-[500px]">
                        <legend className="sr-only">{t("checkout.payment.title")}</legend>
                                       <div className="flex items-center gap-2">
    <CreditCard   className="size-9 text-primary bg-primary/10 rounded-full p-2" />
                        <h2 className="text-2xl">{t("checkout.payment.title")}</h2>
                      
            </div>
                        <p className="text-sm text-muted-foreground">{t("checkout.payment.subtitle")}</p>
                        <label className="flex items-center gap-2  mt-4 bg-(--color-surface) p-6 m-auto rounded-xl border cursor-pointer">
                            <input type="radio"
                                name="paymentMethod"
                                value="cash"
                                checked={paymentMethod === "cash"}
                                onChange={(e) => handlePaymentMethodChange(e.target.value)}
                            />
                            <WalletCards className="text-primary ps-2 size-7"/>
                            {t("checkout.payment.cash")}
                        </label>

                        <label className="flex items-center gap-2  mt-4 bg-(--color-surface) p-6 m-auto rounded-xl border opacity-60 cursor-not-allowed">
                            <input type="radio"
                                name="paymentMethod"
                                value="stripe"
                                checked={paymentMethod === "stripe"}
                                disabled
                                onChange={(e) => handlePaymentMethodChange(e.target.value)}
                            />
                            <CreditCard className="text-primary ps-2 size-7"/>
                            <span className="flex flex-col">
                                {t("checkout.payment.stripe")}
                                <span className="text-xs text-muted-foreground">{t("checkout.payment.stripeUnavailable")}</span>
                            </span>
                        </label>

                        <FieldError id="checkout-paymentMethod-error" message={errors.paymentMethod} />

                        {apiError && (
                            <p role="alert" className="mt-4 rounded-lg border border-(--color-error) bg-(--color-error)/10 p-3 text-sm text-(--color-error)">
                                {apiError}
                            </p>
                        )}

                        <Button
                            type="submit"
                            disabled={isSubmitting || isCartLoading}
                            className="mt-4 w-full flex items-center justify-center gap-2 rounded-lg bg-primary p-3 text-(--color-surface)"
                        >
                            {isSubmitting ? (
                                <>
                                    <Loader2 className="size-4 animate-spin" aria-hidden="true" />
                                    {t("checkout.payment.placingOrder")}
                                </>
                            ) : (
                                <>
                                    <Lock className="size-4" />
                                    {t("checkout.payment.placeOrder")}
                                    <ArrowRight className="size-4 rtl:rotate-180" />
                                </>
                            )}
                        </Button>

<div className="flex justify-center gap-2 mt-2">
    <ShieldCheck className="size-4"/> 

  <p className="text-sm text-muted-foreground">{t("checkout.payment.secureNote")}</p></div>
                    </fieldset>
                    {/* End payment method */}
                </div>
                {/* right */}
            </div>
            </form>
            )}




        </div>
    )
}
