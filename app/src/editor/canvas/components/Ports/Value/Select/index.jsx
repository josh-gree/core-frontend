// @flow

import React, { useCallback, useMemo } from 'react'
import { type CommonProps } from '..'
import styles from './select.pcss'

type Props = CommonProps & {
    options: Array<{
        name: string,
        value: any,
    }>,
}

const Select = ({
    disabled,
    onChange: onChangeProp,
    value,
    options,
    ...props
}: Props) => {
    const onChange = useCallback((e: SyntheticInputEvent<EventTarget>) => {
        onChangeProp(e.target.value)
    }, [onChangeProp])

    if (value == null) { value = undefined } // select doesn't want null value

    const optionMap = useMemo(() => (
        options.reduce((memo, { name, value }) => {
            if (value == null) { value = undefined }
            memo.set(value, name)
            return memo
        }, new Map())
    ), [options])

    const selectionText = optionMap.get(value)

    return (
        <div className={styles.root}>
            <div className={styles.inner}>
                <select
                    {...props}
                    className={styles.control}
                    value={value}
                    disabled={disabled}
                    onChange={onChange}
                >
                    {options.map(({ name, value }) => (
                        <option key={value} value={value}>{name}</option>
                    ))}
                </select>
                {/* `select` holding a currently selected value. This hidden (`visibility: hidden`) control
                    dictates the width of the actual (visible) control above. */}
                <select className={styles.spaceholder}>
                    {/* Some inputs like `windowType` come with a default value set by the server
                        to a value that's not on the list of possible values (casing mismatch
                        such as `events` vs `EVENTS`). In that case we simply display the raw
                        value here instead of nothing. */}
                    <option>{selectionText != null ? selectionText : value}</option>
                </select>
            </div>
        </div>
    )
}

export default Select
