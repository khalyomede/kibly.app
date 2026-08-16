const vibrate = (durationInMilliseconds: number = 15): void => {
    if (typeof navigator === "undefined" || typeof navigator.vibrate !== "function") {
        return;
    }

    navigator.vibrate(durationInMilliseconds);
};

export default vibrate;
