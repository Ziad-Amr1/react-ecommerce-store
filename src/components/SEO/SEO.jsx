import { useTranslation } from "react-i18next";
import { useLocation } from "react-router";
import { assetUrl } from "@/utils/assetUrl";

const SITE_NAME = "Oversea Store";

const DEFAULT_IMAGE = assetUrl("logo.webp");

const DEFAULT_GEO = {
  region: "US-CA",
  placename: "San Francisco, CA",
  position: "37.7749;-122.4194",
};

function getSiteUrl() {
  if (typeof window !== "undefined") {
    return window.location.origin;
  }
  return typeof import.meta.env.VITE_API_URL === "string"
    ? "https://react-ecommerce-store.vercel.app"
    : "http://localhost:5173";
}

function toAbsoluteUrl(origin, value) {
  if (!value) return origin;
  return value.startsWith("http") ? value : `${origin}${value}`;
}

export default function SEO({
  title,
  description,
  keywords,
  image,
  url,
  type = "website",
  geo,
  noindex = false,
}) {
  const { t } = useTranslation();
  const location = useLocation();

  const origin = getSiteUrl();
  const path = url || `${location.pathname}${location.search}`;
  const canonical = `${origin}${path === "/" ? "/" : `/${path.replace(/^\/+/, "")}`}`;

  const siteTitle = t("brand.name", SITE_NAME);
  const fullTitle = title ? `${title} | ${siteTitle}` : siteTitle;
  const fullImage = toAbsoluteUrl(origin, image || DEFAULT_IMAGE);
  const resolvedGeo = geo === false ? null : geo || DEFAULT_GEO;

  return (
    <>
      <title>{fullTitle}</title>

      <meta name="description" content={description} />

      {keywords && <meta name="keywords" content={keywords} />}

      <meta name="robots" content={noindex ? "noindex, nofollow" : "index, follow"} />

      <link rel="canonical" href={canonical} />

      {/* Open Graph */}
      <meta property="og:site_name" content={siteTitle} />

      <meta property="og:title" content={fullTitle} />

      {description && <meta property="og:description" content={description} />}

      <meta property="og:type" content={type} />

      <meta property="og:url" content={canonical} />

      <meta property="og:image" content={fullImage} />

      {/* Twitter */}
      <meta name="twitter:card" content="summary_large_image" />

      <meta name="twitter:title" content={fullTitle} />

      {description && <meta name="twitter:description" content={description} />}

      <meta name="twitter:image" content={fullImage} />

      {/* Geo targeting */}
      {resolvedGeo ? (
        <>
          {resolvedGeo.region && (
            <meta name="geo.region" content={resolvedGeo.region} />
          )}

          {resolvedGeo.placename && (
            <meta name="geo.placename" content={resolvedGeo.placename} />
          )}

          {resolvedGeo.position && (
            <>
              <meta name="geo.position" content={resolvedGeo.position} />

              <meta name="ICBM" content={resolvedGeo.position} />
            </>
          )}
        </>
      ) : null}
    </>
  );
}