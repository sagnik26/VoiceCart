import { vars } from 'nativewind';

/**
 * VoiceCart semantic colors (RGB channels for NativeWind alpha support).
 * Brand coral is `primary` (CTAs / Talk). Do not use `destructive` for brand —
 * that token stays for true error states.
 */
export const colors = {
  light: {
    '--primary': '201 96 58',
    '--primary-foreground': '255 255 255',
    '--secondary': '240 237 232',
    '--secondary-foreground': '42 39 36',
    '--background': '250 249 246',
    '--foreground': '42 39 36',
    '--card': '255 255 255',
    '--card-foreground': '42 39 36',
    '--popover': '255 255 255',
    '--popover-foreground': '42 39 36',
    '--muted': '240 237 232',
    '--muted-foreground': '107 101 92',
    '--destructive': '196 64 48',
    '--destructive-foreground': '255 255 255',
    '--border': '201 195 184',
    '--input': '201 195 184',
    '--ring': '201 96 58',
    '--accent': '240 237 232',
    '--accent-foreground': '42 39 36',
    '--success': '29 158 117',
    '--success-foreground': '255 255 255',
    '--warning': '209 154 43',
    '--warning-foreground': '42 39 36',
  },
  dark: {
    '--primary': '201 96 58',
    '--primary-foreground': '255 255 255',
    '--secondary': '46 42 38',
    '--secondary-foreground': '250 249 246',
    '--background': '26 24 22',
    '--foreground': '250 249 246',
    '--card': '36 34 32',
    '--card-foreground': '250 249 246',
    '--popover': '36 34 32',
    '--popover-foreground': '250 249 246',
    '--muted': '46 42 38',
    '--muted-foreground': '168 162 152',
    '--destructive': '224 100 90',
    '--destructive-foreground': '255 255 255',
    '--border': '58 54 50',
    '--input': '58 54 50',
    '--ring': '201 96 58',
    '--accent': '46 42 38',
    '--accent-foreground': '250 249 246',
    '--success': '29 158 117',
    '--success-foreground': '255 255 255',
    '--warning': '209 154 43',
    '--warning-foreground': '26 24 22',
  },
};

export const config = {
  light: vars(colors.light),
  dark: vars(colors.dark),
};
