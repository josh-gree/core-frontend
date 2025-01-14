// @flow

import React, { useCallback, useState, useMemo, useRef, useEffect } from 'react'
import { useDispatch } from 'react-redux'
import { useHistory } from 'react-router-dom'
import styled from 'styled-components'
import cloneDeep from 'lodash/cloneDeep'
import { useTransition, animated } from 'react-spring'

import useIsMounted from '$shared/hooks/useIsMounted'
import StatusIcon from '$shared/components/StatusIcon'
import StatusLabel from '$shared/components/StatusLabel'
import { updateStream as updateStreamAction, updateEditStream, updateEditStreamField } from '$userpages/modules/userPageStreams/actions'
import TOCPage from '$shared/components/TOCPage'
import Toolbar from '$shared/components/Toolbar'
import CoreLayout from '$shared/components/Layout/Core'
import CodeSnippets from '$shared/components/CodeSnippets'
import { subscribeSnippets, publishSnippets } from '$utils/streamSnippets'
import Sidebar from '$shared/components/Sidebar'
import SidebarProvider, { useSidebar } from '$shared/components/Sidebar/SidebarProvider'
import ShareSidebar from '$userpages/components/ShareSidebar'
import BackButton from '$shared/components/BackButton'
import Nav from '$shared/components/Layout/Nav'
import { getResourcePermissions } from '$userpages/modules/permission/actions'
import useLastMessageTimestamp from '$shared/hooks/useLastMessageTimestamp'
import getStreamActivityStatus from '$shared/utils/getStreamActivityStatus'
import Notification from '$shared/utils/Notification'
import { NotificationIcon } from '$shared/utils/constants'
import { MEDIUM } from '$shared/utils/styled'
import useModal from '$shared/hooks/useModal'
import { CoreHelmet } from '$shared/components/Helmet'
import usePreventNavigatingAway from '$shared/hooks/usePreventNavigatingAway'
import { truncate } from '$shared/utils/text'
import routes from '$routes'

import InfoView from './InfoView'
import ConfigureView from './ConfigureView'
import PreviewView from './PreviewView'
import HistoryView from './HistoryView'
import PartitionsView from './PartitionsView'
import SecurityView from './SecurityView'
import StatusView from './StatusView'
import ConfirmSaveModal from './ConfirmSaveModal'
import useNewStreamMode from './useNewStreamMode'

import styles from './edit.pcss'

function StreamPageSidebar({ stream }) {
    const sidebar = useSidebar()
    const dispatch = useDispatch()

    const streamId = stream && stream.id

    const onClose = useCallback(() => {
        sidebar.close()

        if (streamId) {
            dispatch(getResourcePermissions('STREAM', streamId))
        }
    }, [sidebar, dispatch, streamId])

    return (
        <Sidebar.WithErrorBoundary
            isOpen={sidebar.isOpen()}
            onClose={onClose}
        >
            {sidebar.isOpen('share') && (
                <ShareSidebar
                    sidebarName="share"
                    resourceTitle={stream && truncate(stream.id)}
                    resourceType="STREAM"
                    resourceId={stream && stream.id}
                    onClose={onClose}
                />
            )}
        </Sidebar.WithErrorBoundary>
    )
}

const didChange = (original, changed) => {
    const { streamStatus: originalStatus, lastData: originalData, ...originalStripped } = original || {}
    const { streamStatus: changedStatus, lastData: changedData, ...changedStripped } = changed || {}

    return JSON.stringify(originalStripped) !== JSON.stringify(changedStripped)
}

