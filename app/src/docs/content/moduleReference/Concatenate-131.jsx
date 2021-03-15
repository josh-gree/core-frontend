/* eslint-disable max-len */
import moduleDescription from './Concatenate-131.md'

export default {
    id: 131,
    name: 'Concatenate',
    path: 'Text',
    help: {
        outputNames: [],
        inputs: {},
        helpText: moduleDescription,
        inputNames: [],
        params: {},
        outputs: {},
        paramNames: [],
    },
    inputs: [
        {
            id: 'ep_cWkxb_IvS2CZ-UWI-9oqZA',
            name: 'in1',
            longName: 'Concatenate.in1',
            type: 'String',
            connected: false,
            canConnect: true,
            export: false,
            drivingInput: true,
            canToggleDrivingInput: true,
            acceptedTypes: [
                'String',
            ],
            requiresConnection: true,
            canHaveInitialValue: true,
            initialValue: null,
        },
        {
            id: 'ep_-BoKAOdESlKUGQEENkvTHQ',
            name: 'in2',
            longName: 'Concatenate.in2',
            type: 'String',
            connected: false,
            canConnect: true,
            export: false,
            drivingInput: true,
            canToggleDrivingInput: true,
            acceptedTypes: [
                'String',
            ],
            requiresConnection: true,
            canHaveInitialValue: true,
            initialValue: null,
        },
        {
            id: 'ep_6OPEVzJPTOa8wjbsHQWFJg',
            name: 'endpoint-1543304402722',
            longName: 'Concatenate.in3',
            type: 'String',
            connected: false,
            canConnect: true,
            export: false,
            displayName: 'in3',
            jsClass: 'VariadicInput',
            variadic: {
                isLast: true,
                index: 3,
            },
            drivingInput: true,
            canToggleDrivingInput: true,
            acceptedTypes: [
                'String',
            ],
            requiresConnection: false,
            canHaveInitialValue: true,
            initialValue: null,
        },
    ],
    outputs: [
        {
            id: 'ep_fkJkzx_wRjGv3AYFgevwWA',
            name: 'out',
            longName: 'Concatenate.out',
            type: 'String',
            connected: false,
            canConnect: true,
            export: false,
            noRepeat: false,
            canBeNoRepeat: true,
        },
    ],
    params: [],
}
