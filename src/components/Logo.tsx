import { Component } from "solid-js";
import logo from "../images/kibly-logo.png";
import logoMobile from "../images/kibly-logo-mobile.png";
import logoTablet from "../images/kibly-logo-tablet.png";
import logoLaptop from "../images/kibly-logo-laptop.png";
import logoDesktop from "../images/kibly-logo-desktop.png";
import logoWebp from "../images/kibly-logo.webp";
import logoMobileWebp from "../images/kibly-logo-mobile.webp";
import logoTabletWebp from "../images/kibly-logo-tablet.webp";
import logoLaptopWebp from "../images/kibly-logo-laptop.webp";
import logoDesktopWebp from "../images/kibly-logo-desktop.webp";
import LogoProperties from "./LogoProperties";

const Logo: Component<LogoProperties> = (properties) => {
    return <picture>
        <source type="image/png" media="(min-width: 1441px)" srcset={logoWebp} />
        <source type="image/png" media="(min-width: 1025px)" srcset={logoLaptopWebp} />
        <source type="image/png" media="(min-width: 769px)" srcset={logoTabletWebp} />
        <source type="image/png" media="(min-width: 391px)" srcset={logoDesktopWebp} />
        <source type="image/png" media="(min-width: 1px)" srcset={logoMobileWebp} />

        <source type="image/png" media="(min-width: 1441px)" srcset={logo} />
        <source type="image/png" media="(min-width: 1025px)" srcset={logoLaptop} />
        <source type="image/png" media="(min-width: 769px)" srcset={logoTablet} />
        <source type="image/png" media="(min-width: 391px)" srcset={logoDesktop} />

        <img src={logoMobile} alt="Kibly Logo" class={properties.class} fetchpriority="high" style="view-transition-name: logo;" />
    </picture>;
};

export default Logo;
