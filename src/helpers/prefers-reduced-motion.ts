const prefersReducedMotion = (): boolean => window.matchMedia("(prefers-reduced-motion: reduce)").matches;

export default prefersReducedMotion;
