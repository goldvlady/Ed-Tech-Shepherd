import { Text } from '@chakra-ui/react';
import React from 'react';

export default function GridList() {
  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-3 mt-4 px-6">
      <div className="relative flex items-center space-x-3 overflow-hidden rounded-lg border border-gray-300 bg-primaryBlue px-4 py-2 shadow-sm focus-within:ring-2 focus-within:ring-indigo-500 focus-within:ring-offset-2 hover:border-gray-400">
        <div className="absolute h-24 w-24 -right-4 top-10 -rotate-45 text-gray-400 overflow-auto">
          <img src="/svgs/card-money.svg" alt="" />
        </div>
        <div className="min-w-0 space-y-2 flex-1">
          <span className="absolute inset-0" aria-hidden="true" />
          <Text className="text-sm font-medium text-white/90">
            Total earned
          </Text>
          <Text className="text-2xl font-semibold text-white">$5160.50</Text>
          <Text className="truncate text-sm text-white/90">
            24hrs of tutoring completed!
          </Text>
        </div>
      </div>
      <div className="relative flex items-center space-x-3 rounded-lg border border-gray-300 bg-gray-50 overflow-hidden px-4 py-2 shadow-sm focus-within:ring-2 focus-within:ring-indigo-500 focus-within:ring-offset-2 hover:border-gray-400">
        <div className="absolute h-24 w-24 -right-4 top-10 -rotate-45 text-gray-400">
          <img src="/svgs/card-case.svg" alt="" />
        </div>
        <div className="min-w-0 space-y-2 flex-1">
          <span className="absolute inset-0" aria-hidden="true" />
          <Text className="text-sm font-medium text-gray-400">
            Total Clients
          </Text>
          <Text className="text-2xl font-semibold">314</Text>
          <Text className="truncate text-sm text-green-400">
            + Increased 10% this month
          </Text>
        </div>
      </div>
      <div className="relative overflow-hidden flex items-center space-x-3 rounded-lg border border-gray-300 bg-gray-50 px-4 py-2 shadow-sm focus-within:ring-2 focus-within:ring-indigo-500 focus-within:ring-offset-2 hover:border-gray-400">
        <div className="absolute h-24 w-24 -right-4 top-10 -rotate-45 text-gray-400 overflow-auto">
          <img src="/svgs/card-groups.svg" alt="" />
        </div>
        <div className="min-w-0 space-y-2 flex-1">
          <span className="absolute inset-0" aria-hidden="true" />
          <Text className="text-sm font-medium text-gray-400">
            Current clients
          </Text>
          <Text className="text-2xl font-semibold">20</Text>
          <Text className="truncate text-sm text-red-400">
            - Decreased 10% this month
          </Text>
        </div>
      </div>
    </div>
  );
}
