import Hero from "./Hero";
import Journey from "./Journey";
import Reviews from "./Reviews";

export default function LandingPage() {

    //All components of the landing page
    return (
        <div style={{display: 'grid'}}>
            <Hero/>
            <Journey/>
            <Reviews/>
        </div>
    );
}