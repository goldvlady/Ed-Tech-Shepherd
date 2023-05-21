import React, { ReactNode } from 'react';
import { Outlet } from "react-router-dom"
import {
    IconButton,
    Avatar,
    Button,
    Box,
    CloseButton,
    Flex,
    HStack,
    VStack,
    Icon,
    useColorModeValue,
    Link,
    Drawer,
    DrawerContent,
    Text,
    useDisclosure,
    BoxProps,
    FlexProps,
    Menu,
    MenuButton,
    MenuDivider,
    MenuItem,
    MenuList,
    Divider,
} from '@chakra-ui/react';
import {
    FiHome,
    FiTrendingUp,
    FiCompass,
    FiStar,
    FiSettings,
    FiMenu,
    FiBell,
    FiChevronDown,
    FiBriefcase,
    FiBarChart2,
} from 'react-icons/fi';
import { BsChatLeftDots, BsPlayCircle, BsPin } from 'react-icons/bs';
import { CgNotes } from 'react-icons/cg';
import { TbCards } from 'react-icons/tb';
import { IconType } from 'react-icons';
import Logo from "../../../public/images/logo-blue.png"
import DashboardIndex from "./index"
import TutorMarketplace from "./Tutor"

interface LinkItemProps {
    name: string;
    icon: IconType;
    path: string;
}
const LinkItems: Array<LinkItemProps> = [
    { name: 'Home', icon: FiHome, path: "/dashboard" },
    { name: 'Performance', icon: FiBarChart2, path: "/performance" },
    { name: 'Chat', icon: BsChatLeftDots, path: "/chat" },

];

const LinkBItems: Array<LinkItemProps> = [
    { name: 'Library', icon: BsPlayCircle, path: "/library" },
    { name: 'Notes', icon: CgNotes, path: "/notes" },
    { name: 'Flashcards', icon: TbCards, path: "/flashcards" },
];


export default function DashboardLayout({
    children,
}: {
    children: ReactNode;
}) {
    const { isOpen, onOpen, onClose } = useDisclosure();

    return (
        <Box minH="100vh" bg={useColorModeValue('gray.100', 'gray.900')}>
            <SidebarContent
                onClose={() => onClose}
                display={{ base: 'none', md: 'block' }}
            />
            <Drawer
                autoFocus={false}
                isOpen={isOpen}
                placement="left"
                onClose={onClose}
                returnFocusOnClose={false}
                onOverlayClick={onClose}
                size="full">
                <DrawerContent>
                    <SidebarContent onClose={onClose} />
                </DrawerContent>
            </Drawer>
            {/* mobilenav */}
            <MobileNav onOpen={onOpen} />
            <Box ml={{ base: 0, md: 60 }}>
                <Outlet />
            </Box>
        </Box>
    );
}

interface SidebarProps extends BoxProps {
    onClose: () => void;
}

export const CustomButton = (props: any) => {
    const { buttonText, fontStyle, buttonType, onClick, padding } = props
    return (
        <Box
            as='button'
            height='38px'
            lineHeight='1.2'
            transition='all 0.2s cubic-bezier(.08,.52,.52,1)'
            border='1px'
            padding={padding ? padding : "9px 20px"}
            mx='4px'
            alignItems='center'
            borderRadius='8px'
            fontSize={fontStyle ? fontStyle.fontSize : "14px"}
            fontWeight={fontStyle ? fontStyle.fontWeight : "semibold"}

            bg={buttonType === "outlined" ? "transparent" : "#207DF7"}
            borderColor={buttonType === "outlined" ? "transparent" : '#ccd0d5'}
            color={buttonType === "outlined" ? "#207DF7" : "#fff"}
            _hover={{ bg: buttonType === "outlined" ? "#E2E8F0" : '#1964c5' }}
            _active={{
                bg: '#dddfe2',
                transform: 'scale(0.98)',
                borderColor: '#bec3c9',
            }}
            _focus={{
                boxShadow:
                    '0 0 1px 2px rgba(88, 144, 255, .75), 0 1px 1px rgba(0, 0, 0, .15)',
            }}
            onClick={onClick}
        >
            {buttonText}
        </Box >)
}

