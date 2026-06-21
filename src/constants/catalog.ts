export const BILL_CATEGORIES = ["USD", "CAD", "EURO", "GBP"] as const;

export const ASCORBIC_ACID_CATEGORY = "Ascorbic Acid";

export const SHOP_CATEGORIES = [
  ...BILL_CATEGORIES,
  ASCORBIC_ACID_CATEGORY,
] as const;

export const ADMIN_CATEGORIES = [
  ...BILL_CATEGORIES,
  ASCORBIC_ACID_CATEGORY,
  "clone cards",
] as const;
