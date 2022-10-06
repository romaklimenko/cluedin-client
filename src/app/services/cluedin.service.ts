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

  public getEntitySchema(token: Token) {
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
}
