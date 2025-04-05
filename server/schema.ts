import {
  timestamp,
  pgTable,
  text,
  primaryKey,
  integer,
  pgEnum,
  boolean,
  serial,
  real,
  index,
} from "drizzle-orm/pg-core";

import postgres from "postgres";
import { drizzle } from "drizzle-orm/postgres-js";
import type { AdapterAccountType } from "next-auth/adapters";

import { createId } from "@paralleldrive/cuid2";
import { relations } from "drizzle-orm";

const pool = postgres(process.env.DATABASE_URL!, { max: 1 });

export const db = drizzle(pool);

export const RoleEnum = pgEnum("roles", ["user", "admin"]);

// user authentication user & id --------------------------------------------

export const users = pgTable("user", {
  id: text("id")
    .primaryKey()
    .notNull()
    .$defaultFn(() => createId()),
  name: text("name"),
  email: text("email").unique(),
  emailVerified: timestamp("emailVerified", { mode: "date" }),
  image: text("image"),
  password: text("password"),
  twoFactorEnabled: boolean("twoFactorEnabled").default(false),
  role: RoleEnum("roles").default("user"),
  customerID: text("customerID"),
});

export const accounts = pgTable(
  "account",
  {
    userId: text("userId")
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
    type: text("type").$type<AdapterAccountType>().notNull(),
    provider: text("provider").notNull(),
    providerAccountId: text("providerAccountId").notNull(),
    refresh_token: text("refresh_token"),
    access_token: text("access_token"),
    expires_at: integer("expires_at"),
    token_type: text("token_type"),
    scope: text("scope"),
    id_token: text("id_token"),
    session_state: text("session_state"),
  },
  (account) => [
    {
      compoundKey: primaryKey({
        columns: [account.provider, account.providerAccountId],
      }),
    },
  ]
);

// connect user & id authentication via token --------------------------------------------

export const emailTokens = pgTable(
  "email_tokens",
  {
    id: text("id")
      .notNull()
      .$defaultFn(() => createId()),
    token: text("token").notNull(),
    expires: timestamp("expires", { mode: "date" }).notNull(),
    email: text("email").notNull(),
  },
  (verificationToken) => [
    {
      compositePk: primaryKey({
        columns: [verificationToken.id, verificationToken.token],
      }),
    },
  ]
);

export const passwordResetTokens = pgTable(
  "password_reset_tokens",
  {
    id: text("id")
      .notNull()
      .$defaultFn(() => createId()),
    token: text("token").notNull(),
    expires: timestamp("expires", { mode: "date" }).notNull(),
    email: text("email").notNull(),
  },
  (verificationToken) => [
    {
      compositePk: primaryKey({
        columns: [verificationToken.id, verificationToken.token],
      }),
    },
  ]
);

export const twoFactorTokens = pgTable(
  "two_factor_tokens",
  {
    id: text("id")
      .notNull()
      .$defaultFn(() => createId()),
    token: text("token").notNull(),
    expires: timestamp("expires", { mode: "date" }).notNull(),
    email: text("email").notNull(),
    userID: text("userID").references(() => users.id, { onDelete: "cascade" }),
  },
  (verificationToken) => [
    {
      compositePk: primaryKey({
        columns: [verificationToken.id, verificationToken.token],
      }),
    },
  ]
);

// Create Product --------------------------------------------

export const products = pgTable("products", {
  id: serial("id").primaryKey(),
  description: text("description").notNull(),
  title: text("title").notNull(),
  created: timestamp("created").defaultNow(),
  price: real("price").notNull(),
});

// list variant schema --------------------------------------------

export const productVariants = pgTable("productVariant", {
  id: serial("id").primaryKey(),
  color: text("color").notNull(),
  productType: text("productType").notNull(),
  updated: timestamp("updated").defaultNow(),
  productID: serial("productID")
    .notNull()
    .references(() => products.id, { onDelete: "cascade" }),
}); // have parent relations as a child with products schema -----------

export const imagesVariant = pgTable("imagesVariant", {
  id: serial("id").primaryKey(),
  url: text("url").notNull(),
  size: real("size").notNull(),
  name: text("name").notNull(),
  order: real("order").notNull(),
  variantID: serial("variantID")
    .notNull()
    .references(() => productVariants.id, { onDelete: "cascade" }),
}); // have parent relations as a child with products variants schema -----------

export const tagsVariant = pgTable("tagsVariant", {
  id: serial("id").primaryKey(),
  tag: text("tag").notNull(),
  variantID: serial("variantID")
    .notNull()
    .references(() => productVariants.id, { onDelete: "cascade" }),
}); // have parent relations as a child with products variants schema -----------

