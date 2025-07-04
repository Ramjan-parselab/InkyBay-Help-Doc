export default {
  content: ["./app/**/{**,.client,.server}/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      fontFamily: {
        sans: [
          "Inter",
          "ui-sans-serif",
          "system-ui",
          "sans-serif",
          "Apple Color Emoji",
          "Segoe UI Emoji",
          "Segoe UI Symbol",
          "Noto Color Emoji",
        ],
        poppins: ["Poppins", "sans-serif"], 
      },

      keyframes: {
        ripple: {
          '0%': {transform: 'scale(0.9)', opacity: 0.7, border: '2px solid #fff',},
          '100%': {transform: 'scale(1.8)', opacity: 0.1, border: '2px solid #fff',},
        },
        fadeIn: {
          '0%': { opacity: 0.2 },
          '100%': { opacity: 1 },
        },
        fadeOut: {
          '0%': { opacity: 1 },
          '100%': { opacity: 0.2 },
        },

        slideIn: {
          '0%': { transform: 'translateX(-330px)' },
          '100%': { transform: 'translateX(0)' },
        },
        slideOut: {
          '0%': { transform: 'translateX(0)' },
          '100%': { transform: 'translateX(-330px)' },
        },

         bigToSmall: {
          '0%': { maxHeight: '1000px', opacity: '1' },
          '100%': { maxHeight: '0px', opacity: '0' },
        },
        smallToBig: {
          '0%': { maxHeight: '0px', opacity: '0' },
          '100%': { maxHeight: '1000px', opacity: '1' },
        },
        dropdown: {
          '0%': { opacity: '0.2', transform: 'translateY(-20px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        dropUp: {
          '0%': { opacity: '1', transform: 'translateY(0)' },
          '100%': { opacity: '0.2', transform: 'translateY(-20px)' },
        },
      },
      animation: {
        ripple: 'ripple 1.5s ease-out infinite',
        fadeIn: 'fadeIn 0.5s ease-in-out',
        fadeOut: 'fadeOut 0.5s ease-in-out',

        slideIn: 'slideIn 0.3s ease-out forwards',
        slideOut: 'slideOut 0.3s ease-in forwards',

        bigToSmall: 'bigToSmall 0.6s ease-in-out forwards',
        smallToBig: 'smallToBig 0.3s ease-in-out forwards',
        dropdown: 'dropdown 0.5s ease-out forwards',
        dropUp: 'dropUp 0.5s ease-in forwards',
      },
    },
  },
  plugins: [],
};
