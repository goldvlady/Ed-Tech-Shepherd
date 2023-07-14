import { Layout, OffersGridList, Section } from '../components';
import offerStore from '../state/offerStore';
import React, { useEffect } from 'react';

export default function Offers() {
  const { offers, isLoading, fetchOffers } = offerStore();

  useEffect(() => {
    fetchOffers();
  }, []);

  return (
    <Layout className="px-4">
      <Section
        title="Offers"
        subtitle="10"
        description="Easily manage and respond to offers from potential clients"
      />
      <OffersGridList />
    </Layout>
  );
}
