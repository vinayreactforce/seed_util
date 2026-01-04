import fontFamily from './fontFamily';
import { moderateScale } from './responsiveSize';

export const lightTheme = {
  colors: {
    primaryBrand: '#009EDB',
    brandHover: '#007BB4',

    // States & Interaction
    disabled: '#919191', // Text/Icon color for disabled state
    disabledBackground: '#F3F3F3', // --slds-g-color-neutral-base-95 (Input fill)
    disabledBorder: '#D8D8D8',

    // Semantic Feedback
    success: '#2E844A',
    error: '#EA001E',
    warning: '#FE9339',
    info: '#0176D3',

    // Text & Typography
    primaryText: '#181818',
    heading: '#080808',
    labelText: '#444444',
    valueText: '#181818',
    placeholder: '#747474', // --slds-g-color-text-placeholder-base-1

    // Surfaces & Layout
    appBackground: '#F3F3F3',
    surface: '#FFFFFF',
    border: '#D8D8D8', // --slds-g-color-border-base-3

    typography: '#000000',
    background: '#ffffff',
    barStyle: 'dark-content',
    opacity50: 'rgba(1,1,1,0.5)',
    textInputColor: 'rgba(217, 217, 217,0.2)',
    darkwhite: '#000000',
    primary: 'rgba(16, 16, 20, 1)',
    inverse: 'rgba(255, 255, 255, 1)',
    gradient1: 'rgba(255, 190, 190, 1)',
    gradient2: 'rgba(255, 255, 255, 1)',
    grey25: 'rgba(247, 247, 247, 1)',
    grey50: 'rgba(229, 229, 229, 1)',
    grey100: 'rgba(204, 204, 204, 1)',
    grey200: 'rgba(178, 178, 178, 1)',
    grey300: 'rgba(153, 153, 153, 1)',
    gery350: 'rgba(127, 127, 127, 1)',
    grey400: 'rgba(102, 102, 102, 1)',
    grey450: 'rgba(76, 76, 76, 1)',
    grey500: 'rgba(51, 51, 51, 1)',
    red400: 'rgba(204, 1, 1, 1)',
    red300: 'rgba(237, 48, 45, 1)',
    red200: 'rgba(255, 119, 119, 1)',
    red150: 'rgba(124, 0, 2, 1)',
    red100: 'rgba(255, 224, 224, 1)',
    amber500: 'rgba(234, 187, 11, 1)',
    amber300: 'rgba(221, 119, 11, 1)',
    amber100: 'rgba(255, 238, 195, 1)',
    blue300: 'rgba(39, 130, 249, 1)',
    blue100: 'rgba(227, 244, 255, 1)',
    green300: 'rgba(35, 155, 35, 1)',
    green100: 'rgba(210, 248, 190, 1)',
    success100: 'rgba(35, 155, 35, 1)',
    success10: 'rgba(210, 248, 190, 1)',
    info100: 'rgba(39, 130, 217, 1)',
    info10: 'rgba(227, 244, 255, 1)',
    error100: 'rgba(237, 48, 45, 1)',
    error10: 'rgba(255, 224, 224, 1)',
    warning100: 'rgba(221, 119, 11, 1)',
    warning10: 'rgba(255, 238, 195, 1)',
    sucess10: 'rgba(210, 248, 190, 1)',
    white: 'rgba(255, 255, 255, 1)',
    green200: ' rgba(124, 200, 119, 1)',
    neutral: 'rgba(255, 255, 255, 0.9)',
    modalBackground: 'rgba(229, 229, 229, 0.75)',
    masking: 'rgba(16, 16, 20, 0.6)',
    sheetHandler: '#E5E5E5',
    orderText: '#ED302D',
    vehicleCardBackground: '#F5F5F5',
    gradient3: '#E5E5E5',
    gradient4: '#FFFFFF',
    labourText: '#4C4C4C',
    pending: '#DD770B',
    black: '#000000',
    preInvoiceText: '#2782F9',
    preInvoiceBackground: '#E3F4FF',
  },
  typography: {
    large: {
      fontSize: moderateScale(16),
      lineHeight: moderateScale(20),
    },
    medium: {
      fontSize: moderateScale(14),
      lineHeight: moderateScale(20),
    },
    small: {
      fontSize: moderateScale(11),
      lineHeight: moderateScale(16),
    },
    xSmall: {
      fontSize: moderateScale(13),
      lineHeight: moderateScale(16),
    },
    bodyLarge: {
      fontSize: moderateScale(20),
      lineHeight: moderateScale(24),
    },
    bodyMedium: {
      fontSize: moderateScale(16),
      lineHeight: moderateScale(20),
    },
    bodySmall: {
      fontSize: moderateScale(12),
      lineHeight: moderateScale(16),
    },
    bodyXSmall: {
      fontSize: moderateScale(11),
      lineHeight: moderateScale(14),
    },
    bodyXXSmall: {
      fontSize: moderateScale(10),
      lineHeight: moderateScale(14),
    },
    titleLarge: {
      fontSize: moderateScale(22),
      lineHeight: moderateScale(28),
    },
    titleMedium: {
      fontSize: moderateScale(16),
      lineHeight: moderateScale(24),
    },
    titleSmall: {
      fontSize: moderateScale(14),
      lineHeight: moderateScale(20),
    },
    headlineLarge: {
      fontSize: moderateScale(32),
      lineHeight: moderateScale(40),
    },
    headlineMedium: {
      fontSize: moderateScale(28),
      lineHeight: moderateScale(36),
    },
    headlineSmall: {
      fontSize: moderateScale(24),
      lineHeight: moderateScale(32),
    },
    xssmall: {
      fontSize: moderateScale(10),
      lineHeight: moderateScale(14),
    },
  },
  spacing: {
    sm: moderateScale(4),
    md: moderateScale(8),
    lg: moderateScale(16),
    xl: moderateScale(24),
    hero: moderateScale(64),
  },
  roundBorder: {
    xSmall: moderateScale(2),
    small: moderateScale(4),
    medium: moderateScale(8),
    large: moderateScale(12),
    xLarge: moderateScale(20),
  },
  fontFamily,
} as const;

