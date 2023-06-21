import React, { FC } from "react"

interface WelcomePageProps {
  greeting: string;
  date: string;
  time: string;
}

const WelcomePage: FC<WelcomePageProps> = ({greeting, date, time}) => {
  return (
    <section className="px-6 my-6">
      <h2 className="sm:text-3xl text-2xl">{greeting}</h2>
      <div className="flex items-center space-x-2 text-gray-400">
        <img src="/svgs/cloud.svg" alt="" className="h-5 w-5" />
        <svg viewBox="0 0 2 2" className="h-2 w-2 fill-current">
          <circle cx={1} cy={1} r={1} />
        </svg>
        <p>{date}</p>
        <svg viewBox="0 0 2 2" className="h-2 w-2 text-gray-400 fill-current">
          <circle cx={1} cy={1} r={1} />
        </svg>
        <p>{time}</p>
      </div>
    </section>
  )
}

export default WelcomePage