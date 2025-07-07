export const loader = async ({ request }) => {
    const origin = new URL(request.url).origin;

    const pages = [
        { path: "/sitemap/main.xml" },
        { path: "/sitemap/docs.xml"}, 
        // You can generate this list from your DB or CMS
    ];

    const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
        <sitemapindex xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
            ${pages
            .map(
                (page) => `
                <sitemap>
                    <loc>${origin}${page.path}</loc>
                </sitemap>
                `
            ).join("")}
        </sitemapindex>`;

        return new Response(sitemap, {
            headers: {
            "Content-Type": "application/xml",
            },
        });
};

