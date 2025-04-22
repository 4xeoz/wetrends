import ContactForm from "../_component/home/contact-form";
import Hero from "../_component/home/hero";
import { ServiceCategories } from "../_component/home/service-categories";
import MeetTeam from "../_component/home/meet-team";
import Story from "../_component/home/story"; // Import the new Story component
import ContactSection from "../_component/home/contact-section";

export default function Home() {
  return (
    <div className="relative flex flex-col bg-white">

      <div className="bg-wetrends-900">
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
      

      <div className="bg-wetrends z-10 relative">
        <ContactSection />
       
      </div>
      
    </div>
  );
}
