import React, { useState, useEffect } from 'react';
import {
  Box,
  Container,
  Heading,
  SimpleGrid,
  Input,
  FormControl,
  FormLabel,
  VStack,
  HStack,
  Text,
  Select,
  useToast,
  Card,
  CardBody,
  List,
  ListItem,
  Flex,
  Progress,
  Divider,
  Image,
  Stack,
} from '@chakra-ui/react';
import {
  FaHome,
  FaMapMarkerAlt,
  FaLeaf,
  FaBed,
  FaBath,
  FaWarehouse,
  FaExpandArrowsAlt,
  FaTree,
  FaHome as FaHouseIcon,
  FaMountain,
  FaCamera,
  FaCompass,
  FaLightbulb,
  FaClipboardCheck,
  FaRegularBuilding,
  FaShieldAlt,
} from 'react-icons/fa';
import { cities } from '../lib/cities';
import { getAIRecommendations, getLocationCostData } from '../lib/openai';
import { ImageAnalyzer } from './ImageAnalyzer';
import { FeatureComparison } from './FeatureComparison';
import { InfoPopover, InfoSection, InfoListItem } from './InfoPopover';
import { PricingCard } from './PricingCard';
import {
  COST_FACTORS,
  FOUNDATION_FACTORS,
  ROOF_PITCH_FACTORS,
  INTERIOR_FINISH_FACTORS,
} from './CostFactors';
import type { MaterialAnalysis } from '../lib/openai';
import type { CalculatorInputs, ConsultationForm, PricingTier, BuilderType } from '../types';

const HUBSPOT_MEETING_URL = 'https://meetings.hubspot.com/larry-madison/barnhaus-introductory-call?uuid=79f93a92-f2ff-4807-9c79-c33682a1731b&__hstc=124330133.6b4e96000c1c288d2c9a4ef948ff3c72.1742747177230.1754012541672.1754078449989.13&__hssc=124330133.1.1754078449989&__hsfp=1913391899';

