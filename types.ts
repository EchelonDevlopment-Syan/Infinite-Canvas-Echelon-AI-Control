export interface Slide {
  id: number;
  title: string;
  subtitle?: string;
  content: string[];
  visualType: 'grid' | 'network' | 'comparison' | 'quote' | 'apps' | 'image' | 'upload';
  imageUrl?: string;
}

export enum ProcessingState {
  IDLE = 'IDLE',
  PROCESSING = 'PROCESSING',
  SUCCESS = 'SUCCESS',
  ERROR = 'ERROR'
}

export interface GeneratedVideo {
  uri: string;
}