const UnstyledEdit = ({
    stream,
    canShare,
    disabled,
    isNewStream,
    ...props
}: any) => {
    const sidebar = useSidebar()
    const { id: streamId } = stream
    const streamRef = useRef()
    streamRef.current = stream
    const originalStreamRef = useRef()
    const { api: confirmSaveDialog } = useModal('confirmSave')

    const dispatch = useDispatch()
    const history = useHistory()

    useEffect(() => {
        if (!streamId || !streamRef.current) { return }
        originalStreamRef.current = {
            ...streamRef.current,
            config: cloneDeep(streamRef.current.config),
        }
    }, [streamId])

    const updateStream = useCallback((change, additionalData) => {
        try {
            if (typeof change === 'string') {
                dispatch(updateEditStreamField(change, additionalData))
            } else if (typeof change === 'object') {
                dispatch(updateEditStream({
                    ...change,
                }))
            } else {
                throw new Error(`Unknown update, change = ${JSON.stringify(change)}, additionalData = ${JSON.stringify(additionalData)}`)
            }
        } catch (e) {
            console.warn(e)
        }
    }, [dispatch])

    usePreventNavigatingAway(
        'You have unsaved changes. Are you sure you want to leave?',
        () => didChange(originalStreamRef.current, streamRef.current),
    )

    const isMounted = useIsMounted()

    const [spinner, setSpinner] = useState(false)

    const save = useCallback(async (options = {
        redirect: true,
    }) => {
        setSpinner(true)

        try {
            await dispatch(updateStreamAction(stream))

            if (isMounted()) {
                Notification.push({
                    title: 'Stream saved successfully',
                    icon: NotificationIcon.CHECKMARK,
                })

                if (options.redirect) {
                    history.push(routes.streams.index())
                }
            }
        } catch (e) {
            console.warn(e)

            Notification.push({
                title: e.message,
                icon: NotificationIcon.ERROR,
            })
        } finally {
            if (isMounted()) {
                setSpinner(false)
            }
        }
    }, [stream, dispatch, isMounted, history])

    const confirmIsSaved = useCallback(async () => {
        if (!didChange(originalStreamRef.current, streamRef.current)) {
            return true
        }

        const { save: saveRequested, proceed: canProceed } = await confirmSaveDialog.open()

        if (!isMounted()) { return false }

        if (saveRequested) {
            await save({
                redirect: false,
            })
        }

        return !!canProceed
    }, [confirmSaveDialog, save, isMounted])

    const cancel = useCallback(async () => {
        const canProceed = await confirmIsSaved()

        if (isMounted() && canProceed) {
            history.push(routes.streams.index())
        }
    }, [confirmIsSaved, history, isMounted])

    const subSnippets = useMemo(() => (
        subscribeSnippets({
            id: stream.id,
        })
    ), [stream.id])

    const pubSnippets = useMemo(() => (
        publishSnippets({
            id: stream.id,
        })
    ), [stream.id])

    const openShareDialog = useCallback(async () => {
        const canProceed = await confirmIsSaved()

        if (isMounted() && canProceed) {
            sidebar.open('share')
        }
    }, [confirmIsSaved, sidebar, isMounted])

    const isDisabled = !!(disabled || sidebar.isOpen())

    const [timestamp, error] = useLastMessageTimestamp(stream.id)

    const status = error ? StatusIcon.ERROR : getStreamActivityStatus(timestamp, stream.inactivityThresholdHours)

    const transitions = useTransition(true, null, {
        config: {
            tension: 500,
            friction: 50,
            clamp: true,
            duration: 300,
        },
        from: {
            opacity: 0,
        },
        enter: {
            opacity: 1,
        },
        leave: {
            opacity: 1,
        },
    })

    return (
        <CoreLayout
            {...props}
            nav={(
                <Nav noWide />
            )}
            navComponent={(
                <Toolbar
                    altMobileLayout
                    left={<BackButton onBack={cancel} />}
                    actions={{
                        share: {
                            title: 'Share',
                            kind: 'primary',
                            outline: true,
                            onClick: () => openShareDialog(),
                            disabled: isDisabled || !canShare,
                            className: styles.showOnDesktop,
                        },
                        saveChanges: {
                            title: 'Save & Exit',
                            kind: 'primary',
                            spinner,
                            onClick: () => save(),
                            disabled: isDisabled,
                            className: styles.showOnDesktop,
                        },
                        done: {
                            title: 'Done',
                            kind: 'primary',
                            spinner,
                            onClick: () => save(),
                            disabled: isDisabled,
                            className: styles.showOnTablet,
                        },
                    }}
                />
            )}
        >
            <CoreHelmet title={stream.id} />
            {transitions.map(({ item, key, props: style }) => (
                item && (
                    <animated.div
                        key={key}
                        {...(isNewStream ? { style } : {})}
                    >
                        <TOCPage title="Set up your Stream">
                            <TOCPage.Section
                                id="details"
                                title="Details"
                            >
                                <InfoView
                                    stream={stream}
                                    disabled={isDisabled}
                                    updateStream={updateStream}
                                />
                            </TOCPage.Section>
                            <TOCPage.Section
                                id="snippets"
                                title="Code Snippets"
                            >
                                <p>
                                    You can grab the code (JS &amp; Java) you’ll need to use this stream in your applications below.
                                    {' '}
                                    Only users with appropriate permissions can publish or subscribe to the stream.
                                </p>
                                <CodeSnippets
                                    items={[
                                        ['javascript', 'Js', subSnippets.javascript],
                                        ['java', 'Java', subSnippets.java],
                                    ]}
                                    title="Subscribe"
                                />
                                <CodeSnippets
                                    items={[
                                        ['javascript', 'Js', pubSnippets.javascript],
                                        ['java', 'Java', pubSnippets.java],
                                    ]}
                                    title="Publish"
                                />
                            </TOCPage.Section>
                            <TOCPage.Section
                                id="security"
                                title="Security"
                                onlyDesktop
                            >
                                <SecurityView
                                    stream={stream}
                                    disabled={isDisabled}
                                    updateStream={updateStream}
                                />
                            </TOCPage.Section>
                            <TOCPage.Section
                                id="configure"
                                title="Fields"
                                onlyDesktop
                            >
                                <ConfigureView
                                    stream={stream}
                                    disabled={isDisabled}
                                    updateStream={updateStream}
                                />
                            </TOCPage.Section>
                            <TOCPage.Section
                                id="status"
                                title="Status"
                                status={<StatusIcon
                                    tooltip
                                    status={status}
                                />}
                                onlyDesktop
                            >
                                <StatusView
                                    stream={stream}
                                    disabled={isDisabled}
                                    updateStream={updateStream}
                                />
                            </TOCPage.Section>
                            <TOCPage.Section
                                id="preview"
                                title="Preview"
                            >
                                <PreviewView stream={stream} />
                            </TOCPage.Section>
                            <TOCPage.Section
                                id="historical-data"
                                title="Data storage"
                                onlyDesktop
                            >
                                <HistoryView
                                    stream={stream}
                                    disabled={isDisabled}
                                    updateStream={updateStream}
                                />
                            </TOCPage.Section>
                            <TOCPage.Section
                                id="stream-partitions"
                                title="Stream partitions"
                                linkTitle="Partitions"
                                status={(<StatusLabel.Advanced />)}
                            >
                                <PartitionsView
                                    stream={stream}
                                    disabled={isDisabled}
                                    updateStream={updateStream}
                                />
                            </TOCPage.Section>
                        </TOCPage>
                    </animated.div>
                )
            ))}
            <StreamPageSidebar stream={stream} />
            <ConfirmSaveModal />
        </CoreLayout>
    )
}

const Edit = styled(UnstyledEdit)`
    strong {
        font-weight: ${MEDIUM};
    }
`

export default (props: any) => {
    const isNewStream = useNewStreamMode()

    return (
        <SidebarProvider>
            <Edit {...props} isNewStream={isNewStream} />
        </SidebarProvider>
    )
}
