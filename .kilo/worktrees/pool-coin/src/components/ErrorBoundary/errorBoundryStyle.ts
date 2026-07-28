import { StyleSheet } from "react-native";
import { typography } from "../../theme";


  export const errorBoundryStyle = StyleSheet.create({
    container: {
      flex: 1,
      justifyContent: typography.justify.center,
      alignItems: typography.align.center,
      padding: typography.padding['3xl'],
    },
    iconContainer: {
      marginBottom: typography.margin['3xl'],
    },
    icon: {
      fontSize: 64,
    },
    title: {
      marginBottom: typography.margin.md,
      textAlign: typography.textAlign.center,
    },
    message: {
      textAlign: typography.textAlign.center,
      marginBottom: typography.margin['3xl'],
    },
    errorContainer: {
      width: typography.width.full,
      borderWidth: typography.borderWidth.thin,
      marginBottom: typography.margin['3xl'],
    },
    errorTitle: {
      marginBottom: typography.margin.md,
    },
    errorText: {
      fontFamily: 'monospace',
    },
    buttonContainer: {
      width: typography.width.full,
      marginBottom: typography.margin.xl,
    },
    supportText: {
      textAlign: typography.textAlign.center,
    },
  });