export const darkTheme = {
  colors: {
    primaryBrand: '#1B96FF',
    brandHover: '#70B9FF',

    // States & Interaction
    disabled: '#8B949E', // --slds-g-color-neutral-base-50
    disabledBackground: '#0D1117', // Darker than surface to look "sunken"
    disabledBorder: '#21262D',

    // Semantic Feedback
    success: '#4BCA81',
    error: '#FF5D59',
    warning: '#E2B104',
    info: '#70B9FF',

    // Text & Typography
    primaryText: '#E6EDF3',
    heading: '#FFFFFF',
    labelText: '#8B949E',
    valueText: '#F0F6FC',
    placeholder: '#484F58', // Muted so it doesn't look like an entered value

    // Surfaces & Layout
    appBackground: '#010409',
    surface: '#161B22', // --slds-g-color-neutral-base-10
    border: '#30363D', // --slds-g-color-border-base-3
    typography: '#ffffff',
    background: '#000000',
    barStyle: 'light-content',
    opacity50: 'rgba(201, 201, 201,0.5)',
    textInputColor: '#000000',
    darkwhite: '#ffffff',
    primary: 'rgba(255, 255, 255, 1)',
    inverse: 'rgba(16, 16, 20, 1)',
    gradient1: 'rgba(124, 0, 2, 1)',
    gradient2: 'rgba(16, 16, 20, 1)',
    grey25: 'rgba(39, 39, 43, 1)',
    grey50: 'rgba(63, 63, 66, 1)',
    grey100: 'rgba(111, 111, 114, 1)',
    grey200: 'rgba(135, 135, 137, 1)',
    grey300: 'rgba(159, 159, 161, 1)',
    gery350: 'rgba(183, 183, 184, 1)',
    grey400: 'rgba(207, 207, 208, 1)',
    grey450: 'rgba(231, 231, 231, 1)',
    grey500: 'rgba(231, 231, 231, 1)',
    greyrou500: 'rgba(247, 247, 247, 1)',
    red400: 'rgba(202, 44, 44, 1)',
    red300: 'rgba(250, 79, 76, 1)',
    red200: 'rgba(255, 62, 91, 1)',
    red150: 'rgba(124, 0, 2, 1)',
    red100: 'rgba(63, 41, 45, 1)',
    amber500: 'rgba(234, 187, 11, 1)',
    amber300: 'rgba(255, 193, 101, 1)',

    amber100: 'rgba(79, 53, 32, 1)',
    blue300: 'rgba(165, 216, 255, 1)',
    blue100: 'rgba(13, 59, 102, 1)',
    green300: 'rgba(132, 239, 136, 1)',
    green100: 'rgba(13, 75, 39, 1)',
    green200: 'rgba(27, 144, 76, 1)',
    success100: 'rgba(132, 239, 136, 1)',
    success10: 'rgba(13, 75, 39, 1)',
    info100: 'rgba(165, 216, 255, 1)',
    info10: 'rgba(39, 130, 217, 1)',
    error100: 'rgba(250, 79, 76, 1)',
    error10: 'rgba(63, 41, 45, 1)',
    warning100: 'rgba(255, 193, 101, 1)',
    warning10: 'rgba(79, 53, 32, 1)',
    sucess10: 'rgba(13, 75, 39, 1)',
    white: 'rgba(255, 255, 255, 1)',
    neutral: 'rgba(16, 16, 20, 0.9)',
    modalBackground: 'rgba(63, 63, 66, 0.75)',
    masking: 'rgba(16, 16, 20, 0.6)',
    sheetHandler: '#3F3F42',
    orderText: '#FA4F4C',
    vehicleCardBackground: '#27272B',
    gradient3: '#3F3F42',
    gradient4: '#101014',
    labourText: '#E7E7E7',
    pending: '#FFC165',
    black: '#000000',
    preInvoiceText: '#A5D8FF',
    preInvoiceBackground: '#0D3B66',
  },
  typography: {
    large: {
      fontSize: moderateScale(16),
      lineHeight: moderateScale(20),
    },
    medium: {
      fontSize: moderateScale(14),
      lineHeight: moderateScale(20),
    },
    small: {
      fontSize: moderateScale(11),
      lineHeight: moderateScale(16),
    },
    xSmall: {
      fontSize: moderateScale(13),
      lineHeight: moderateScale(16),
    },
    bodyLarge: {
      fontSize: moderateScale(20),
      lineHeight: moderateScale(24),
    },
    bodyMedium: {
      fontSize: moderateScale(16),
      lineHeight: moderateScale(20),
    },
    bodySmall: {
      fontSize: moderateScale(12),
      lineHeight: moderateScale(16),
    },
    bodyXSmall: {
      fontSize: moderateScale(11),
      lineHeight: moderateScale(14),
    },
    bodyXXSmall: {
      fontSize: moderateScale(10),
      lineHeight: moderateScale(14),
    },
    titleLarge: {
      fontSize: moderateScale(22),
      lineHeight: moderateScale(28),
    },
    titleMedium: {
      fontSize: moderateScale(16),
      lineHeight: moderateScale(24),
    },
    titleSmall: {
      fontSize: moderateScale(14),
      lineHeight: moderateScale(20),
    },
    headlineLarge: {
      fontSize: moderateScale(32),
      lineHeight: moderateScale(40),
    },
    headlineMedium: {
      fontSize: moderateScale(28),
      lineHeight: moderateScale(36),
    },
    headlineSmall: {
      fontSize: moderateScale(24),
      lineHeight: moderateScale(32),
    },
    xssmall: {
      fontSize: moderateScale(10),
      lineHeight: moderateScale(14),
    },
  },
  spacing: {
    sm: moderateScale(4),
    md: moderateScale(8),
    lg: moderateScale(16),
    xl: moderateScale(24),
    hero: moderateScale(64),
  },
  roundBorder: {
    xSmall: moderateScale(2),
    small: moderateScale(4),
    medium: moderateScale(8),
    large: moderateScale(12),
    xLarge: moderateScale(20),
  },
  fontFamily,
} as const;
