/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    colors: {
      'transparent': 'transparent',
      'black': '#17181c',
      'lightblack': '#1d1e22',
      'gray': '#797e91',
      'blue': '#5168f4',
      'darkblue': '#5168f450',
      'red': '#f23751',
      'lightred': '#f45c71',
      'darkred': '#f2375150',
      'yellow': '#f4dd51',
      'darkyellow': '#f4dd5150',
      'green': '#72e65f',
    },
    extend: {},
  },
  plugins: [],
}

