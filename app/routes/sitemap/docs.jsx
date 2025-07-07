import prisma from "../../db.server";

export const loader = async ({ request }) => {
    const origin = new URL(request.url).origin;

    const docs = await prisma.docs.findMany({
        select: {
            id: true, slug: true, title: true, updatedAt: true,
            category: {
                select :{
                    id: true, slug: true,
                    category: {
                        select :{
                            id: true, slug: true,
                        }
                    }
                }
            }
        },
        orderBy: {
            id: "desc"
        },
    });

    const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
        <urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
            ${docs?.length > 0 && docs.map(
                (doc) => `
                <url>
                    <loc>${doc?.title}</loc>
                    <link>${doc?.category?.category?.slug ? `${origin}/en/${doc?.category?.category?.slug}/${doc?.category?.slug}/${doc?.slug}`: `${origin}/en/docs/${doc?.slug}`}</link>
                    ${doc?.updatedAt ? `<lastmod>${new Date(doc.updatedAt).toISOString()}</lastmod>` : ``}
                    <changefreq>weekly</changefreq>
                    <priority>0.7</priority>
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

