import * as React from "react";
import styled, { css } from "styled-components";

function createCSS() {
    let i = 1;
    let styles = '';

    while (i < 12) {
        styles += `
       &:nth-child(${i}) {
        animation-delay: ${i / 20}s !important;
        }
       `
        i++;
    }

    return css`${styles}`;
}

const Root = styled.svg`
height: 75px;
width: 95px;
margin: auto;

path {
    ${createCSS()}
    transform: translateY(0px);
    animation-play-state: paused;
    animation-direction: alternate !important;
    animation-duration: .3s;
    animation-iteration-count:infinite;
}

&:hover {
    path {
        animation-play-state: running; 
        animation-name: animateLogoPaths;
    }
}

@keyframes animateLogoPaths {
    from {
        transform: translateY(0px);
    }

    to {
        transform: translateY(-10px);
    }
}
`

type Props = React.ComponentPropsWithRef<typeof Root>;

const Logo: React.FC<Props> = ({ props }) => {
    return <Root
        xmlns="http://www.w3.org/2000/svg"
        width="572"
        height="234" // 🇳🇬
        viewBox="0 0 572 234"
        {...props}
    >
        <path d="M40.6458 123.48C44.6125 131.465 42.5978 138.394 34.6072 144.272C39.1112 146.318 43.5778 146.89 48.0112 145.996C52.4418 145.102 55.7285 143.004 57.8779 139.701C61.5725 134.189 60.2525 127.801 53.9165 120.536C52.1925 118.602 50.1685 116.737 47.8525 114.94C45.5312 113.145 43.4165 111.676 41.4992 110.537C39.5845 109.4 37.2152 108.041 34.3952 106.458C31.5725 104.877 29.3392 103.552 27.6885 102.478C8.03118 89.4104 -0.806154 73.0011 1.16051 53.2424C3.50051 31.7251 15.4552 16.3291 37.0298 7.0491C49.9152 1.62776 61.7245 3.91843 72.4512 13.9291C82.6192 23.4678 85.8752 34.2864 82.2192 46.3811C79.5165 55.4504 73.4845 60.9918 64.1245 62.9944C60.8965 63.7864 57.7818 63.8358 54.7778 63.1344C51.7698 62.4384 49.1925 61.1811 47.0485 59.3691C44.9018 57.5598 43.4605 55.3824 42.7272 52.8438C41.5418 49.1344 41.9592 45.8491 43.9712 42.9904C45.9818 40.1344 49.7485 37.5211 55.2672 35.1424C52.8538 31.1891 49.1499 30.4611 44.1632 32.9624C37.5112 36.3024 32.8232 40.8144 30.0992 46.5051C27.3712 52.1958 26.9512 57.9958 28.8405 63.8998C30.7285 69.8091 34.7085 74.8438 40.7818 79.0091C42.6165 80.2438 45.0485 81.8131 48.0685 83.7224C51.0925 85.6358 53.6979 87.2358 55.8859 88.5198C58.0739 89.8091 60.4632 91.4278 63.0578 93.3744C65.6472 95.3224 67.9752 97.2464 70.0445 99.1531C78.8752 107.242 84.2419 116.369 86.1419 126.52C88.0419 136.672 86.2285 145.97 80.7032 154.408C75.9352 161.573 68.8445 166.893 59.4338 170.378C50.0218 173.86 41.0712 174.573 32.5765 172.524C24.7832 170.582 18.3885 166.664 13.3818 160.757C8.37251 154.856 5.43385 147.78 4.56585 139.534C4.04185 135.418 4.32318 131.585 5.41118 128.021C8.28185 118.94 13.9792 114.084 22.5072 113.446C31.0338 112.813 37.0765 116.158 40.6458 123.48Z" fill="black" />
        <path d="M165.44 140.169C165.993 141.979 166.727 144.495 167.64 147.707C168.552 150.923 169.183 153.199 169.531 154.539C170.476 157.939 170.384 160.842 169.257 163.251C168.133 165.657 166.179 167.285 163.399 168.125C160.74 168.947 158.244 168.627 155.907 167.174C153.571 165.717 151.941 163.354 151.02 160.078C150.217 157.542 147.808 148.354 143.792 132.51C142.604 127.629 141.431 124.394 140.28 122.805C139.641 122.785 139.123 122.902 138.72 123.157C138.316 123.415 137.744 124.365 137.003 126.014C130.129 136.675 125.728 148.069 123.799 160.198C122.679 167.241 119.397 170.831 113.961 170.969C110.933 171.089 108.64 170.293 107.089 168.582C105.537 166.871 104.289 164.314 103.345 160.917C101.107 153.542 99.0695 145.242 97.2281 136.022C95.3841 126.802 93.9015 118.413 92.7775 110.851C91.6521 103.293 90.2508 94.8246 88.5761 85.4499C88.0641 83.1246 87.3055 79.6926 86.3015 75.1592C85.2975 70.6286 84.7361 67.9899 84.6135 67.2472C83.9161 63.8086 84.1975 60.9059 85.4588 58.5366C86.7161 56.1686 88.8295 54.7392 91.7975 54.2486C94.3721 53.6979 96.7415 54.1926 98.9015 55.7406C101.061 57.2886 102.529 59.6499 103.311 62.8219C105.975 73.5566 109.36 91.7259 113.471 117.333L114.667 124.566C115.388 123.559 116.256 122.273 117.267 120.705C118.275 119.143 119.083 117.867 119.681 116.877C120.28 115.893 121.016 114.783 121.893 113.558C122.771 112.337 123.58 111.281 124.323 110.395C129.892 103.379 135.887 100.262 142.301 101.041C148.716 101.822 153.916 106.201 157.903 114.174C159.196 116.629 160.271 119.277 161.123 122.119C161.972 124.963 162.803 128.255 163.612 131.993C164.421 135.734 165.029 138.458 165.44 140.169Z" fill="black" />
        <path d="M191.441 127.394C184.755 127.394 179.337 121.975 179.337 115.29C179.337 108.604 184.755 103.186 191.441 103.186C198.126 103.186 203.545 108.604 203.545 115.29C203.545 121.975 198.126 127.394 191.441 127.394ZM237.746 129.89C236.981 127.714 235.451 125.818 233.159 124.202C228.866 121.431 224.722 122.068 220.727 126.114C220.093 126.788 219.166 127.914 217.95 129.492C216.735 131.072 215.807 132.2 215.174 132.874C211.551 136.911 207.325 137.924 202.494 135.915C207.697 131.551 211.457 127.372 213.771 123.371C215.635 120.046 216.817 116.526 217.317 112.814C217.814 109.104 217.643 105.626 216.797 102.375C215.954 99.1284 214.507 96.0844 212.458 93.2431C210.409 90.4044 207.774 88.2844 204.551 86.8817C197.903 83.5244 191.001 83.3777 183.841 86.4417C176.685 89.5084 171.666 94.6857 168.797 101.971C166.186 108.599 165.523 115.423 166.805 122.447C168.089 129.474 170.682 135.64 174.579 140.95C178.479 146.259 183.607 150.507 189.971 153.683C196.334 156.866 203.011 158.119 210.007 157.44C221.11 156.456 230.073 149.55 236.897 136.719C238.229 134.344 238.513 132.068 237.746 129.89Z" fill="black" />
        <path d="M275.091 115.29C268.407 115.29 262.987 109.871 262.987 103.186C262.987 96.5016 268.407 91.0816 275.091 91.0816C281.776 91.0816 287.195 96.5016 287.195 103.186C287.195 109.871 281.776 115.29 275.091 115.29ZM310.472 90.0763C308.771 79.5336 294.691 63.0363 275.798 67.347C255.7 71.9323 251.368 81.5616 246.958 94.5283C244.85 81.2616 237.25 76.4176 235.046 74.6043C232.836 72.795 230.258 72.1576 227.306 72.699C224.354 73.2403 221.643 74.467 220.868 77.0856C218.111 86.4003 227.638 87.0976 228.091 90.9136C228.92 97.099 230.044 105.846 231.462 117.163C232.874 128.482 233.804 135.984 234.251 139.666C239.574 175.515 233.731 196.635 242.15 196.635C258.634 196.635 251.672 151.31 251.422 120.934C258.976 136.788 279.566 140.244 291.876 132.095C305.983 122.799 313.468 108.632 310.472 90.0763Z" fill="black" />
        <path d="M388.043 109.019C388.076 111.019 388.088 113.783 388.079 117.31C388.07 120.837 388.046 123.33 388.01 124.79C387.976 128.515 387.039 131.433 385.194 133.549C383.352 135.661 380.896 136.743 377.831 136.787C374.895 136.846 372.455 135.794 370.507 133.639C368.562 131.482 367.598 128.61 367.616 125.019C367.54 122.213 367.772 112.189 368.311 94.9461C368.527 89.6475 368.28 86.0235 367.575 84.0755C366.934 83.8701 366.372 83.8381 365.891 83.9808C365.404 84.1248 364.548 84.9221 363.316 86.3781C353.238 95.1928 345.455 105.47 339.964 117.214C336.778 124.031 332.404 126.719 326.848 125.274C323.74 124.515 321.647 123.038 320.572 120.851C319.496 118.665 318.974 115.707 319.007 111.985C318.883 103.853 319.234 94.8381 320.051 84.9475C320.866 75.0568 321.803 66.1155 322.866 58.1168C323.924 50.1208 324.97 41.1221 326 31.1235C326.159 28.6155 326.388 24.9128 326.69 20.0208C326.991 15.1328 327.19 12.2915 327.282 11.5035C327.575 7.8128 328.707 4.9488 330.675 2.91146C332.64 0.876798 335.202 0.0421326 338.354 0.408799C341.127 0.599466 343.387 1.79146 345.126 3.99146C346.868 6.19013 347.67 9.0128 347.539 12.4595C347.115 24.1248 345.258 43.5435 341.971 70.7181L341.078 78.4048C342.103 77.5928 343.358 76.5408 344.84 75.2448C346.318 73.9555 347.508 72.8955 348.404 72.0648C349.299 71.2408 350.367 70.3301 351.615 69.3421C352.859 68.3581 353.99 67.5221 355.002 66.8408C362.694 61.3461 369.683 59.9288 375.963 62.5861C382.243 65.2475 386.244 71.2035 387.966 80.4541C388.564 83.3208 388.883 86.3195 388.919 89.4515C388.955 92.5835 388.836 96.1661 388.57 100.193C388.3 104.225 388.126 107.165 388.043 109.019Z" fill="black" />
        <path d="M416.521 97.6164C421.014 99.7324 425.377 99.7977 429.61 97.8137C431.991 96.7577 433.049 95.2337 432.785 93.2524C432.255 90.6084 430.535 89.4831 427.626 89.8791C422.867 90.2777 419.163 92.8551 416.521 97.6164ZM432.389 118.642C427.89 119.7 422.271 119.831 415.527 119.036C417.378 123.931 421.014 126.311 426.437 126.179C427.361 126.179 428.819 126.08 430.801 125.88C432.785 125.682 434.239 125.586 435.165 125.586C440.849 125.716 444.155 128.296 445.083 133.319C445.479 136.095 445.149 138.511 444.09 140.559C443.03 142.611 441.179 143.966 438.538 144.626C424.519 148.459 413.346 146.674 405.015 139.27C399.723 134.644 396.055 128.924 394.007 122.112C391.954 115.303 391.527 108.658 392.717 102.178C393.907 95.7004 396.617 89.5831 400.849 83.8298C405.081 78.0791 410.501 73.8804 417.115 71.2351C424.385 68.3271 431.595 68.4258 438.735 71.5311C445.875 74.6404 450.503 79.7644 452.619 86.9044C453.81 90.2124 454.074 93.5831 453.414 97.0218C452.751 100.462 451.529 103.602 449.743 106.443C447.958 109.287 445.545 111.798 442.503 113.98C439.459 116.162 436.089 117.718 432.389 118.642Z" fill="black" />
        <path d="M531.902 67.0611C535.177 69.2678 537.224 71.9878 538.041 75.2238C538.861 78.4611 538.3 81.5491 536.361 84.4904C534.438 87.5811 531.913 89.3411 528.785 89.7677C525.657 90.1997 522.372 89.2424 518.93 86.9064C517.266 85.5824 515.64 84.8931 514.045 84.8464C512.453 84.7984 511.092 85.1451 509.962 85.8731C508.832 86.6064 507.589 87.6558 506.23 89.0158C496.597 98.8771 491.061 110.849 489.621 124.929C489.045 130.594 488.414 134.372 487.718 136.265C486.33 141.414 482.848 144.076 477.27 144.249C474.696 144.234 472.434 143.62 470.481 142.404C468.529 141.188 467.185 139.337 466.45 136.844C460.522 115.121 456.902 96.3838 455.586 80.6451C455.329 77.0424 456.204 74.0331 458.2 71.6158C460.198 69.1998 462.846 67.8784 466.152 67.6544C467.642 67.4864 469.06 67.6318 470.398 68.0851C471.734 68.5411 472.95 69.2731 474.049 70.2838C475.148 71.2958 476.04 72.5197 476.733 73.9517C477.425 75.3904 477.953 77.0704 478.322 78.9944C478.374 79.4424 478.748 81.4424 479.452 84.9958C486.062 76.5344 491.11 70.9731 494.597 68.3118C500.449 63.8731 506.69 61.5411 513.328 61.3237C519.958 61.1104 526.152 63.0224 531.902 67.0611Z" fill="black" />
        <path d="M534.186 126.754C536.037 123.449 535.242 120.54 531.806 118.026C531.407 117.63 530.978 117.365 530.515 117.233C530.05 117.104 529.654 117.104 529.326 117.233C528.993 117.365 528.697 117.465 528.433 117.53C528.166 117.6 527.869 117.829 527.542 118.225C527.209 118.621 526.946 118.92 526.747 119.117C526.547 119.316 526.282 119.649 525.953 120.11C525.622 120.574 525.387 120.87 525.259 121.001C522.086 125.234 520.301 130.522 519.903 136.869C520.034 137.268 520.102 137.698 520.102 138.16C520.102 138.624 520.067 139.053 520.002 139.449C519.934 139.846 520.002 140.242 520.202 140.638C520.398 141.037 520.763 141.368 521.293 141.632C521.819 141.764 522.283 141.764 522.681 141.632C523.078 141.5 523.573 141.104 524.167 140.442C524.763 139.78 525.061 139.384 525.061 139.249C527.967 136.738 531.011 132.574 534.186 126.754ZM570.683 152.142C571.874 154.921 571.937 157.498 570.881 159.881C569.821 162.26 568.035 164.045 565.525 165.234C563.01 166.425 560.534 166.59 558.086 165.73C555.639 164.87 553.69 163.117 552.235 160.476C551.175 158.757 550.185 156.442 549.261 153.532C549.126 153.268 548.531 150.492 547.475 145.201C547.079 145.598 546.186 146.589 544.797 148.176C543.41 149.762 542.482 150.824 542.021 151.35C541.555 151.881 540.795 152.672 539.739 153.73C538.679 154.79 537.721 155.682 536.862 156.408C536.001 157.136 535.107 157.832 534.186 158.492C526.911 163.514 520.034 164.805 513.557 162.36C507.075 159.913 502.713 154.457 500.465 145.994C499.274 140.177 499.274 134.26 500.465 128.242C501.655 122.226 503.967 116.538 507.407 111.184C510.843 105.826 514.813 101.96 519.309 99.5798C526.449 95.7464 532.927 95.3478 538.747 98.3904C539.937 99.0518 540.93 99.4504 541.722 99.5798C542.515 99.7118 543.142 99.5478 543.606 99.0851C544.07 98.6211 544.401 98.0918 544.601 97.4971C544.797 96.9011 544.961 96.0104 545.095 94.8198C546.945 85.8278 548.135 73.3971 548.665 57.5291C548.795 49.9904 548.865 46.1558 548.865 46.0251C549.126 42.9838 550.153 40.5371 551.938 38.6851C553.723 36.8358 556.005 35.9064 558.781 35.9064C561.558 35.9064 563.905 36.8011 565.823 38.5864C567.738 40.3704 568.829 42.7211 569.095 45.6264C569.225 49.8611 569.159 56.9331 568.898 66.8504C568.765 70.9518 568.434 79.6784 567.905 93.0331C567.375 106.392 567.045 116.705 566.914 123.978C566.649 136.012 567.905 145.398 570.683 152.142Z" fill="black" />
        <path d="M241.63 233.378C225.836 233.378 209.132 227.937 192.706 217.353C177.73 207.703 168.224 197.214 167.825 196.773C165.364 194.035 165.586 189.821 168.324 187.358C171.06 184.894 175.276 185.118 177.738 187.855C178.324 188.499 212.585 225.679 250.385 219.325C276.445 214.942 298.878 191.011 317.057 148.197C318.497 144.806 322.416 143.231 325.8 144.666C329.189 146.106 330.769 150.018 329.33 153.407C309.24 200.723 283.397 227.329 252.524 232.486C248.953 233.082 245.316 233.378 241.63 233.378Z" fill="#8F8F8F" />
    </Root>
}

export default Logo;