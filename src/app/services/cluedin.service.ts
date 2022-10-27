import { Injectable } from '@angular/core';
import { getApiUrl } from '../models/jtw';
import { Token } from '../models/token';

@Injectable({
  providedIn: 'root'
})
export class CluedInService {

  constructor() { }

  async fetchJson(groupName: string, input: RequestInfo, init?: RequestInit) {
    console.groupCollapsed(`👋 ${groupName}`);
    console.info('Request', input, init);
    console.groupEnd();
    const t0 = performance.now();
    const response = await fetch(input, init);
    if (!response.ok) {
      let error = {
        status: response.status,
        statusText: response.statusText,
        error: 'Response is not succesfull',
      };

      try {
        error.error = await response.json();
      } catch (error) {
        console.error(error);
      }

      const t1 = performance.now();
      console.group(`❌ ${groupName}`);
      console.info('Request', input, init);
      console.error('Error', error);
      console.info('Elapsed', Math.floor(t1 - t0), 'ms.');
      console.groupEnd();
      return Promise.reject(error);
    }
    const text = await response.text();
    const t1 = performance.now();
    console.groupCollapsed(`✅ ${groupName}`);
    console.info('Request', input, init);
    // here, we parse JSON but don's save,
    // so if the object will be changed later,
    // the console will represent the original response:
    console.info('Response', JSON.parse(text));
    console.info('Elasped', Math.floor(t1 - t0), 'ms.')
    console.groupEnd();
    return JSON.parse(text);
  }

  public getEntity(token: Token, id: string): Promise<EntityResponse> {
    return this.fetchJson(
      `Get Entity (id:${id})`,
      `${getApiUrl(token)}entity?id=${id}&full=true`,
      {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token.accessToken}`
        }
      });
  }

  public getEntityRelationsSummary(token: Token, id: string): Promise<EntityRelationsSummaryResponse> {
    return this.fetchJson(
      `Get Entity Relations' Summary (id:${id})`,
      `${getApiUrl(token)}entityedges?id=${id}`,
      {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token.accessToken}`
        }
      });
  }

  public getEntityRelations(token: Token, id: string, edgeType: string): Promise<EntityResponse[]> {
    return this.fetchJson(
      `Get Entity Relations' (id:${id})`,
      `${getApiUrl(token)}entity/relations?id=${id}&relationship=${edgeType}`,
      {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token.accessToken}`
        }
      });
  }

  public getEntitySchema(token: Token): Promise<VocabularyKeyResponse[]> {
    return this.fetchJson(
      'Get all Vocabulary Keys',
      `${getApiUrl(token)}v1/entity/schema/`,
      {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token.accessToken}`
        }
      });
  }

  public search(token: Token, query: string): Promise<SearchResponse> {
    query = query === '' ? '*' : query;

    const gql =
    `{
      search (query:"${query}" pageSize: 100 )
      {
        entries
        {
          id
          name
          entityType
        }
      }
    }`;

    return this.fetchJson(
      `Search '${query}'`,
      `${getApiUrl(token)}graphql`,
      {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token.accessToken}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ query: gql })
      });
  }
}

export interface EntityRelationsSummaryResponse {
  id: string;
  type: string;
  name: string | null;
  displayName: string | null;
  edges: {
    edgeType: string;
    direction: 'Incoming' | 'Outgoing';
    entityType: string | null;
    entityId: string | null;
    name: string | null;
    createdDate: string;
    isGrouped: boolean;
    entityCount: number;
  }[]
}

export interface EntityResponse {
  entity: {
    'attribute-id': string;
    processedData: { // TODO: move to a separate interface
      entityType: string;
      name: string;
      codes: string[];
      properties: { [vocabularyKey: string]: string };
      'attribute-origin': string;
    }
  }
}

export interface SearchResponse {
  data: {
    search: {
      entries: [
        {
          id: string,
          name?: string,
          entityType: string
        }
      ]
    }
  }
}

export interface VocabularyKeyResponse {
  Key: string;
  VocabularyName: string;
  DisplayName: string;
  ShowInApplication: boolean;
  Visibility: string;
  DataType: string;
  Grouping: string;
  VocabularySource: string;
  Editable: boolean;
  Removable: boolean;
  PersonallyIdentifying: boolean;
  UsedInProcessing: boolean;
  IsCore: boolean;
  MapsToOtherKey: string;
}