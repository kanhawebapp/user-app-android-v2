/**
 * Animation constants for DailyPuja feature
 * Centralized timing values for temple door and content animations
 */

export const ANIMATION_DURATION = {
  /** Duration for door opening animation in milliseconds */
  DOOR_OPEN: 10000,

  /** Duration for door glow effect (0.8x of door open duration) */
  DOOR_GLOW: 12000,

  /** Delay before starting door open animation */
  DOOR_OPEN_DELAY: 5000,

  /** Delay before showing temple content after door starts opening */
  CONTENT_SHOW_DELAY: 12000,

  /** Total time from mount to content show = DOOR_OPEN_DELAY + CONTENT_SHOW_DELAY */
  TOTAL_DELAY: 17000,

  /** Duration for zoom animation when switching gods */
  ZOOM_ANIMATION_DURATION: 800,

  /** Duration for fade animation when switching gods */
  FADE_ANIMATION_DURATION: 600,

  // ===========================================
  // TempleBackground Animation Timings
  // ===========================================

  /** Duration for background image zoom animation */
  BACKGROUND_ZOOM_DURATION: 1200,

  /** Duration for background image fade animation */
  BACKGROUND_FADE_DURATION: 600,

  /** Duration for lord image zoom animation */
  LORD_ZOOM_DURATION: 10,

  /** Duration for lord image fade animation */
  LORD_FADE_DURATION: 8,

  /** Delay before starting lord image animation (for layered depth effect) */
  LORD_ANIMATION_DELAY: 10,
} as const;

export default ANIMATION_DURATION;
