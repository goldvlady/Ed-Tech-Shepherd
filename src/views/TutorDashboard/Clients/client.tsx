import { Layout } from '../../../components';
import { ArrowRightIcon } from '../../../components/icons';
import ApiService from '../../../services/ApiService';
import { Avatar, Text, Box, Spinner } from '@chakra-ui/react';
import {
  ChevronRightIcon,
  QuestionMarkCircleIcon
} from '@heroicons/react/20/solid';
import moment from 'moment';
import React, { useState, useCallback, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useParams } from 'react-router-dom';

export default function Client() {
  const { clientId }: any = useParams();
  const [client, setClient] = useState<any>();
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const doFetchTutorClient = useCallback(async (id: string) => {
    const response = await ApiService.getTutorSingleClients(id);
    const tutorClients = await response.json();
    setClient(tutorClients);
    setIsLoading(false);
  }, []);
  useEffect(() => {
    doFetchTutorClient(clientId);
  }, [doFetchTutorClient]);

  const dayMappings = {
    0: 'Sun',
    1: 'Mon',
    2: 'Tue',
    3: 'Wed',
    4: 'Thu',
    5: 'Fri',
    6: 'Sat'
  };

  function getDaysOfWeek(schedule) {
    const selectedDays = Object.keys(schedule).map((key) => dayMappings[key]);
    const daysOfWeek = selectedDays.join(',');
    return daysOfWeek;
  }

  function formatTimeRange(begin: string, end: string): string {
    return `${begin} -> ${end}`;
  }

  function getFormattedTimeRanges(
    schedule: Record<string, { begin: string; end: string }>
  ): string {
    const formattedTimeRanges = Object.values(schedule).map(
      ({ begin, end }) => {
        return formatTimeRange(begin, end);
      }
    );
    return formattedTimeRanges.join(', ');
  }

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
      <nav className="flex mt-4" aria-label="Breadcrumb">
        <ol className="flex items-center">
          <li>
            <button className="flex items-center">
              <Link
                to="/clients"
                className="text-sm font-medium text-gray-400 hover:text-gray-700"
              >
                Clients
              </Link>
            </button>
          </li>
          <li>
            <div className="flex items-center text-gray-400">
              <ChevronRightIcon
                className="h-5 w-5 flex-shrink-0 text-gray-400"
                aria-hidden="true"
              />
              <Text className="text-sm font-medium">
                {' '}
                {`${client?.student?.user?.name.first} ${client?.student?.user?.name.last}`}
              </Text>
            </div>
          </li>
          <li>
            <div className="flex items-center">
              <ChevronRightIcon
                className="h-5 w-5 flex-shrink-0 text-gray-400"
                aria-hidden="true"
              />
              <Text className="text-sm font-normal text-secondaryBlue hover:text-blue-700">
                Contract
              </Text>
            </div>
          </li>
        </ol>
      </nav>
      <section className="my-4">
        <Text className="space-x-2">
          <span className="font-bold px-4 text-2xl">Contract</span>
        </Text>
      </section>

      <div className="mx-auto max-w-7xl px-4 py-10 sm:px-2">
        <div className="mx-auto grid max-w-2xl grid-cols-1 grid-rows-1 items-start gap-x-8 gap-y-8 lg:mx-0 lg:max-w-none lg:grid-cols-3">
          {/* Invoice summary */}
          <div className="lg:col-start-3 bg-white lg:col-span-2 lg:row-end-1 p-2 rounded-lg shadow-sm ring-1 ring-gray-900/5">
            <div>
              <div className="h-14 w-14 mx-auto flex items-center justify-center bg-gray-100 p-2 rounded-full">
                <img
                  src="/svgs/text-document.svg"
                  className="h-6 w-6 text-gray-400"
                  alt=""
                />
              </div>
              <div className="mt-3 text-center sm:mt-5">
                <div className="mt-2 space-y-1">
                  <Text className="text-dark font-semibold">
                    You have an active contract
                  </Text>
                  <Text className="text-sm text-gray-500">
                    You’ve completed 10 out of 15 sessions
                  </Text>
                </div>
              </div>
            </div>
            <div className="mt-5 sm:mt-6">
              <button
                type="button"
                className="inline-flex w-full justify-center border rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-500 shadow-sm hover:text-gray-560 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-gray-600"
              >
                Send message
              </button>
            </div>
          </div>

          <div className="-mx-4 space-y-4 sm:mx-0 lg:col-span-2 lg:row-span-2 lg:row-end-2">
            <div className="flex shadow-sm sm:rounded-lg p-4 ring-1 ring-gray-900/5 lg:space-y-0 space-y-3 items-center justify-between">
              <section className="flex items-center sm:space-y-0 space-y-3 sm:space-x-4">
                <Avatar
                  name={`${client?.student?.user?.name.first} ${client?.student?.user?.name.last}`}
                  src={client?.student?.user?.avatar}
                />

                <Text className="">
                  <span className="block whitespace-nowrap">{`${client?.student?.user?.name.first} ${client?.student?.user?.name.last}`}</span>
                  <span className="inline-block text-gray-400 text-sm">
                    {`  Your contract with ${
                      client?.student?.user?.name.first
                    } ends ${moment(client?.offer?.contractEndDate).format(
                      'MMMM DD, YYYY'
                    )}`}
                  </span>
                </Text>
              </section>
              <div className="flex flex-none items-center gap-x-4">
                <Text className="rounded-md bg-gray-50 px-2.5 py-1.5 text-sm font-semibold text-gray-500 shadow-sm hover:bg-gray-50 sm:block">
                  {moment(client?.offer?.contractEndDate).format('DD.MM.YYYY')}
                </Text>
              </div>
            </div>

            <div className="shadow-sm sm:rounded-lg p-4 ring-1 ring-gray-900/5 lg:space-y-0 space-y-3">
              <Text className="text-xl mb-4 font-semibold tracking-wider">
                Offer Details
              </Text>
              <ul className="space-y-4">
                <li className="text-sm space-y-2 font-normal">
                  <Text className="text-secondaryGray">Subject & Level</Text>
                  <Text>{`${client?.offer?.course.label} - ${client?.offer?.level.label}`}</Text>
                </li>
                <li className="text-sm space-y-2 font-normal">
                  <Text className="text-secondaryGray">
                    What days would you like to have your classes
                  </Text>
                  <Text>{getDaysOfWeek(client?.offer.schedule)}</Text>
                </li>
                <li className="text-sm space-y-2 font-normal">
                  <Text className="text-secondaryGray">
                    Frequency of class sessions
                  </Text>
                  <Text>Weekly</Text>
                </li>
                <li className="text-sm space-y-2 font-normal">
                  <Text className="text-secondaryGray">Time</Text>
                  <Text className="flex items-center space-x-1">
                    {getFormattedTimeRanges(client.offer.schedule)}
                  </Text>
                </li>
                <li className="text-sm space-y-2 font-normal">
                  <Text className="text-secondaryGray">Start date</Text>
                  <Text>
                    {moment(client?.offer?.contractStartDate).format(
                      'MMMM DD, YYYY'
                    )}
                  </Text>
                </li>
                <li className="text-sm space-y-2 font-normal">
                  <Text className="text-secondaryGray">End date</Text>
                  <Text>
                    {moment(client?.offer?.contractEndDate).format(
                      'MMMM DD, YYYY'
                    )}
                  </Text>
                </li>
                <li className="text-sm space-y-2 font-normal">
                  <Text className="text-secondaryGray">Note</Text>
                  <Text>{client.offer.note}</Text>
                </li>
              </ul>
            </div>

            <div className="shadow-sm sm:rounded-lg p-4 ring-1 ring-gray-900/5 lg:space-y-0 space-y-3">
              <Text className="text-xl mb-4 font-semibold tracking-wider">
                Payment Details
              </Text>
              <ul className="space-y-4">
                <li className="text-sm space-y-2 font-normal">
                  <Text className="text-secondaryGray">Hourly rate</Text>
                  <Text className="text-gray-800">{`$${client.offer.rate}.00/hr`}</Text>
                  <Text className="flex space-x-1 text-sm">
                    <span>Shepherd charges a</span>
                    <span className="text-secondaryBlue">
                      {` 5% service fee (-$${client.offer.rate * 0.05}.00/hr)`}
                    </span>
                    <QuestionMarkCircleIcon className="h-4 w-4 rounded-full text-gray-200 bg-secondaryGray" />
                  </Text>
                </li>

                <li className="text-sm space-y-2 font-normal">
                  <Text className="text-secondaryGray">You'll receive</Text>
                  <Text className="text-gray-800">{`$${
                    client.offer.rate - client.offer.rate * 0.05
                  }.00/hr`}</Text>
                </li>

                <li className="text-sm mb-4 space-y-2 font-normal">
                  <Text className="text-secondaryGray">Total amount</Text>
                  <Text className="text-gray-800">$000.00</Text>
                  <Text className="flex space-x-1 text-sm">
                    You'll be paid after each session
                  </Text>
                </li>
              </ul>

              <div
                style={{ marginTop: '1rem' }}
                className="flex items-start space-x-2 font-semibold bg-blue-100 text-gray-500 p-3 rounded-md"
              >
                <div className="flex justify-center items-center text-sm font-bold bg-primaryColor text-white w-10 rounded-full">
                  i
                </div>
                <Text className="text-sm">
                  Initial payment will not be made until after the client
                  reviews the offer after the first session. The client may
                  decide to continue with you or withdraw the offer
                </Text>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