const SidebarContent = ({ onClose, ...rest }: SidebarProps) => {
    return (
        <Box
            transition="3s ease"
            bg={useColorModeValue('white', 'gray.900')}
            borderRight="1px"
            borderRightColor={useColorModeValue('gray.200', 'gray.700')}
            w={{ base: 'full', md: 60 }}
            pos="fixed"
            h="full"
            {...rest}>
            <Flex h="20" alignItems="center" mx="8" justifyContent="space-between">
                <Text fontSize="2xl" fontFamily="monospace" fontWeight="bold">

                    <svg width="115" height="47" viewBox="0 0 115 47" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <g clip-path="url(#clip0_454_6347)">
                            <path d="M8.01014 24.8371C8.80929 26.4475 8.40367 27.8453 6.79327 29.0303C7.63274 29.4341 8.58001 29.5561 9.49427 29.378C9.89516 29.3149 10.2787 29.1696 10.6208 28.9511C10.9629 28.7327 11.2563 28.4458 11.4823 28.1085C12.2267 26.9971 11.9605 25.7087 10.684 24.2434C10.3119 23.8308 9.90292 23.4531 9.46222 23.1149C9.05361 22.7935 8.62608 22.497 8.18192 22.227C7.79621 21.9978 7.3191 21.7236 6.75058 21.4046C6.18206 21.0855 5.73161 20.8179 5.39923 20.6017C1.43849 17.9665 -0.343223 14.6567 0.0540886 10.6724C0.525407 6.33301 2.93453 3.22774 7.28145 1.35654C9.87772 0.263168 12.2568 0.725663 14.4186 2.74403C16.4677 4.66781 17.1238 6.84934 16.387 9.28862C15.8423 11.1176 14.627 12.2344 12.7411 12.639C12.1245 12.7986 11.4787 12.8082 10.8576 12.6671C10.285 12.5431 9.75076 12.2827 9.30019 11.9079C8.88378 11.5673 8.5802 11.1085 8.42941 10.5919C8.30649 10.2652 8.26509 9.91348 8.3088 9.56719C8.35252 9.2209 8.48003 8.89052 8.68026 8.60474C9.08529 8.02877 9.84394 7.50122 10.9562 7.02208C10.4699 6.22476 9.72413 6.07822 8.71891 6.58247C7.37868 7.25594 6.4341 8.16625 5.88518 9.31341C5.33962 10.403 5.2484 11.6647 5.63156 12.8216C6.0118 14.0133 6.81374 15.029 8.03738 15.8687C8.40705 16.1176 8.89654 16.4344 9.50585 16.819C10.1151 17.2049 10.6401 17.5274 11.0809 17.7866C11.5802 18.0862 12.0626 18.4131 12.526 18.7657C13.0479 19.1585 13.5171 19.5469 13.9338 19.9311C15.713 21.5626 16.7942 23.4023 17.1773 25.4502C17.3766 26.4135 17.3824 27.407 17.1942 28.3726C17.0061 29.3382 16.6278 30.2566 16.0814 31.0744C15.1207 32.5193 13.6922 33.5928 11.7959 34.295C9.89916 34.9974 8.09527 35.1416 6.38421 34.7278C4.87373 34.3731 3.51752 33.541 2.51646 32.3547C1.49887 31.1447 0.878602 29.6503 0.74011 28.0748C0.630574 27.2976 0.688716 26.5059 0.910625 25.7531C1.48889 23.9213 2.63713 22.9415 4.35535 22.8136C6.07325 22.6859 7.29151 23.3604 8.01014 24.8371Z" fill="#207DF7" />
                            <path d="M33.1554 28.2024C33.2669 28.5677 33.4147 29.0746 33.5989 29.723C33.7827 30.3714 33.9097 30.8306 33.9798 31.1006C34.175 31.6735 34.1555 32.2979 33.9248 32.8575C33.8121 33.098 33.6479 33.3107 33.4438 33.4805C33.2398 33.6504 33.0009 33.7732 32.7441 33.8404C32.4942 33.9239 32.2288 33.95 31.9675 33.9168C31.7061 33.8836 31.4556 33.792 31.2345 33.6486C30.7355 33.3152 30.3831 32.8031 30.2498 32.2176C30.0883 31.7063 29.6028 29.8531 28.7934 26.6579C28.5541 25.6734 28.3183 25.0209 28.086 24.7004C27.9764 24.6919 27.8668 24.7168 27.7716 24.7717C27.6169 24.9371 27.499 25.1334 27.4256 25.3477C26.0653 27.4335 25.1588 29.7825 24.765 32.2419C24.5392 33.6621 23.8785 34.3861 22.7828 34.4138C22.5306 34.4436 22.275 34.4158 22.0352 34.3324C21.7954 34.249 21.5776 34.1122 21.3982 33.9324C21.032 33.4816 20.7739 32.9528 20.6437 32.3866C20.1928 30.8994 19.7819 29.2259 19.4112 27.366C19.0398 25.5066 18.7409 23.8146 18.5144 22.2899C18.2877 20.7656 18.0055 19.0582 17.6679 17.1675C17.5648 16.6984 17.4121 16.0066 17.2097 15.0919C17.0073 14.1784 16.8939 13.6466 16.8694 13.4964C16.7175 12.9091 16.7778 12.2869 17.0396 11.7397C17.1667 11.5029 17.3493 11.3004 17.5718 11.1498C17.7942 10.9992 18.0499 10.9049 18.3168 10.875C18.5629 10.8179 18.8185 10.8152 19.0658 10.8672C19.313 10.9192 19.5459 11.0247 19.7482 11.1761C20.2087 11.5276 20.5247 12.0356 20.6369 12.6042C21.1735 14.769 21.8559 18.4334 22.6841 23.5974L22.9251 25.0559C23.0704 24.853 23.245 24.5935 23.4488 24.2774C23.6522 23.9626 23.8144 23.7052 23.9354 23.5055C24.0562 23.3069 24.2048 23.0838 24.3812 22.8362C24.5578 22.5899 24.721 22.3772 24.8707 22.1982C25.993 20.7834 27.2005 20.1545 28.4932 20.3116C29.7858 20.4694 30.8336 21.3523 31.6368 22.9604C31.9044 23.4722 32.1216 24.0088 32.2856 24.5627C32.4569 25.136 32.6241 25.7997 32.7872 26.5539C32.9503 27.3082 33.073 27.8577 33.1554 28.2024Z" fill="#207DF7" />
                            <path d="M78.0087 21.9209C78.0155 22.3242 78.018 22.8815 78.0162 23.5929C78.014 24.3043 78.0092 24.8071 78.0018 25.1014C78.0331 25.7395 77.8315 26.3673 77.4347 26.8677C77.2504 27.0788 77.0219 27.2467 76.7655 27.3596C76.5091 27.4724 76.231 27.5274 75.951 27.5207C75.6732 27.5326 75.3962 27.4817 75.1408 27.3718C74.8853 27.262 74.6578 27.096 74.4753 26.8861C74.066 26.4024 73.8576 25.7801 73.8927 25.1473C73.8776 24.5815 73.9243 22.56 74.0328 19.0826C74.0765 18.014 74.0271 17.2833 73.8847 16.8905C73.776 16.8499 73.6576 16.8432 73.5451 16.8712C73.34 16.9939 73.1632 17.1587 73.0264 17.3547C71.0395 19.0743 69.4364 21.1932 68.3213 23.5736C67.679 24.9485 66.798 25.4904 65.6784 25.1992C65.4139 25.1559 65.1627 25.0532 64.9436 24.8987C64.7246 24.7442 64.5434 24.5419 64.4138 24.3072C64.1734 23.7431 64.0655 23.1314 64.0981 22.5191C64.0734 20.8789 64.1435 19.0614 64.3085 17.0665C64.4728 15.0719 64.6619 13.2682 64.8758 11.6555C65.0893 10.043 65.2998 8.22853 65.5075 6.21189C65.5394 5.706 65.5858 4.95961 65.6466 3.97276C65.707 2.98695 65.7467 2.41435 65.7656 2.25493C65.7824 1.6148 66.0246 1.00119 66.4494 0.522366C66.6472 0.31912 66.8914 0.166981 67.161 0.0790213C67.4305 -0.00893848 67.7173 -0.0300914 67.9969 0.017382C68.2632 0.0311424 68.5232 0.102939 68.7589 0.227755C68.9946 0.35257 69.2002 0.527392 69.3614 0.740006C69.7263 1.23081 69.8991 1.83822 69.8475 2.44778C69.762 4.80033 69.388 8.71675 68.7256 14.197L68.5458 15.747C68.7522 15.5833 69.0047 15.3709 69.3034 15.1097C69.6013 14.8496 69.8408 14.6358 70.0217 14.4684C70.202 14.3021 70.4177 14.1191 70.6687 13.9193C70.9194 13.7209 71.1468 13.5528 71.3509 13.4148C72.9011 12.3066 74.3091 12.0205 75.5748 12.5567C76.8402 13.0934 77.6464 14.2946 77.9933 16.1602C78.1158 16.7574 78.1801 17.3651 78.1853 17.9748C78.1923 18.6064 78.1688 19.3285 78.1147 20.141C78.0608 20.9541 78.0254 21.5474 78.0087 21.9209Z" fill="#207DF7" />
                            <path d="M86.9442 23.8614C85.8246 24.0818 84.6755 24.1088 83.5467 23.9412C83.9195 24.9282 84.6522 25.4084 85.7449 25.3816C85.9311 25.3816 86.2249 25.3615 86.6242 25.3214C87.024 25.2813 87.3172 25.2613 87.5036 25.2616C88.6489 25.2882 89.3151 25.8082 89.5021 26.8216C89.5911 27.3172 89.5211 27.8283 89.302 28.2817C89.1877 28.4927 89.0281 28.6756 88.8347 28.8174C88.6412 28.9592 88.4187 29.0563 88.1833 29.1016C85.3586 29.8748 83.1071 29.5148 81.4287 28.0216C80.373 27.105 79.603 25.9038 79.2105 24.5613C78.8018 23.2618 78.7127 21.8826 78.9507 20.5412C79.2062 19.1984 79.7668 17.9324 80.5891 16.8409C81.418 15.6995 82.555 14.8183 83.8667 14.3009C84.5579 14.0104 85.3015 13.8657 86.0511 13.876C86.8006 13.8863 87.54 14.0513 88.2229 14.3607C88.8954 14.6285 89.4974 15.0473 89.9824 15.5849C90.4675 16.1224 90.8227 16.7643 91.0206 17.461C91.2592 18.1138 91.3145 18.8194 91.1806 19.5014C91.0572 20.1883 90.7995 20.844 90.4223 21.4309C90.0451 22.0178 89.5557 22.5244 88.9824 22.9216C88.3689 23.3617 87.6771 23.6806 86.9442 23.8614ZM83.7467 19.6213C84.1535 19.8313 84.6033 19.9441 85.0609 19.951C85.5185 19.9579 85.9715 19.8586 86.3844 19.661C86.864 19.4481 87.0772 19.1415 87.0239 18.7412C86.9171 18.2079 86.5707 17.9812 85.9846 18.0609C85.0255 18.1412 84.2795 18.6613 83.7467 19.6213Z" fill="#207DF7" />
                            <path d="M106.996 13.4598C107.601 13.8319 108.043 14.4202 108.232 15.1059C108.315 15.4233 108.327 15.755 108.269 16.0777C108.21 16.4005 108.082 16.7066 107.894 16.9749C107.738 17.2579 107.52 17.5011 107.255 17.6857C106.99 17.8703 106.686 17.9912 106.367 18.0391C105.657 18.1039 104.947 17.8978 104.382 17.4619C104.108 17.2197 103.762 17.0738 103.397 17.0466C103.108 17.029 102.821 17.1013 102.575 17.2537C102.303 17.4385 102.051 17.6509 101.823 17.8876C99.8993 19.8384 98.7157 22.3997 98.4762 25.1302C98.4271 25.9033 98.2986 26.6693 98.0928 27.4161C97.8131 28.4547 97.1114 28.9914 95.9877 29.0263C95.5058 29.0336 95.0315 28.9046 94.6195 28.6542C94.2169 28.3967 93.9267 27.996 93.8075 27.5329C92.6128 23.1521 91.8831 19.3742 91.6183 16.1994C91.5821 15.8761 91.61 15.5488 91.7004 15.2363C91.7907 14.9238 91.9418 14.6322 92.1449 14.3782C92.3402 14.139 92.584 13.9442 92.8603 13.8065C93.1365 13.6688 93.4388 13.5915 93.7471 13.5795C94.0353 13.5445 94.3276 13.5742 94.6029 13.6663C94.8765 13.7609 95.1272 13.9119 95.3387 14.1097C95.564 14.32 95.7474 14.571 95.8794 14.8496C96.0294 15.1734 96.137 15.5151 96.1997 15.8665C96.2099 15.9567 96.2857 16.36 96.4271 17.0765C97.7592 15.3702 98.7764 14.2487 99.4787 13.712C100.556 12.8542 101.878 12.3607 103.253 12.3027C104.594 12.2611 105.911 12.6683 106.996 13.4598Z" fill="#207DF7" />
                            <path d="M114.81 30.6176C114.928 30.8597 114.992 31.1243 114.999 31.3935C115.006 31.6626 114.955 31.9302 114.849 32.1779C114.635 32.6588 114.251 33.0434 113.77 33.2579C113.54 33.3753 113.289 33.4447 113.031 33.4619C112.774 33.4791 112.515 33.4437 112.272 33.3579C111.759 33.1667 111.337 32.7879 111.093 32.298C110.838 31.8567 110.637 31.3867 110.493 30.8977C110.466 30.8445 110.346 30.2845 110.134 29.2178C110.054 29.2976 109.874 29.4976 109.594 29.8177C109.314 30.1376 109.128 30.351 109.034 30.4579C108.941 30.5648 108.788 30.7247 108.575 30.9378C108.361 31.1516 108.168 31.3316 107.995 31.4776C107.822 31.6246 107.642 31.7647 107.456 31.8978C105.99 32.911 104.605 33.1711 103.299 32.678C101.993 32.1845 101.114 31.0843 100.661 29.3775C100.421 28.1963 100.421 26.9788 100.661 25.7976C100.905 24.5725 101.38 23.4051 102.06 22.3574C102.643 21.3825 103.47 20.5761 104.458 20.0172C105.897 19.244 107.202 19.164 108.375 19.7772C108.56 19.8897 108.763 19.9708 108.974 20.0172C109.041 20.0337 109.11 20.0331 109.177 20.0157C109.243 19.9982 109.304 19.9644 109.354 19.9173C109.445 19.8277 109.513 19.718 109.554 19.597C109.605 19.4207 109.638 19.24 109.654 19.0572C110.027 17.2438 110.267 14.7369 110.373 11.5367C110.399 10.0165 110.413 9.24311 110.413 9.21661C110.44 8.66572 110.659 8.1417 111.033 7.73651C111.211 7.55185 111.425 7.40658 111.663 7.31008C111.9 7.21357 112.155 7.16798 112.411 7.17625C112.937 7.16328 113.447 7.35726 113.831 7.71645C114.222 8.08893 114.458 8.5965 114.49 9.13635C114.516 9.99025 114.503 11.417 114.45 13.4166C114.423 14.2438 114.356 16.0039 114.25 18.6968C114.143 21.3909 114.077 23.4711 114.05 24.9375C113.997 27.3645 114.25 29.2579 114.81 30.6176ZM107.456 25.4974C107.829 24.8311 107.669 24.2443 106.976 23.7372C106.905 23.6626 106.815 23.6076 106.716 23.5774C106.639 23.551 106.554 23.551 106.477 23.5774C106.418 23.6014 106.358 23.6214 106.297 23.6372C106.224 23.6649 106.161 23.7137 106.117 23.7773C106.05 23.8572 105.997 23.9174 105.957 23.9575C105.899 24.0199 105.845 24.0867 105.797 24.1573C105.754 24.2203 105.708 24.2804 105.657 24.3371C104.989 25.2736 104.614 26.3873 104.578 27.5373C104.605 27.6213 104.619 27.7091 104.618 27.7974C104.618 27.8845 104.612 27.9715 104.598 28.0575C104.585 28.1397 104.599 28.224 104.638 28.2975C104.687 28.3866 104.765 28.4571 104.858 28.4977C104.949 28.5245 105.046 28.5245 105.138 28.4977C105.255 28.4425 105.358 28.3603 105.437 28.2577C105.557 28.1242 105.617 28.0444 105.617 28.0173C106.203 27.5111 106.816 26.6712 107.456 25.4974Z" fill="#207DF7" />
                            <path d="M47.7249 26.1305C47.5456 25.66 47.2221 25.2585 46.8007 24.9834C45.9358 24.4246 45.1008 24.5531 44.2958 25.369C44.1678 25.5049 43.9813 25.732 43.7361 26.0505C43.4914 26.3689 43.3049 26.5962 43.1768 26.7323C42.4468 27.5462 41.5951 27.7506 40.6218 27.3453C41.5179 26.6381 42.2864 25.7827 42.8941 24.816C43.2654 24.1582 43.5079 23.4355 43.6087 22.6868C43.7132 21.9968 43.6805 21.293 43.5125 20.6156C43.3445 19.9383 43.0445 19.3009 42.6297 18.7399C42.2257 18.1746 41.6747 17.7309 41.0365 17.457C40.3942 17.1233 39.6839 16.9417 38.9604 16.9264C38.2368 16.911 37.5194 17.0622 36.8635 17.3683C36.1702 17.6535 35.5431 18.0788 35.0215 18.6177C34.4999 19.1566 34.095 19.7974 33.8322 20.5001C33.3087 21.8104 33.1695 23.2429 33.4309 24.6295C33.6605 25.977 34.1965 27.2537 34.9975 28.3608C35.8096 29.4542 36.8735 30.3352 38.0987 30.9289C39.3439 31.5638 40.7453 31.8268 42.1357 31.6866C44.3727 31.4882 46.1787 30.0953 47.5538 27.5077C47.6823 27.3051 47.7644 27.0765 47.794 26.8383C47.8236 26.6002 47.8 26.3584 47.7249 26.1305ZM38.3944 25.6271C37.912 25.6271 37.4405 25.4839 37.0394 25.2157C36.6383 24.9475 36.3257 24.5662 36.1412 24.1202C35.9566 23.6741 35.9083 23.1833 36.0024 22.7098C36.0965 22.2363 36.3288 21.8014 36.6698 21.46C37.0109 21.1186 37.4455 20.8861 37.9186 20.7919C38.3917 20.6977 38.8821 20.7461 39.3277 20.9308C39.7734 21.1156 40.1543 21.4285 40.4223 21.8299C40.6902 22.2313 40.8333 22.7033 40.8333 23.186C40.8333 23.5066 40.7702 23.824 40.6476 24.1202C40.5251 24.4164 40.3454 24.6855 40.119 24.9121C39.8925 25.1388 39.6236 25.3186 39.3277 25.4413C39.0318 25.5639 38.7147 25.6271 38.3944 25.6271Z" fill="#207DF7" />
                            <path d="M62.3788 18.1012C62.0357 15.9748 59.1988 12.648 55.392 13.5172C51.3423 14.442 50.4695 16.384 49.5809 18.9989C49.1564 16.3234 47.6247 15.3464 47.1808 14.9807C46.9672 14.8021 46.7157 14.6746 46.4454 14.608C46.1751 14.5415 45.8932 14.5376 45.6212 14.5967C45.0263 14.7057 44.48 14.9531 44.3239 15.4811C43.7685 17.3599 45.6882 17.5003 45.7794 18.27C45.9466 19.5173 46.173 21.2819 46.4587 23.5635C46.7432 25.8462 46.9305 27.359 47.0207 28.1018C48.0932 35.3316 46.9159 39.5908 48.6122 39.5908C51.9335 39.5908 50.5309 30.4498 50.4804 24.3242C52.0027 27.5216 56.1512 28.2185 58.6318 26.5748C61.4741 24.7003 62.9824 21.8432 62.3788 18.1012ZM55.2496 23.1859C54.7672 23.1859 54.2957 23.0428 53.8946 22.7746C53.4935 22.5063 53.1809 22.1251 52.9963 21.6791C52.8117 21.233 52.7635 20.7422 52.8576 20.2687C52.9517 19.7952 53.1839 19.3602 53.525 19.0189C53.8661 18.6775 54.3007 18.445 54.7738 18.3508C55.2469 18.2566 55.7373 18.305 56.1829 18.4897C56.6286 18.6745 57.0095 18.9873 57.2774 19.3888C57.5454 19.7902 57.6885 20.2621 57.6885 20.7449C57.6885 21.3923 57.4315 22.0132 56.9741 22.4709C56.5167 22.9287 55.8964 23.1859 55.2496 23.1859Z" fill="#207DF7" />
                            <path d="M48.5073 47.0005C45.3247 47.0005 41.9591 45.9031 38.6494 43.7688C36.8171 42.5928 35.1337 41.1992 33.6361 39.6183C33.4005 39.3528 33.2794 39.0048 33.2993 38.6502C33.3192 38.2957 33.4784 37.9634 33.7421 37.726C34.0059 37.4885 34.3528 37.3651 34.7072 37.3827C35.0615 37.4004 35.3945 37.5576 35.6334 37.82C35.7514 37.9498 42.6549 45.4478 50.2715 44.1663C55.5224 43.2825 60.0423 38.4563 63.7055 29.822C63.8447 29.4938 64.1085 29.2343 64.4389 29.1008C64.7692 28.9672 65.139 28.9705 65.467 29.1099C65.7949 29.2492 66.0541 29.5132 66.1875 29.8439C66.321 30.1745 66.3177 30.5447 66.1785 30.8729C62.1302 40.415 56.9232 45.7804 50.7022 46.8206C49.9768 46.9412 49.2427 47.0013 48.5073 47.0005Z" fill="#FC9B65" />
                        </g>
                        <defs>
                            <clipPath id="clip0_454_6347">
                                <rect width="115" height="47" fill="white" />
                            </clipPath>
                        </defs>
                    </svg>
                </Text>
                <CloseButton display={{ base: 'flex', md: 'none' }} onClick={onClose} />
            </Flex>
            <NavItem icon={FiBriefcase} path="/find-tutor">
                Find a tutor
            </NavItem>
            <Divider />
            {LinkItems.map((link) => (
                <>
                    <NavItem key={link.name} icon={link.icon} path={link.path}  >
                        {link.name}
                    </NavItem>
                </>

            ))} <Divider />
            {LinkBItems.map((link) => (
                <>
                    <NavItem key={link.name} icon={link.icon} path={link.path}>
                        {link.name}
                    </NavItem>

                </>

            ))} <Divider />
            <NavItem icon={BsPin} path={"/pinned-notes"} >
                Pinned Notes
            </NavItem>
        </Box>
    );
};

