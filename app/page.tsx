import Navbar from './components/Navbar';
import Hero from './components/Hero';
import Marquee from './components/Marquee';
import About from './components/About';
import Themes from './components/Themes';
import Speakers from './components/Speakers';
import Agenda from './components/Agenda';
import Tickets from './components/Tickets';
import Partners from './components/Partners';
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
        <Marquee />
        <About />
        <Themes />
        <Speakers />
        <Agenda />
        <Tickets />
        <Partners />
        <Venue />
        <FAQ />
        <CoreTeam />
      </main>
      <Footer />
    </>
  );
}
