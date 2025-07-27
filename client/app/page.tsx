import React from "react";
import Navbar from "./components/navbar";
import Footer from "./components/footer";
import LandingCard from "./components/landing_card"

export default function Home() {
  return (
    <div>
      <div data-source="https://www.pexels.com/photo/photo-of-person-running-on-dirt-road-1821694/" className="bg-[url('/landing.jpg')] h-[1100px] w-full bg-cover bg-center brightness-90">
        <Navbar white_text={true}/>
        <div className="h-[60vh] flex flex-col md:flex-row md:justify-around items-center justify-center">
          <h1 className="font-bold text-8xl text-forza-100">Habit,<br></br>Effort,<br></br>Reward.</h1>
          <h1 className="font-bold text-8xl text-forza-100">It&apos;s Forza.</h1>
        </div>
      </div>
      <div className="w-full bg-cover bg-center bg-forza-100">
        <h1 className="py-20 font-bold text-5xl text-forza-500 justify-center text-center flex relative">Your Journey Begins With You</h1>
        <div className="flex flex-col md:flex-row md:justify-around items-center py-10">
          <LandingCard data-source="https://www.pexels.com/photo/man-running-1465893/" image="/goals.jpg" alt="Goal Image" title="Set Goals" subtitle="Stay accountable - improve your time and distance benchmarks"></LandingCard>
          <LandingCard data-source="https://www.pexels.com/photo/person-foot-on-bench-7432/" image="/shoe.jpg" alt="Analysis Image" title="Analyse Data" subtitle="Unlock your potential by analysing your tracks, pace and much more"></LandingCard>
        </div>
      </div>
      <div data-source="https://www.pexels.com/photo/person-jogging-3601094/" className="bg-[url('/together.jpg')] h-[600px] w-full bg-cover bg-center brightness-90">
        <h1 className="h-[60vh] flex font-bold text-8xl text-forza-100 justify-center py-60">Together, we go further.</h1>
      </div>
      <div className="w-full bg-cover bg-center bg-forza-100">
        <h1 className="py-20 font-bold text-5xl text-forza-500 justify-center text-center flex relative">Providing Sense of Belonging and Community</h1>
        <div className="flex flex-col md:flex-row md:justify-around items-center py-10">
          <LandingCard data-source="https://www.pexels.com/photo/a-man-and-a-woman-running-at-the-park-8497644/" image="/connect.jpg" alt="People Image" title="Connect and Thrive" subtitle="Connect with friends, share your progress, and celebrate every step of eachother's journey"></LandingCard>
          <LandingCard data-source="https://www.pexels.com/photo/three-people-running-in-a-road-2526883/" image="/conquer.jpeg" alt="Competition Image" title="Compete and Conquer" subtitle="Dive into the thrill - start or join competitions and test your limits together"></LandingCard>
          <LandingCard data-source="https://www.pexels.com/photo/back-view-of-a-people-jugging-together-5319373/" image="/community.jpg" alt="Community Image" title="Club and Community" subtitle="Join clubs, embrace sportsmanship, and discover the true sense of community"></LandingCard>
        </div>
      </div>
      <Footer />
    </div>
  )
}
