import React from 'react'
import cx from 'classnames'
import * as services from '../services'

export default class ModuleHelp extends React.Component {
    state = {}
    componentDidMount() {
        this.load()
    }

    componentDidUpdate(prevProps) {
        if (prevProps.moduleId !== this.props.moduleId) {
            this.load()
        }
    }

    async load() {
        const { moduleId } = this.props
        const help = await services.moduleHelp({
            id: moduleId,
        })

        this.setState({
            [moduleId]: help,
        })
    }

    render() {
        const { className, moduleId } = this.props
        const help = this.state[moduleId] || {}
        return (
            <div className={cx(className)}>
                {/* eslint-disable react/no-danger */}
                <div dangerouslySetInnerHTML={{ __html: help.helpText }} />
            </div>
        )
    }
}