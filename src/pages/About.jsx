import { useTranslation } from "react-i18next";
import { Link } from "react-router";
import { Award, ShieldCheck, Truck, Headphones, ArrowRight, Sparkles, CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { formatNumber } from "@/utils/formatNumber";
import SEO from "@/components/SEO/SEO";

export default function About() {
  const { t, i18n } = useTranslation();
  const locale = i18n.language || "en-US";

  const values = [
    {
      id: "quality",
      icon: Award,
      title: t("about.values.quality.title", { defaultValue: "Premium Quality" }),
      description: t("about.values.quality.description", { defaultValue: "Every item in our store undergoes rigorous inspection to ensure lasting satisfaction." }),
    },
    {
      id: "shipping",
      icon: Truck,
      title: t("about.values.shipping.title", { defaultValue: "Fast & Reliable Shipping" }),
      description: t("about.values.shipping.description", { defaultValue: "We partner with top global logistics carriers to get your orders to your doorstep quickly." }),
    },
    {
      id: "secure",
      icon: ShieldCheck,
      title: t("about.values.secure.title", { defaultValue: "100% Secure Checkout" }),
      description: t("about.values.secure.description", { defaultValue: "Encrypted transactions and safe payment processing give you peace of mind." }),
    },
    {
      id: "support",
      icon: Headphones,
      title: t("about.values.support.title", { defaultValue: "Dedicated Support" }),
      description: t("about.values.support.description", { defaultValue: "Our friendly customer care team is available around the clock to assist you." }),
    },
  ];

  const stats = [
    { value: 12500, label: t("about.stats.customers", { defaultValue: "Happy Customers" }), suffix: "+" },
    { value: 850, label: t("about.stats.products", { defaultValue: "Curated Products" }), suffix: "+" },
    { value: 99.8, label: t("about.stats.satisfaction", { defaultValue: "Satisfaction Rate" }), suffix: "%" },
    { value: 24, label: t("about.stats.support", { defaultValue: "Global Support" }), suffix: "/7" },
  ];

  return (
    <div className="min-h-screen bg-(--color-background) text-(--color-text-primary) font-body">
      <SEO
        title={t("about.heroTitle", { defaultValue: "About Us" })}
        description={t("about.heroSubtitle", {
          defaultValue:
            "We bring you carefully curated products designed for quality, style, and everyday comfort.",
        })}
        url="/about"
      />
      {/* Hero Section */}
      <section className="relative overflow-hidden border-b border-(--color-border) bg-(--color-surface-secondary) py-16 sm:py-24">
        <div>
          <div className="mx-auto max-w-3xl text-center space-y-4">
            <div className="inline-flex items-center gap-2 rounded-full border border-(--color-border) bg-(--color-surface) px-4 py-1.5 text-xs font-semibold uppercase tracking-wider text-(--color-text-secondary) shadow-xs">
              <Sparkles className="size-3.5 text-(--color-primary)" aria-hidden="true" />
              {t("about.eyebrow", { defaultValue: "Our Story & Vision" })}
            </div>

            <h1 className="font-display text-3xl font-bold tracking-tight text-(--color-text-primary) sm:text-5xl">
              {t("about.heroTitle", { defaultValue: "Redefining Online Shopping" })}
            </h1>

            <p className="text-base text-(--color-text-secondary) sm:text-lg leading-relaxed max-w-2xl mx-auto">
              {t("about.heroSubtitle", { defaultValue: "We bring you carefully curated products designed for quality, style, and everyday comfort." })}
            </p>
          </div>
        </div>
      </section>

      {/* Values Section */}
      <section className="py-16 sm:py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center space-y-2 mb-12">
            <h2 className="font-display text-2xl font-bold tracking-tight sm:text-3xl text-(--color-text-primary)">
              {t("about.valuesTitle", { defaultValue: "Why Choose Oversea Store" })}
            </h2>
          </div>

          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {values.map((item) => {
              const Icon = item.icon;
              return (
                <Card key={item.id} className="border-(--color-border) bg-(--color-surface) transition-shadow hover:shadow-md">
                  <CardContent className="space-y-4 p-6">
                    <div className="flex size-12 items-center justify-center rounded-xl bg-(--color-surface-secondary) text-(--color-primary)">
                      <Icon className="size-6" aria-hidden="true" />
                    </div>
                    <h3 className="font-display text-lg font-semibold text-(--color-text-primary)">
                      {item.title}
                    </h3>
                    <p className="text-sm leading-relaxed text-(--color-text-secondary)">
                      {item.description}
                    </p>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>
      </section>

      {/* Mission Section */}
      <section className="border-t border-b border-(--color-border) bg-(--color-surface) py-16 sm:py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 gap-12 lg:grid-cols-2 lg:items-center">
            <div className="space-y-6">
              <h2 className="font-display text-2xl font-bold tracking-tight text-(--color-text-primary) sm:text-3xl">
                {t("about.missionTitle", { defaultValue: "Our Mission" })}
              </h2>

              <p className="text-base leading-relaxed text-(--color-text-secondary)">
                {t("about.missionDescription", { defaultValue: "At Oversea Store, we believe that online shopping should be seamless, inspiring, and dependable. Our team hand-picks every product in our catalog to ensure it meets strict quality standards." })}
              </p>

              <ul className="space-y-3">
                {[
                  t("about.bullet1", { defaultValue: "Rigorous quality check on every vendor item" }),
                  t("about.bullet2", { defaultValue: "Transparent pricing with zero hidden fees" }),
                  t("about.bullet3", { defaultValue: "Fast global shipping with full parcel tracking" }),
                ].map((bullet, idx) => (
                  <li key={idx} className="flex items-center gap-3 text-sm font-medium text-(--color-text-primary)">
                    <CheckCircle2 className="size-4 shrink-0 text-(--color-success)" aria-hidden="true" />
                    <span>{bullet}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-2 gap-4">
              {stats.map((stat, idx) => (
                <div
                  key={idx}
                  className="flex flex-col justify-center rounded-2xl border border-(--color-border) bg-(--color-surface-secondary) p-6 text-center"
                >
                  <p className="font-display text-3xl font-bold tabular-nums text-(--color-text-primary) sm:text-4xl">
                    {formatNumber(stat.value, locale)}{stat.suffix}
                  </p>
                  <p className="mt-1 text-xs font-semibold uppercase tracking-wider text-(--color-text-secondary)">
                    {stat.label}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 sm:py-20 text-center">
        <div className="mx-auto max-w-4xl space-y-6">
          <h2 className="font-display text-2xl font-bold tracking-tight text-(--color-text-primary) sm:text-4xl">
            {t("about.ctaTitle", { defaultValue: "Ready to Experience Better Shopping?" })}
          </h2>

          <p className="text-base text-(--color-text-secondary) max-w-xl mx-auto">
            {t("about.ctaSubtitle", { defaultValue: "Browse our latest arrivals and exclusive collections today." })}
          </p>

          <Button asChild size="lg" className="rounded-full gap-2 px-8 cursor-pointer">
            <Link to="/products">
              {t("about.exploreProducts", { defaultValue: "Explore Catalog" })}
              <ArrowRight className="size-4 rtl:rotate-180" aria-hidden="true" />
            </Link>
          </Button>
        </div>
      </section>
    </div>
  );
}
