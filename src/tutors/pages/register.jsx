import { classNames } from '../helpers'
import { CheckIcon } from '@heroicons/react/20/solid'

const steps = [
  { name: 'Step 1', href: '#', status: 'complete', title: 'Personal details' },
  { name: 'Step 2', href: '#', status: 'current' },
  { name: 'Step 3', href: '#', status: 'current' },
]

export default function CreateAccount() {
  return (
    <div className="flex min-h-full flex-1">
      <div className="relative hidden bg-gray-100 w-[50%] flex-1 lg:block">
        <h2 className="mt-12 mb-6 text-4xl px-6 font-bold">
          <span>Hi there,</span>
          <span className="text-primaryBlue">Welcome!</span>
        </h2>
        <img
          className="inset-0 w-full object-cover"
          src="/images/register-pattern.png"
          alt=""
        />
      </div>
      <div className="flex flex-1 w-[50%] flex-col justify-center px-4 py-12 sm:px-6 lg:flex-none lg:px-20 xl:px-24">
        <div className="mx-auto w-full max-w-sm lg:w-96">
          <div className="text-center">
            <img
              className="h-10 w-auto mx-auto"
              src="/svgs/logo.svg"
              alt="Your Company"
            />
            <h2 className="mt-8 text-2xl font-bold leading-9 tracking-tight text-gray-900">
              Create your Shepherd Account
            </h2>
            <p className="mt-2 text-sm leading-6 text-gray-500">
              Hi there, before you proceed, let us know who is signing up
            </p>
          </div>

          <Steps />

          <div className="mt-10">
            <div>
              <form className="space-y-6">
                <div>
                  <label htmlFor="firstname" className="block text-sm font-medium leading-6 text-gray-500">
                    First Name
                  </label>
                  <div className="mt-2">
                    <input
                      id="firstname"
                      name="firstname"
                      type="text"
                      autoComplete="firstname"
                      required
                      placeholder="Emmanuel"
                      className="block w-full rounded-md border-0 py-1.5 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-700 focus:ring-2 focus:ring-inset focus:ring-secondaryBlue sm:text-sm sm:leading-6"
                    />
                  </div>
                </div>

                <div>
                  <label htmlFor="lastname" className="block text-sm font-medium leading-6 text-gray-500">
                    Last Name
                  </label>
                  <div className="mt-2">
                    <input
                      id="lastname"
                      name="lastname"
                      type="text"
                      placeholder="Baltimore"
                      autoComplete="lastname"
                      required
                      className="block w-full rounded-md border-0 py-1.5 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-700 focus:ring-2 focus:ring-inset focus:ring-secondaryBlue sm:text-sm sm:leading-6"
                    />
                  </div>
                </div>

                <div>
                  <label htmlFor="email" className="block text-sm font-medium leading-6 text-gray-500">
                    Email address
                  </label>
                  <div className="mt-2">
                    <input
                      id="email"
                      name="email"
                      type="email"
                      autoComplete="email"
                      required
                      className="block w-full rounded-md border-0 py-1.5 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-700 focus:ring-2 focus:ring-inset focus:ring-secondaryBlue sm:text-sm sm:leading-6"
                    />
                  </div>
                </div>

                <div>
                  <button
                    type="submit"
                    className="flex w-full justify-center rounded-md bg-secondaryBlue px-3 py-2 text-sm font-semibold leading-6 text-white shadow-sm hover:bg-secondary-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600"
                  >
                    Next
                  </button>
                </div>

                <div className="flex items-center justify-center">
                  <div className="text-sm leading-6 space-x-2">
                    <span>Already have an account?</span>
                    <a href="#" className="font-semibold text-secondaryBlue hover:text-blue-500">
                      Log in
                    </a>
                  </div>
                </div>

              </form>
            </div>

          </div>
        </div>
      </div>
    </div>
  )
}

function Steps() {
  return (
    <nav aria-label="Progress" className='mt-6'>
      <ol className="flex items-center">
        {steps.map((step, stepIdx) => (
          <li key={step.name} className={classNames(stepIdx !== steps.length - 1 ? 'pr-8 w-full' : '', 'relative')}>
            {step.status === 'complete' ? (
              <>
                <div className="absolute inset-0 flex items-center" aria-hidden="true">
                  <div className='pl-10 w-full text-xs font-bold text-gray-500'>
                    <span>{step.title}</span>
                  </div>
                  <div className="h-0.5 w-12 bg-secondaryBlue" />
                </div>
                <a
                  href="#"
                  className="relative flex h-8 w-8 items-center justify-center rounded-full border border-secondaryBlue bg-blue-100"
                  aria-current="step"
                >
                  <span className="h-2.5 w-2.5 rounded-full bg-secondaryBlue" aria-hidden="true" />
                  <span className="sr-only">{step.name}</span>
                </a>
              </>
            ) : step.status === 'current' ? (
              <>
                <div className="absolute inset-0 flex items-center" aria-hidden="true">
                  <div className="h-0.5 w-full bg-gray-200" />
                </div>
                <a
                  href="#"
                  className="relative flex h-8 w-8 items-center justify-center rounded-full border-2 border-gray-400 bg-white"
                  aria-current="step"
                >
                  <span className="h-2.5 w-2.5 rounded-full bg-gray-400" aria-hidden="true" />
                  <span className="sr-only">{step.name}</span>
                </a>
              </>
            ) : (
              <>
                <div className="absolute inset-0 flex items-center" aria-hidden="true">
                  <div className="h-0.5 w-full bg-gray-200" />
                </div>
                <a
                  href="#"
                  className="group relative flex h-8 w-8 items-center justify-center rounded-full border-2 border-gray-300 bg-white hover:border-gray-400"
                >
                  <span
                    className="h-2.5 w-2.5 rounded-full bg-transparent group-hover:bg-gray-300"
                    aria-hidden="true"
                  />
                  <span className="sr-only">{step.name}</span>
                </a>
              </>
            )}
          </li>
        ))}
      </ol>
    </nav>
  )
}