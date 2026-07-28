# TODO

- [x] Wire MyFollowingScreen card press to navigate to AstrologerProfileScreen
  - [x] Update `src/navigation/mainNavigation/renderHelpers.tsx` to pass astrologer navigation handler to `MyFollowingScreen`
  - [x] Update `RenderSidebarScreenProps` and `renderSidebarScreen` signature to accept `onNavigateToAstrologerProfile`
  - [x] Update `src/navigation/mainNavigation/MainNavigator.tsx` to pass `handleNavigateToAstrologerProfile` into `renderSidebarScreen`
  - [ ] Verify TypeScript build/lint passes (tests currently fail due to Jest/react-native-vector-icons config, unrelated to this change)


