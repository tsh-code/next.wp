/** @type {import('next').NextConfig} */
module.exports = {
  reactStrictMode: true,
  async redirects() {
    return [
      {
        source: "/page/1/",
        destination: "/",
        permanent: true,
      },
      {
        source: "/category/:slug/page/1/",
        destination: "/category/:slug/",
        permanent: true,
      },
      {
        source: "/tag/:slug/page/1/",
        destination: "/tag/:slug/",
        permanent: true,
      },
      {
        source: "/author/:slug/page/1/",
        destination: "/author/:slug/",
        permanent: true,
      },
    ];
  },
  trailingSlash: true,
  i18n: {
    locales: ["pl"],
    defaultLocale: "pl"
  },
  images: {
    domains: [process.env.WP_DOMAIN, "secure.gravatar.com"],
  },
};
