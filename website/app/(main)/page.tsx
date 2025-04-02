import ContactForm from "../_component/home/contact-form";
import Hero from "../_component/home/hero";
import HowItWorks from "../_component/home/how-it-works";
import Services from "../_component/home/services";
import WhyChooseUs from "../_component/home/why-choose-us";


export default function Home() {
  


  return (
    <div className="relative flex flex-col">
      <Hero />
      <Services />
      <HowItWorks />
      <WhyChooseUs />
      <ContactForm />
      

    </div>
  )
}
