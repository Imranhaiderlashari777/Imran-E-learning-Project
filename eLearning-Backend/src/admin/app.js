export default {
    config: {
        head: {
            favicon: "/favicon1.ico",
          },
      theme: {
        light: {
          colors: {
            primary100: '#E0F7F9',
            primary200: '#B3ECF2',
            primary500: '#029381', // your brand color
            primary600: '#027B6C',
            primary700: '#02695B',
          },
        },
        dark: {
          colors: {
            primary100: '#3384F5',
            primary200: '#3384F5',
            primary500: '#fff',
            primary600: '#fff',
            primary700: '#fff',
              // Override button colors
              buttonPrimary500: '#212134', // background white
              buttonPrimary600: '#212134',
              buttonPrimary700: '#ffffff',
              buttonPrimaryText: '#029381', // text blue

          },
        },
      },
      locales: ['en'],
      notifications: { releases: false },
      auth: {
        logo: '/uploads/your_logo.svg', // optional
      },
      menu: {
        logo: '/uploads/your_logo.svg', // optional
      },
      
    },
  };
  