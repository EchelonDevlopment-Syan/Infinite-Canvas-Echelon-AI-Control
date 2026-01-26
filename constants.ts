import { Slide } from './types';

export const COMPANY_NAME = "Echelon AI Control";
export const PARENT_COMPANY = "Echelon Development & Contract Consulting";
export const FOUNDER_NAME = "Syan Kazi";
export const FOUNDER_TITLE = "CEO & Founder, Bio-Digital Architect";
export const COPYRIGHT_TEXT = `© 2025 ${PARENT_COMPANY}. All Rights Reserved.`;

/**
 * Replace this URL with your actual professional headshot.
 * Currently using a fixed ID from Picsum to ensure it stays consistent on reload.
 */
export const FOUNDER_IMAGE_URL = "https://picsum.photos/id/1025/200/200?grayscale";

export const SLIDES: Slide[] = [
  {
    id: 1,
    title: "Beyond the Page: The Rise of the Infinite Canvas",
    subtitle: "An exploration of how spatial software is reshaping our tools for thought.",
    content: ["Breaking the boundaries of traditional digital formats.", "Moving from linear constraints to spatial freedom."],
    visualType: 'network'
  },
  {
    id: 2,
    title: "Our Digital Tools Were Built on a Flawed Foundation",
    content: [
      "For 40 years, software has been trapped by the 'page' metaphor.",
      "Documents, spreadsheets, presentations—all constrained by physical limitations.",
      "This forces sprawling, non-linear thoughts into fragmented containers."
    ],
    visualType: 'comparison'
  },
  {
    id: 3,
    title: "We Inherited the Limits of the Physical World",
    content: [
      "Skeuomorphism: Digital objects mimicking real-world counterparts.",
      "Folders, files, desktops—metaphors that limit our potential.",
      "We didn't just digitize the benefits of paper; we digitized its constraints."
    ],
    visualType: 'grid'
  },
  {
    id: 4,
    title: "The Page Metaphor Fragments Our Thinking",
    content: [
      "Linearity over Association: Suppresses web-like deep thinking.",
      "Premature Structuring: Forces ideas into hierarchies too early.",
      "Loss of Context: Information siloed across countless apps.",
      "Friction in Synthesis: Copy-pasting instead of connecting."
    ],
    visualType: 'network'
  },
  {
    id: 5,
    title: "A New Paradigm: Spatial Software",
    content: [
      "An infinite canvas—zoomable, pannable, boundless.",
      "Not just a feature, but a new primitive for computing.",
      "Moving beyond the desktop metaphor to one of infinite territory."
    ],
    visualType: 'grid'
  },
  {
    id: 6,
    title: "Core Attributes of an Infinite Canvas",
    content: [
      "1. Zettabyte-Scale Surface: Virtually limitless 2D space.",
      "2. Objects with Position & Scale: Location becomes meaning.",
      "3. A Place for Work: A persistent context-rich repository."
    ],
    visualType: 'grid'
  },
  {
    id: 12,
    title: "The Paradigm Shift Is Already Here",
    content: [
      "Figma: Collaborative interface design.",
      "Miro: Team brainstorming and workshops.",
      "Milanote: Creative research and moodboarding.",
      "Obsidian: Network of interconnected notes."
    ],
    visualType: 'apps'
  },
  {
    id: 14,
    title: "Changing How We Think",
    content: [
      "The most powerful tools don't just help us execute ideas.",
      "They change the very ideas we're able to have."
    ],
    visualType: 'quote'
  }
];