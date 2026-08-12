/* @refresh reload */
import { render } from 'solid-js/web';
import { init as initSentry } from "@sentry/solid";
import { solidRouterBrowserTracingIntegration, withSentryRouterRouting } from "@sentry/solid/solidrouter";
import { Route, Router } from "@solidjs/router";
import Home from "./pages/Home";
import Play from "./pages/Play";
import 'solid-devtools';
import './index.css';

initSentry({
    dsn: "https://253ff891c423bb4bffcc46cc77a14e25@o396055.ingest.us.sentry.io/4510897559306240",
    tracesSampleRate: 0.1, //  Capture 10% of the transactions
    integrations: [solidRouterBrowserTracingIntegration()],
});

const root = document.getElementById('root');

if (import.meta.env.DEV && !(root instanceof HTMLElement)) {
    throw new Error(
        'Root element not found. Did you forget to add it to your index.html? Or maybe the id attribute got misspelled?',
    );
}

const SentryRouter = withSentryRouterRouting(Router);

render(
    () => (
        <SentryRouter>
            <Route path="/" component={Home} />
            <Route path="/play" component={Play} />
            <Route path="*404" component={Home} />
        </SentryRouter>
    ),
    root!
);
