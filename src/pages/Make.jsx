import React from 'react';
import PageLayout from '../components/PageLayout';
import content from '../data/content.json';

export default function Make() {
  return <PageLayout {...content.make} />;
}