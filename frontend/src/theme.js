// src/theme.js
import { createTheme } from '@mui/material/styles';

const theme = createTheme({
  palette: {
    mode: 'dark',
  },
  components: {
    MuiCssBaseline: {
      styleOverrides: {
        '@global': {
          '@keyframes blink': {
            '0%': { opacity: 1 },
            '50%': { opacity: 0 },
            '100%': { opacity: 1 },
          },
        },
      },
    },
  },
  typography: {
    h5: {
      paddingLeft: '12px',
      marginTop: '4px',
    },
    body1: {
      paddingLeft: '12px',
      marginTop: '4px',
    },
  },
  custom: {
    radarChartContainer: {
      marginTop: 20,
    },
    sliderContainer: {
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
    },
    sliderItem: {
      width: '45%',
    },
    imageContainer: {
      height: '160px',
      overflow: 'hidden',
    },
    imageStyle: {
      objectFit: 'contain',
      height: '100%',
      width: '100%',
    },
    cardContentCenter: {
      textAlign: 'center',
    },
    appBarPadding: {
      my: 4,
    },
    paddingLeft: {
      paddingLeft: '12px',
    },
  },
});

export default theme;
