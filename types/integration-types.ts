export interface IntegrationContentProps {
  item: {
    name: string;
    slug: string;
    type: string;
    image: string;
    content: string;
    isAvailable: boolean;
    component?: React.ReactNode;
  };
  onRemoveConnection?: (slug: string) => void;
}
