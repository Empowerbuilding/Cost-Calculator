import React, { useCallback, useState } from 'react';
import { useDropzone } from 'react-dropzone';
import {
  Box,
  VStack,
  Text,
  Image,
  Progress,
  Card,
  CardBody,
  List,
  ListItem,
  ListIcon,
  Badge,
  Alert,
  AlertIcon,
  Stack,
  Collapse,
  Button,
} from '@chakra-ui/react';
import { FaCloudUploadAlt, FaCheck, FaChevronDown, FaChevronUp } from 'react-icons/fa';
import { MaterialAnalysis, analyzeHouseImage } from '../lib/openai';

interface ImageAnalyzerProps {
  onAnalysisComplete: (analysis: MaterialAnalysis) => void;
}

export function ImageAnalyzer({ onAnalysisComplete }: ImageAnalyzerProps) {
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [analysis, setAnalysis] = useState<MaterialAnalysis | null>(null);
  const [isExpanded, setIsExpanded] = useState(false);

  const onDrop = useCallback(async (acceptedFiles: File[]) => {
    if (acceptedFiles.length === 0) return;

    const file = acceptedFiles[0];
    const reader = new FileReader();

    reader.onload = async () => {
      const base64 = (reader.result as string).split(',')[1];
      setPreviewUrl(URL.createObjectURL(file));
      setIsAnalyzing(true);
      setIsExpanded(false);

      try {
        const result = await analyzeHouseImage(base64);
        setAnalysis(result);
        onAnalysisComplete(result);
        setIsExpanded(true);
      } catch (error) {
        console.error('Error analyzing image:', error);
      } finally {
        setIsAnalyzing(false);
      }
    };

    reader.readAsDataURL(file);
  }, [onAnalysisComplete]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'image/*': ['.jpeg', '.jpg', '.png']
    },
    maxFiles: 1,
    multiple: false
  });

  const getQualityBadge = (value: number) => {
    if (value < 1.0) return { color: 'gold', text: 'Economy' };
    if (value > 1.0) return { color: 'purple', text: 'Luxury' };
    return { color: 'blue', text: 'Standard' };
  };

  return (
    <Card w="full" variant="outline" bg="white" shadow="md">
      <CardBody>
        <VStack spacing={4}>
          <Alert 
            status="info" 
            borderRadius="md"
            bg="blue.50"
            color="blue.800"
          >
            <AlertIcon />
            <Text fontSize="sm" fontWeight="medium">
              Upload an exterior photo to analyze materials
            </Text>
          </Alert>

          {!previewUrl && (
            <Box
              {...getRootProps()}
              w="full"
              h="150px"
              border="2px dashed"
              borderColor={isDragActive ? 'blue.500' : 'blue.200'}
              borderRadius="lg"
              p={4}
              display="flex"
              alignItems="center"
              justifyContent="center"
              bg={isDragActive ? 'blue.50' : 'gray.50'}
              cursor="pointer"
              transition="all 0.2s"
              _hover={{ bg: 'blue.50', borderColor: 'blue.400' }}
            >
              <input {...getInputProps()} />
              <VStack spacing={2}>
                <Box
                  as={FaCloudUploadAlt}
                  size={30}
                  color={isDragActive ? 'blue.500' : 'blue.400'}
                />
                <Text color="gray.600" fontSize="sm" textAlign="center">
                  {isDragActive ? 'Drop photo here' : 'Drag & drop or click to upload'}
                </Text>
              </VStack>
            </Box>
          )}

          {previewUrl && (
            <Box w="full" position="relative">
              <Image
                src={previewUrl}
                alt="House preview"
                maxH="200px"
                objectFit="contain"
                borderRadius="md"
                mx="auto"
              />
              <Box
                {...getRootProps()}
                position="absolute"
                top={0}
                left={0}
                right={0}
                bottom={0}
                bg="blackAlpha.300"
                borderRadius="md"
                display="flex"
                alignItems="center"
                justifyContent="center"
                opacity={0}
                transition="opacity 0.2s"
                _hover={{ opacity: 1 }}
                cursor="pointer"
              >
                <Text color="white" fontWeight="bold">
                  Click to change photo
                </Text>
              </Box>
            </Box>
          )}

          {isAnalyzing && (
            <Box w="full" p={3} bg="gray.50" borderRadius="md">
              <Progress size="xs" isIndeterminate colorScheme="blue" />
              <Text fontSize="sm" color="blue.600" mt={2} textAlign="center">
                Analyzing materials...
              </Text>
            </Box>
          )}

          {analysis && !isAnalyzing && (
            <Box w="full">
              <List spacing={2} w="full">
                {[
                  { label: 'Roofing', value: analysis.roofing, impact: analysis.costImpact.roofing },
                  { label: 'Siding', value: analysis.siding, impact: analysis.costImpact.siding },
                  { label: 'Windows', value: analysis.windows, impact: analysis.costImpact.windows },
                  { label: 'Doors', value: analysis.doors, impact: analysis.costImpact.doors }
                ].map((item, index) => (
                  <ListItem key={index}>
                    <Stack
                      direction="row"
                      spacing={2}
                      align="center"
                      bg="gray.50"
                      p={2}
                      borderRadius="md"
                    >
                      <ListIcon as={FaCheck} color="gold.500" />
                      <Text fontWeight="medium" fontSize="sm" color="gray.700" minW="60px">
                        {item.label}:
                      </Text>
                      <Text fontSize="sm" color="gray.600" flex="1">
                        {item.value}
                      </Text>
                      <Badge
                        colorScheme={getQualityBadge(item.impact).color}
                        fontSize="xs"
                      >
                        {getQualityBadge(item.impact).text}
                      </Badge>
                    </Stack>
                  </ListItem>
                ))}
              </List>
            </Box>
          )}
        </VStack>
      </CardBody>
    </Card>
  );
}