import Hero from "../_component/home/lg_screen /hero";
import { ServiceCategories } from "../_component/home/lg_screen /service-categories";
import MeetTeam from "../_component/home/lg_screen /meet-team";
import Story from "../_component/home/lg_screen /story";
import ContactSection from "../_component/home/lg_screen /contact-section";
import ComparisonSection from "../_component/home/lg_screen /comparison-section";
import { FaqSection } from "../_component/home/lg_screen /faq-section";
export default function Home() {
  return (
    <div className="relative flex flex-col bg-white">

      <div className="bg-wetrends-900 ">
        <Story />
      </div>

      <div className="bg-wetrends">
        <Hero />
      </div>

      <div>
        <MeetTeam />
      </div>

      <div className="">
        <ServiceCategories />
      </div>

      <div>
        <ComparisonSection />
      </div>

      <div>
        <FaqSection />
      </div>
      

      <div className="bg-wetrends z-10 relative">
        <ContactSection />
       
      </div>


      
    </div>
  );
}
