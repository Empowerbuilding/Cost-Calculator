import React from 'react';
import {
  Popover,
  PopoverTrigger,
  PopoverContent,
  PopoverHeader,
  PopoverBody,
  PopoverArrow,
  PopoverCloseButton,
  IconButton,
  VStack,
  Text,
  List,
  ListItem,
  Divider,
  Box,
  Badge,
  useBreakpointValue,
} from '@chakra-ui/react';
import { FaInfoCircle } from 'react-icons/fa';

interface InfoPopoverProps {
  title: string;
  children: React.ReactNode;
}

export function InfoPopover({ title, children }: InfoPopoverProps) {
  const placement = useBreakpointValue({ base: 'bottom', md: 'right-start' });
  const width = useBreakpointValue({ base: '90vw', md: '400px' });
  const maxHeight = useBreakpointValue({ base: '80vh', md: 'none' });

  return (
    <Popover placement={placement}>
      <PopoverTrigger>
        <IconButton
          icon={<FaInfoCircle />}
          aria-label="Info"
          variant="ghost"
          size="sm"
          color="brand.500"
          _hover={{
            bg: 'brand.50',
            transform: 'scale(1.1)',
          }}
          transition="all 0.2s"
        />
      </PopoverTrigger>
      <PopoverContent
        bg="white"
        borderColor="brand.100"
        boxShadow="xl"
        _focus={{
          outline: 'none',
          boxShadow: 'xl',
        }}
        width={width}
        maxW={width}
        maxH={maxHeight}
        overflowY="auto"
        sx={{
          '&::-webkit-scrollbar': {
            width: '4px',
          },
          '&::-webkit-scrollbar-track': {
            width: '6px',
            background: 'gray.50',
          },
          '&::-webkit-scrollbar-thumb': {
            background: 'brand.200',
            borderRadius: '24px',
          },
        }}
      >
        <PopoverArrow bg="white" />
        <PopoverCloseButton 
          color="gray.600" 
          zIndex="popover"
          position="absolute"
          right="8px"
          top="8px"
        />
        <PopoverHeader
          fontWeight="bold"
          color="brand.700"
          borderBottomWidth="1px"
          borderBottomColor="brand.100"
          bg="brand.50"
          py={3}
          pr={8}
        >
          {title}
        </PopoverHeader>
        <PopoverBody py={4}>
          <VStack
            align="stretch"
            spacing={3}
            divider={<Divider borderColor="gray.200" />}
          >
            {children}
          </VStack>
        </PopoverBody>
      </PopoverContent>
    </Popover>
  );
}

export function InfoListItem({ label, description }: { label: string; description: string }) {
  return (
    <ListItem display="flex" alignItems="baseline" gap={2}>
      <Badge 
        colorScheme="brand" 
        fontSize="xs" 
        px={2} 
        py={0.5}
        whiteSpace="nowrap"
      >
        {label}
      </Badge>
      <Text 
        fontSize="sm" 
        color="gray.700"
        flexGrow={1}
        lineHeight="1.5"
      >
        {description}
      </Text>
    </ListItem>
  );
}

export function InfoSection({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <Box>
      <Text 
        fontWeight="medium" 
        color="brand.700" 
        mb={2}
        fontSize={{ base: "sm", md: "md" }}
      >
        {title}
      </Text>
      {children}
    </Box>
  );
}