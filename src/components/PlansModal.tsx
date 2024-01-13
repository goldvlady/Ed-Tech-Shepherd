import priceData from '../mocks/pricing.json';
import ApiService from '../services/ApiService';
import userStore from '../state/userStore';
import { CustomButton } from '../views/Dashboard/layout';
import { StarIcon } from './icons';
import { SelectedNoteModal } from './index';
import {
  Box,
  Button,
  Flex,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalCloseButton,
  ModalBody,
  Stack,
  Text
} from '@chakra-ui/react';
import { Transition, Dialog } from '@headlessui/react';
import { XMarkIcon } from '@heroicons/react/20/solid';
import { getAuth } from 'firebase/auth';
import React, { Fragment, useState, useEffect } from 'react';
import { PiCheckCircleFill } from 'react-icons/pi';
import { useNavigate } from 'react-router';
import Typewriter from 'typewriter-effect';

interface StripePricingTableProps {
  'pricing-table-id': string;
  'publishable-key': string;
}

// Create a functional component for the custom element
const StripePricingTable: React.FC<StripePricingTableProps> = (props) => {
  return React.createElement('stripe-pricing-table', props);
};

interface ToggleProps {
  setTogglePlansModal: (state: boolean) => void;
  togglePlansModal: boolean;
}

const PlansModal = ({
  setTogglePlansModal,
  togglePlansModal,
  message,
  subMessage
}: ToggleProps & { message?: string; subMessage?: string }) => {
  const [showSelected, setShowSelected] = useState(false);
  const [currentPlan, setCurrentPlan] = useState('Basic');
  const { user }: any = userStore();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalContent, setModalContent] = useState('');
  const navigate = useNavigate();
  const openModal = (content) => {
    setModalContent(content);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setModalContent('');
  };

  const { hasActiveSubscription } = userStore((state) => ({
    hasActiveSubscription: state.hasActiveSubscription
  }));

  const planPriorities = {
    Basic: 1,
    Premium: 2,
    'Founding Member': 3
  };

  // Function to determine the button text
  const getButtonText = (userPlan, cardPlan) => {
    const userPlanPriority = planPriorities[userPlan.tier] || 0;
    const cardPlanPriority = planPriorities[cardPlan.tier];

    if (userPlanPriority === cardPlanPriority) {
      return 'Manage your plan';
    } else if (userPlanPriority < cardPlanPriority) {
      return 'Upgrade plan';
    } else {
      return 'Downgrade plan';
    }
  };

  // Function to determine if the button should be disabled
  const isButtonDisabled = (userPlan) => {
    return userPlan.tier === 'Founding Member';
  };

  useEffect(() => {
    const script = document.createElement('script');
    script.src = 'https://js.stripe.com/v3/pricing-table.js';
    script.async = true;
    document.body.appendChild(script);

    return () => {
      document.body.removeChild(script);
    };
  }, []);

  const handleSubscriptionClick = async (priceIdKey) => {
    const priceId = process.env[priceIdKey];
    if (!priceId) {
      console.error('Price ID not found for', priceIdKey);
      // Handle error scenario
      return;
    }
    if (!user || !user.id) {
      console.error('User is not authenticated');
      // Handle unauthenticated user scenario

      openModal('You will be redirected to create an account');
      setTimeout(() => {
        navigate('/signup');
      }, 150);
      return;
    }

    const session = await ApiService.initiateUserSubscription(
      user.id,
      priceId,
      user.stripeCustomerId ? user.stripeCustomerId : null
    );
    const portal = await session.json();
    window.location.href = portal.url;
  };

  // Function to redirect to Stripe's customer portal
  const redirectToCustomerPortal = async (tier) => {
    console.log('tier', tier);
    let portal;
    if (!user || !user.id) {
      console.error('User is not authenticated');
      // Handle unauthenticated user scenario

      openModal('You will be redirected to create an account');
      setTimeout(() => {
        navigate('/signup');
      }, 150);
      return;
    }
    if (tier === 'Founding Member') {
      const session = await ApiService.getStripeCustomerPortalUrl(
        user.stripeCustomerId
      );
      portal = await session.json();
    } else {
      const session = await ApiService.getStripeCustomerPortalUrl(
        user.stripeCustomerId,
        user.subscription.stripeSubscriptionId,
        user.subscription.tier
      );
      portal = await session.json();
    }
    window.location.href = portal.url;
  };

  const handleClose = () => {
    setTogglePlansModal(false);
  };

  const handleShowSelected = () => {
    setShowSelected(true);
  };

  return (
    <div>
      {togglePlansModal && (
        <Transition.Root show={togglePlansModal} as={Fragment}>
          <Dialog as="div" className="relative z-[800]" onClose={() => null}>
            <Transition.Child
              as={Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0"
              enterTo="opacity-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100"
              leaveTo="opacity-0"
            >
              <div className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" />
            </Transition.Child>

            <div className="fixed inset-0 z-10 overflow-y-auto">
              <div className="flex min-h-full items-end justify-center p-4 text-center sm:items-center sm:p-0">
                <Transition.Child
                  as={Fragment}
                  enter="ease-out duration-300"
                  enterFrom="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
                  enterTo="opacity-100 translate-y-0 sm:scale-100"
                  leave="ease-in duration-200"
                  leaveFrom="opacity-100 translate-y-0 sm:scale-100"
                  leaveTo="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
                >
                  <Dialog.Panel className="relative transform overflow-hidden rounded-2xl bg-white mt-10 text-left shadow-xl transition-all sm:w-full sm:max-w-5xl">
                    <div>
                      <div className="flex justify-between align-middle border-b pb-2 px-2">
                        <Box p={2}>
                          {message && (
                            <>
                              <Text
                                fontSize={24}
                                fontWeight={600}
                                color={
                                  !hasActiveSubscription
                                    ? 'text.200'
                                    : '#fb8441'
                                }
                                textAlign={'center'}
                              >
                                {message}
                              </Text>
                              {subMessage && (
                                <Text
                                  fontSize={17}
                                  fontWeight={500}
                                  color="text.300"
                                  mt={2}
                                >
                                  {subMessage}
                                </Text>
                              )}
                            </>
                          )}
                          {!message && (
                            <>
                              <Text
                                fontSize={24}
                                fontWeight={600}
                                color="text.200"
                              >
                                Select your Plan
                              </Text>
                              <Text
                                fontSize={14}
                                fontWeight={500}
                                color="text.400"
                              >
                                Get started for free today and unlock the full
                                power of your AI study tools!
                              </Text>
                            </>
                          )}
                        </Box>
                        <button
                          onClick={handleClose}
                          className="inline-flex h-6 space-x-1 items-center rounded-full bg-gray-100 px-2 py-1 mt-4 mb-2 mr-4 text-xs font-medium text-secondaryGray hover:bg-orange-200 hover:text-orange-600"
                        >
                          <span>Close</span>
                          <XMarkIcon className="w-4 h-4" />
                        </button>
                      </div>
                      <Box padding={'10px'}>
                        {hasActiveSubscription ? (
                          <div className="landing-price-wrapper">
                            {priceData.map((priceCard) => (
                              <div
                                className={`landing-price-card ${
                                  user.subscription &&
                                  user.subscription.tier === priceCard.tier
                                    ? 'landing-price-card-active'
                                    : ''
                                }`}
                                style={{
                                  position: priceCard.popular
                                    ? 'relative'
                                    : 'static'
                                }}
                              >
                                {priceCard.popular &&
                                  !(
                                    user.subscription.tier === priceCard.tier
                                  ) && (
                                    <Text className="landing-price-sub-bubble">
                                      Popular
                                    </Text>
                                  )}
                                <div
                                  className={`${
                                    user.subscription &&
                                    user.subscription.tier === priceCard.tier
                                      ? 'landing-plan-wrapper'
                                      : 'landing-metric-wrapper'
                                  }`}
                                >
                                  <Text className="landing-price-level">
                                    {priceCard.tier}
                                  </Text>
                                  {user.subscription.tier ===
                                    priceCard.tier && (
                                    <Box className="landing-price-level-plan">
                                      Current Plan
                                    </Box>
                                  )}
                                </div>
                                <div className="landing-metric-wrapper">
                                  <Text className="landing-price-point">
                                    {priceCard.price}
                                  </Text>
                                  {priceCard.cycle && (
                                    <Text
                                      className="landing-metric-tag"
                                      style={{ fontWeight: '400' }}
                                    >
                                      {priceCard.cycle}
                                    </Text>
                                  )}
                                </div>
                                <div className="landing-section-item-modal">
                                  {priceCard['value'].map((value) => (
                                    <div className="landing-price-value">
                                      <img
                                        className="landing-check-icon"
                                        src="/images/checkIcon.svg"
                                        alt="price"
                                      />
                                      <Text
                                        className="landing-desc-mini"
                                        fontSize={14}
                                      >
                                        {value}
                                      </Text>
                                    </div>
                                  ))}
                                  <Button
                                    className="landing-price-btn"
                                    onClick={() =>
                                      redirectToCustomerPortal(priceCard.tier)
                                    }
                                    disabled={isButtonDisabled(
                                      user.subscription
                                    )}
                                  >
                                    {getButtonText(
                                      user.subscription,
                                      priceCard
                                    )}
                                  </Button>
                                </div>
                              </div>
                            ))}
                          </div>
                        ) : (
                          <div className="landing-price-wrapper">
                            {priceData.map((priceCard) => (
                              <div
                                className="landing-price-card"
                                style={{
                                  position: priceCard.popular
                                    ? 'relative'
                                    : 'static'
                                }}
                              >
                                {priceCard.popular && (
                                  <Text className="landing-price-sub-bubble">
                                    Popular
                                  </Text>
                                )}
                                <div className="landing-metric-wrapper">
                                  <Text className="landing-price-level">
                                    {priceCard.tier}
                                  </Text>
                                </div>
                                <div className="landing-metric-wrapper">
                                  <Text className="landing-price-point">
                                    {priceCard.price}
                                  </Text>
                                  {priceCard.cycle && (
                                    <Text
                                      className="landing-metric-tag"
                                      style={{ fontWeight: '400' }}
                                    >
                                      {priceCard.cycle}
                                    </Text>
                                  )}
                                </div>
                                <div className="landing-section-item-modal">
                                  {priceCard['value'].map((value) => (
                                    <div className="landing-price-value">
                                      <img
                                        className="landing-check-icon"
                                        src="/images/checkIcon.svg"
                                        alt="price"
                                      />
                                      <Text
                                        className="landing-desc-mini"
                                        fontSize={14}
                                      >
                                        {value}
                                      </Text>
                                    </div>
                                  ))}
                                  <Button
                                    className="landing-price-btn"
                                    onClick={() =>
                                      handleSubscriptionClick(priceCard.priceId)
                                    }
                                  >
                                    Try for Free
                                  </Button>
                                </div>
                              </div>
                            ))}
                          </div>
                        )}
                        <Text
                          textAlign="center"
                          my={2}
                          fontSize={14}
                          fontWeight={500}
                          color="text.300"
                        >
                          For more details & enquiries?{' '}
                          <span className="text-blue-600">Contact Support</span>
                        </Text>
                      </Box>

                      {/* <div className="overflow-hidden sm:w-[80%] w-full mx-auto p-6 pt-3  bg-white sm:grid sm:grid-cols-3 justify-items-center sm:gap-x-4 sm:space-y-0 space-y-2">
                        {actions2.map((action) => (
                          <div
                            onClick={() => {
                              if (action.showModal) handleShowSelected();
                            }}
                            key={action.title}
                            className="group cursor-pointer relative transform  bg-white border-1 rounded-lg  border-gray-300 p-4 focus-within:border-blue-500 hover:border-blue-500"
                          >
                            <div>
                              <img src={action.imageURL} alt={action.title} />
                            </div>
                            <div className="mt-4">
                              <button className="text-base font-semibold leading-6 text-orange-400">
                                <span
                                  className="absolute inset-0"
                                  aria-hidden="true"
                                />
                                {action.title}
                              </button>
                              <Text className="mt-2 text-sm text-secondaryGray">
                                {action.description}
                              </Text>
                            </div>
                          </div>
                        ))}
                      </div> */}
                    </div>
                  </Dialog.Panel>
                </Transition.Child>
              </div>
            </div>
          </Dialog>
        </Transition.Root>
      )}
      <Modal isOpen={isModalOpen} onClose={closeModal}>
        <ModalOverlay />
        <ModalContent>
          <ModalCloseButton />
          <ModalBody>
            <p>{modalContent}</p>
          </ModalBody>
        </ModalContent>
      </Modal>
    </div>
  );
};

export default PlansModal;
