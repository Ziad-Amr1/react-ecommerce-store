import { useTranslation } from "react-i18next";
import {
  Truck,
  RotateCcw,
  ShieldCheck,
  Clock,
  PackageCheck,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import AccountPageHeader from "@/components/layout/AccountPageHeader";
import SEO from "@/components/SEO/SEO";

export default function ShippingReturns() {
  const { t } = useTranslation();

  return (
    <div className="py-8 font-body text-foreground">
      <SEO
        title={t("shipping.title", "Shipping & Returns Policy")}
        description={t(
          "shipping.description",
          "Everything you need to know about delivery options, shipping costs, and our return policy.",
        )}
        url="/shipping"
      />
      <div className="mx-auto max-w-4xl space-y-8">
        <AccountPageHeader
          title={t("shipping.title", "Shipping & Returns Policy")}
          description={t(
            "shipping.description",
            "Everything you need to know about delivery options, shipping costs, and our return policy.",
          )}
        />

        {/* Feature Cards Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <Card className="rounded-2xl border bg-card p-5 text-center">
            <CardContent className="flex flex-col items-center p-0 space-y-2">
              <div className="flex size-12 items-center justify-center rounded-2xl bg-primary/10 text-primary">
                <Truck className="size-6" />
              </div>
              <h3 className="font-display font-semibold text-base">
                {t("shipping.cards.fastDelivery.title", "Fast & Reliable Delivery")}
              </h3>
              <p className="text-xs text-muted-foreground">
                {t("shipping.cards.fastDelivery.desc", "Delivered directly to your doorstep with live tracking.")}
              </p>
            </CardContent>
          </Card>

          <Card className="rounded-2xl border bg-card p-5 text-center">
            <CardContent className="flex flex-col items-center p-0 space-y-2">
              <div className="flex size-12 items-center justify-center rounded-2xl bg-primary/10 text-primary">
                <RotateCcw className="size-6" />
              </div>
              <h3 className="font-display font-semibold text-base">
                {t("shipping.cards.easyReturns.title", "30-Day Easy Returns")}
              </h3>
              <p className="text-xs text-muted-foreground">
                {t("shipping.cards.easyReturns.desc", "Hassle-free return policy with quick refunds.")}
              </p>
            </CardContent>
          </Card>

          <Card className="rounded-2xl border bg-card p-5 text-center">
            <CardContent className="flex flex-col items-center p-0 space-y-2">
              <div className="flex size-12 items-center justify-center rounded-2xl bg-primary/10 text-primary">
                <ShieldCheck className="size-6" />
              </div>
              <h3 className="font-display font-semibold text-base">
                {t("shipping.cards.insuredPackage.title", "Insured Shipments")}
              </h3>
              <p className="text-xs text-muted-foreground">
                {t("shipping.cards.insuredPackage.desc", "Every order is safely packaged and fully insured.")}
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Shipping Options & Timelines */}
        <Card className="rounded-2xl border bg-card">
          <CardHeader className="border-b bg-muted/20">
            <div className="flex items-center gap-2.5">
              <Clock className="size-5 text-primary" />
              <CardTitle>{t("shipping.options.title", "Shipping Options & Delivery Times")}</CardTitle>
            </div>
          </CardHeader>

          <CardContent className="p-6 space-y-4">
            <p className="text-sm text-muted-foreground leading-relaxed">
              {t(
                "shipping.options.intro",
                "We ship orders Monday through Friday. Orders placed before 2 PM local time are processed on the same business day.",
              )}
            </p>

            <div className="overflow-x-auto rounded-xl border border-border">
              <table className="w-full text-start text-sm">
                <thead className="bg-muted/50 text-xs font-semibold uppercase text-muted-foreground">
                  <tr>
                    <th className="p-3 text-start">{t("shipping.table.method", "Shipping Method")}</th>
                    <th className="p-3 text-start">{t("shipping.table.time", "Estimated Time")}</th>
                    <th className="p-3 text-start">{t("shipping.table.cost", "Cost")}</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border">
                  <tr>
                    <td className="p-3 font-medium">{t("shipping.table.standard", "Standard Shipping")}</td>
                    <td className="p-3 text-muted-foreground">3 - 5 Business Days</td>
                    <td className="p-3 font-semibold text-primary">{t("shipping.table.freeOver50", "Free over $50 ($4.99 otherwise)")}</td>
                  </tr>
                  <tr>
                    <td className="p-3 font-medium">{t("shipping.table.express", "Express Shipping")}</td>
                    <td className="p-3 text-muted-foreground">1 - 2 Business Days</td>
                    <td className="p-3 font-semibold">$12.99</td>
                  </tr>
                  <tr>
                    <td className="p-3 font-medium">{t("shipping.table.international", "International Shipping")}</td>
                    <td className="p-3 text-muted-foreground">7 - 14 Business Days</td>
                    <td className="p-3 font-semibold">$24.99</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>

        {/* Return & Exchange Policy */}
        <Card className="rounded-2xl border bg-card">
          <CardHeader className="border-b bg-muted/20">
            <div className="flex items-center gap-2.5">
              <PackageCheck className="size-5 text-primary" />
              <CardTitle>{t("shipping.returns.title", "Returns & Exchange Guidelines")}</CardTitle>
            </div>
          </CardHeader>

          <CardContent className="p-6 space-y-4">
            <ol className="space-y-3 list-decimal list-inside text-sm text-muted-foreground leading-relaxed">
              <li>
                <strong className="text-foreground font-semibold me-1">
                  {t("shipping.returns.step1Title", "Request a Return:")}
                </strong>
                {t(
                  "shipping.returns.step1Desc",
                  "Contact our support team or visit your order history to initiate a return request.",
                )}
              </li>
              <li>
                <strong className="text-foreground font-semibold me-1">
                  {t("shipping.returns.step2Title", "Prepare Package:")}
                </strong>
                {t(
                  "shipping.returns.step2Desc",
                  "Pack the items securely in their original packaging with tags attached.",
                )}
              </li>
              <li>
                <strong className="text-foreground font-semibold me-1">
                  {t("shipping.returns.step3Title", "Ship & Receive Refund:")}
                </strong>
                {t(
                  "shipping.returns.step3Desc",
                  "Attach the pre-paid shipping label and drop it off at any authorized parcel location. Refunds are processed within 3-5 days of arrival.",
                )}
              </li>
            </ol>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
