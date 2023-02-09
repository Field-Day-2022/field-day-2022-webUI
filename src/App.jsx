import TopNav from './components/TopNav'
import LoginPage from "./pages/LoginPage";
import Sidebar from "./components/Sidebar";
import HomePage from "./pages/HomePage";

import React from "react";
import { Authenticator } from './utils/authenticator'

function App() {

  const auth = new Authenticator();

  return (
    <div className="flex flex-col w-full min-h-screen bg-neutral-100 text-neutral-800 select-none">
      <TopNav
        title='Field Day'
        auth={auth}
      />
      <div className="flex flex-grow" >

        {(auth.validateUser()) ?
          [<Sidebar />,
          <HomePage />]
          :
          <LoginPage
            auth={auth}
          />}

      </div>

    </div>
  )
}

export default App
