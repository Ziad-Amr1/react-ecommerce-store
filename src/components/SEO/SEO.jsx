import { Helmet } from "react-helmet-async";

const SEO = ({
  title,
  description,
  keywords,
  image,
  url,
  type = "website",
}) => {
  const siteName = "Oversea Store";
  const siteUrl = "https://example.com";

  const fullTitle = `${title} | ${siteName}`;
  const fullUrl = `${siteUrl}${url || ""}`;

  return (
    <Helmet>
      {/* Basic SEO */}
      <title>{fullTitle}</title>

      <meta name="description" content={description} />

      {keywords && <meta name="keywords" content={keywords} />}

      <meta name="robots" content="index, follow" />

      {/* Canonical */}
      <link rel="canonical" href={fullUrl} />

      {/* Open Graph */}
      <meta property="og:title" content={fullTitle} />

      <meta property="og:description" content={description} />

      <meta property="og:type" content={type} />

      <meta property="og:url" content={fullUrl} />

      {image && <meta property="og:image" content={`${siteUrl}${image}`} />}

      {/* Twitter */}
      <meta name="twitter:card" content="summary_large_image" />

      <meta name="twitter:title" content={fullTitle} />

      <meta name="twitter:description" content={description} />

      {image && <meta name="twitter:image" content={`${siteUrl}${image}`} />}
    </Helmet>
  );
};

export default SEO;
