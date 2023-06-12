import { ChevronRightIcon } from "@heroicons/react/24/outline";

export default function PaymentTab() {
  return (
    <div className="space-y-6">
      
      <section className="space-y-4 border shadow-sm sm:rounded-lg p-4">
        <h2 className="border-b pb-4 uppercase text-secondaryGray">payment</h2>
        <div className="flex pt-2 justify-between items-center">
          <p className="text-sm">
            <span className="block font-[500] text-dark">Account name</span>
            <span className="block text-secondaryGray">lateefkolade98@gmail.com</span>
          </p>
          <button className="bg-white text-secondaryGray text-sm font-semibold border flex justify-center items-center rounded-md px-4 py-1.5">
            Change
          </button>
        </div>
        <div className="flex justify-between items-center">
          <p className="text-sm">
            <span className="block font-[500] text-dark">Account number</span>
            <span className="block text-secondaryGray">0214582140</span>
          </p>
          <button className="bg-white text-secondaryGray text-sm font-semibold border flex justify-center items-center rounded-md px-4 py-1.5">
            Change
          </button>
        </div>
        <div className="flex justify-between items-center">
          <p className="text-sm">
            <span className="block font-[500] text-dark">Bank name</span>
            <span className="block text-secondaryGray">Bank of America</span>
          </p>
          <button className="bg-white text-secondaryGray text-sm font-semibold border flex justify-center items-center rounded-md px-4 py-1.5">
            Change
          </button>
        </div>
      </section>

      <section className="space-y-4 border shadow-sm sm:rounded-lg p-4">
        <h2 className="border-b text-secondaryGray pb-4">Support</h2>

        <div className="flex justify-between mt-6 items-center">
          <p className="text-sm">
            <span className="block font-[500] text-dark">Terms and Conditions</span>
            <span className="block text-secondaryGray">Read Sherperd’s terms & conditions</span>
          </p>
          <ChevronRightIcon className="w-4 text-secondaryGray"/>
        </div>

        <div className="flex justify-between mt-6 items-center">
          <p className="text-sm">
            <span className="block font-[500] text-dark">Contact Support</span>
            <span className="block text-secondaryGray">Need help? Kindly reach out to our support team via mail</span>
          </p>
          <ChevronRightIcon className="w-4 text-secondaryGray"/>
        </div>
      </section>

    </div>
  )
}