export type Tier = 'free' | 'pro';
export type Recurrence = 'monthly' | 'semesterly' | 'yearly' | 'one-off';
export const plans: Array<{
  tier: Tier;
  recurrence: Recurrence;
  paymentLink: string;
  price: number;
}> = [
  {
    tier: 'pro',
    recurrence: 'monthly',
    price: 20,
    paymentLink: 'https://buy.stripe.com/test_fZe5kk2EmfnH36g7ss'
  },
  {
    tier: 'pro',
    recurrence: 'semesterly',
    price: 48,
    paymentLink: 'https://buy.stripe.com/test_dR69AA2Em3EZgX63cd'
  },
  {
    tier: 'pro',
    recurrence: 'yearly',
    price: 120,
    paymentLink: 'https://buy.stripe.com/test_8wM5kken42AVbCMeUW'
  },
  {
    tier: 'free',
    recurrence: 'one-off',
    paymentLink: '',
    price: 0
  }
];
