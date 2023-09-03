import { Section } from '../../../components';
import BountyGridList from '../../../components/BountyGridList';
import offerStore from '../../../state/offerStore';
import { Box, Spinner } from '@chakra-ui/react';
import React, { useState, useCallback, useEffect } from 'react';

function TutorBounties() {
  const { pagination, fetchBountyOffers, bounties } = offerStore();

  const [isLoading, setIsLoading] = useState(true);
  const [page, setPage] = useState<number>(1);
  const [limit, setLimit] = useState<number>(20);

  const doFetchBountyOffers = useCallback(async () => {
    await fetchBountyOffers(page, limit);

    setIsLoading(false);
    /* eslint-disable */
  }, []);

  useEffect(() => {
    doFetchBountyOffers();
  }, [doFetchBountyOffers]);

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
    <>
      <Box className="p-4 bg-white">
        <Section
          title="Bounties"
          subtitle={bounties.length}
          description="Easily manage and respond to active bounty offers from potential clients"
        />

        <Box>
          {bounties && bounties.length > 0 && (
            <BountyGridList offers={bounties} pagination={pagination} />
          )}
        </Box>
      </Box>
    </>
  );
}

export default TutorBounties;
