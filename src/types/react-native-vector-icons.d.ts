declare module 'react-native-vector-icons/Ionicons' {
  import { Component } from 'react';
  import { Icon } from 'react-native-vector-icons';
  export default Icon;
}

declare module 'react-native-vector-icons' {
  import { TextStyle, ViewStyle } from 'react-native';

  export interface IconProps {
    name: string;
    size?: number;
    color?: string;
    style?: TextStyle | ViewStyle;
  }

  export class Icon extends Component<IconProps> {
    static getImageSource(
      name: string,
      size?: number,
      color?: string
    ): Promise<any>;
  }
} 