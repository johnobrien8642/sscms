import React, { useContext, createContext, Dispatch } from "react";
import { SettingsType } from "@db/models/Settings";

export type SiteSettings = {
    settings: SettingsType | null;
};

export const SiteSettingsContext = createContext<SiteSettings>({
    settings: null
});

export function SiteSettingsProvider({ 
		settings,
		children 
	}: any) {
		return (
			<SiteSettingsContext.Provider 
				value={{ 
                    settings
				}}
			>
				{children}
			</SiteSettingsContext.Provider>
		);
}

export function useSiteSettings() {
	return useContext(SiteSettingsContext);
}