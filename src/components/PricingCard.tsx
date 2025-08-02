import React from 'react';
import {
  Card,
  CardBody,
  VStack,
  HStack,
  Text,
  Box,
  Button,
  Stat,
  StatNumber,
  StatHelpText,
  StatArrow,
  Badge,
  Divider
} from '@chakra-ui/react';
import { FaDollarSign, FaTools, FaUserCog, FaCalendarAlt, FaArrowRight } from 'react-icons/fa';
import { PricingTier, BuilderType } from '../types';
import { CONTRACTOR_MARKUP } from './CostFactors';

const HUBSPOT_MEETING_URL = 'https://meetings-na2.hubspot.com/larry-madison?uuid=477da47a-4975-40b1-ad7e-87aae01d665e';

interface PricingCardProps {
  tier: PricingTier;
  selectedBuilder: BuilderType;
  cost: Record<BuilderType, number>;
  getTierScheme: (tier: PricingTier) => { color: string; bg: string };
}

export function PricingCard({
  tier,
  selectedBuilder,
  cost,
  getTierScheme,
}: PricingCardProps) {
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      maximumFractionDigits: 0
    }).format(amount);
  };

  const getTierLabel = (tier: PricingTier) => {
    switch (tier) {
      case 'economy':
        return 'Economy Package';
      case 'standard':
        return 'Standard Package';
      case 'luxury':
        return 'Luxury Package';
    }
  };

  return (
    <Card
      bg="white"
      borderWidth={2}
      borderColor="brand.500"
      transition="all 0.2s"
      _hover={{ transform: 'translateY(-2px)', shadow: 'lg' }}
    >
      <CardBody>
        <VStack align="stretch" spacing={4}>
          <HStack justify="space-between">
            <VStack align="start" spacing={1}>
              <Text fontWeight="bold" fontSize="lg" color="brand.700">
                {getTierLabel(tier)}
              </Text>
              <Badge colorScheme="brand" variant="subtle">
                {tier === 'economy' ? 'Economy' : tier === 'standard' ? 'Standard' : 'Luxury'} Finishes
              </Badge>
            </VStack>
            <Box as={FaDollarSign} size="24px" color="brand.500" />
          </HStack>
          
          <Divider borderColor="brand.200" />
          
          <VStack align="stretch" spacing={3}>
            <HStack justify="space-between" spacing={2} p={2} bg="gray.50" rounded="md">
              <HStack spacing={2}>
                <Box as={FaTools} color="brand.500" />
                <Text fontSize="sm" fontWeight="medium" color="gray.700">Owner Build</Text>
              </HStack>
              <Text fontSize="sm" fontWeight="bold" color="brand.600">
                {formatCurrency(cost.owner)}
              </Text>
            </HStack>
            
            <HStack justify="space-between" spacing={2} p={2} bg="gray.50" rounded="md">
              <HStack spacing={2}>
                <Box as={FaUserCog} color="brand.500" />
                <Text fontSize="sm" fontWeight="medium" color="gray.700">Contractor Build</Text>
              </HStack>
              <Text fontSize="sm" fontWeight="bold" color="brand.600">
                {formatCurrency(cost.contractor)}
              </Text>
            </HStack>
          </VStack>

          <Stat>
            <StatNumber color="brand.700" fontSize="2xl">
              {formatCurrency(cost[selectedBuilder])}
            </StatNumber>
            {selectedBuilder === 'contractor' && (
              <StatHelpText>
                <StatArrow type="increase" />
                {(CONTRACTOR_MARKUP * 100).toFixed(0)}% contractor markup included
              </StatHelpText>
            )}
          </Stat>

          <Button
            size="lg"
            width="full"
            rightIcon={<FaArrowRight />}
            leftIcon={<FaCalendarAlt />}
            fontWeight="bold"
            py={6}
            _hover={{
              transform: 'translateY(-1px)',
              shadow: 'md'
            }}
            onClick={() => window.location.href = HUBSPOT_MEETING_URL}
          >
            Schedule Consultation
          </Button>
        </VStack>
      </CardBody>
    </Card>
  );
}