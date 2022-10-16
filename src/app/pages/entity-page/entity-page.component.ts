import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Token } from 'src/app/models/token';
import { CluedInService, EntityResponse } from 'src/app/services/cluedin.service';
import { TokensService } from 'src/app/services/tokens.service';

type Tab = 'properties' | 'relations' | 'graph';

@Component({
  selector: 'app-entity-page',
  templateUrl: './entity-page.component.html',
  styleUrls: ['./entity-page.component.css']
})
export class EntityPageComponent implements OnInit {

  public token: Token | null = null;
  public entity: EntityResponse | null = null;
  public properties: { vocabularyKey: string; value: string; }[] = [];
  public currentTab: Tab = 'properties';

  constructor(
    private route: ActivatedRoute,
    private tokenService: TokensService,
    private cluedInService: CluedInService) { }

  ngOnInit(): void {
    this.route.params.subscribe(async (params) => {
      const jti = params['slug-jti'].split('-').pop();
      const entityId = params['id'];
      for (let token of this.tokenService.getTokens()) { // TODO: tokenService.getTokens(x => x..JWT?.jti === jti)
        if (token.JWT?.jti === jti) {
          this.token = token;
          this.entity = await this.cluedInService.getEntity(this.token, entityId);
          for (let key of Object.keys(this.entity.entity.processedData.properties)) {
            if (key.startsWith('property-')) {
              this.properties.push({
                vocabularyKey: key.slice('property-'.length),
                value: this.entity.entity.processedData.properties[key]
              });
            }
          }
          this.properties.sort((a, b) => a.vocabularyKey > b.vocabularyKey ? 1 : -1);
          break;
        }
      }
    });
  }

  selectTab(tab: Tab): void {
    this.currentTab = tab;
  }

}
