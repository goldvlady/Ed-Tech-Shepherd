import LoaderOverlay from '../../../../components/loaderOverlay';
import TitleCard from './TitleCard';
import { SimpleGrid } from '@chakra-ui/react';
import React from 'react';
import { capitalize } from 'lodash';

interface LibraryProviderProps {
  providers: Array<{ _id: string; name: string }>;
  onSelectProvider: (providerId: string) => void;
}

const ProviderList: React.FC<LibraryProviderProps> = ({
  providers,
  onSelectProvider
}) => {
  if (!providers?.length) {
    return <LoaderOverlay />;
  }

  return (
    <SimpleGrid columns={{ base: 1, md: 2, lg: 2, xl: 3 }} spacing={10}>
      {providers.map((provider) => (
        <TitleCard
          key={provider._id}
          data={{ name: capitalize(provider.name) }}
          onClick={() => onSelectProvider(provider._id)}
        />
      ))}
    </SimpleGrid>
  );
};

export const ProviderSkeleton = () => (
  <SimpleGrid columns={{ base: 1, md: 2, lg: 2, xl: 3 }} spacing={10}>
    {[1, 2, 3].map((provider) => (
      <div
        key={provider}
        className="w-72 h-20 border border-black/5 bg-[#F8F9FB] animate-pulse"
      ></div>
    ))}
  </SimpleGrid>
);
export default ProviderList;
