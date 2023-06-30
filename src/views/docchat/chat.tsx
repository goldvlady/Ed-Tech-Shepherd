import { Text } from "@chakra-ui/react";
import { useState, useEffect } from "react";

const Chat = () => {
  const [chatbotSpace, setChatbotSpace] = useState(647);
  const [query, setQuery] = useState("");
  const prompts = [
    "Explain this document to me like I'm five",
    "Who wrote this book?",
    "How many chapters are in this book?",
  ];

  useEffect(() => {
    window.addEventListener("resize", () => {
      const chatbotWidth =
        document.getElementById("chatbot")?.clientWidth || 647;
      // ts-ignore
      setChatbotSpace(chatbotWidth + 24);
    });
    return window.removeEventListener("resize", () => {
      const chatbotWidth =
        document.getElementById("chatbot")?.clientWidth || 647;
      // ts-ignore
      setChatbotSpace(chatbotWidth + 24);
    });
  }, []);

  const handleQuery = (e) => {
    const query = e.target.value;
    setQuery(query);
    console.log(query);
  };

  const handleSubmitQuery = (e) => {
    e.preventDefault();
    console.log("Submitted", query);
  };
  return (
    <form className="lg:col-span-6 flex-auto h-full" id="chatbot">
      <div className="flex flex-col flex-auto h-full">
        <div className="flex overflow-scroll flex-col flex-auto flex-shrink-0 bg-white h-full">
          <div className="flex flex-col h-full overflow-x-auto mb-4">
            <div className="flex flex-col h-full">
              <div className="grid grid-cols-12 gap-y-2">
                <div className="grid grid-cols-12 grid-rows-4 col-start-1 col-end-13 m-6 p-3 h-52 rounded-lg bg-gray-100 text-slate-700 font-light content-around">
                  <div className="flex col-start-1 col-end-13 align-middle pb-12 row-span-2">
                    <div className="h-16 w-16 flex-shrink-0 bg-orange-300 p-2 flex justify-center items-center rounded-full">
                      <img
                        src="/svgs/robot-face.svg"
                        className="h-9 w-9 text-gray-400"
                        alt=""
                      />
                    </div>
                    <div className="pl-5 pt-3">
                      <Text className="font-semibold">Plato.</Text>
                      <Text>Philosopher, thinker, study companion.</Text>
                    </div>
                  </div>
                  <Text className="py-2 col-start-1 col-end-13 text-sm">
                    Welcome! I'm here to help you make the most of your time and
                    your notes. Ask me questions, and I'll find the answers that
                    match, given the information you've supplied. Let's get
                    learning!
                  </Text>
                </div>

                <div className="flex flex-col col-span-full px-3 py-1 h-24 rounded-lg justify-between ml-7 text-sm">
                  <Text className="">What do you need?</Text>
                  <div className="flex row-auto space-x-3">
                    <div className="flex flex-row space-x-2 border-gray-300 cursor-pointer hover:bg-blue-100 border-1  rounded-full py-2 px-3">
                      <img
                        src="/svgs/summary.svg"
                        className="h3 w3 text-gray-400"
                        alt=""
                      />
                      <p>Summary</p>
                    </div>
                    <div className="flex flex-row space-x-2 border-gray-300 cursor-pointer hover:bg-blue-100 border-1 rounded-full py-2 px-3">
                      <img
                        src="/svgs/flashcards.svg"
                        className="h3 w3 text-gray-400"
                        alt=""
                      />
                      <p>Flashcards</p>
                    </div>
                    <div className="flex flex-row space-x-2 border-gray-300 cursor-pointer hover:bg-blue-100 border-1 rounded-full py-2 px-3">
                      <img
                        src="/svgs/quiz.svg"
                        className="h3 w3 text-gray-400"
                        alt=""
                      />
                      <Text>Quiz</Text>
                    </div>
                  </div>
                </div>

                <div className="flex flex-col col-span-full px-3 py-1 h-36 rounded-lg justify-between ml-7 text-sm">
                  <Text className="my-4">Try asking about:</Text>
                  <div className="flex flex-wrap">
                    {prompts.map((prompt, key) => {
                      return (
                        <div
                          key={key}
                          className="border-gray-300 border-1 rounded-full py-2 px-3 mb-2 mx-1 hover:bg-gray-200 cursor-pointer"
                        >
                          <Text>{prompt}</Text>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div
        className={`w-[${chatbotSpace}px] shadow-sm fixed z-50 border-t bg-gray-50 bottom-0 right-0 flex flex-row items-center h-16 px-4`}
      >
        <div className="flex-grow">
          <div className="relative w-full">
            <input
              type="text"
              placeholder="Tell Shepherd what to do next"
              value={query}
              onChange={handleQuery}
              className="flex w-full bg-white border-x-black rounded-full focus:outline-none pl-4 h-10 placeholder:text-xs"
            />
            <button
              className="absolute flex items-center h-full w-11 right-0 top-0 text-gray-400 hover:text-gray-600 pl-2"
              onClick={handleSubmitQuery}
            >
              <img alt="" src="/svgs/send.svg" className="w-8 h-8" />
            </button>
          </div>
        </div>
        <div className="ml-4">
          <button className="flex items-center justify-center bg-gray-200 hover:bg-gray-300 rounded-md text-white px-4 py-2 flex-shrink-0">
            <img alt="" src="/svgs/anti-clock.svg" className="w-5 h-5" />
          </button>
        </div>
      </div>
    </form>
  );
};

export default Chat;
