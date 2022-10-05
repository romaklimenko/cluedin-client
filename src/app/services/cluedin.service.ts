import { Injectable } from '@angular/core';
import { getOrganizationUrl } from '../models/jtw';
import { Token } from '../models/token';

@Injectable({
  providedIn: 'root'
})
export class CluedInService {

  constructor() { }

  public async getEntitySchema(token: Token) {
    const iss = new URL(token.JWT!.iss!);
    const organizationUrl = getOrganizationUrl(token);
    const apiUrl = `${organizationUrl}api/api/`;
    const response = await fetch(
      `${apiUrl}v1/entity/schema/`,
      {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token.accessToken}`
        }
      });
    return await response.json();
  }
}
