import Hero from "./Hero";
import Journey from "./Journey";
import Reviews from "./Reviews";

export default function LandingPage() {

    return (
        <div style={{display: 'grid'}}>
            <Hero />
            <Journey />
            <Reviews />
        </div>
    );
}