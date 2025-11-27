import { Category, Project } from "./types";

export const CATEGORIES: Category[] = [
  "ALL",
  "Interior",
  "Exhibition",
  "Pavilion",
  "Furniture",
  "Concept Works",
  "Designer Profile"
];

export const INITIAL_PROJECTS: Project[] = [
  { 
    id: 1, 
    title: "Minimalist Loft", 
    category: "Interior", 
    image: "https://picsum.photos/800/600?random=1",
    description: "A serene living space focusing on open lighting and natural materials."
  },
  { 
    id: 2, 
    title: "Future Tech Expo", 
    category: "Exhibition", 
    image: "https://picsum.photos/800/600?random=2",
    description: "Interactive display systems integrated into a fluid spatial design."
  },
  { 
    id: 3, 
    title: "Bamboo Pavilion", 
    category: "Pavilion", 
    image: "https://picsum.photos/800/600?random=3",
    description: "Sustainable structure study utilizing organic bamboo weaving techniques."
  },
  { 
    id: 4, 
    title: "Ergo Chair V1", 
    category: "Furniture", 
    image: "https://picsum.photos/800/600?random=4",
    description: "Ergonomic study focused on lumbar support and minimal aesthetic."
  },
  { 
    id: 5, 
    title: "Floating City", 
    category: "Concept Works", 
    image: "https://picsum.photos/800/600?random=5",
    description: "Urban planning concept for rising sea levels."
  },
];
