# Sidebar Refactor TODO

## Completed: 0/18

- [ ] 1. Create folder structure: `hooks/`, `utils/`, `components/`
- [x] 2. Create `hooks/useSidebarAnimation.ts` ✅\n- [x] 3. Create `utils/getUserInitials.ts` ✅\n- [x] 4. Rename & enhance `helpers.ts` → `constants.ts` ✅\n- [x] 5. Rename & enhance `sidebarType.ts` → `types.ts` ✅
- [x] 6. Create atomic components: `components/SidebarOverlay.tsx`, `components/SidebarCloseButton.tsx` ✅
- [x] 7. Create `components/SidebarHeader.tsx`, `UserProfileSection.tsx`, `GuestSection.tsx` ✅
- [x] 8. Create `components/MenuItem.tsx` ✅
- [x] 9. Create `components/SidebarMenuList.tsx` ✅
- [x] 10. Create `components/SocialIcons.tsx`, `VersionInfo.tsx`, `LogoutButton.tsx` ✅
- [x] 11. Create `components/SidebarFooter.tsx` ✅
- [x] 12. Refactor main `Sidebar.tsx` (~100 lines, compose all) ✅
- [x] 13. Update `styles.ts` (extract sub-styles if needed) ✅
- [x] 14. Update `index.ts` (re-export everything) ✅
- [ ] 15. TypeScript check: `yarn tsc --noEmit`
- [ ] 16. Lint: `yarn lint src/components/Sidebar`
- [ ] 17. Test in app: Open sidebar in MainNavigator (auth/guest)
- [ ] 18. Mark all complete & attempt_completion

**Next Step**: Start with hooks/utils (pure logic extraction)

