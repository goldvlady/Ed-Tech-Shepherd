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
        "50": "#EBF4FE",
        "100": "#BAD7FD",
        "200": "#7AA7FB",
        "300": "#4D8DF9",
        "400": "#207DF7",
        "500": "#072D5F",
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


const solidButton = defineStyle({
    fontWeight: '500',
    fontSize: '14px',
    lineHeight: '20px',
    background: colors.primary[400],
    borderRadius: "8px",
    color: '#fff',

    _hover: {
        background: '#0C67DD'
    },

    _disabled: {
        opacity: 1,
        color: '#C7C9CC',
        background: '#F1F1F1',
        pointerEvents: "none"
    }
});

const flatButton = defineStyle({
    fontWeight: '500',
    fontSize: '14px',
    lineHeight: '20px',
    background: '#F2F2F3',
    borderRadius: "8px",
    color: '#5C5F64',

    _hover: {
        background: '#F2F2F3',
        color: '#212224'
    },

    _disabled: {
        opacity: 1,
        color: '#C7C9CC',
        background: '#F2F2F3',
        pointerEvents: "none"
    }
});

const floatingButton = defineStyle({
    fontWeight: '500',
    fontSize: '14px',
    lineHeight: '20px',
    background: '#fff',
    borderRadius: "8px",
    color: '#5C5F64',
    border: '1px solid #E7E8E9',
    boxShadow: '0px 2px 6px rgba(136, 139, 143, 0.1)',

    _hover: {
        borderColor: '#DCDDDE',
        color: '#212224'
    },

    _disabled: {
        opacity: 1,
        color: '#C7C9CC',
        background: '#F2F2F3',
        pointerEvents: "none"
    }
});

const linkButton = defineStyle({
    fontSize: '14px',
    fontWeight: '500',
    lineHeight: '20px',
    color: colors.primary[400]
})

const inputField = defineStyle({
    addon: {
        background: 'none',
        position: 'relative',
        '&:before': {
            content: '""',
            display: 'block',
            position: 'absolute',
            left: '-1px',
            top: 0,
            bottom: 0,
            width: '1px',
            background: '#FFF',
        }
    },
    '.chakra-divider': {
        display: 'none'
    },
    field: {
        border: '1px solid #E4E6E7',
        boxShadow: '0px 2px 6px rgba(136, 139, 143, 0.1)',
        color: '#212224',
        borderRadius: '6px',
        padding: '14px 14px 14px 16px',
        minHeight: '48px',

        '::placeholder': {
            color: '#9A9DA2'
        },

        _hover: {
            border: '1px solid #DDDEDF',
        },

        _active: {
            border: `1.5px solid ${colors.primary[400]}`
        },

        _focus: {
            border: `1.5px solid ${colors.primary[400]}`
        },

        _invalid: {
            border: `1.5px solid #F53535`,
            boxShadow: '0 0 0 1px #F53535',
            ':after': {
                content: '"dsds"',

            }
        }
    }
})

const looneyCheckbox = defineStyle({
    control: {
        borderRadius: "100%"
    }
})

export const buttonTheme = defineStyleConfig({
    variants: { solid: solidButton, flat: flatButton, floating: floatingButton, link: linkButton },
})

export const textTheme = defineStyleConfig({
    variants: { muted: mutedText },
})

export const checkboxTheme = defineStyleConfig({
    variants: { looney: looneyCheckbox },
})

export const formLabelTheme = defineStyleConfig({
    baseStyle: defineStyle({
        color: '#5C5F64',
        fontSize: '14px',
        fontWeight: '500',
        lineHeight: '20px',
        letterSpacing: '-0.001em',
        marginInlineEnd: '0'
    }),
})

export const menuListTheme = defineStyle({
    baseStyle: defineStyle({
        list: {
            boxShadow: '0px 6px 16px rgba(10, 9, 11, 0.08), 0px 0px 0px 1px rgba(10, 9, 11, 0.05)',
            border: 'none',
            borderRadius: '8px',
            padding: '8px',
        },
        item: {
            borderRadius: '6px',
            background: '#FFF',
        }
    })
})

export const inputTheme = defineStyleConfig({
    variants: { outline: inputField },
})

export const modalTheme = defineStyleConfig({
    baseStyle: defineStyle({
        dialog: {
            overflow: 'hidden'
        },
        closeButton: {
            background: '#F3F5F6',
            borderRadius: '40px',
            width: 'auto',
            height: 'auto',
            color: '#969CA6',
            paddingInline: '8px',
            paddingBlock: '4px',
            fontSize: '9px',
            marginTop: '10px',
            ':before': {
                content: '"Close"',
                fontSize: '12px',
                fontWeight: '400',
                lineHeight: '15px',
                color: '#969CA6',
                marginRight: '4px'
            },
            ':hover': {
                color: '#000',
                ':before': {
                    color: '#000',
                }
            }
        },
        footer: {
            background: '#F7F7F8'
        },
        body: {
            fontWeight: 400,
            fontSize: '14px',
            lineHeight: '20px',
            display: 'flex',
            alignItems: 'center',
            color: '#585F68',
            padding: '24px',
            paddingBottom: '32px !important',

            '.modal-title': {
                color: '#212224',
                fontWeight: '500',
                fontSize: '16px',
                lineHeight: '21px',
                letterSpacing: '-0.012em',
                marginBottom: '8px'
            }
        }
    })
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
    components: { Button: buttonTheme, Text: textTheme, Checkbox: checkboxTheme, Alert: alertTheme, Input: inputTheme, FormLabel: formLabelTheme, Modal: modalTheme, Menu: menuListTheme },
    styles: {
        global: (props: any) => ({
            body: {
                bg: "#f5f5f5",
            }
        })
    },
})

export default theme;