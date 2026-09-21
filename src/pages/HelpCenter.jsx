import { useState } from "react";
import { Link } from "react-router";
import { useTranslation } from "react-i18next";
import {
  Package,
  Truck,
  RotateCcw,
  CreditCard,
  Search,
  MessageSquare,
  ArrowRight,
} from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import AccountPageHeader from "@/components/layout/AccountPageHeader";
import SEO from "@/components/SEO/SEO";

const FAQ_ITEMS = [
  {
    category: "orders",
    icon: Package,
    titleKey: "help.faqs.orders.title",
    defaultTitle: "Orders & Account",
    faqs: [
      {
        qKey: "help.faqs.orders.q1",
        aKey: "help.faqs.orders.a1",
        defaultQ: "How do I track my order status?",
        defaultA: "You can track your order status by logging into your account and navigating to 'My Orders'. Each order displays live status updates and tracking details.",
      },
      {
        qKey: "help.faqs.orders.q2",
        aKey: "help.faqs.orders.a2",
        defaultQ: "Can I modify or cancel an order after placing it?",
        defaultA: "Orders can be modified or canceled within 1 hour of placement. Please visit 'My Orders' or contact customer support immediately for assistance.",
      },
      {
        qKey: "help.faqs.orders.q3",
        aKey: "help.faqs.orders.a3",
        defaultQ: "Do I need an account to place an order?",
        defaultA: "No, you can place orders as a guest. However, creating an account allows you to track orders easily, save wishlist items, and manage shipping addresses.",
      },
    ],
  },
  {
    category: "shipping",
    icon: Truck,
    titleKey: "help.faqs.shipping.title",
    defaultTitle: "Shipping & Delivery",
    faqs: [
      {
        qKey: "help.faqs.shipping.q1",
        aKey: "help.faqs.shipping.a1",
        defaultQ: "What are the standard shipping timelines?",
        defaultA: "Standard domestic delivery takes 2 to 5 business days. Express delivery is available at checkout for 1-2 business day shipping.",
      },
      {
        qKey: "help.faqs.shipping.q2",
        aKey: "help.faqs.shipping.a2",
        defaultQ: "Do you offer free shipping?",
        defaultA: "Yes, we offer free standard shipping on all domestic orders over $50.",
      },
    ],
  },
  {
    category: "returns",
    icon: RotateCcw,
    titleKey: "help.faqs.returns.title",
    defaultTitle: "Returns & Refunds",
    faqs: [
      {
        qKey: "help.faqs.returns.q1",
        aKey: "help.faqs.returns.a1",
        defaultQ: "What is your return policy?",
        defaultA: "We accept returns within 30 days of item delivery. Returned items must be unused, in original packaging, and with tags attached.",
      },
      {
        qKey: "help.faqs.returns.q2",
        aKey: "help.faqs.returns.a2",
        defaultQ: "How long does a refund take to process?",
        defaultA: "Once your returned package is received and inspected, refunds are credited back to your original payment method within 3 to 7 business days.",
      },
    ],
  },
  {
    category: "payment",
    icon: CreditCard,
    titleKey: "help.faqs.payment.title",
    defaultTitle: "Payment & Pricing",
    faqs: [
      {
        qKey: "help.faqs.payment.q1",
        aKey: "help.faqs.payment.a1",
        defaultQ: "Which payment methods are accepted?",
        defaultA: "We accept major credit cards (Visa, MasterCard, American Express), PayPal, Apple Pay, and Cash on Delivery in supported regions.",
      },
      {
        qKey: "help.faqs.payment.q2",
        aKey: "help.faqs.payment.a2",
        defaultQ: "Is my payment information secure?",
        defaultA: "Yes. All transactions are encrypted via 256-bit SSL encryption and processed through PCI-DSS compliant secure payment gateways.",
      },
    ],
  },
];

export default function HelpCenter() {
  const { t } = useTranslation();
  const [searchQuery, setSearchQuery] = useState("");

  return (
    <div className="py-8 font-body text-foreground">
      <SEO
        title={t("help.title", "Help Center & FAQ")}
        description={t(
          "help.description",
          "Find answers to frequently asked questions or get in touch with support.",
        )}
        url="/help"
      />
      <div className="mx-auto max-w-4xl space-y-8">
        <AccountPageHeader
          title={t("help.title", "Help Center & FAQ")}
          description={t(
            "help.description",
            "Find answers to frequently asked questions or get in touch with support.",
          )}
        />

        {/* Search Bar */}
        <div className="relative max-w-lg mx-auto text-center space-y-3">
          <div className="relative">
            <Search className="absolute start-4 top-1/2 size-5 -translate-y-1/2 text-muted-foreground" />
            <Input
              type="search"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder={t("help.searchPlaceholder", "Search help topics or questions...")}
              className="ps-12 h-12 rounded-2xl bg-card border-border shadow-xs text-sm"
            />
          </div>
        </div>

        {/* FAQ Sections */}
        <div className="space-y-6">
          {FAQ_ITEMS.map((group) => {
            const Icon = group.icon;
            const groupTitle = t(group.titleKey, group.defaultTitle);
            const filteredFaqs = group.faqs.filter((faq) => {
              const q = t(faq.qKey, faq.defaultQ).toLowerCase();
              const a = t(faq.aKey, faq.defaultA).toLowerCase();
              const query = searchQuery.toLowerCase().trim();
              return !query || q.includes(query) || a.includes(query);
            });

            if (filteredFaqs.length === 0) return null;

            return (
              <Card key={group.category} className="overflow-hidden rounded-2xl border bg-card">
                <CardContent className="p-6">
                  <div className="flex items-center gap-3 mb-4 pb-3 border-b border-border">
                    <div className="flex size-10 items-center justify-center rounded-xl bg-primary/10 text-primary">
                      <Icon className="size-5" />
                    </div>
                    <h2 className="font-display text-lg font-bold text-foreground">
                      {groupTitle}
                    </h2>
                  </div>

                  <Accordion type="single" collapsible className="w-full">
                    {filteredFaqs.map((faq, idx) => (
                      <AccordionItem key={idx} value={`${group.category}-${idx}`}>
                        <AccordionTrigger className="text-start font-medium text-sm hover:text-primary">
                          {t(faq.qKey, faq.defaultQ)}
                        </AccordionTrigger>
                        <AccordionContent className="text-sm text-muted-foreground leading-relaxed">
                          {t(faq.aKey, faq.defaultA)}
                        </AccordionContent>
                      </AccordionItem>
                    ))}
                  </Accordion>
                </CardContent>
              </Card>
            );
          })}
        </div>

        {/* Contact Support Banner */}
        <Card className="rounded-2xl border border-primary/20 bg-primary/5 p-6 sm:p-8">
          <CardContent className="flex flex-col sm:flex-row items-center justify-between gap-6 p-0 text-center sm:text-start">
            <div className="space-y-1">
              <div className="flex items-center justify-center sm:justify-start gap-2">
                <MessageSquare className="size-5 text-primary" />
                <h3 className="font-display text-lg font-bold text-foreground">
                  {t("help.contactBanner.title", "Still have questions?")}
                </h3>
              </div>
              <p className="text-sm text-muted-foreground max-w-md">
                {t(
                  "help.contactBanner.description",
                  "Can't find the answer you're looking for? Contact our customer support team.",
                )}
              </p>
            </div>

            <Button asChild className="rounded-xl gap-2 cursor-pointer shrink-0">
              <Link to="/contact">
                <span>{t("help.contactBanner.button", "Contact Support")}</span>
                <ArrowRight className="size-4 rtl:rotate-180" />
              </Link>
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