// -------------------------------------------------------------------------------

// -------------------------------------------------------------------------------

// -------------------------------------------------------------------------------

// -------------------------------------------------------------------------------

// relations between product schema ------------------------------

export const productRelations = relations(products, ({ many }) => ({
  productVariants: many(productVariants, { relationName: "productVariants" }),
  reviews: many(reviews, { relationName: "reviews" }),
})); // as parent schema, have relations with child schema with products variants -----------

export const productVariantsRelations = relations(
  productVariants,
  ({ many, one }) => ({
    products: one(products, {
      fields: [productVariants.productID],
      references: [products.id],
      relationName: "productVariants",
    }),
    imagesVariant: many(imagesVariant, { relationName: "imagesVariant" }),
    tagsVariant: many(tagsVariant, { relationName: "tagsVariant" }),
  }) // as parent schema, have relations as child into parent schema into product schema and as parent schema have relations with child schema including images & tags variants -----------
);

export const imagesVariantRelations = relations(imagesVariant, ({ one }) => ({
  productVariants: one(productVariants, {
    fields: [imagesVariant.variantID],
    references: [productVariants.id],
    relationName: "imagesVariant",
  }), // as child schema have relations with parent schema into product variants schema -----------
}));

export const tagsVariantRelations = relations(tagsVariant, ({ one }) => ({
  productVariants: one(productVariants, {
    fields: [tagsVariant.variantID],
    references: [productVariants.id],
    relationName: "tagsVariant",
  }), // as child schema have relations with parent schema into product variants schema -----------
}));

// review schema --------------------------------------------

export const reviews = pgTable(
  "reviews",
  {
    id: serial("id").primaryKey(),
    rating: real("rating").notNull(),
    userID: text("userID")
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
    productID: serial("productID")
      .notNull()
      .references(() => products.id, {
        onDelete: "cascade",
      }),
    comment: text("comment").notNull(),
    created: timestamp("created").defaultNow(),
  },
  (table) => {
    return {
      productIndex: index("productIndex").on(table.productID),
      userIndex: index("userIndex").on(table.userID),
    };
  }
);

// review relations schema --------------------------------------------

export const reviewRelations = relations(reviews, ({ one }) => ({
  user: one(users, {
    fields: [reviews.userID],
    references: [users.id],
    relationName: "user_reviews",
  }),
  product: one(products, {
    fields: [reviews.productID],
    references: [products.id],
    relationName: "reviews",
  }),
}));

export const userRelations = relations(users, ({ many }) => ({
  reviews: many(reviews, { relationName: "user_reviews" }),
  orders: many(orders, { relationName: "user_orders" }),
}));

// orders schema --------------------------------------------

export const orders = pgTable("orders", {
  id: serial("id").primaryKey(),
  userID: text("userID")
    .notNull()
    .references(() => users.id, { onDelete: "cascade" }),
  total: real("total").notNull(),
  status: text("status").notNull(),
  created: timestamp("created").defaultNow(),
  receiptURL: text("receiptURL"),
});

// orders product schema --------------------------------------------

export const ordersProduct = pgTable("ordersProduct", {
  id: serial("id").primaryKey(),
  quantity: integer("quantity").notNull(),
  productVariantID: serial("productVariantID")
    .notNull()
    .references(() => productVariants.id, { onDelete: "cascade" }),
  productID: serial("productID")
    .notNull()
    .references(() => products.id, { onDelete: "cascade" }),
  orderID: serial("orderID")
    .notNull()
    .references(() => orders.id, { onDelete: "cascade" }),
});

// orders relations schema --------------------------------------------

export const ordersRelations = relations(orders, ({ one, many }) => ({
  user: one(users, {
    fields: [orders.userID],
    references: [users.id],
    relationName: "user_orders",
  }),
  ordersProduct: many(ordersProduct, { relationName: "ordersProduct" }),
}));

export const ordersProductRelations = relations(ordersProduct, ({ one }) => ({
  order: one(orders, {
    fields: [ordersProduct.orderID],
    references: [orders.id],
    relationName: "ordersProduct",
  }),
  product: one(products, {
    fields: [ordersProduct.productID],
    references: [products.id],
    relationName: "products",
  }),
  productVariants: one(productVariants, {
    fields: [ordersProduct.productVariantID],
    references: [productVariants.id],
    relationName: "productVariants",
  }),
}));
