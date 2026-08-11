import { A } from "@solidjs/router";
import { Component } from "solid-js";
import logo from "../images/kibby-logo.png";
import logoMobile from "../images/kibby-logo-mobile.png";
import logoTablet from "../images/kibby-logo-tablet.png";
import logoLaptop from "../images/kibby-logo-laptop.png";
import logoDesktop from "../images/kibby-logo-desktop.png";
import logoWebp from "../images/kibby-logo.webp";
import logoMobileWebp from "../images/kibby-logo-mobile.webp";
import logoTabletWebp from "../images/kibby-logo-tablet.webp";
import logoLaptopWebp from "../images/kibby-logo-laptop.webp";
import logoDesktopWebp from "../images/kibby-logo-desktop.webp";

const Home: Component = () => {
    return <div class="min-h-screen bg-orange-50 flex items-center justify-center flex-col gap-4">
        <picture>
            <source type="image/png" media="(min-width: 1441px)" srcset={logoWebp} />
            <source type="image/png" media="(min-width: 1025px)" srcset={logoLaptopWebp} />
            <source type="image/png" media="(min-width: 769px)" srcset={logoTabletWebp} />
            <source type="image/png" media="(min-width: 391px)" srcset={logoDesktopWebp} />
            <source type="image/png" media="(min-width: 1px)" srcset={logoMobileWebp} />

            <source type="image/png" media="(min-width: 1441px)" srcset={logo} />
            <source type="image/png" media="(min-width: 1025px)" srcset={logoLaptop} />
            <source type="image/png" media="(min-width: 769px)" srcset={logoTablet} />
            <source type="image/png" media="(min-width: 391px)" srcset={logoDesktop} />

            <img src={logoMobile} alt="Kibby Logo" width="200" height="auto" />
        </picture>
        <div class="text-slate-400">A cozy word guessing game</div>
        <A href="/play">
            <button class="bg-green-600 text-green-50 border border-2 border-green-800 text-lg rounded-xl px-10 py-1">Play now</button>
        </A>
    </div>
};

export default Home;