interface NavItemProps extends FlexProps {
    icon: IconType;
    children: any;
    path: string;
}
const NavItem = ({ icon, path, children, ...rest }: NavItemProps) => {
    return (
        <Link href={path} style={{ textDecoration: 'none' }} _focus={{ boxShadow: 'none' }} >
            <Flex
                align="center"
                px="4"
                py="2"
                mx="4"
                my="2"
                borderRadius="lg"
                role="group"
                cursor="pointer"
                _hover={{
                    bg: '#F0F6FE',
                    color: '#207DF7',
                }}
                _active={{
                    bg: '#F0F6FE',
                    color: '#207DF7',
                }}
                {...rest}>
                {icon && (
                    <Icon
                        mr="4"
                        fontSize="16"
                        _groupHover={{
                            color: '#207DF7',
                        }}
                        as={icon}
                    />
                )}
                {children}
            </Flex>
        </Link>
    );
};

interface MobileProps extends FlexProps {
    onOpen: () => void;
}
const MobileNav = ({ onOpen, ...rest }: MobileProps) => {
    return (
        <Flex
            ml={{ base: 0, md: 60 }}
            px={{ base: 4, md: 4 }}
            height="20"
            alignItems="center"
            bg={useColorModeValue('white', 'gray.900')}
            borderBottomWidth="1px"
            borderBottomColor={useColorModeValue('gray.200', 'gray.700')}
            justifyContent={{ base: 'space-between', md: 'flex-end' }}
            {...rest}>
            <IconButton
                display={{ base: 'flex', md: 'none' }}
                onClick={onOpen}
                variant="outline"
                aria-label="open menu"
                icon={<FiMenu />}
            />

            <Text
                display={{ base: 'flex', md: 'none' }}
                fontSize="2xl"
                fontFamily="monospace"
                fontWeight="bold">
                Logo
            </Text>
            <Menu>
                <MenuButton bg={"#207DF7"} color="white" _hover={{ bg: "#1964c5" }} _active={{ bg: "#1964c5" }} as={Button} rightIcon={<FiChevronDown />}>
                    + Create
                </MenuButton>
                <MenuList>
                    <MenuItem onClick={() => console.log("ADD NEW NOTE")}>New note</MenuItem>
                    <MenuItem>Upload document</MenuItem>

                </MenuList>
            </Menu>

            <HStack spacing={{ base: '0', md: '6' }}>

                <IconButton
                    size="lg"
                    variant="ghost"
                    aria-label="open menu"
                    icon={<FiBell />}
                />
                <Flex alignItems={'center'}>
                    <Menu>
                        <MenuButton
                            py={2}
                            transition="all 0.3s"
                            _focus={{ boxShadow: 'none' }}>
                            <HStack>
                                <Avatar
                                    size={'sm'}
                                    src={
                                        'https://images.unsplash.com/photo-1619946794135-5bc917a27793?ixlib=rb-0.3.5&q=80&fm=jpg&crop=faces&fit=crop&h=200&w=200&s=b616b2c5b373a80ffc9636ba24f7a4a9'
                                    }
                                />
                                <VStack
                                    display={{ base: 'none', md: 'flex' }}
                                    alignItems="flex-start"
                                    spacing="1px"
                                    ml="2">
                                    <Text fontSize="sm">Justina Clark</Text>
                                    <Text fontSize="xs" color="gray.600">
                                        Admin
                                    </Text>
                                </VStack>
                                <Box display={{ base: 'none', md: 'flex' }}>
                                    <FiChevronDown />
                                </Box>
                            </HStack>
                        </MenuButton>
                        <MenuList
                            bg={useColorModeValue('white', 'gray.900')}
                            borderColor={useColorModeValue('gray.200', 'gray.700')}>
                            <MenuItem>Profile</MenuItem>
                            <MenuItem>Settings</MenuItem>
                            <MenuItem>Billing</MenuItem>
                            <MenuDivider />
                            <MenuItem>Sign out</MenuItem>
                        </MenuList>
                    </Menu>
                </Flex>
            </HStack>
        </Flex>
    );
};