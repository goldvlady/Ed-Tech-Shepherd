import { Layout, OffersGridList, Section } from '../../../components';
import ApiService from '../../../services/ApiService';
import offerStore from '../../../state/offerStore';
import {
  Box,
  Spinner,
  Tab,
  Tabs,
  TabList,
  TabPanel,
  TabPanels
} from '@chakra-ui/react';
import React, { useEffect, useState, useCallback } from 'react';

export default function Offers() {
  const { offers, fetchOffers, pagination } = offerStore();
  const [isLoading, setIsLoading] = useState(true);
  const [page, setPage] = useState<number>(1);
  const [limit, setLimit] = useState<number>(20);

  const [allOffers, setAllOffers] = useState<any>([]);
  const doFetchStudentTutors = useCallback(async () => {
    await fetchOffers(page, limit, 'tutor');
    setAllOffers(offers);
    setIsLoading(false);
    /* eslint-disable */
  }, []);

  useEffect(() => {
    doFetchStudentTutors();
  }, [doFetchStudentTutors]);

  if (isLoading) {
    return (
      <Box
        p={5}
        textAlign="center"
        style={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          height: '100vh'
        }}
      >
        <Spinner />
      </Box>
    );
  }

  return (
    <Box className="p-4 bg-white">
      <Section
        title="Offers"
        subtitle={offers ? offers.length : 0}
        description="Easily manage and respond to offers from potential clients"
      />

      <Tabs>
        <TabList className="tab-list">
          <Tab fontSize={16} fontWeight={500} color="text.400">
            Offers
          </Tab>
          <Tab fontSize={16} fontWeight={500} color="text.400">
            Instant Offers
          </Tab>
        </TabList>

        <TabPanels>
          <TabPanel>
            {offers && offers.length > 0 && (
              <OffersGridList offers={offers} pagination={pagination} />
            )}
          </TabPanel>
          <TabPanel>kljkhjghfgd</TabPanel>
        </TabPanels>
      </Tabs>
    </Box>
  );
}
