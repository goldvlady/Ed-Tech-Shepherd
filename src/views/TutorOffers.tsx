import { Layout, OffersGridList, Section } from '../components';
import ApiService from '../services/ApiService';
import offerStore from '../state/offerStore';
import React, { useEffect, useState, useCallback } from 'react';

export default function Offers() {
  const { offers, fetchOffers } = offerStore();
  const [isLoading, setIsLoading] = useState(false);

  const [allOffers, setAllOffers] = useState<any>([]);
  const doFetchTutorOffers = useCallback(async () => {
    setIsLoading(true);
    const response = await ApiService.getOffers();

    const jsonResp = await response.json();
    setAllOffers(jsonResp);
    setIsLoading(false);
    /* eslint-disable */
  }, []);

  useEffect(() => {
    doFetchTutorOffers();
  }, [doFetchTutorOffers]);
  // console.log('off', allOffers);

  return (
    <Layout className="p-4 bg-white">
      <Section
        title="Offers"
        subtitle={allOffers.length}
        description="Easily manage and respond to offers from potential clients"
      />
      {allOffers.length > 0 && <OffersGridList offers={allOffers} />}
    </Layout>
  );
}
