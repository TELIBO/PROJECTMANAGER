/** @type { import("drizzle-kit").Config } */
export default {
    schema: "src/lib/schema.js",
    dialect: "postgresql",
    dbCredentials: {
      url:"postgresql://neondb_owner:npg_Mik5zXUOAa7R@ep-weathered-resonance-a8dik81h-pooler.eastus2.azure.neon.tech/neondb?sslmode=require",
    },
  };
  