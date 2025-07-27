import { vitePlugin as remix } from "@remix-run/dev";
import { defineConfig } from "vite";

export default defineConfig({
  plugins: [
    remix({
      future: {
        v3_fetcherPersist: true,
        v3_relativeSplatPath: true,
        v3_throwAbortReason: true,
        v3_singleFetch: true,
        v3_lazyRouteDiscovery: true,
      },
      ignoredRouteFiles: ["**/.*"],
      routes(defineRoutes){
          return defineRoutes((route)=> {

                route("/", "routes/_index.jsx");
            
                // Frontend all routes 
                route(":lang", "routes/$lang._index.jsx", ()=> {
                    route("", "routes/$lang.home.jsx", {index: true});
                    route("ticket", "routes/$lang.ticket.jsx");
                    route("docs/:slug", "routes/$lang.$slug.docDetails.jsx");
                    route("docs", "routes/$lang.docs.jsx");
                    route("privacy", "routes/$lang.privacy.jsx");
                    route("terms", "routes/$lang.terms.jsx");
                    route("pages/:slug", "routes/$lang.$page.jsx");
                });
                
                // Categories routes
                route(":lang/", "routes/category/$lang.layout.jsx", ()=> {
                    route(":category", "routes/category/$lang.$category.category.jsx", {index: true});
                    route(":category/:subcategory", "routes/category/$lang.$category.$subcategory.subcategory.jsx");
                    route(":category/:subcategory/:slug", "routes/category/$lang.$category.$subcategory.$slug.document.jsx");
                });


                  route("sitemap.xml", "routes/sitemap/_index.jsx");
                  route("sitemap", "routes/sitemap/sitemap.jsx", ()=> {
                        route("main.xml", "routes/sitemap/main.jsx");
                        route("docs.xml", "routes/sitemap/docs.jsx");
                  })

                // Admin routes
                route("/admin", "routes/admin/auth/auth.jsx", ()=>{
                    route("login", "routes/admin/auth/login.jsx", {index: true});
                    // route("register", "routes/admin/auth/register.jsx")
                });
                route("/admin", "routes/admin/home.jsx", ()=> {
                    route("", "routes/admin/dashboard.jsx", {index: true});

                    route("categories", "routes/admin/categories/category.jsx", ()=>{
                        route("", "routes/admin/categories/_index.jsx", {index: true});
                        route("create", "routes/admin/categories/create.jsx");
                        route(":id", "routes/admin/categories/edit.jsx");
                    });

                    route("supports", "routes/admin/supports/support.jsx", ()=>{
                        route("", "routes/admin/supports/_index.jsx", {index: true});
                        route("create", "routes/admin/supports/create.jsx");
                        route(":id", "routes/admin/supports/edit.jsx");
                    });

                    route("languages", "routes/admin/languages/language.jsx", ()=>{
                        route("", "routes/admin/languages/_index.jsx", {index: true});
                        route("create", "routes/admin/languages/create.jsx");
                        route(":id", "routes/admin/languages/edit.jsx");
                    });

                    route("socials-media", "routes/admin/socialMedia/socialMedia.jsx", ()=>{
                        route("", "routes/admin/socialMedia/_index.jsx", {index: true});
                        route("create", "routes/admin/socialMedia/create.jsx");
                        route(":id", "routes/admin/socialMedia/edit.jsx");
                    });

                    route("users", "routes/admin/users/user.jsx", ()=>{
                        route("", "routes/admin/users/_index.jsx", {index: true});
                        route("create", "routes/admin/users/create.jsx");
                        route(":id", "routes/admin/users/edit.jsx");
                        route("profile", "routes/admin/users/profile.jsx")
                    });

                    route("footer/menus", "routes/admin/footerMenus/menu.jsx", ()=>{
                        route("", "routes/admin/footerMenus/_index.jsx", {index: true});
                        route("create", "routes/admin/footerMenus/create.jsx");
                        route(":id", "routes/admin/footerMenus/edit.jsx");
                    });

                    route("docs", "routes/admin/docs/doc.jsx", ()=>{
                        route("", "routes/admin/docs/_index.jsx", {index: true});
                        route("create", "routes/admin/docs/create.jsx");
                        route(":id", "routes/admin/docs/edit.jsx");
                    });

                    route("pages", "routes/admin/pages/page.jsx", ()=>{
                        route("", "routes/admin/pages/_index.jsx", {index: true});
                        route("create", "routes/admin/pages/create.jsx");
                        route(":id", "routes/admin/pages/edit.jsx");
                    });
                    
                    route("settings", "routes/admin/settings.jsx");
                })
          })
      }
    }),
  ],
});
