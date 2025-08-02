import { StrictMode, useState, useEffect } from 'react';
import { createRoot } from 'react-dom/client';
import { 
  ChakraProvider, 
  extendTheme, 
  Box, 
  Spinner, 
  Center,
  Portal
} from '@chakra-ui/react';
import { keyframes } from '@emotion/react';
import App from './App.tsx';

// Define fade animation
const fadeIn = keyframes`
  from { opacity: 0; }
  to { opacity: 1; }
`;

const theme = extendTheme({
  styles: {
    global: {
      'html, body': {
        backgroundColor: '#171717',
        color: 'gray.100',
        margin: 0,
        padding: 0,
        minHeight: '100vh',
      },
    },
  },
  colors: {
    brand: {
      50: '#E6F7F0',
      100: '#BCE8D6',
      200: '#8FD9BC',
      300: '#61CAA2',
      400: '#34BB88',
      500: '#00A870', // Primary brand green
      600: '#008A5C',
      700: '#006C48',
      800: '#004E34',
      900: '#003020',
    },
    gray: {
      50: '#F7F7F7',
      100: '#E6E6E6',
      200: '#D4D4D4',
      300: '#C1C1C1',
      400: '#AFAFAF',
      500: '#9C9C9C',
      600: '#747474',
      700: '#4D4D4D',
      800: '#262626',
      900: '#171717',
    }
  },
  components: {
    Button: {
      defaultProps: {
        colorScheme: 'brand',
      },
      variants: {
        solid: {
          bg: 'brand.500',
          color: 'white',
          _hover: {
            bg: 'brand.600',
            transform: 'translateY(-2px)',
            shadow: 'lg',
          }
        }
      }
    },
    Card: {
      baseStyle: {
        container: {
          bg: 'white',
          borderRadius: 'xl',
          overflow: 'hidden',
        },
      },
    },
    Heading: {
      baseStyle: {
        color: 'white',
      },
    },
  },
});

function LoadingScreen() {
  return (
    <Box
      position="fixed"
      top={0}
      left={0}
      right={0}
      bottom={0}
      bg="#171717"
      zIndex={9999}
      display="flex"
      alignItems="center"
      justifyContent="center"
      sx={{
        animation: `${fadeIn} 0.2s ease-in`
      }}
    >
      <Spinner
        thickness="4px"
        speed="0.65s"
        emptyColor="gray.700"
        color="brand.500"
        size="xl"
      />
    </Box>
  );
}

function Root() {
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Ensure the loading state persists long enough for styles to be applied
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 500);

    return () => clearTimeout(timer);
  }, []);

  return (
    <ChakraProvider theme={theme}>
      {isLoading && <LoadingScreen />}
      <Box
        minH="100vh"
        bg="#171717"
        opacity={isLoading ? 0 : 1}
        transition="opacity 0.3s ease-in"
      >
        <App />
      </Box>
    </ChakraProvider>
  );
}

// Add immediate styles to prevent flash
const style = document.createElement('style');
style.textContent = `
  body {
    background-color: #171717 !important;
    margin: 0;
    padding: 0;
  }
`;
document.head.appendChild(style);

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <Root />
  </StrictMode>
);