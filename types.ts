export type Category = 
  | "ALL" 
  | "Interior" 
  | "Exhibition" 
  | "Pavilion" 
  | "Furniture" 
  | "Concept Works" 
  | "Designer Profile";

export interface Project {
  id: number;
  title: string;
  category: Category;
  image: string;
  description?: string;
}

export interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
}
