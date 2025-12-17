import { Helmet } from "react-helmet-async";

interface SEOProps {
  title?: string;
  description?: string;
  image?: string;
  url?: string;
}

export default function SEO({ 
  title = "نادي نظم المعلومات الإدارية - MIS Club", 
  description = "نادي طلابي في جامعة الملك سعود يهتم بتطوير مهارات الطلاب في مجال نظم المعلومات الإدارية والتقنية. قرارات ذكية تبدأ من البيانات.",
  image = "https://mis-club.vercel.app/og-image.png",
  url = "https://mis-club.vercel.app/"
}: SEOProps) {
  const siteTitle = title === "نادي نظم المعلومات الإدارية - MIS Club" ? title : `${title} | MIS Club`;

  return (
    <Helmet>
      {/* Primary Meta Tags */}
      <title>{siteTitle}</title>
      <meta name="title" content={siteTitle} />
      <meta name="description" content={description} />

      {/* Open Graph / Facebook */}
      <meta property="og:type" content="website" />
      <meta property="og:url" content={url} />
      <meta property="og:title" content={siteTitle} />
      <meta property="og:description" content={description} />
      <meta property="og:image" content={image.startsWith("http") ? image : `https://mis-club.vercel.app${image}`} />

      {/* Twitter */}
      <meta property="twitter:card" content="summary_large_image" />
      <meta property="twitter:url" content={url} />
      <meta property="twitter:title" content={siteTitle} />
      <meta property="twitter:description" content={description} />
      <meta property="twitter:image" content={image.startsWith("http") ? image : `https://mis-club.vercel.app${image}`} />
    </Helmet>
  );
}
