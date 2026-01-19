import * as icons from 'lucide-react-native'; // Changed from /icons for better tree-shaking support

interface IconProps {
  name: keyof typeof icons;
  color?: string;
  size?: number;
  strokeWidth?: number; // Added for more control
}

const Icon = ({ name, color, size = 24, strokeWidth = 2 }: IconProps) => {
  // Use the name to get the component from the icons object
  const LucideIcon = icons[name] as React.FC<any>;

  if (!LucideIcon) {
    console.warn(`Icon "${name}" does not exist in lucide-react-native`);
    return null;
  }

  return <LucideIcon color={color} size={size} strokeWidth={strokeWidth} />;
};

export default Icon;