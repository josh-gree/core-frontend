// @flow

import React, { useMemo, useState, useEffect } from 'react'
import cx from 'classnames'
import findLastIndex from 'lodash/findLastIndex'

import Icons from './Icons'

import styles from './editorNav.pcss'

export const statuses = {
    EMPTY: 'empty',
    VALID: 'valid',
    ERROR: 'error',
    UNPUBLISHED: 'unpublished',
}

type Section = {
    // eslint-disable-next-line react/no-unused-prop-types
    id: string,
    title: string,
    onClick?: Function,
    status: $Values<typeof statuses>,
    seen?: boolean,
    active?: boolean,
}

// $FlowFixMe
const isSet = (status) => !!statuses[status] && statuses[status] !== statuses.EMPTY
// $FlowFixMe
const isError = (status) => !!statuses[status] && statuses[status] === statuses.ERROR

const NavSection = ({
    title,
    onClick,
    status = statuses.EMPTY,
    seen = false,
    active = false,
}: Section) => {
    const iconName = useMemo(() => {
        if (seen) {
            if (active) {
                return isError(status) ? 'activeError' : 'active'
            }
            if (!isSet(status)) {
                return 'seen'
            }
        }
        // $FlowFixMe
        if (!status || !statuses[status] || statuses[status] === statuses.EMPTY) {
            return 'default'
        }
        return statuses[status]
    }, [status, seen, active])

    return (
        <div className={cx(styles.navSection, {
            [styles.active]: !!active,
        })}
        >
            <div className={styles.title}>
                <button type="button"onClick={onClick}>{title}</button>
            </div>
            <div className={styles.status}>
                <div className={styles.marker}>
                    <Icons name={iconName} className={styles.icon} />
                </div>
            </div>
        </div>
    )
}

type Props = {
    sections: Array<Section>,
    activeSection?: string,
    className?: string,
}

const EditorNav = ({ sections, activeSection, className }: Props) => {
    const [highestSeenSection, setHighestSeenSection] = useState(-1)

    useEffect(() => {
        setHighestSeenSection((prev) => {
            const highest = findLastIndex(sections, ({ id }) => id === activeSection)

            return highest > prev ? highest : prev
        })
    }, [sections, activeSection])

    return (
        <div className={cx(styles.root, styles.EditorNav, className)}>
            <div className={styles.progressBar}>
                <div className={styles.baseTrack} />
                <div
                    className={styles.progressTrack}
                    style={{
                        height: `${(Math.max(0, highestSeenSection) / Math.max(1, sections.length - 1)) * 100}%`,
                    }}
                />
            </div>
            {sections.map(({ id, status, ...rest }, index) => (
                <NavSection
                    key={id}
                    id={id}
                    status={status}
                    active={id === activeSection}
                    seen={highestSeenSection >= index}
                    {...rest}
                />
            ))}
        </div>
    )
}

export default EditorNav
