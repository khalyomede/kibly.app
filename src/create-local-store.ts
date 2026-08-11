import { createStore, reconcile, SetStoreFunction } from "solid-js/store";
import { onCleanup } from "solid-js";

const createLocalStore = <StoredDataType extends object>(
    defaultData: StoredDataType,
    storageKey: string,
    validator: (rawStoredValue: any) => StoredDataType,
): [StoredDataType, SetStoreFunction<StoredDataType>] => {
    const rawStoredValue = localStorage.getItem(storageKey);

    const initialData: StoredDataType = rawStoredValue === null
        ? defaultData
        : validator(JSON.parse(rawStoredValue));

    const [store, setStore] = createStore<StoredDataType>(initialData);

    const setLocalStorageStore: SetStoreFunction<StoredDataType> = (...forwardedArguments: unknown[]): void => {
        (setStore as (...args: unknown[]) => void)(...forwardedArguments);

        localStorage.setItem(storageKey, JSON.stringify(store));
    };

    if (rawStoredValue === null) {
        setLocalStorageStore(defaultData);
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

            setLocalStorageStore(reconcile(nextStoredData));
        };

        window.addEventListener("storage", handleExternalStorageChange);

        onCleanup((): void => {
            window.removeEventListener("storage", handleExternalStorageChange);
        });
    }

    return [store, setLocalStorageStore];
};

export default createLocalStore;
