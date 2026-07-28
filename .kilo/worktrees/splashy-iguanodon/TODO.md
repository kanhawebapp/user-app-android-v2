# TODO

- [x] Wire MyFollowingScreen card press to navigate to AstrologerProfileScreen
  - [x] Update `src/navigation/mainNavigation/renderHelpers.tsx` to pass astrologer navigation handler to `MyFollowingScreen`
  - [x] Update `RenderSidebarScreenProps` and `renderSidebarScreen` signature to accept `onNavigateToAstrologerProfile`
  - [x] Update `src/navigation/mainNavigation/MainNavigator.tsx` to pass `handleNavigateToAstrologerProfile` into `renderSidebarScreen`
  - [ ] Verify TypeScript build/lint passes (tests currently fail due to Jest/react-native-vector-icons config, unrelated to this change)

- [x] Create MyBookingScreen and navigate to it from RemediesScreen
  - [x] Add `src/screens/main/MyBookingScreen.tsx`
  - [x] Add tab key `myBookings` in `src/navigation/mainNavigation/mainNavigator.types.ts`
  - [x] Render `MyBookingScreen` in `src/navigation/mainNavigation/renderHelpers.tsx`
  - [x] Update RemediesScreen prop destructuring to include `onNavigateToLogin` / `onNavigateToSignup` (for compatibility)
  - [x] Pass `onNavigateToMyBookings` from RemediesScreen to navigate to `myBookings`

