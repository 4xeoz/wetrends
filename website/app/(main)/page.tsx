import ContactForm from "../_component/home/contact-form";
import Hero from "../_component/home/hero";
import { ServiceCategories } from "../_component/home/service-categories";



export default function Home() {
  


  return (
    <div className="relative flex flex-col bg-wetrends">
      <div className="m-5 2xl:m-20 z-0">
      <Hero />
      </div>
      <div className="bg-white">
        <ServiceCategories/>

      </div>

      <div className="z-10">
        <ContactForm />
      </div>
     
      

    </div>
  )
}
