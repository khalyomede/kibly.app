import { A } from "@solidjs/router";
import { Component } from "solid-js";
import Logo from "../components/Logo";

const Home: Component = () => {
    return <div class="min-h-screen bg-orange-50 flex items-center justify-center flex-col gap-4 md:gap-8">
        <Logo class="w-70 lg:w-80 h-auto" />
        <div class="text-slate-400 md:text-3xl lg:text-2xl">A cozy word guessing game</div>
        <A href="/play">
            <button class="bg-green-600 text-green-50 border border-2 border-green-800 text-lg md:text-3xl lg:text-xl rounded-xl lg:rounded-3xl px-10 py-1 md:px-12 md:py-3 lg:py-2 hover:cursor-pointer">Play now</button>
        </A>
    </div>
};

export default Home;
