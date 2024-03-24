/** @type {import('tailwindcss').Config} */
export default {
  content: ['./src/**/*.{html,js,ts,jsx,tsx}'],
  theme: {
    //TODO: 具体等ui规范出来再补充
    extend: {
      //文本色
      textColor: {
        primary: '#3490dc',
        secondary: '#ffed4a',
        danger: '#e3342f',
      },
      //文本大小
      fontSize: {
        primary: '16px',
        input: '14px',
        title: '20px',
        dialogTitle: '18px',
      },
      //。。。
    },
  },
  plugins: [],
}
