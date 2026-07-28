import React from 'react';
import PageLayout from '../components/PageLayout';
import content from '../data/content.json';

export default function Teach() {
  return <PageLayout {...content.teach} />;
}