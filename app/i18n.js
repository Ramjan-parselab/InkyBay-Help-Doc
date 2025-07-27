export default {
	// This is the list of languages your application supports
	supportedLngs: ["af", "am", "ar", "az", "be", "bg", "bn", "bs", "ca", "cs", "cy", "da", "de",
		"el", "en", "eo", "es", "et", "eu", "fa", "fi", "fr", "ga", "gl", "gu", "he",
		"hi", "hr", "ht", "hu", "hy", "id", "is", "it", "ja", "jv", "ka", "kk", "km",
		"kn", "ko", "ku", "ky", "la", "lb", "lo", "lt", "lv", "mg", "mi", "mk", "ml",
		"mn", "mr", "ms", "mt", "my", "ne", "nl", "no", "ny", "pa", "pl", "ps", "pt",
		"ro", "ru", "rw", "sd", "si", "sk", "sl", "sm", "sn", "so", "sq", "sr", "st",
		"su", "sv", "sw", "ta", "te", "tg", "th", "tk", "tl", "tr", "tt", "ug", "uk",
		"ur", "uz", "vi", "xh", "yi", "yo", "zh", "zh-CN", "zh-TW", "zu", "pt-BR"
	],
	// This is the language you want to use in case
	// if the user language is not in the supportedLngs
	fallbackLng: "en",
	// The default namespace of i18next is "translation", but you can customize it here
	defaultNS: "common",
    // Disabling suspense is recommended
    react: { useSuspense: false },
};