import React from 'react';
import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalCloseButton,
  FormControl,
  FormLabel,
  Input,
  Textarea,
  Button,
  VStack,
  Text,
} from '@chakra-ui/react';
import { FaCalendarAlt } from 'react-icons/fa';
import { ConsultationForm } from '../types';

interface ConsultationModalProps {
  isOpen: boolean;
  onClose: () => void;
  form: ConsultationForm;
  onChange: (field: keyof ConsultationForm, value: string) => void;
  onSubmit: () => void;
  bedrooms: number;
  bathrooms: number;
}

export function ConsultationModal({
  isOpen,
  onClose,
  form,
  onChange,
  onSubmit,
  bedrooms,
  bathrooms,
}: ConsultationModalProps) {
  return (
    <Modal isOpen={isOpen} onClose={onClose} size="xl">
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>Schedule a Value Engineering Consultation</ModalHeader>
        <ModalCloseButton />
        <ModalBody pb={6}>
          <VStack spacing={4}>
            <Text>
              Let's discuss how we can optimize your {bedrooms} bedroom, {bathrooms} bathroom home design
              for maximum value while maintaining quality and functionality.
            </Text>
            
            <FormControl>
              <FormLabel>Name</FormLabel>
              <Input
                value={form.name}
                onChange={(e) => onChange('name', e.target.value)}
                placeholder="Your name"
              />
            </FormControl>

            <FormControl>
              <FormLabel>Email</FormLabel>
              <Input
                type="email"
                value={form.email}
                onChange={(e) => onChange('email', e.target.value)}
                placeholder="your@email.com"
              />
            </FormControl>

            <FormControl>
              <FormLabel>Phone</FormLabel>
              <Input
                type="tel"
                value={form.phone}
                onChange={(e) => onChange('phone', e.target.value)}
                placeholder="Your phone number"
              />
            </FormControl>

            <FormControl>
              <FormLabel>Additional Notes</FormLabel>
              <Textarea
                value={form.message}
                onChange={(e) => onChange('message', e.target.value)}
                placeholder="Tell us more about your project goals..."
              />
            </FormControl>

            <Button
              colorScheme="blue"
              leftIcon={<FaCalendarAlt />}
              size="lg"
              width="full"
              onClick={onSubmit}
              mt={4}
            >
              Request Consultation
            </Button>
          </VStack>
        </ModalBody>
      </ModalContent>
    </Modal>
  );
}