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
    const json = await response.json();
    const t1 = performance.now();
    console.groupCollapsed(`✅ ${groupName}`);
    console.info('Request', input, init);
    console.info('Response', json);
    console.info('Elasped', Math.floor(t1 - t0), 'ms.')
    console.groupEnd();
    return json;
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