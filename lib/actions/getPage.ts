import type { KeySchemaElement } from '@aws-sdk/client-dynamodb';
import { extractKey, doSearch, type ScanParams } from '../util.ts';
import type { DynamoApiController } from '../dynamoDbApi.ts';
import type { ItemList, Key } from '../types.d.ts';

export async function getPage(
    ddbApi: DynamoApiController,
    keySchema: KeySchemaElement[],
    TableName: string,
    scanParams: ScanParams,
    pageSize: number,
    operationType: 'query' | 'scan',
): Promise<{ pageItems: Record<string, any>[]; nextKey: any }> {
    const pageItems: Record<string, any>[] = [];

    function onNewItems(items: ItemList | undefined, lastStartKey: Key | undefined): boolean {
        if (items) {
            for (let i = 0; i < items.length && pageItems.length < pageSize + 1; i++) {
                pageItems.push(items[i]);
            }
        }

        // If there is more items to query (!lastStartKey) then don't stop until
        // we are over pageSize count. Stopping at exactly pageSize count would
        // not extract key of last item later and make pagination not work.
        return pageItems.length > pageSize || !lastStartKey;
    }

    let items = await doSearch(ddbApi, TableName, scanParams, 10, onNewItems, operationType);
    let nextKey = null;

    if (items.length > pageSize) {
        items = items.slice(0, pageSize);
        nextKey = extractKey(items[pageSize - 1], keySchema);
    }

    return {
        pageItems: items,
        nextKey,
    };
}

