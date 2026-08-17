const vibrate = (durationInMillisecondsOrPattern: number | Array<number> = 15): void => {
    if (typeof navigator === "undefined" || typeof navigator.vibrate !== "function") {
        return;
    }

    navigator.vibrate(durationInMillisecondsOrPattern);
};

export default vibrate;
