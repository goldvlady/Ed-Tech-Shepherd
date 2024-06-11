export type Tier = 'free' | 'pro';
export type Recurrence = 'month' | 'semester' | 'year' | 'one-off';
export const plans: Array<{
  tier: Tier;
  recurrence: Recurrence;
  paymentLink: string;
  price: number;
  priceId: string;
}> = [
  {
    tier: 'free',
    recurrence: 'one-off',
    paymentLink: '',
    price: 0,
    priceId: 'price_1POcotF6YXFSjxP0l9wkAwLc'
  },
  {
    tier: 'pro',
    recurrence: 'month',
    price: 20,
    paymentLink: 'https://buy.stripe.com/test_fZe5kk2EmfnH36g7ss',
    priceId: 'price_1POcqcF6YXFSjxP0azWdg3Xj'
  },
  {
    tier: 'pro',
    recurrence: 'semester',
    price: 48,
    paymentLink: 'https://buy.stripe.com/test_dR69AA2Em3EZgX63cd',
    priceId: 'price_1POcsqF6YXFSjxP0jt1TxxHc'
  },
  {
    tier: 'pro',
    recurrence: 'year',
    price: 120,
    paymentLink: 'https://buy.stripe.com/test_8wM5kken42AVbCMeUW',
    priceId: 'price_1POcuBF6YXFSjxP0HzUKBzzL'
  }
];
