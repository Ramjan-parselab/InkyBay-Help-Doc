import { PrismaClient } from "@prisma/client";

const prisma = global.prisma || new PrismaClient();

async function main() {
    // Users
  await prisma.users.createMany({
    data: [
      { name: 'Admin One', email: 'admin@test.com', password: '$2b$10$LN.LfXQhI8/TIq6Sv2FkiuaKYLdvKSL1379VaMMBytBvOhIFAxHW6', role: 'ADMIN', status: 'ACTIVE' },
      { name: 'User One', email: 'user1@test.com', password: '$2b$10$LN.LfXQhI8/TIq6Sv2FkiuaKYLdvKSL1379VaMMBytBvOhIFAxHW6', role: 'USER', status: 'INACTIVE' },
      { name: 'User Two', email: 'user2@test.com', password: '$2b$10$LN.LfXQhI8/TIq6Sv2FkiuaKYLdvKSL1379VaMMBytBvOhIFAxHW6', role: 'USER', status: 'ACTIVE' }
    ]
  });

  // Languages
  await prisma.language.createMany({
    data: [
      { name: 'English', flug: 'sdfsdf', code: 'en', status: 'ACTIVE' },
      { name: 'French', flug: 'sdfsdf', code: 'fr', status: 'ACTIVE' },
      { name: 'Arabic', flug: 'sdfsdf', code: 'ar', status: 'INACTIVE' }
    ]
  });

  // Categories
   await prisma.categories.createMany({
    data: [
      { name: 'Getting Started', slug: 'getting-started', level: 'LEVEL_1', serial: 1, status: 'ACTIVE' },
      { name: 'Jewelry Customization', slug: 'jewelry-customization', level: 'LEVEL_1', serial: 2, status: 'ACTIVE' },
      { name: 'Design & Theme Integration', slug: 'design-theme-integration', level: 'LEVEL_1', serial: 3, status: 'INACTIVE' }
    ]
  });

  // Categories language 
  await prisma.categoryLanguage.createMany({
    data:[
      {lang: "en", name: "Getting Starte", description: "Set up JewelsLab with your Shopify store in just a few steps", categoryId: parseInt(1) },
      {lang: "en", name: "Jewelry Customization", description: "Learn how to offer personalized jewelry options like engraving & stone choice.", categoryId: parseInt(2) },
      {lang: "en", name: "Design & Theme Integration", description: "Customize the look of the app to match your store theme perfectly.", categoryId: parseInt(3) },
    ]
  })

  // Footer Menu
  await prisma.footerMenu.createMany({
    data: [
      { name: 'Visit Website ', newTab: false, url: '/privacy', position: 1, status: 'ACTIVE' },
      { name: 'API Docs', newTab: false, url: '/terms', position: 2, status: 'ACTIVE' },
      { name: 'Release Notes', newTab: true, url: '/release-notes', position: 3, status: 'ACTIVE' },
      { name: 'Privacy Policy', newTab: true, url: '/privacy', position: 4, status: 'ACTIVE' },
      { name: 'Terms of Service', newTab: true, url: '/terms-service', position: 5, status: 'ACTIVE' }
    ]
  });

  // Footer menu language 
  await prisma.footerMenuLanguage.createMany({
    data:[
      {lang: "en", name: "Visit Website",  footerMenuId: parseInt(1) },
      {lang: "en", name: "API Docs", footerMenuId: parseInt(2) },
      {lang: "en", name: "Release Notes",  footerMenuId: parseInt(3) },
      {lang: "en", name: "Privacy Policy",  footerMenuId: parseInt(4) },
      {lang: "en", name: "Terms of Service",  footerMenuId: parseInt(5) },
    ]
  })

  // Social Media
  await prisma.socialMedia.createMany({
    data: [
      { name: 'Facebook', url: 'https://facebook.com', logo: 'fb-logo.png' },
      { name: 'Twitter', url: 'https://twitter.com', logo: 'twitter-logo.png' },
      { name: 'Instagram', url: 'https://instagram.com', logo: 'insta-logo.png' }
    ]
  });

  // Popular Search
  await prisma.popularSearch.createMany({
    data: [
      { lang: 'en', title: 'How to reset password', count: 10 },
      { lang: 'fr', title: 'Créer un compte', count: 5 },
      { lang: 'ar', title: 'استرجاع الحساب', count: 7 }
    ]
  });
  

  // Settings
  await prisma.settings.createMany({
    data: [
      { fieldType: '_NOTICE', fieldValue: JSON.stringify({visibility: 1}) },
      { fieldType: '_LOGO', fieldValue: JSON.stringify({url: `/images/logo/logo.svg`}) },
    ]
  });

// Supports
await prisma.supports.createMany({
    data: [
        {title: "Contact Support", url: "https://www.tawk.to/", status: "ACTIVE", },
        {title: "Tutorials", url: "https://youtu.be/3PPDVvpBGAE", status: "ACTIVE", },
        {title: "Submit a Ticket", url: "ticket", status: "ACTIVE", },
    ]
});

// Supports Language
await prisma.supportLanguage.createMany({
    data: [
        {lang: "en", title: "Contact Support", description: "Reach out to our support team anytime!we are available 24/7.", 
          buttonText: "Live Chat",  supportId: parseInt(1)
        },
        {lang: "en", title: "Tutorials", description: "Step-by-step guides to help you get the most out of JewelsLab.", 
          buttonText: "Browse Guides",  supportId: parseInt(2)
        },
        {lang: "en", title: "Submit a Ticket", description: "Have a specific issue? Send us a ticket and we’ll follow up shortly.", 
          buttonText: "Submit Ticket",  supportId: parseInt(3)
        },
    ]
});

  // Tickets
  await prisma.tickets.createMany({
    data: [
      { name: 'Alice', email: 'alice@example.com', subject: 'Login Issue', description: 'Unable to login.' },
      { name: 'Bob', email: 'bob@example.com', subject: 'Page Error', description: 'Error on help page.' },
      { name: 'Charlie', email: 'charlie@example.com', subject: 'Account Setup', description: 'Need help with setup.' }
    ]
  });

  console.log('✅ Seeded static data successfully.');
}
  main()
    .then(async () => {
      await prisma.$disconnect()
    })
    .catch(async (e) => {
      console.error(e)
      await prisma.$disconnect()
      process.exit(1)
    })
    .finally(() => prisma.$disconnect());