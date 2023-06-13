import { IExecuteFunctions } from 'n8n-core';
import {
	INodeExecutionData,
	INodeType,
	INodeTypeDescription,
	NodeOperationError,
} from 'n8n-workflow';

export class mdmtestNode implements INodeType {
	description: INodeTypeDescription = {
		displayName: 'MDMTEST Node',
		name: 'mdmtestNode',
		group: ['transform'],
		version: 1,
		description: 'Basic MDMTEST Node',
		defaults: {
			name: 'MDMTEST Node',
		},
		inputs: ['main'],
		outputs: ['main'],
		properties: [
			// Node properties which the user gets displayed and
			// can change on the node.
			{
				displayName: 'Mdm Contact',
				name: 'mdmContact',
				type: 'string',
				default: '',
				placeholder: 'Placeholder value for MDM Test Node',
				description: 'The description text for MDM Test Node',
			},
		],
	};

	// The function below is responsible for actually doing whatever this node
	// is supposed to do. In this case, we're just appending the `mdmContact` property
	// with whatever the user has entered.
	// You can make async calls and use `await`.
	async execute(this: IExecuteFunctions): Promise<INodeExecutionData[][]> {
		const items = this.getInputData();

		let item: INodeExecutionData;
		let mdmContact: string;

		// Iterates over all input items and add the key "mdmContact" with the
		// value the parameter "mdmContact" resolves to.
		// (This could be a different value for each item in case it contains an expression)
		for (let itemIndex = 0; itemIndex < items.length; itemIndex++) {
			try {
				mdmContact = this.getNodeParameter('mdmContact', itemIndex, '') as string;
				item = items[itemIndex];

				item.json['mdmContact'] = mdmContact;
			} catch (error) {
				// This node should never fail but we want to showcase how
				// to handle errors.
				if (this.continueOnFail()) {
					items.push({ json: this.getInputData(itemIndex)[0].json, error, pairedItem: itemIndex });
				} else {
					// Adding `itemIndex` allows other workflows to handle this error
					if (error.context) {
						// If the error thrown already contains the context property,
						// only append the itemIndex
						error.context.itemIndex = itemIndex;
						throw error;
					}
					throw new NodeOperationError(this.getNode(), error, {
						itemIndex,
					});
				}
			}
		}

		return this.prepareOutputData(items);
	}
}
