const STRIPE_PLANS = [
  { matcher: "Starter", memberLimit: 5, projectLimit: 3 },
  { matcher: "Professional", memberLimit: 10, projectLimit: 15 },
  { matcher: "Enterprise", memberLimit: 5000, projectLimit: 5000 },
];

export default STRIPE_PLANS;
