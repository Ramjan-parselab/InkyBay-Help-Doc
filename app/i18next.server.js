import Backend from "i18next-fetch-backend";
import { RemixI18Next } from "remix-i18next/server";
import i18n from "./i18n"; // your i18n configuration file

let i18next = new RemixI18Next({
	detection: { supportedLanguages: i18n.supportedLngs, fallbackLanguage: i18n.fallbackLng },
	// The config here will be used for getFixedT
	i18next: {
		...i18n,
		backend: { 
			loadPath: `/api/locales/{{lng}}/{{ns}}`,
			requestOptions: {
				cache: 'no-store',
				headers: {
				'Cache-Control': 'no-cache, no-store, must-revalidate',
				'Pragma': 'no-cache',
				'Expires': '0'
				}
			},
			reloadInterval: false 
		},
	},
	// This backend will be used by getFixedT
	backend: Backend,
});


export default i18next;	