export default function ConstructionCalculator() {
  const toast = useToast();
  const [inputs, setInputs] = useState<CalculatorInputs>({
    bedrooms: 3,
    bathrooms: 2,
    garageSpace: 400,
    livingSpace: 2000,
    patioSpace: 200,
    location: 'san-antonio',
    sustainabilityScore: 5,
    foundation: 'slab',
    roofPitch: 'medium',
    interiorFinish: 'modern'
  });

  const [locationMultiplier, setLocationMultiplier] = useState<number>(1.0);
  const [selectedTier, setSelectedTier] = useState<PricingTier>('standard');
  const [selectedBuilder, setSelectedBuilder] = useState<BuilderType>('contractor');
  const [totalCost, setTotalCost] = useState<Record<PricingTier, Record<BuilderType, number>>>({
    economy: { owner: 0, contractor: 0 },
    standard: { owner: 0, contractor: 0 },
    luxury: { owner: 0, contractor: 0 }
  });
  const [aiRecommendations, setAiRecommendations] = useState<string[]>([]);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [materialAnalysis, setMaterialAnalysis] = useState<MaterialAnalysis | null>(null);

  useEffect(() => {
    let isMounted = true;

    const updateLocationCosts = async () => {
      try {
        const multiplier = await getLocationCostData(inputs.location);
        if (isMounted) {
          setLocationMultiplier(multiplier);
        }
      } catch (error) {
        console.error('Error updating location costs:', error);
      }
    };

    updateLocationCosts();
    return () => {
      isMounted = false;
    };
  }, [inputs.location]);

  useEffect(() => {
    const calculateCostForTier = (tier: PricingTier) => {
      const factors = COST_FACTORS[tier];
      let basePrice = (
        (inputs.bedrooms * factors.bedroom) +
        (inputs.bathrooms * factors.bathroom) +
        (inputs.garageSpace * factors.garage) +
        (inputs.livingSpace * factors.living) +
        (inputs.patioSpace * factors.patio)
      );
      
      basePrice *= FOUNDATION_FACTORS[inputs.foundation];
      basePrice *= ROOF_PITCH_FACTORS[inputs.roofPitch];
      basePrice *= INTERIOR_FINISH_FACTORS[inputs.interiorFinish];
      
      if (materialAnalysis) {
        const materialImpact = 
          (materialAnalysis.costImpact.roofing +
           materialAnalysis.costImpact.siding +
           materialAnalysis.costImpact.windows +
           materialAnalysis.costImpact.doors) / 4;
        basePrice *= materialImpact;
      }

      const sustainabilityBonus = inputs.sustainabilityScore * 0.02;
      const adjustedBasePrice = basePrice * (locationMultiplier + sustainabilityBonus);

      return {
        owner: adjustedBasePrice,
        contractor: adjustedBasePrice * 1.18
      };
    };

    setTotalCost({
      economy: calculateCostForTier('economy'),
      standard: calculateCostForTier('standard'),
      luxury: calculateCostForTier('luxury')
    });
  }, [inputs, locationMultiplier, materialAnalysis]);

  useEffect(() => {
    let isMounted = true;

    const analyzeWithAI = async () => {
      setIsAnalyzing(true);
      try {
        const recommendations = await getAIRecommendations(inputs);
        if (isMounted) {
          setAiRecommendations(recommendations);
          toast({
            title: "Analysis Complete",
            description: "New recommendations available",
            status: "success",
            duration: 3000,
            isClosable: true,
          });
        }
      } catch (error) {
        if (isMounted) {
          toast({
            title: "Analysis Error",
            description: "Could not get recommendations",
            status: "error",
            duration: 3000,
            isClosable: true,
          });
        }
      } finally {
        if (isMounted) {
          setIsAnalyzing(false);
        }
      }
    };
    
    analyzeWithAI();

    return () => {
      isMounted = false;
    };
  }, [inputs, toast]);

  const handleInputChange = (field: keyof CalculatorInputs, value: number | string) => {
    let newValue: number | string = value;
    
    if (typeof value === 'number' || (typeof value === 'string' && value.trim() !== '')) {
      const numValue = Number(value);
      if (!isNaN(numValue)) {
        switch (field) {
          case 'sustainabilityScore':
            newValue = Math.min(Math.max(numValue, 1), 10);
            break;
          case 'bedrooms':
          case 'bathrooms':
            newValue = Math.max(numValue, 1);
            break;
          case 'garageSpace':
          case 'livingSpace':
          case 'patioSpace':
            newValue = Math.max(numValue, 0);
            break;
          default:
            newValue = numValue;
        }
      }
    }

    setInputs(prev => ({
      ...prev,
      [field]: newValue
    }));
  };

  const getTierScheme = (tier: PricingTier) => {
    switch (tier) {
      case 'economy':
        return { color: 'green', bg: 'green.50' };
      case 'standard':
        return { color: 'blue', bg: 'blue.50' };
      case 'luxury':
        return { color: 'purple', bg: 'purple.50' };
    }
  };

  const currentCity = cities.find(c => c.id === inputs.location);

  return (
    <Container maxW="6xl" py={{ base: 4, md: 8 }} px={{ base: 4, md: 8 }}>
      <VStack spacing={{ base: 6, md: 8 }}>
        <Flex
          direction={{ base: 'column', md: 'row' }}
          align={{ base: 'center', md: 'center' }}
          justify="space-between"
          w="full"
          gap={{ base: 4, md: 0 }}
        >
          <Image
            src="/assets/images/brand/your-logo.png"
            alt="Construction Calculator"
            height={{ base: "60px", md: "80px" }}
            fallback={
              <Flex align="center">
                <Box as={FaHome} size={{ base: "40px", md: "50px" }} color="brand.500" mr={3} />
                <Heading size={{ base: "xl", md: "2xl" }} color="white">Construction Calculator</Heading>
              </Flex>
            }
          />
          <Heading size={{ base: "md", md: "lg" }} color="brand.500" textAlign={{ base: "center", md: "right" }}>
            Construction Cost Calculator
          </Heading>
        </Flex>

        <SimpleGrid columns={{ base: 1, md: 2 }} spacing={{ base: 4, md: 6 }} w="full">
          <FormControl>
            <FormLabel>
              <Stack direction={{ base: "row" }} spacing={2} align="center">
                <Box as={FaMapMarkerAlt} color="brand.500" />
                <Text>Location</Text>
              </Stack>
            </FormLabel>
            <Select
              value={inputs.location}
              onChange={(e) => handleInputChange('location', e.target.value)}
              bg="white"
              color="gray.800"
              size={{ base: "md", md: "lg" }}
            >
              {cities.map(city => (
                <option key={city.id} value={city.id}>
                  {city.name}, {city.state}
                </option>
              ))}
            </Select>
          </FormControl>

          <FormControl>
            <FormLabel>
              <Stack direction={{ base: "row" }} spacing={2} align="center">
                <Box as={FaLeaf} color="brand.500" />
                <Text>Sustainability Score (1-10)</Text>
                <InfoPopover title="Sustainability Score Guide">
                  <InfoSection title="Score Levels & Features">
                    <List spacing={2}>
                      <InfoListItem
                        label="1-3"
                        description="Basic energy efficiency features: Standard insulation, regular windows, basic HVAC"
                      />
                      <InfoListItem
                        label="4-7"
                        description="Enhanced sustainability: Energy Star appliances, improved insulation, smart thermostats"
                      />
                      <InfoListItem
                        label="8-10"
                        description="Maximum sustainability: Solar readiness, advanced HVAC, premium insulation, water conservation"
                      />
                    </List>
                  </InfoSection>
                  
                  <InfoSection title="Cost Impact">
                    <Text fontSize="sm" color="gray.600">
                      Each point adds 2% to base cost but typically reduces long-term operating expenses by 3-5% annually.
                    </Text>
                  </InfoSection>
                  
                  <InfoSection title="Benefits">
                    <List spacing={1}>
                      <InfoListItem
                        label="Energy"
                        description="Lower monthly utility costs"
                      />
                      <InfoListItem
                        label="Value"
                        description="Higher resale value"
                      />
                      <InfoListItem
                        label="Comfort"
                        description="Improved indoor environment"
                      />
                    </List>
                  </InfoSection>
                </InfoPopover>
              </Stack>
            </FormLabel>
            <Input
              type="number"
              min={1}
              max={10}
              value={inputs.sustainabilityScore}
              onChange={(e) => handleInputChange('sustainabilityScore', e.target.value)}
              bg="white"
              color="gray.800"
              size={{ base: "md", md: "lg" }}
            />
          </FormControl>
        </SimpleGrid>

        <Card w="full" shadow="xl" bg="white">
          <CardBody>
            <SimpleGrid columns={{ base: 1, md: 2 }} spacing={{ base: 6, md: 8 }}>
              <VStack align="stretch" spacing={{ base: 4, md: 6 }}>
                <Heading size={{ base: "sm", md: "md" }} color="gray.800">Building Specifications</Heading>
                
                <FormControl>
                  <FormLabel>
                    <Stack direction="row" spacing={2} align="center">
                      <Box as={FaExpandArrowsAlt} color="brand.500" />
                      <Text color="gray.700">Living Space (sq ft)</Text>
                    </Stack>
                  </FormLabel>
                  <Input
                    type="number"
                    min={0}
                    value={inputs.livingSpace}
                    onChange={(e) => handleInputChange('livingSpace', e.target.value)}
                    bg="white"
                    color="gray.800"
                    size={{ base: "md", md: "lg" }}
                  />
                </FormControl>

                <FormControl>
                  <FormLabel>
                    <Stack direction="row" spacing={2} align="center">
                      <Box as={FaWarehouse} color="brand.500" />
                      <Text color="gray.700">Garage Space (sq ft)</Text>
                    </Stack>
                  </FormLabel>
                  <Input
                    type="number"
                    min={0}
                    value={inputs.garageSpace}
                    onChange={(e) => handleInputChange('garageSpace', e.target.value)}
                    bg="white"
                    color="gray.800"
                    size={{ base: "md", md: "lg" }}
                  />
                </FormControl>

                <FormControl>
                  <FormLabel>
                    <Stack direction="row" spacing={2} align="center">
                      <Box as={FaTree} color="brand.500" />
                      <Text color="gray.700">Patio Space (sq ft)</Text>
                    </Stack>
                  </FormLabel>
                  <Input
                    type="number"
                    min={0}
                    value={inputs.patioSpace}
                    onChange={(e) => handleInputChange('patioSpace', e.target.value)}
                    bg="white"
                    color="gray.800"
                    size={{ base: "md", md: "lg" }}
                  />
                </FormControl>

                <FormControl>
                  <FormLabel>
                    <Stack direction="row" spacing={2} align="center">
                      <Box as={FaBed} color="brand.500" />
                      <Text color="gray.700">Bedrooms</Text>
                    </Stack>
                  </FormLabel>
                  <Input
                    type="number"
                    min={1}
                    value={inputs.bedrooms}
                    onChange={(e) => handleInputChange('bedrooms', e.target.value)}
                    bg="white"
                    color="gray.800"
                    size={{ base: "md", md: "lg" }}
                  />
                </FormControl>

                <FormControl>
                  <FormLabel>
                    <Stack direction="row" spacing={2} align="center">
                      <Box as={FaBath} color="brand.500" />
                      <Text color="gray.700">Bathrooms</Text>
                    </Stack>
                  </FormLabel>
                  <Input
                    type="number"
                    min={1}
                    value={inputs.bathrooms}
                    onChange={(e) => handleInputChange('bathrooms', e.target.value)}
                    bg="white"
                    color="gray.800"
                    size={{ base: "md", md: "lg" }}
                  />
                </FormControl>
              </VStack>

              <VStack align="stretch" spacing={{ base: 4, md: 6 }}>
                <FormControl>
                  <FormLabel>
                    <Stack direction="row" spacing={2} align="center">
                      <Box as={FaHome} color="brand.500" />
                      <Text color="gray.700">Foundation Type</Text>
                    </Stack>
                  </FormLabel>
                  <Select
                    value={inputs.foundation}
                    onChange={(e) => handleInputChange('foundation', e.target.value)}
                    bg="white"
                    color="gray.800"
                    size={{ base: "md", md: "lg" }}
                  >
                    <option value="slab">Concrete Slab</option>
                    <option value="crawl">Crawl Space</option>
                    <option value="basement">Full Basement</option>
                  </Select>
                </FormControl>

                <FormControl>
                  <FormLabel>
                    <Stack direction="row" spacing={2} align="center">
                      <Box as={FaMountain} color="brand.500" />
                      <Text color="gray.700">Roof Pitch</Text>
                    </Stack>
                  </FormLabel>
                  <Select
                    value={inputs.roofPitch}
                    onChange={(e) => handleInputChange('roofPitch', e.target.value)}
                    bg="white"
                    color="gray.800"
                    size={{ base: "md", md: "lg" }}
                  >
                    <option value="low">Low Pitch (3/12 or less)</option>
                    <option value="medium">Medium Pitch (4/12 - 8/12)</option>
                    <option value="high">High Pitch (9/12 or greater)</option>
                  </Select>
                </FormControl>

                <FormControl>
                  <FormLabel>
                    <Stack direction="row" spacing={2} align="center">
                      <Box as={FaHome} color="brand.500" />
                      <Text color="gray.700">Interior Finish Level</Text>
                    </Stack>
                  </FormLabel>
                  <Select
                    value={inputs.interiorFinish}
                    onChange={(e) => handleInputChange('interiorFinish', e.target.value)}
                    bg="white"
                    color="gray.800"
                    size={{ base: "md", md: "lg" }}
                  >
                    <option value="basic">Basic (Standard Finishes)</option>
                    <option value="modern">Modern (Mid-Grade Finishes)</option>
                    <option value="premium">Premium (High-End Finishes)</option>
                  </Select>
                </FormControl>

                <Box>
                  <Heading size={{ base: "sm", md: "md" }} mb={4} display="flex" alignItems="center" gap={2} color="gray.800">
                    <FaCamera />
                    Material Analysis
                    <InfoPopover title="Material Analysis Guide">
                      <InfoSection title="Analysis Process">
                        <Text fontSize="sm" color="gray.700">
                          Our AI system analyzes exterior photos to evaluate key building materials and their quality levels.
                        </Text>
                      </InfoSection>

                      <InfoSection title="Elements Analyzed">
                        <List spacing={2}>
                          <InfoListItem
                            label="Roofing"
                            description="Material type, pattern, and installation quality"
                          />
                          <InfoListItem
                            label="Siding"
                            description="Material composition, texture, and finish quality"
                          />
                          <InfoListItem
                            label="Windows"
                            description="Frame material, style, and energy efficiency features"
                          />
                          <InfoListItem
                            label="Doors"
                            description="Material type, design elements, and hardware quality"
                          />
                        </List>
                      </InfoSection>

                      <InfoSection title="Quality Levels">
                        <List spacing={2}>
                          <InfoListItem
                            label="Economy"
                            description="Standard materials with basic features (0.9x cost factor)"
                          />
                          <InfoListItem
                            label="Standard"
                            description="Quality materials with good features (1.0x cost factor)"
                          />
                          <InfoListItem
                            label="Luxury"
                            description="Premium materials with advanced features (1.1-1.2x cost factor)"
                          />
                        </List>
                      </InfoSection>
                    </InfoPopover>
                  </Heading>
                  <ImageAnalyzer onAnalysisComplete={setMaterialAnalysis} />
                </Box>
              </VStack>
            </SimpleGrid>

            <Box mt={8} pt={6} borderTopWidth={1}>
              <Heading size={{ base: "sm", md: "md" }} mb={4} color="gray.800">Cost Comparison</Heading>
              <SimpleGrid columns={{ base: 1, md: 3 }} spacing={{ base: 4, md: 4 }}>
                {(['economy', 'standard', 'luxury'] as PricingTier[]).map((tier) => (
                  <PricingCard
                    key={tier}
                    tier={tier}
                    selectedBuilder={selectedBuilder}
                    cost={totalCost[tier]}
                    getTierScheme={getTierScheme}
                  />
                ))}
              </SimpleGrid>
            </Box>

            {aiRecommendations.length > 0 && (
              <Box mt={8} pt={6} borderTopWidth={1}>
                <Stack 
                  direction={{ base: "column", md: "row" }} 
                  spacing={2} 
                  mb={4} 
                  align={{ base: "flex-start", md: "center" }}
                >
                  <Heading size={{ base: "sm", md: "md" }} color="gray.800">
                    Location-Specific Recommendations
                  </Heading>
                  <InfoPopover title={`Building in ${currentCity?.name}, ${currentCity?.state}`}>
                    <InfoSection title="Regional Characteristics">
                      <List spacing={2}>
                        <InfoListItem
                          label="Climate"
                          description={`${currentCity?.region} region with specific weather patterns and building requirements`}
                        />
                        <InfoListItem
                          label="Building Codes"
                          description="Local regulations and requirements for construction"
                        />
                        <InfoListItem
                          label="Materials"
                          description="Locally available and climate-appropriate building materials"
                        />
                      </List>
                    </InfoSection>

                    <InfoSection title="Cost Factors">
                      <List spacing={2}>
                        <InfoListItem
                          label="Labor"
                          description="Local workforce availability and wage rates"
                        />
                        <InfoListItem
                          label="Materials"
                          description="Regional supplier networks and transportation costs"
                        />
                        <InfoListItem
                          label="Permits"
                          description="Local fees and inspection requirements"
                        />
                      </List>
                    </InfoSection>

                    <InfoSection title="Design Considerations">
                      <List spacing={2}>
                        <InfoListItem
                          label="Style"
                          description="Regional architectural preferences and trends"
                        />
                        <InfoListItem
                          label="Energy"
                          description="Local climate impact on energy efficiency needs"
                        />
                        <InfoListItem
                          label="Features"
                          description="Popular amenities in the local market"
                        />
                      </List>
                    </InfoSection>
                  </InfoPopover>
                </Stack>
                
                <Box 
                  bg="brand.50" 
                  p={4} 
                  borderRadius="lg" 
                  mb={4}
                >
                  <Stack 
                    direction={{ base: "column", md: "row" }} 
                    spacing={2} 
                    align={{ base: "flex-start", md: "center" }}
                    color="brand.700"
                  >
                    <Box as={FaCompass} flexShrink={0} />
                    <Text fontWeight="medium">
                      Optimized for {currentCity?.name}, {currentCity?.state} ({currentCity?.region})
                    </Text>
                  </Stack>
                </Box>

                <VStack spacing={4} align="stretch">
                  {aiRecommendations.map((recommendation, index) => {
                    const [title, ...details] = recommendation.split(' - ');
                    const content = details.join(' - ');
                    
                    return (
                      <Card 
                        key={index} 
                        bg="white" 
                        shadow="sm"
                        _hover={{ shadow: "md" }}
                        transition="all 0.2s"
                        overflow="hidden"
                      >
                        <CardBody p={0}>
                          <Box 
                            bg="brand.50" 
                            p={3}
                            borderBottom="1px"
                            borderColor="brand.100"
                          >
                            <Stack 
                              direction="row" 
                              align="flex-start" 
                              spacing={3}
                            >
                              <Box 
                                as={FaLightbulb} 
                                color="brand.500" 
                                mt={1} 
                                flexShrink={0}
                              />
                              <Text 
                                fontWeight="semibold"
                                color="brand.700"
                                fontSize={{ base: "sm", md: "md" }}
                              >
                                {title}
                              </Text>
                            </Stack>
                          </Box>
                          <Box p={4}>
                            <Text 
                              color="gray.700"
                              fontSize={{ base: "sm", md: "md" }}
                              lineHeight="tall"
                              whiteSpace="pre-wrap"
                            >
                              {content}
                            </Text>
                          </Box>
                        </CardBody>
                      </Card>
                    );
                  })}
                </VStack>
              </Box>
            )}

            <FeatureComparison />

            <Text fontSize={{ base: "xs", md: "sm" }} color="gray.500" textAlign="center" mt={8}>
              Contact a licensed contractor for accurate pricing in your area.
            </Text>
          </CardBody>
        </Card>
      </VStack>
    </Container>
  );
}

export { ConstructionCalculator }