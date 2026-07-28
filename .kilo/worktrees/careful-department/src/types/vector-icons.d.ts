/**
 * Type declarations for react-native-vector-icons
 */

declare module 'react-native-vector-icons/MaterialIcons' {
  import { Component } from 'react';
  import { ImageProps } from 'react-native';

  interface MaterialIconsProps extends ImageProps {
    name: string;
    size?: number;
    color?: string;
  }

  export default class MaterialIcons extends Component<MaterialIconsProps> {}
}

declare module 'react-native-vector-icons/Ionicons' {
  import { Component } from 'react';
  import { ImageProps } from 'react-native';

  interface IoniconsProps extends ImageProps {
    name: string;
    size?: number;
    color?: string;
  }

  export default class Ionicons extends Component<IoniconsProps> {}
}

declare module 'react-native-vector-icons/FontAwesome' {
  import { Component } from 'react';
  import { ImageProps } from 'react-native';

  interface FontAwesomeProps extends ImageProps {
    name: string;
    size?: number;
    color?: string;
  }

  export default class FontAwesome extends Component<FontAwesomeProps> {}
}

declare module 'react-native-vector-icons/MaterialCommunityIcons' {
  import { Component } from 'react';
  import { ImageProps } from 'react-native';

  interface MaterialCommunityIconsProps extends ImageProps {
    name: string;
    size?: number;
    color?: string;
  }

  export default class MaterialCommunityIcons extends Component<MaterialCommunityIconsProps> {}
}

declare module 'react-native-vector-icons/Feather' {
  import { Component } from 'react';
  import { ImageProps } from 'react-native';

  interface FeatherProps extends ImageProps {
    name: string;
    size?: number;
    color?: string;
  }

  export default class Feather extends Component<FeatherProps> {}
}

declare module 'react-native-vector-icons/AntDesign' {
  import { Component } from 'react';
  import { ImageProps } from 'react-native';

  interface AntDesignProps extends ImageProps {
    name: string;
    size?: number;
    color?: string;
  }

  export default class AntDesign extends Component<AntDesignProps> {}
}

