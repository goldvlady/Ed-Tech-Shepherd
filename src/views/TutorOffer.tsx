import React, { Fragment, useState } from 'react'
import { Dialog, Transition } from '@headlessui/react'
import {
  Layout, 
  Breadcrumb, 
  OfferSummary, 
  AcceptOfferModal, 
  DeclineOfferModal,
  DetailsCard
} from "../components";

export default function Offer() {
  const [offerModalState, setOfferModalState] = useState(false);
  const [declineOffferModalState, setDeclineOfferModalState] = useState(false);
  return (
    <>
      <Layout className="px-4">
        <Breadcrumb />
        <section className="my-4">
          <h4 className="space-x-2">
            <span className="font-bold text-2xl">Review Offer</span>
          </h4>
          <p className="text-primaryGray text-sm">Respond to offer from clients, you may also choose to renegotiate</p>
        </section>
        
        <div className="mx-auto max-w-7xl px-4 py-10 sm:px-2">
          <div className="mx-auto grid max-w-2xl grid-cols-1 grid-rows-1 items-start gap-x-8 gap-y-8 lg:mx-0 lg:max-w-none lg:grid-cols-3">
            {/* Offer Summary */}
            <OfferSummary setDeclineOfferModalState={setDeclineOfferModalState} setOfferModalState={setOfferModalState}/>

            
            <DetailsCard
              name="Liam Kelly"
              avatarSrc="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80"
              offerExpires="June 10, 2023"
              subjectLevel="Mathematics - A-Level"
              availability="Mon, Tue, Wed"
              note="Consequat luctus morbi suspendisse eu quis diam eleifend orci aliquet. Facilisi in lorem ultricies ligula arcu odio"
              hourlyRate="$25.00/hr"
              serviceFee="5% service fee (-$3.00/hr)"
              finalRate="$22.00/hr"
              totalAmount="$214.00"
              paymentAwareness="You'll be paid after each session"
              paymentNote="Initial payment will not be made until after the client reviews the offer after the first session. The client may decide to continue with you or withdraw the offer"
            />


          </div>
        </div>
      </Layout>

      {/* Accept Offer Modal */}
      <Transition.Root show={offerModalState} as={Fragment}>
        <Dialog as="div" className="relative z-50" onClose={setOfferModalState}>
          <AcceptOfferModal offerModalState={offerModalState} setOfferModalState={setOfferModalState}/>
        </Dialog>
      </Transition.Root>

      {/* Decline Offer Modal */}
      <Transition.Root show={declineOffferModalState} as={Fragment}>
      <Dialog as="div" className="relative z-50" onClose={setDeclineOfferModalState}>
        <DeclineOfferModal declineOfferModalState={declineOffferModalState} setDeclineOfferModalState={setDeclineOfferModalState}/>
      </Dialog>
      </Transition.Root>
    </>
  )
}