// @flow

import React from 'react'
import classNames from 'classnames'
import uniq from 'lodash/uniq'
import sortBy from 'lodash/sortBy'
import { Input, Button } from 'reactstrap'
import { Translate, I18n } from 'react-redux-i18n'

import DropdownActions from '$shared/components/DropdownActions'
import SvgIcon from '$shared/components/SvgIcon'
import links from '$mp/../links'

import type { Stream, StreamList, StreamIdList, StreamId } from '$shared/flowtype/stream-types'

import styles from './streamSelector.pcss'

type Props = {
    fetchingStreams: boolean,
    streams: StreamIdList,
    availableStreams: StreamList,
    className?: string,
}

type State = {
    search: string,
    sort: string,
    selectedStreams: StreamIdList,
    nextStreams: StreamIdList,
    removedStreams: StreamIdList,
}

const RemoveIcon = () => (
    <svg className={styles.RemoveIcon} xmlns="http://www.w3.org/2000/svg" width="16" height="16">
        <path
            fill="white"
            d="M9 11.333H5.333a.667.667 0 1 1 0-1.333H9c.92 0 1.667-.748
            1.667-1.667 0-.918-.748-1.666-1.667-1.666H7.333v1a.335.335 0
            0 1-.51.282L4.157 6.283a.333.333 0 0 1 0-.566l2.666-1.666a.333.333
            0 0 1 .51.282v1H9c1.654 0 3 1.346 3 3s-1.346 3-3 3M8 0a8 8 0 1 0 0
            16A8 8 0 0 0 8 0"
        />
    </svg>
)

const SORT_BY_NAME = 'name'
const SORT_BY_RECENT = 'recent'
const SORT_BY_ADDED = 'added'

function getSortedStreams({ sort, matchingStreams, nextStreams }) {
    let sortOptions
    if (sort === SORT_BY_ADDED) {
        sortOptions = ['isAdded', 'lowerName']
    }
    if (sort === SORT_BY_NAME) {
        sortOptions = ['lowerName']
    }
    if (sort === SORT_BY_RECENT) {
        sortOptions = ['lastUpdated']
    }

    return sortBy(matchingStreams.map((s) => ({
        ...s,
        lowerName: s.name.toLowerCase(),
        isAdded: -Number(nextStreams.has(s.id)),
    })), sortOptions)
}

export class StreamSelector extends React.Component<Props, State> {
    state = {
        search: '',
        sort: SORT_BY_NAME,
        nextStreams: [...this.props.streams],
        selectedStreams: [],
        removedStreams: [],
    }

    componentWillReceiveProps({ streams }: Props) {
        this.setState({
            nextStreams: [...streams],
        })
    }

    onChange = (event: SyntheticInputEvent<EventTarget>) => {
        this.setState({
            search: event.target.value,
        })
    }

    onToggle = (id: StreamId) => {
        const { selectedStreams } = this.state
        this.setState({
            selectedStreams: selectedStreams.includes(id)
                ? selectedStreams.filter((sid) => sid !== id) // remove if selected
                : selectedStreams.concat(id), // add if not selected
        })
    }

    onSelectAll = (ids: StreamIdList) => {
        const { selectedStreams } = this.state
        this.setState({
            selectedStreams: uniq(selectedStreams.concat(ids)),
        })
    }

    onSelectNone = (ids: StreamIdList) => {
        const { selectedStreams } = this.state
        this.setState({
            selectedStreams: uniq(selectedStreams.filter((id) => !ids.includes(id))),
        })
    }

    onClearAll = () => {
        this.setState({
            selectedStreams: [],
            removedStreams: [...this.props.streams],
        })
    }

    onRemove = (id: StreamId) => {
        this.setState({
            removedStreams: [...this.state.removedStreams, id],
        })
    }

    onChangeSort = (sort: string) => {
        this.setState({
            sort,
        })
    }

