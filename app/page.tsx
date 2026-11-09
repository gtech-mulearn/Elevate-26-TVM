import Navbar from './components/Navbar';
import Hero from './components/Hero';
import Marquee from './components/Marquee';
import About from './components/About';
import Themes from './components/Themes';
import Speakers from './components/Speakers';
import Agenda from './components/Agenda';
import Tickets from './components/Tickets';
import Partners from './components/Partners';
import Sponsors from './components/Sponsors';
import Venue from './components/Venue';
import FAQ from './components/FAQ';
import CoreTeam from './components/CoreTeam';
import Footer from './components/Footer';

export default function Home() {
  return (
    <>
      <Navbar />
      <main>
        <Hero />
        <Partners />
        <About />
        <Marquee />
        <Themes />
        <Speakers />
        <Agenda />
        <Tickets />
        <Sponsors />
        <Venue />
        <FAQ />
        <CoreTeam />
      </main>
      <Footer />
    </>
  );
}
