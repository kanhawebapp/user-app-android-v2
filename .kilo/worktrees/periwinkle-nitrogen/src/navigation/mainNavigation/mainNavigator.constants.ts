/**
 * MainNavigator Constants
 * Contains all static constants used in MainNavigator component
 */

// Default notification count shown in header
export const DEFAULT_NOTIFICATION_COUNT = 5;

// Gift modal offer amount
export const WELCOME_BONUS_AMOUNT = 100;

// Gift modal offer text
export const WELCOME_BONUS_TITLE = 'Welcome Bonus! 🎁';
export const WELCOME_BONUS_DESCRIPTION =
  'Get extra balance to start your astrology journey with us. Claim your welcome bonus now!';
export const CLAIM_BONUS_BUTTON_TEXT = 'Claim ₹100 Bonus';

// Default active tab
export const DEFAULT_ACTIVE_TAB: MainTabKey = 'home';

// Gift modal offer type
export const OFFER_TYPE_BONUS = 'bonus';

// Animation and timing constants (if needed in future)
export const MODAL_ANIMATION_DURATION = 300;
export const SIDEBAR_ANIMATION_DURATION = 250;

// Import type for MainTabKey
import type {MainTabKey} from './mainNavigator.types';
