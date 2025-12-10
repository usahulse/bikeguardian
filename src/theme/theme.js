export const colors = {
  background: '#111827',
  text: '#FFFFFF',
  primary: '#00FFFF', // Cyan
  danger: '#FF0000', // Neon Red
  success: '#00FF00', // Green
  muted: '#6B7280',
};

export const styles = {
  container: {
    flex: 1,
    backgroundColor: colors.background,
    color: colors.text,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: colors.primary,
  },
  button: {
      backgroundColor: colors.primary,
      padding: 10,
      borderRadius: 5,
  },
  buttonText: {
      color: colors.background,
      textAlign: 'center',
      fontWeight: 'bold',
  }
};
