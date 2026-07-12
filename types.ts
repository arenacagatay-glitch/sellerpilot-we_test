import { LucideIcon } from 'lucide-react';

export interface ChatExample {
  id: number;
  category: string;
  customerName: string;
  date: string;
  question: string;
  answer: string;
}

export interface Feature {
  id: number;
  icon: LucideIcon;
  title: string;
  description: string;
}

export interface Step {
  id: number;
  icon: LucideIcon;
  title: string;
  description: string;
}

export interface FaqItem {
  id: number;
  question: string;
  answer: string;
}

export interface StatCard {
  id: number;
  title: string;
  description: string;
  imageUrl: string;
  iconLabel: string;
}

// Admin panelinde gösterilen tek bir talep / konuşma satırı.
// Google Sheet'teki bir satıra karşılık gelir.
export interface Lead {
  name: string;
  email: string;
  phone: string;
  date: string;
  status: string;
}