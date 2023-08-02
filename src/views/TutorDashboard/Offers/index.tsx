import { Layout, OffersGridList, Section } from '../../../components';
import ApiService from '../../../services/ApiService';
import offerStore from '../../../state/offerStore';
import { Box } from '@chakra-ui/react';
import React, { useEffect, useState, useCallback } from 'react';

export default function Offers() {
  const { offers, fetchOffers, pagination } = offerStore();
  const [isLoading, setIsLoading] = useState(false);
  const [page, setPage] = useState<number>(1);
  const [limit, setLimit] = useState<number>(20);

  const [allOffers, setAllOffers] = useState<any>([]);
  const doFetchStudentTutors = useCallback(async () => {
    await fetchOffers(page, limit);
    setAllOffers(offers);
    /* eslint-disable */
  }, []);

  useEffect(() => {
    doFetchStudentTutors();
  }, [doFetchStudentTutors]);

  return (
    <Box className="p-4 bg-white">
      <Section
        title="Offers"
        subtitle={offers ? offers.length : 0}
        description="Easily manage and respond to offers from potential clients"
      />
      {offers && offers.length > 0 && (
        <OffersGridList offers={offers} pagination={pagination} />
      )}
    </Box>
  );
}
