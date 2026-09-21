import { useTranslation } from "react-i18next";
import { useLocation } from "react-router";

const SITE_NAME = "Oversea Store";

const DEFAULT_IMAGE = "/logo.webp";

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
      {geo ? (
        <>
          {geo.region && <meta name="geo.region" content={geo.region} />}

          {geo.placename && <meta name="geo.placename" content={geo.placename} />}

          {geo.position && (
            <>
              <meta name="geo.position" content={geo.position} />

              <meta name="ICBM" content={geo.position} />
            </>
          )}
        </>
      ) : null}
    </>
  );
}