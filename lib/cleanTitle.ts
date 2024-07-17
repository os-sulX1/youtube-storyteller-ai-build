import React from 'react';

export const cleanTitle = (title: string): string => {
  return title
    .replace(/[^a-zA-Z0-9\s]/g, ' ') // Replace non-alphanumeric characters with space
    .replace(/\s+/g, ' ') // Replace multiple spaces with a single space
    .trim(); // Trim leading and trailing spaces
};
