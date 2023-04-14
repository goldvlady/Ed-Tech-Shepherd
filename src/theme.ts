import { createMultiStyleConfigHelpers, defineStyle, defineStyleConfig, extendTheme, theme as defaultTheme } from '@chakra-ui/react';

import { alertAnatomy } from '@chakra-ui/anatomy';
const { definePartsStyle: defineAlertPartsStyle, defineMultiStyleConfig: defineAlertMultiStyleConfig } = createMultiStyleConfigHelpers(alertAnatomy.keys)

const borderRadius = {
    radii: {
        none: '0',
        sm: '0.125rem',
        base: '0.25rem',
        md: '12px',
        lg: '0.5rem',
        xl: '0.75rem',
        '2xl': '1rem',
        '3xl': '1.5rem',
        full: '9999px',
    },
}

const colors = {
    primary:
    {
        "50": "#E5F9FF",
        "100": "#B8EEFF",
        "200": "#8AE3FF",
        "300": "#5CD8FF",
        "400": "#2ECDFF",
        "500": "#00C2FF",
        "600": "#009BCC",
        "700": "#007499",
        "800": "#004E66",
        "900": "#002733"
    },
    secondary:
    {
        50: '#e1f5ff',
        100: '#bde1f3',
        200: '#96cfe8',
        300: '#70b4de',
        400: '#4a96d4',
        500: '#3275ba',
        600: '#245391',
        700: '#173569',
        800: '#071941',
        900: '#00051a',
    }
}

const mutedText = defineStyle({
    color: "#696969",
    fontSize: "var(--chakra-fontSizes-xs)"
})

const getLooneyButtonStyle = (textColor: string, backgroundColor: string, boxShadowColor: string) => {
    return {
        fontWeight: 'semibold',
        background: "none !important",
        paddingBottom: "3px",
        position: "relative",
        transition: "all 0s",
        color: textColor,

        _before: {
            content: '""',
            left: 0,
            position: "absolute",
            right: 0,
            top: 0,
            bottom: 0,
            zIndex: -2,
            borderRadius: "12px",
            background: backgroundColor,
            boxShadow: `inset 0px -4px 0px 0px ${boxShadowColor}`,
        },

        _active: {
            boxShadow: "none",
            paddingBottom: "0",
            transform: `translateY(4px) translateZ(0)`,
            _before: {
                boxShadow: "none"
            }
        }
    }
}

const looneyButton = defineStyle({
    ...getLooneyButtonStyle('#FFF', colors.primary[500], colors.primary[700]),
});

const looneyGhostButton = defineStyle({
    ...getLooneyButtonStyle('#000', defaultTheme.colors.gray[50], defaultTheme.colors.gray[200]),
});

const looneyCheckbox = defineStyle({
    control: {
        borderRadius: "100%"
    }
})


export const buttonTheme = defineStyleConfig({
    variants: { looney: looneyButton, looneyGhost: looneyGhostButton },
})

export const textTheme = defineStyleConfig({
    variants: { muted: mutedText },
})

export const checkboxTheme = defineStyleConfig({
    variants: { looney: looneyCheckbox },
})

const alertTheme = defineAlertMultiStyleConfig({
    baseStyle: defineAlertPartsStyle({
        container: {
            borderRadius: borderRadius.radii.md
        }
    })
})


const theme = extendTheme({
    colors,
    ...borderRadius,
    components: { Button: buttonTheme, Text: textTheme, Checkbox: checkboxTheme, Alert: alertTheme },
    styles: {
        global: (props: any) => ({
            body: {
                bg: "#f5f5f5",
                //backgroundImage: 'url(https://www.transparenttextures.com/patterns/notebook-dark.png)'
                //bg: "#eef1f7"
            }
        })
    },
})

export default theme;