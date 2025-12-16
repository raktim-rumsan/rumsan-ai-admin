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
  isAdminPanel: boolean;
  onRemoveConnection?: (slug: string) => void;
}
