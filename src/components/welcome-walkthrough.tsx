import { XCircleIcon } from '@heroicons/react/20/solid';
import * as Dialog from '@radix-ui/react-dialog';
import React from 'react';
import LinedListWelcome from './LinedListWelcome';
import useCompletedStore from '../state/useCompletedStore';
const SignUpButton = ({ last }: { last?: boolean }) => (
  <button
    className={`px-8 pointer-events-none py-3 border ${
      last && ' w-5/6'
    } border-input bg-green-500 shadow-sm text-black h-9 inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50`}
  >
    Sign Up
  </button>
);
const DialogClose = () => (
  <Dialog.Close
    onClick={() => {
      localStorage.setItem('completed', 'true');
    }}
    className="!ml-auto -mt-4"
  >
    <XCircleIcon width={20} height={20} />
  </Dialog.Close>
);
export default function WelcomeWalkthrough() {
  const open = useCompletedStore((state) => state.open);
  const setOpen = useCompletedStore((state) => state.setOpen);
  const [currentIdx, setCurrentIdx] = React.useState(1);
  const [items, setItems] = React.useState<
    Array<{ title: string; read: boolean; id: number }>
  >([
    {
      id: 1,
      title: 'Welcome to Shepherd',
      read: true
    },
    {
      id: 2,
      title: 'Taking Notes on Shepherd',
      read: false
    },
    { id: 3, title: 'Doc-Chat', read: false },
    { id: 4, title: 'Creating flashcards & Creating quizzes', read: false },
    { id: 5, title: 'AI Tutor', read: false },
    { id: 6, title: 'Connecting with a human tutor', read: false },
    { id: 7, title: 'Final note!', read: false }
  ]);
  const render = React.useMemo(() => {
    if (currentIdx === 1) {
      return (
        <Dialog.Content className="bg-white px-8 py-12 min-h-[50vh] w-auto rounded-b-md rounded-r-md">
          <div className="flex items-center justify-center gap-4">
            <Dialog.Title className="whitespace-nowrap -mt-4 !text-lg">
              {items.find((i) => i.id === currentIdx).title}
            </Dialog.Title>
            <DialogClose />
          </div>
          <p className="text-lg my-3">
            Hey Friend! Welcome to Shepherd. We're really excited to have you
            with us. We built Shepherd because we want to make your studying
            more efficient and effective. As former students we wanted to build
            the tool we wish we had. Let's take a quick walk through some cool
            features that can make studying a breeze for you.
          </p>
          <div className="flex gap-3">
            <button
              onClick={() => {
                const it = [...items];

                it.find((i) => i.id === currentIdx + 1).read = true;

                setItems(it);
                setCurrentIdx(2);
              }}
              className=" px-8 py-3 border border-input bg-transparent shadow-sm text-black h-9 inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50"
            >
              Continue
            </button>
            <SignUpButton />
          </div>
        </Dialog.Content>
      );
    } else if (currentIdx === 2) {
      return (
        <Dialog.Content className="bg-white  px-8 py-12 min-h-[50vh] w-auto rounded-b-md rounded-r-md">
          <div className="flex items-center justify-center gap-4">
            <Dialog.Title className="whitespace-nowrap -mt-4 !text-lg">
              {items.find((i) => i.id === currentIdx).title}
            </Dialog.Title>
            <DialogClose />
          </div>
          <p className="text-lg my-3">
            First up, note-taking. This is probably where you&apos;d be day to
            day. It&apos;s super easy and organized here. Think of it as your
            digital notebook that&apos;s always just a click away, ready to keep
            all your thoughts and study notes in one place. <br /> You can use
            Shepherd to converse with your notes or automatically generate
            flashcards
          </p>
          <img
            src="/images/welcome/chat-notes.gif"
            alt="chat notes"
            loading="eager"
            className=" h-80 my-3 w-full"
          />
          <div className="flex gap-3 items-center justify-center">
            <button
              onClick={() => {
                const it = [...items];

                it.find((i) => i.id === currentIdx + 1).read = true;

                setItems(it);
                setCurrentIdx(3);
              }}
              className=" px-8 py-3 border border-input bg-transparent shadow-sm text-black h-9 inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50"
            >
              Continue
            </button>
            <SignUpButton />
          </div>
        </Dialog.Content>
      );
    } else if (currentIdx === 3) {
      return (
        <Dialog.Content className="bg-white  px-8 py-12 min-h-[50vh] w-auto rounded-b-md rounded-r-md">
          <div className="flex items-center justify-center gap-4">
            <Dialog.Title className="whitespace-nowrap -mt-4 !text-lg">
              {items.find((i) => i.id === currentIdx).title}
            </Dialog.Title>
            <DialogClose />
          </div>
          <p className="text-lg my-3">
            Have a complex or really long document, and need to get smart about
            it really fast? Ever wished you could just ask your notes a
            question? With Doc-Chat, you kind of can. It&apos;s like having a
            chat with your documents to get summaries or clarify points. Pretty
            handy, right? Also you can share your chat with your friends!
          </p>
          <img
            src="/images/welcome/Docchat-2.gif"
            alt="docchat"
            loading="eager"
            className=" h-80 my-3 w-full"
          />
          <div className="flex gap-3 items-center justify-center">
            <button
              onClick={() => {
                const it = [...items];

                it.find((i) => i.id === currentIdx + 1).read = true;

                setItems(it);
                setCurrentIdx(4);
              }}
              className=" px-8 py-3 border border-input bg-transparent shadow-sm text-black h-9 inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50"
            >
              Continue
            </button>
            <SignUpButton />
          </div>
        </Dialog.Content>
      );
    } else if (currentIdx === 4) {
      return (
        <Dialog.Content className="bg-white overflow-y-scroll  px-8 py-12 min-h-[50vh] max-h-[80vh] w-auto rounded-b-md rounded-r-md">
          <div className="flex items-center justify-center gap-4">
            <Dialog.Title className="whitespace-nowrap -mt-4 !text-lg">
              {items.find((i) => i.id === currentIdx).title}
            </Dialog.Title>
            <DialogClose />
          </div>
          <p className="text-lg my-3">
            Ok, this one is super cool. Flashcards can be a pain to make, but
            not here. Shepherd helps you whip them up in no time. You can
            generate flashcards from a topic, or from your own document with
            varying difficulties.
          </p>
          <p className="text-lg my-3">
            What&apos;s also super cool is - You can also upload Anki flashcards
            (<em>wink</em> Med-students). We also use a pretty cool
            Spaced-repetition algorithm to prompted to study (via email) so you
            never forget. You can also share these with your friends!
          </p>
          <img
            src="/images/welcome/Generate-Flashcards.gif"
            alt="flashcards"
            loading="eager"
            className=" h-80 my-3 w-full"
          />
          <p className="text-lg my-3">
            Here is my favorite, generating a quiz. You can generate a quiz from
            a topic or file in many different formats
          </p>
          <img
            src="/images/welcome/Generate-Quizzes.gif"
            alt="quizzes"
            loading="eager"
            className=" h-80 my-3 w-full"
          />
          <div className="flex gap-3 items-center justify-center">
            <button
              onClick={() => {
                const it = [...items];

                it.find((i) => i.id === currentIdx + 1).read = true;

                setItems(it);
                setCurrentIdx(5);
              }}
              className=" px-8 py-3 border border-input bg-transparent shadow-sm text-black h-9 inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50"
            >
              Continue
            </button>
            <SignUpButton />
          </div>
        </Dialog.Content>
      );
    } else if (currentIdx === 5) {
      return (
        <Dialog.Content className="bg-white overflow-y-scroll  px-8 py-12  w-auto rounded-b-md rounded-r-md">
          <div className="flex items-center justify-center gap-4">
            <Dialog.Title className="whitespace-nowrap -mt-4 !text-lg">
              {items.find((i) => i.id === currentIdx).title}
            </Dialog.Title>
            <DialogClose />
          </div>
          <p className="text-lg my-3">
            If you hit a tough spot, our AI Tutor is here for you.
          </p>
          <p className="text-lg my-3">
            We use the latest AI- models here and we are really prioritizing
            giving you clear explanations, so you can understand those tricky
            parts without any confusion
          </p>
          <div className="flex gap-3 items-center justify-center">
            <button
              onClick={() => {
                const it = [...items];

                it.find((i) => i.id === currentIdx + 1).read = true;

                setItems(it);
                setCurrentIdx(6);
              }}
              className=" px-8 py-3 border border-input bg-transparent shadow-sm text-black h-9 inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50"
            >
              Continue
            </button>
            <SignUpButton />
          </div>
        </Dialog.Content>
      );
    } else if (currentIdx === 6) {
      return (
        <Dialog.Content className="bg-white overflow-y-scroll  px-8 py-12  w-auto rounded-b-md rounded-r-md">
          <div className="flex items-center justify-center gap-4">
            <Dialog.Title className="whitespace-nowrap -mt-4 !text-lg">
              {items.find((i) => i.id === currentIdx).title}
            </Dialog.Title>
            <DialogClose />
          </div>
          <p className="text-lg my-3">
            Ok, here is where we really shine. If you need personalized
            guidance? You can connect with human tutors from some really cool
            universities.
            <br />
            They&apos;re super knowledgeable and friendly. They're here to offer
            you additional support and insight via text or video.
            <br />
            They are super affordable because we take{' '}
            <strong>
              50% less commission than competing tutor platforms.
            </strong>{' '}
            <br />
            We are always onboarding tutors. So fi you want to share your
            knowledge? Sign up to become a tutor too!" One secret: If you’re
            accepted as a tutor, you get access to all our premium tools too
          </p>

          <div className="flex gap-3 items-center justify-center">
            <button
              onClick={() => {
                const it = [...items];

                it.find((i) => i.id === currentIdx + 1).read = true;

                setItems(it);
                setCurrentIdx(7);
              }}
              className=" px-8 py-3 border border-input bg-transparent shadow-sm text-black h-9 inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50"
            >
              Continue
            </button>
            <SignUpButton />
          </div>
        </Dialog.Content>
      );
    } else if (currentIdx === 7) {
      return (
        <Dialog.Content className="bg-white overflow-y-scroll  px-8 py-12  w-auto rounded-b-md rounded-r-md">
          <div className="flex items-center justify-center gap-4">
            <Dialog.Title className="whitespace-nowrap -mt-4 !text-lg">
              {items.find((i) => i.id === currentIdx).title}
            </Dialog.Title>
            <DialogClose />
          </div>
          <p className="text-lg my-3">
            Ok! That&apos;s the quick tour! We are really excited about what
            we’ve built, but we would be even more stoked if you join us!
          </p>
          <p className="text-lg my-3">
            Quick parting notes
            <ol>
              <li>
                We offer a 4 week free trial for our premium offer because we
                really believe you&apos;d love it. It&apos;s easy to cancel if
                you don&apos;t.
              </li>
              <li>
                If you sign up for a premium account you get to support a low
                income student who can&apos;t afford Shepherd at the moment.
              </li>
            </ol>
          </p>
          <p className="text-lg my-3">
            We have more features coming out soon! And we’d love to hear your
            thoughts and shape the way we all learn.
            <br />
            Ready to dive in?
          </p>
          <div className="flex gap-3 items-center w-full justify-center">
            <SignUpButton last />
          </div>
        </Dialog.Content>
      );
    }
  }, [currentIdx]);

  return (
    <Dialog.Root defaultOpen={true} open={open} onOpenChange={setOpen}>
      <Dialog.Trigger />
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 z-50 bg-black/40 data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0" />
        <div
          className={`fixed  overflow-scroll left-[50%] top-[50%] z-50  w-full   translate-x-[-50%] translate-y-[-50%]   duration-200 data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[state=closed]:slide-out-to-left-1/2 data-[state=closed]:slide-out-to-top-[48%] data-[state=open]:slide-in-from-left-1/2 data-[state=open]:slide-in-from-top-[48%] sm:rounded-lg ${
            currentIdx === 1 || currentIdx === 5 ? 'md:w-[50vw]' : 'md:w-[70vw]'
          }  flex justify-start`}
        >
          <div className=" px-4 py-6  rounded-l-md rounded-br-md h-80 border-none z-50  bg-gradient-to-br from-[#eee3ff] via-[#ebf2fe] to-white">
            {
              <LinedListWelcome
                items={items}
                clickHandler={(id) => {
                  const it = [...items];

                  it.find((i) => i.id === id).read = true;

                  setItems(it);
                  setCurrentIdx(id);
                }}
              />
            }
          </div>

          {render}
        </div>
      </Dialog.Portal>
    </Dialog.Root>
  );
}
