import Hero from "./Hero";
import Journey from "./Journey";
import Reviews from "./Reviews";
import {useExternalScripts} from "../../util/hooks";

export default function LandingPage() {

    useExternalScripts("https://cdn.cai.tools.sap/webchat/webchat.js",
        "1864cb48-c651-4fea-91ab-d5de81f561ee", "b1cc896712145b707d9b5e3ac97eafcb", "cai-webchat")

    //All components of the landing page
    return (
        <div style={{display: 'grid'}}>
            <Hero/>
            <Journey/>
            <Reviews/>
        </div>
    );
}