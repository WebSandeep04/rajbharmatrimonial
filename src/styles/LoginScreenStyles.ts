import { StyleSheet } from 'react-native';
import { colors } from '../theme/colors';
import { typography } from '../theme/typography';

export const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  safeArea: {
    flex: 1,
  },
  contentContainer: {
    flex: 1,
    padding: 32,
    justifyContent: 'space-between',
    paddingTop: 80,
  },
  header: {
    alignItems: 'center',
    marginTop: 20,
  },
  logoCircle: {
    width: 90,
    height: 90,
    borderRadius: 45,
    backgroundColor: colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 32,
    elevation: 8,
    shadowColor: colors.primary,
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.4,
    shadowRadius: 8,
    borderWidth: 2,
    borderColor: colors.secondary,
  },
  logoText: {
    color: colors.secondary,
    fontSize: 36,
    fontWeight: 'bold',
    fontFamily: 'serif',
  },
  subtitle: {
    ...typography.subtitle,
    textAlign: 'center',
    marginTop: 12,
    paddingHorizontal: 20,
  },
  actionContainer: {
    width: '100%',
    paddingBottom: 20,
  },
  googleButton: {
    backgroundColor: colors.surface,
    borderRadius: 16,
    paddingVertical: 14,
    paddingHorizontal: 20,
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    marginBottom: 40,
    borderWidth: 1,
    borderColor: colors.border,
  },
  buttonDisabled: {
    opacity: 0.7,
  },
  buttonContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  gIconContainer: {
    marginRight: 12,
  },
  gText: {
    color: '#DB4437',
    fontSize: 22,
    fontWeight: 'bold',
  },
  buttonText: {
    color: colors.textDark,
    fontSize: 16,
    fontWeight: '600',
    letterSpacing: 0.5,
  },
  footer: {
    alignItems: 'center',
  },
  linksRow: {
    flexDirection: 'row',
    marginTop: 4,
  },
  footerText: {
    color: colors.textLight,
    fontSize: 13,
  },
  linkText: {
    color: colors.primary,
    fontSize: 13,
    fontWeight: '600',
  },
});
