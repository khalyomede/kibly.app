import { createSignal, onCleanup, Accessor, Setter } from "solid-js";

const createLocalSignal = <StoredDataType,>(
    defaultData: StoredDataType,
    storageKey: string,
    validator: (rawStoredValue: any) => StoredDataType,
): [Accessor<StoredDataType>, Setter<StoredDataType>] => {
    const rawStoredValue = localStorage.getItem(storageKey);

    const initialData: StoredDataType = rawStoredValue === null
        ? defaultData
        : validator(JSON.parse(rawStoredValue));

    const [readStoredValue, writeStoredValue] = createSignal<StoredDataType>(initialData);

    const writeToLocalStorage = (valueOrUpdater: unknown): StoredDataType => {
        const nextValue = (writeStoredValue as (input: unknown) => StoredDataType)(valueOrUpdater);

        localStorage.setItem(storageKey, JSON.stringify(nextValue));

        return nextValue;
    };

    const setLocalStorageSignal = writeToLocalStorage as Setter<StoredDataType>;

    if (rawStoredValue === null) {
        writeToLocalStorage(defaultData);
    }

    if (typeof window !== "undefined") {
        const handleExternalStorageChange = (storageChangeEvent: StorageEvent): void => {
            const changeTargetsOtherKey = storageChangeEvent.storageArea !== localStorage
                || (storageChangeEvent.key !== storageKey && storageChangeEvent.key !== null);

            if (changeTargetsOtherKey) {
                return;
            }

            const nextStoredData: StoredDataType = storageChangeEvent.newValue === null
                ? defaultData
                : validator(storageChangeEvent.newValue);

            writeToLocalStorage(nextStoredData);
        };

        window.addEventListener("storage", handleExternalStorageChange);

        onCleanup((): void => {
            window.removeEventListener("storage", handleExternalStorageChange);
        });
    }

    return [readStoredValue, setLocalStorageSignal];
};

export default createLocalSignal;
