import React from 'react';
import { ErrorMessage, useField } from 'formik';
import { VStack, ChakraProvider, Text, Input } from '@chakra-ui/react';
import theme from '../theme';

export const TextFieldProfile = ({ label, ...props }) => {
  const [field, meta] = useField(props);
  return (
    <div className="mb-4">
      <VStack width={{ base: '30', md: '' }} align="start" fontSize={14}>
        <Text fontWeight={600} htmlFor={field.name}>
          {label}
        </Text>
        <Input
          height={8}
          fontSize={13}
          className={`form-control shadow-none ${
            meta.touched && meta.error && 'is-invalid'
          }`}
          {...field}
          {...props}
          autoComplete="off"
        />
      </VStack>
      <ErrorMessage component="div" name={field.name} className="error" />
    </div>
  );
};
