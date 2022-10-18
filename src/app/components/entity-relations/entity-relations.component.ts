import { Component, Input, OnInit } from '@angular/core';
import { Token } from 'src/app/models/token';
import { CluedInService, EntityRelationsSummaryResponse, EntityResponse } from 'src/app/services/cluedin.service';
import { TokenService } from 'src/app/services/token.service';

@Component({
  selector: 'app-entity-relations',
  templateUrl: './entity-relations.component.html',
  styleUrls: ['./entity-relations.component.css']
})
export class EntityRelationsComponent implements OnInit {

  @Input() id: string = '';
  @Input() token: Token | null = null;

  public entityRelationsSummaryResponse: EntityRelationsSummaryResponse | null = null;

  constructor(
    public cluedInService: CluedInService,
    public tokenService: TokenService) { }

  async ngOnInit() {
    const entityRelationsSummaryResponse = await this.cluedInService.getEntityRelationsSummary(this.token!, this.id);
    entityRelationsSummaryResponse.edges = entityRelationsSummaryResponse.edges;
    this.entityRelationsSummaryResponse = entityRelationsSummaryResponse;
  }
}
