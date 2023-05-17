const STRIPE_PLANS = [
  { matcher: "Starter", memberLimit: 5, projectLimit: 1 },
  { matcher: "Professional", memberLimit: 10, projectLimit: 5 },
  { matcher: "Enterprise", memberLimit: 1000, projectLimit: 1000 },
];

export default STRIPE_PLANS;