    render() {
        const { availableStreams, fetchingStreams, className } = this.props
        const { search, sort } = this.state
        const matchingStreams: StreamList = availableStreams.filter((stream) => (
            stream.name.toLowerCase().includes(search.toLowerCase())
        ))

        // coerce arrays to Set as we are checking existence in a loop
        const nextStreams = new Set(this.state.nextStreams.filter((id) => !this.state.removedStreams.includes(id)))
        const selectedStreams = new Set(this.state.selectedStreams)
        const matchingNextStreams = new Set(matchingStreams.filter((x) => nextStreams.has(x.id)))
        const allVisibleStreamsSelected = (selectedStreams.size + matchingNextStreams.size) === matchingStreams.length

        const sortedStreams = getSortedStreams({
            sort,
            nextStreams,
            matchingStreams,
        })

        return (
            <div className={className}>
                <div className={styles.root}>
                    {!!fetchingStreams && <Translate value="streamSelector.loading" />}
                    <div className={styles.inputContainer}>
                        <SvgIcon name="search" className={styles.SearchIcon} />
                        <Input
                            className={styles.input}
                            onChange={this.onChange}
                            value={this.state.search}
                            placeholder={I18n.t('streamSelector.typeToSearch')}
                        />
                        <DropdownActions
                            className={classNames(styles.sortDropdown, styles.dropdown)}
                            title={
                                <span className={styles.sortDropdownTitle}>
                                    <Translate value="streamSelector.sort" />
                                    &nbsp;
                                    {sort}
                                </span>
                            }
                        >
                            <DropdownActions.Item onClick={() => this.onChangeSort(SORT_BY_NAME)}>
                                <Translate value="streamSelector.sortByName" />
                            </DropdownActions.Item>
                            <DropdownActions.Item onClick={() => this.onChangeSort(SORT_BY_RECENT)}>
                                <Translate value="streamSelector.sortByRecent" />
                            </DropdownActions.Item>
                            <DropdownActions.Item onClick={() => this.onChangeSort(SORT_BY_ADDED)}>
                                <Translate value="streamSelector.sortByAdded" />
                            </DropdownActions.Item>
                        </DropdownActions>
                    </div>
                    <div className={styles.streams}>
                        {!availableStreams.length && (
                            <div className={styles.noAvailableStreams}>
                                <p><Translate value="streamSelector.noStreams" /></p>
                                <a href={links.userpages.streamCreate} className={styles.streamCreateButton}>
                                    <Translate value="streamSelector.create" />
                                </a>
                            </div>
                        )}
                        {sortedStreams.map((stream: Stream) => (
                            <div
                                key={stream.id}
                                className={classNames(styles.stream, {
                                    [styles.added]: nextStreams.has(stream.id),
                                    [styles.selected]: selectedStreams.has(stream.id),
                                })}
                            >
                                {nextStreams.has(stream.id) && (
                                    <a
                                        className={styles.removeButton}
                                        href="#"
                                        title={I18n.t('streamSelector.remove')}
                                        onClick={(event: SyntheticInputEvent<EventTarget>) => {
                                            event.preventDefault()
                                            event.stopPropagation()
                                            this.onRemove(stream.id)
                                        }}
                                    >
                                        <RemoveIcon />
                                    </a>
                                )}
                                <button
                                    type="button"
                                    className={styles.addButton}
                                    onClick={() => {
                                        if (nextStreams.has(stream.id)) {
                                            return
                                        }
                                        this.onToggle(stream.id)
                                    }}
                                >
                                    {stream.name}
                                </button>
                            </div>
                        ))}
                    </div>
                    <div className={styles.footer}>
                        <div className={styles.selectedCount}>
                            {selectedStreams.size !== 1 ?
                                <Translate value="streamSelector.selectedStreams" streamCount={selectedStreams.size} /> :
                                <Translate value="streamSelector.selectedStream" streamCount={selectedStreams.size} />
                            }
                        </div>
                        <Button
                            onClick={() => {
                                const toSelect = matchingStreams
                                    .map((s) => s.id)
                                    .filter((id) => !nextStreams.has(id))

                                if (allVisibleStreamsSelected) {
                                    this.onSelectNone(toSelect)
                                } else {
                                    this.onSelectAll(toSelect)
                                }
                            }}
                            disabled={allVisibleStreamsSelected && matchingNextStreams.size === matchingStreams.length}
                        >
                            {!allVisibleStreamsSelected
                                ? <Translate value="streamSelector.selectAll" />
                                : <Translate value="streamSelector.selectNone" />
                            }
                        </Button>
                    </div>
                </div>
            </div>
        )
    }
}

export default StreamSelector
