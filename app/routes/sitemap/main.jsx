export const loader = async ({ request }) => {
    const origin = new URL(request.url).origin;

    const pages = [
        { loc: "/", changefreq:"daily",  priority: '1.00'},
        { loc: "/docs", changefreq:"weekly",  priority: '0.9'},
        { loc: "/terms", changefreq:"monthly",  priority: '0.8'},
        { loc: "/privacy", changefreq:"monthly",  priority: '0.7'},
    ];

    const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
        <urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
            ${pages
            .map(
                (page) => `
                <url>
                    <loc>${origin}${page.loc}</loc>
                    <changefreq>${page.changefreq}</changefreq>
                    <priority>${page.priority}</priority>
                </url>
                `
            ).join("")}
        </urlset>`;

        return new Response(sitemap, {
            headers: {
            "Content-Type": "application/xml",
            },
        });
};

