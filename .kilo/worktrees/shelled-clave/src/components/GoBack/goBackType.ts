// /**
//  * GoBack Component Types
//  */

// export interface GoBackProps {
//   /** Called when back button is pressed */
//   onBack?: () => void;

//   /** Optional title shown next to back button */
//   title?: string;

//   /** Optional subtitle shown below the title */
//   subtitle?: string;

//   /** Custom component rendered on the right side of the header */
//   rightComponent?: React.ReactNode;
// }

import React from 'react';

export interface GoBackProps {
  onBack?: () => void;
  title?: string;
  subtitle?: string;
  rightComponent?: React.ReactNode;

  /**
   * Title alignment
   * Default: center
   */
  titleAlign?: 'left' | 'center' | 'right';
}