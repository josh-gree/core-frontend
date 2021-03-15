// @flow

import React from 'react'
import styled from 'styled-components'

type Props = {
    color?: string,
    opacity?: string,
}

const UnstyledLogo = ({ color = '#ff5c00', opacity = '1', ...props }: Props) => (
    <svg
        {...props}
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 40 40"
    >
        <path
            fill={color}
            fillRule="evenodd"
            fillOpacity={opacity}
            d={
                'M25.0093 1.8487V.6955c0-.3953-.3296-.7135-.7246-.6947-7.7532.3682-13.96' +
                '65 6.6158-14.279 14.3823.0166.4868.4106.6142.6423.6142h1.1714c.3707 0 .' +
                '6745-.291.6938-.661.3327-6.3895 5.4596-11.5101 11.8521-11.8341.4876-.06' +
                '26.644-.329.644-.6535m-10.544 13.1486h1.121c.364 0 .6607-.2836.6872-.64' +
                '65.3168-4.341 3.798-7.8035 8.1473-8.092.1945-.013.5885-.1585.5885-.6625' +
                'V4.455c0-.4033-.342-.72-.7446-.6937-5.6266.367-10.126 4.8659-10.4932 10' +
                '.4917-.0262.4023.2905.7443.6939.7443m10.5439-6.7767v1.1466c0 .4691-.407' +
                '3.6379-.606.6619-2.2755.2745-4.0807 2.0756-4.3614 4.3489-.0434.352-.336' +
                '3.6193-.691.6193h-1.1194c-.4082 0-.7332-.3504-.6925-.7566.3545-3.5418 3' +
                '.1713-6.3581 6.7136-6.7126.4062-.0406.7567.2844.7567.6925zM38.151 24.97' +
                '38c-.3244 0-.5909-.1564-.6535-.6438-.3241-6.3917-5.4455-11.5178-11.8358' +
                '-11.8505-.3702-.0192-.6612-.323-.6612-.6937v-1.1713c0-.2316.1274-.6255.' +
                '6142-.6422 7.7678.3126 14.0161 6.525 14.3845 14.277.0188.395-.2995.7245' +
                '-.6948.7245H38.151zM25.0005 14.4314c0-.4033.342-.72.7445-.6937 5.6266.3' +
                '671 10.126 4.8659 10.4932 10.4917.0263.4024-.2905.7444-.6939.7444h-1.14' +
                '15c-.504 0-.6496-.3939-.6625-.5884-.2885-4.3487-3.7516-7.8294-8.0932-8.' +
                '1461-.363-.0265-.6466-.3232-.6466-.687v-1.1209zm6.7777 10.5424h-1.1468c' +
                '-.4692 0-.638-.4073-.662-.6059-.2745-2.2751-2.076-4.0802-4.3495-4.3607-' +
                '.352-.0435-.6194-.3363-.6194-.6909V18.197c0-.4081.3505-.733.7567-.6925 ' +
                '3.5423.3545 6.359 3.1709 6.7135 6.7127.0407.4061-.2843.7566-.6925.7566z' +
                'M1.849 14.9943c.3244 0 .5909.1564.6535.6439.3241 6.3916 5.4455 11.5178 ' +
                '11.8358 11.8504.3702.0193.6612.3231.6612.6937v1.1713c0 .2317-.1274.6256' +
                '-.6142.6422C6.6176 29.6833.3692 23.4709.0008 15.7188c-.0188-.395.2994-.' +
                '7245.6949-.7245H1.849zm13.1505 10.5424c0 .4033-.342.72-.7445.6938-5.626' +
                '6-.3673-10.126-4.866-10.4932-10.4917-.0263-.4025.2905-.7445.6939-.7445h' +
                '1.1415c.504 0 .6496.394.6625.5884.2885 4.3487 3.7516 7.8294 8.0932 8.14' +
                '62.363.0264.6466.3231.6466.687v1.1208zM8.2218 14.9943h1.1468c.4692 0 .6' +
                '38.4073.662.606.2746 2.275 2.076 4.08 4.3495 4.3607.352.0434.6194.3362.' +
                '6194.6908v1.1193c0 .4081-.3505.733-.7567.6925-3.5423-.3546-6.359-3.1709' +
                '-6.7136-6.7127-.0406-.4061.2844-.7566.6926-.7566zm6.7805 23.157c0-.3244' +
                '.1564-.5909.644-.6535 6.3926-.324 11.5194-5.4446 11.852-11.834.0194-.37' +
                '02.3232-.6612.6939-.6612h1.1714c.2317 0 .6256.1275.6423.6142-.3125 7.76' +
                '66-6.5258 14.014-14.279 14.3824-.395.0188-.7246-.2994-.7246-.6948v-1.15' +
                '31zm10.5439-13.1487c.4033 0 .7201.342.6938.7444-.3671 5.6258-4.8666 10.' +
                '1246-10.4932 10.4917-.4025.0263-.7445-.2904-.7445-.6937v-1.1414c0-.504.' +
                '394-.6495.5885-.6624 4.3493-.2885 7.8305-3.751 8.1473-8.092.0265-.363.3' +
                '232-.6466.6871-.6466h1.121zm-10.544 6.7768v-1.1466c0-.4692.4075-.6379.6' +
                '06-.6619 2.2756-.2745 4.0809-2.0757 4.3614-4.349.0435-.3518.3364-.6193.' +
                '691-.6193H21.78c.4082 0 .7332.3505.6926.7566-.3545 3.5419-3.1712 6.3582' +
                '-6.7136 6.7126-.4062.0407-.7567-.2843-.7567-.6924z'
            }
        />
    </svg>
)

const Logo = styled(UnstyledLogo)`
    height: 2.5em;
    width: 2.5em;
`

export default Logo
