// @flow

import React, { type Node } from 'react'
import { Link } from 'react-router-dom'
import classNames from 'classnames'
import screensToClassNames from '../screens'
import buttonStyles from '../../Button/button.pcss'
import styles from './navLink.pcss'

type Props = {
    children: Node,
    opaqueNav?: boolean,
    desktop?: boolean,
    mobile?: boolean,
    outline?: boolean,
    noDecorate?: boolean,
    className?: string,
    closeNav?: () => void,
    onClick?: (SyntheticInputEvent<EventTarget>) => void,
    href?: string,
    to?: string,
}

class NavLink extends React.Component<Props> {
    onClick = (e: SyntheticInputEvent<EventTarget>) => {
        const { onClick, closeNav } = this.props
        if (closeNav) {
            closeNav()
        }
        if (onClick) {
            onClick(e)
        }
    }

    render() {
        const {
            className,
            children,
            opaqueNav,
            mobile,
            desktop,
            href,
            to,
            outline,
            noDecorate,
            closeNav,
            ...props
        } = this.props

        const Tag = typeof to !== 'undefined' ? Link : 'a'

        return (
            <Tag
                href={!(href || to) ? '#' : href}
                to={to}
                className={classNames(className, styles.navLink, {
                    [styles.opaqueNav]: opaqueNav,
                    [styles.outline]: outline,
                    [buttonStyles.btn]: outline,
                    [buttonStyles.btnSecondary]: outline,
                }, screensToClassNames(!!mobile, !!desktop))}
                onClick={this.onClick}
                {...props}
            >
                <span className={classNames(styles.inner, {
                    [styles.underlined]: !outline && !noDecorate,
                })}
                >
                    {children}
                </span>
            </Tag>
        )
    }
}

export default NavLink