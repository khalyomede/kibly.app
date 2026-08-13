/* @refresh reload */
import { render } from 'solid-js/web';
import { init as initSentry, withSentryErrorBoundary } from "@sentry/solid";
import { solidRouterBrowserTracingIntegration, withSentryRouterRouting } from "@sentry/solid/solidrouter";
import { Route, Router } from "@solidjs/router";
import Home from "./pages/Home";
import Play from "./pages/Play";
import PlayError from "./pages/PlayError";
import 'solid-devtools';
import './index.css';
import { ErrorBoundary } from 'solid-js';

initSentry({
    dsn: "https://3e9d25a2fa7bfc44e48ea522be92af1e@o396055.ingest.us.sentry.io/4511892369375232",
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
const SentryErrorBoundary = withSentryErrorBoundary(ErrorBoundary);

render(
    () => (
        <SentryErrorBoundary fallback={PlayError}>
            <SentryRouter>
                <Route path="/" component={Home} />
                <Route path="/play" component={Play} />
                <Route path="*404" component={Home} />
            </SentryRouter>
        </SentryErrorBoundary>
    ),
    root!
);
