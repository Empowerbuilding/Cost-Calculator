import React from 'react';
import {
  Box,
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  Container,
  VStack,
  Button,
  Text,
} from '@chakra-ui/react';
import { FaCheck, FaTimes, FaChartLine } from 'react-icons/fa';

const HUBSPOT_MEETING_URL = 'https://meetings-na2.hubspot.com/larry-madison?uuid=477da47a-4975-40b1-ad7e-87aae01d665e';

const features = [
  {
    name: 'Basic Structure',
    economy: true,
    standard: true,
    luxury: true,
  },
  {
    name: 'Energy Efficient Windows',
    economy: false,
    standard: true,
    luxury: true,
  },
  {
    name: 'Premium Insulation',
    economy: false,
    standard: true,
    luxury: true,
  },
  {
    name: 'Smart Home Integration',
    economy: false,
    standard: false,
    luxury: true,
  },
  {
    name: 'Custom Finishes',
    economy: false,
    standard: true,
    luxury: true,
  },
  {
    name: 'Premium Appliances',
    economy: false,
    standard: false,
    luxury: true,
  },
];

export function FeatureComparison() {
  return (
    <VStack spacing={8} w="full">
      <Box 
        w="full" 
        position="relative"
        overflow="hidden"
      >
        <Box 
          overflowX={{ base: "auto", md: "hidden" }}
          sx={{
            // Custom scrollbar styling
            '&::-webkit-scrollbar': {
              height: '6px',
            },
            '&::-webkit-scrollbar-track': {
              background: 'gray.100',
            },
            '&::-webkit-scrollbar-thumb': {
              background: 'gray.300',
              borderRadius: '3px',
            },
          }}
        >
          <Box minWidth="600px">
            <Table variant="simple" bg="white" borderRadius="lg" size="sm">
              <Thead bg="gray.50">
                <Tr>
                  <Th 
                    position="sticky"
                    left={0}
                    zIndex={2}
                    bg="gray.50"
                    fontSize="sm"
                    color="gray.700"
                    width="160px"
                    minWidth="160px"
                    maxWidth="160px"
                    px={3}
                    borderRight="1px solid"
                    borderRightColor="gray.200"
                    _after={{
                      content: '""',
                      position: 'absolute',
                      right: '-4px',
                      top: 0,
                      bottom: 0,
                      width: '4px',
                      background: 'linear-gradient(to right, rgba(0,0,0,0.1), transparent)',
                      pointerEvents: 'none',
                    }}
                  >
                    Feature
                  </Th>
                  <Th 
                    fontSize="sm" 
                    color="green.600" 
                    textAlign="center"
                    width="140px"
                    px={3}
                  >
                    Economy
                  </Th>
                  <Th 
                    fontSize="sm" 
                    color="blue.600" 
                    textAlign="center"
                    width="140px"
                    px={3}
                  >
                    Standard
                  </Th>
                  <Th 
                    fontSize="sm" 
                    color="purple.600" 
                    textAlign="center"
                    width="140px"
                    px={3}
                  >
                    Luxury
                  </Th>
                </Tr>
              </Thead>
              <Tbody>
                {features.map((feature, index) => (
                  <Tr key={index}>
                    <Td 
                      position="sticky"
                      left={0}
                      zIndex={1}
                      bg="white"
                      color="gray.700"
                      fontWeight="medium"
                      fontSize="sm"
                      whiteSpace="normal"
                      lineHeight="shorter"
                      width="160px"
                      minWidth="160px"
                      maxWidth="160px"
                      px={3}
                      py={2.5}
                      borderRight="1px solid"
                      borderRightColor="gray.200"
                      _after={{
                        content: '""',
                        position: 'absolute',
                        right: '-4px',
                        top: 0,
                        bottom: 0,
                        width: '4px',
                        background: 'linear-gradient(to right, rgba(0,0,0,0.1), transparent)',
                        pointerEvents: 'none',
                      }}
                    >
                      {feature.name}
                    </Td>
                    <Td textAlign="center" width="140px" px={3} py={2.5}>
                      {feature.economy ? (
                        <Box as={FaCheck} color="green.500" display="inline" />
                      ) : (
                        <Box as={FaTimes} color="red.500" display="inline" />
                      )}
                    </Td>
                    <Td textAlign="center" width="140px" px={3} py={2.5}>
                      {feature.standard ? (
                        <Box as={FaCheck} color="green.500" display="inline" />
                      ) : (
                        <Box as={FaTimes} color="red.500" display="inline" />
                      )}
                    </Td>
                    <Td textAlign="center" width="140px" px={3} py={2.5}>
                      {feature.luxury ? (
                        <Box as={FaCheck} color="green.500" display="inline" />
                      ) : (
                        <Box as={FaTimes} color="red.500" display="inline" />
                      )}
                    </Td>
                  </Tr>
                ))}
              </Tbody>
            </Table>
          </Box>
        </Box>
      </Box>

      <Container maxW="container.lg" centerContent py={8}>
        <VStack spacing={6} width="full">
          <Button
            size="lg"
            colorScheme="brand"
            leftIcon={<FaChartLine />}
            fontSize={{ base: "md", md: "lg" }}
            width={{ base: "full", md: "auto" }}
            px={{ base: 6, md: 8 }}
            py={{ base: 6, md: 7 }}
            _hover={{
              transform: 'translateY(-2px)',
              shadow: 'lg',
            }}
            onClick={() => window.location.href = HUBSPOT_MEETING_URL}
            whiteSpace="normal"
            height="auto"
            display="flex"
            flexDirection="column"
            gap={1}
          >
            <Text>Schedule Your Project</Text>
            <Text>Value Engineering Session</Text>
          </Button>
          
          <Text 
            fontSize={{ base: "sm", md: "md" }} 
            color="gray.500" 
            textAlign="center"
            px={4}
          >
            Contact a licensed contractor for accurate pricing in your area.
          </Text>
        </VStack>
      </Container>
    </VStack>
  );
}