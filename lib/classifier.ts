

export function classifyShopper(events: string[]) {

    const evidence: string[] = [];
let recommendation = "";

  let state = "Browser";
  let confidence = 50;

  const compareCount =
    events.filter(
      event => event === "compare_products"
    ).length;

  const couponCount =
    events.filter(
      event => event === "search_coupon"
    ).length;

  const cartCount =
    events.filter(
      event => event === "add_to_cart"
    ).length;

  const purchaseCount =
    events.filter(
      event => event === "purchase"
    ).length;

  // Loyal Customer

if (purchaseCount >= 3) {
  state = "Loyal Customer";
  confidence = 95;

  evidence.push(
    `${purchaseCount} completed purchases`
  );

  recommendation =
    "Offer loyalty rewards and exclusive products.";
}

  // Cart Abandoner
else if (
  cartCount > 0 &&
  purchaseCount === 0
) {
  state = "Cart Abandoner";
  confidence = 90;

  evidence.push(
    `Added ${cartCount} item(s) to cart`
  );

  recommendation =
    "Send cart recovery reminders or incentives.";
}

  // Discount Seeker

else if (couponCount >= 2) {
  state = "Discount Seeker";
  confidence = 85;

  evidence.push(
    `Searched coupons ${couponCount} times`
  );

  recommendation =
    "Show limited-time discounts and offers.";
}

  // Comparer

 else if (compareCount >= 2) {
  state = "Comparer";
  confidence = 90;

  evidence.push(
    `Compared ${compareCount} products`
  );

  recommendation =
    "Show comparison charts, reviews and trust badges.";
}

if (state === "Browser") {
  evidence.push(
    "Browsing behavior detected"
  );

  recommendation =
    "Highlight popular products and categories.";
}
return {
  state,
  confidence,
  evidence,
  recommendation
};
}