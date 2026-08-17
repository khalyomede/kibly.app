import { Component } from "solid-js";

interface ToggleSwitchProperties {
    label: string;
    isChecked: boolean;
    onToggle: () => void;
};

const ToggleSwitch: Component<ToggleSwitchProperties> = (properties) => {
    return (
        <div class="flex items-center justify-between">
            <span class="text-sm text-slate-600 tracking-wide">{properties.label}</span>
            <button
                type="button"
                role="switch"
                aria-checked={properties.isChecked}
                aria-label={properties.label}
                onClick={properties.onToggle}
                classList={{
                    "relative": true,
                    "w-11": true,
                    "h-6": true,
                    "rounded-full": true,
                    "border-2": true,
                    "transition-colors": true,
                    "hover:cursor-pointer": true,
                    "border-green-800": properties.isChecked,
                    "bg-green-600": properties.isChecked,
                    "border-slate-300": !properties.isChecked,
                    "bg-white/70": !properties.isChecked,
                }}
            >
                <span
                    classList={{
                        "absolute": true,
                        "top-[2px]": true,
                        "left-[2px]": true,
                        "w-4": true,
                        "h-4": true,
                        "rounded-full": true,
                        "bg-white": true,
                        "shadow-sm": true,
                        "transition-transform": true,
                        "translate-x-5": properties.isChecked,
                        "translate-x-0": !properties.isChecked,
                    }}
                />
            </button>
        </div>
    );
};

export default ToggleSwitch;
