// @flow

import React, { type ComponentType, useCallback, forwardRef } from 'react'
import styled, { keyframes } from 'styled-components'

export type Props = {
    onAnimationStart?: ?(SyntheticAnimationEvent<EventTarget>) => void,
    onAutoComplete?: ?(boolean) => void,
}

const startAnimation = keyframes`
  from {}
  to {}
`

const cancelAnimation = keyframes`
  from {}
  to {}
`

const OnAutoCompleteDecorator = (WrappedComponent: ComponentType<any>) => {
    const UnstyledOnAutoCompleteDecoratorWrapper = ({ onAutoComplete, onAnimationStart: onAnimationStartProp, ...props }: Props, ref: any) => {
        const onAnimationStart = useCallback((e: SyntheticAnimationEvent<EventTarget>) => {
            if (onAutoComplete && (e.animationName === startAnimation.name || e.animationName === cancelAnimation.name)) {
                onAutoComplete(e.animationName === startAnimation.name)
            }

            if (onAnimationStartProp) {
                onAnimationStartProp(e)
            }
        }, [onAutoComplete, onAnimationStartProp])

        return (
            <WrappedComponent
                {...props}
                onAnimationStart={onAnimationStart}
                ref={ref}
            />
        )
    }

    const OnAutoCompleteDecoratorWrapper = styled(forwardRef(UnstyledOnAutoCompleteDecoratorWrapper))`
        :-webkit-autofill {
            animation-name: ${startAnimation};
        }

        :not(:-webkit-autofill) {
            animation-name: ${cancelAnimation};
        }
    `

    const OptInOnAutoCompleteDecorator = ({ onAutoComplete, ...props }: Props, ref: any) => (
        onAutoComplete ? (
            <OnAutoCompleteDecoratorWrapper {...props} onAutoComplete={onAutoComplete} ref={ref} />
        ) : (
            <WrappedComponent {...props} ref={ref} />
        )
    )

    return (forwardRef(OptInOnAutoCompleteDecorator): ComponentType<Props>)
}

export default OnAutoCompleteDecorator
