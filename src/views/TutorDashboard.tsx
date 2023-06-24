import React from "react";
import { Layout, Proceed, GridList, RecentTransactions, WelcomePage } from "../components";

export default function Dashboard() {
  return (
    <Layout className="px-4">
      <WelcomePage 
        greeting="Hi Leslie, Good Evening"
        date="Tuesday, July 21"
        time="13:00"
      />
      <Proceed />
      <GridList />
      <RecentTransactions />
    </Layout>
  )
}