/* @refresh reload */
import { render } from 'solid-js/web';
import { Route, Router } from "@solidjs/router";
import Home from "./pages/Home";
import Play from "./pages/Play";
import 'solid-devtools';
import './index.css';

const root = document.getElementById('root');

if (import.meta.env.DEV && !(root instanceof HTMLElement)) {
    throw new Error(
        'Root element not found. Did you forget to add it to your index.html? Or maybe the id attribute got misspelled?',
    );
}

render(
    () => (
        <Router>
            <Route path="/" component={Home} />
            <Route path="/play" component={Play} />
        </Router>
    ),
    root!
);
