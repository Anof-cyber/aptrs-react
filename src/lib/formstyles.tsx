import React from 'react';
import { ExclamationCircleIcon } from '@heroicons/react/24/outline';

interface FormErrorMessageProps {
  message: string;
}

export const FormErrorMessage: React.FC<FormErrorMessageProps> = ({ message }) => {
  return (
    <>
      <ExclamationCircleIcon className='h-5 w-5 text-red-500' />
      <p className='text-sm text-red-500'>{message}</p>
    </>
  );
};



export const StyleTextfield ='peer block w-full rounded-md border border-gray-200 py-[9px] pl-2 text-sm outline-2 placeholder:text-gray-500';

export const StyleLabel = 'mb-3 mt-5 block text-xs font-medium text-gray-900'


