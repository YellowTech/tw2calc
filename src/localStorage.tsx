import React from 'react'

const LocalStorage = {
    stringHook: useStringWithLocalStorage,
    numberHook: useNumberWithLocalStorage
}

// functions to create hooks in stored in the localstorage with the specified key
function useStringWithLocalStorage (localStorageKey: string, startValue: string) {
    const [value, setValue] = React.useState(
        localStorage.getItem(localStorageKey) || startValue
    );

    React.useEffect(() => {
        localStorage.setItem(localStorageKey, value);
    }, [value]);

    return [value, setValue] as [string, React.Dispatch<React.SetStateAction<string>>];
};

function useNumberWithLocalStorage (localStorageKey: string) {
    const [value, setValue] = React.useState(
        Number(localStorage.getItem(localStorageKey) || 0)
    );

    React.useEffect(() => {
        localStorage.setItem(localStorageKey, String(value));
    }, [value]);

    return [value, setValue] as [number, React.Dispatch<React.SetStateAction<number>>];
};

export default LocalStorage