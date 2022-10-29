import { AfterViewInit, Component, ElementRef, Input, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import * as d3 from 'd3';
import { Token } from 'src/app/models/token';
import { CluedInService, EntityRelationsSummaryResponse } from 'src/app/services/cluedin.service';
import { getContext, appendFittedText } from 'src/app/tools/append-fitted-text-to-circle';
import { computeLinkNumber, getLinkPath, Node, Relationship } from 'src/app/tools/directed-multigraph';
import { google10c } from 'src/app/tools/google10c';

@Component({
  selector: 'app-entity-graph',
  templateUrl: './entity-graph.component.html',
  styleUrls: ['./entity-graph.component.css']
})
export class EntityGraphComponent implements OnInit, AfterViewInit {

  @Input() id: string = '';
  @Input() token: Token | null = null;

  @ViewChild('svgElement') svgElement!: ElementRef;
  @ViewChild('widthStandard') widthStandard!: ElementRef;

  data: { nodes: Node[], relationships: Relationship[] } = ({
    nodes: [],
    relationships: []
  });

  nodes: Map<string, Node> = new Map<string, Node>();
  relationships: Map<string, Relationship> = new Map<string, Relationship>();
  entityTypes: Map<string, string> = new Map<string, string>();

  constructor(
    private cluedInService: CluedInService,
    private router: Router) { }

  ngOnInit(): void { }

  async ngAfterViewInit() {
    const entityRelationsSummary = await this.cluedInService.getEntityRelationsSummary(this.token!, this.id);
    // { id: '1', label: 'Movie' },
    // { id: '3', label: 'REVIEWED', source: '0', target: '1' },

    this.nodes.clear();
    this.relationships.clear();

    this.addData(entityRelationsSummary);

    // console.log('data', this.data);

    this.render();
  }

  public get entityTypesArray() {
    return Array.from(this.entityTypes);
  }

  addData(entityRelationsSummary: EntityRelationsSummaryResponse): void {
    const entityTypes = new Set<string>();

    const root: Node = {
      id: entityRelationsSummary.id,
      label: entityRelationsSummary.name || entityRelationsSummary.displayName || entityRelationsSummary.id,
      entityType: entityRelationsSummary.type
    };

    entityTypes.add(entityRelationsSummary.type);

    this.nodes.set(entityRelationsSummary.id, root);

    entityRelationsSummary.edges.forEach(d => {
      const node: Node = {
        id: d.isGrouped ? `${root.id}-${d.entityCount}` : d.entityId!,
        label: d.isGrouped ? `${d.entityCount} more entities` : d.name!,
        entityType: d.entityType
      };
      this.nodes.set(node.id, node);
      if (node.entityType) {
        entityTypes.add(node.entityType);
      }

      const relationsip: Relationship = {
        id: `${d.edgeType},${d.isGrouped ? d.edgeType : d.entityId}`,
        label: d.edgeType,
        source: d.direction === 'Incoming' ?
          (d.isGrouped ? `${root.id}-${d.entityCount}` : d.entityId!)
          :
          root.id,
        target: d.direction === 'Outgoing' ?
          (d.isGrouped ? `${root.id}-${d.entityCount}` : d.entityId!)
          :
          root.id
      };

      this.relationships.set(relationsip.id, relationsip);
    });

    for (const [i, entityType] of Array.from(entityTypes).sort().entries()) {
      this.entityTypes.set(entityType, google10c(i));
    }

    this.data = {
      nodes: Array.from(this.nodes.values()),
      relationships: Array.from(this.relationships.values())
    };
  }

  async render() {
    // see: https://observablehq.com/@zechasault/directed-multigraph

    const element = this.svgElement.nativeElement;
    const width = this.widthStandard.nativeElement.clientWidth - 25;
    const height = window.innerHeight - 160;
    const linkDistance = 125;
    const nodeRadius = 45;
    const context = getContext();

    element.setAttribute('viewBox', `0,0,${width},${height}`);

    const svg = d3.select(this.svgElement.nativeElement);

    // deep copy
    let links = this.data.relationships.map(o => ({ ...o }));
    let nodes = this.data.nodes.map(o => ({ ...o }));

    const maxLinkOcc = {};

    computeLinkNumber(links, maxLinkOcc);

    const simulation = d3
      // @ts-ignore
      .forceSimulation(nodes)
      .force(
        'link',
        d3
          .forceLink(links)
          // @ts-ignore
          .id(d => d.id)
          .distance(linkDistance)
      )
      .force('charge', d3.forceManyBody())
      .force('collide', d3.forceCollide().radius(nodeRadius + linkDistance / 2))
      .force('center', d3.forceCenter(width / 2, height / 2))
      .on('tick', () => {
        updateNodes();
        updateLinks();
      });

    const g = svg.append('g');

    svg.call(
      d3
        .zoom()
        .scaleExtent([1 / 4, 8])
        .on('zoom', (event) => g.attr('transform', event.transform))
    );

    const link = g
      .append('g')
      .selectAll('g')
      .data(links)
      .enter()
      .append('g');

    // paths
    link
      .append('path')
      .attr('class', 'links')
      .attr('stroke', '#aaa')
      .attr('stroke-width', '2px')
      .attr('id', d => d.id)
      .attr('style', 'fill: none;');

    // texts
    link
      .append('text')
      .append('textPath')
      .attr('href', d => `#${d.id}`)
      .attr('startOffset', '50%')
      .attr('style', 'text-anchor: middle')
      .append('tspan')
      .attr('stroke', 'black')
      .attr('style', 'font-size: 12px')
      .text(d => `${d.label} ►`)
      .attr('dy', -6);

    const node = g
      .append('g')
      .selectAll('g')
      .data(nodes)
      .enter()
      .append('g')
      .attr('cursor', 'move')
      .on('click', async (event: PointerEvent, d: Node) => {
        if (d.entityType) {
          // TODO: is it nasty?
          this.router.navigateByUrl(`${window.location.pathname.split('/').slice(0, -1).join('/')}/${d.id}#graph`);
        }
      })
      .call(
        // @ts-ignore
        d3
          .drag()
          .on('start', (event, d) => {
            if (!event.active) {
              simulation.alphaTarget(0.3).restart();
            }
            // @ts-ignore
            d.fx = d.x;
            // @ts-ignore
            d.fy = d.y;
          })
          .on('drag', (event, d) => {
            // @ts-ignore
            d.fx = event.x;
            // @ts-ignore
            d.fy = event.y;
          })
          .on('end', (event) => {
            if (!event.active) {
              simulation.alphaTarget(0);
            }
          })
      );

    node
      .append('circle')
      .attr('r', nodeRadius)
      .attr('stroke-width', 3)
      // @ts-ignore
      .attr('stroke', (d, i) => {
        return d.entityType ? d3.rgb(this.entityTypes.get(d.entityType)!).darker(1) : d3.rgb('gray').darker(1);
      }
      )
      .attr('fill', (d, i) => {
        return d.entityType ? this.entityTypes.get(d.entityType)! : 'gray';
      });

    appendFittedText(context, node, (d: { label: string; }) => d.label, nodeRadius - 5);

    node
      .selectAll('.fitted-text')
      .attr('fill', 'white')
      .selectAll('tspan')
      .attr('font-weight', 'bold');

    function updateNodes() {
      // @ts-ignore
      node.attr('transform', d => `translate(${d.x},${d.y})`);
    }

    function updateLinks(nodeId = null) {
      // @ts-ignore
      const updatedLinks = links.filter(d => nodeId ? d.source.id === nodeId || d.target.id === nodeId : true);

      // @ts-ignore
      const linkPath = g.selectAll('.links')
        // @ts-ignore
        .data(updatedLinks, d => d.id);

      linkPath.attr('d', (d, i, p) => {
        const linkTspan = d3
          // @ts-ignore
          .select(p[i].parentNode)
          .select('textPath')
          .select('tspan');

        // @ts-ignore
        if (d.source.id === d.target.id) {
          // @ts-ignore
          const dr = nodeRadius / 2 + 5 + d.linknum * 7;
          // @ts-ignore
          return (`M${(d.source.x - 1)},${d.source.y} A ${dr},${dr} 0 1,1 ${(d.target.x + 1)},${d.target.y}`);
        } else {
          // @ts-ignore
          const a1 = maxLinkOcc[`${d.source.id}->${d.target.id}`];
          // @ts-ignore
          const a2 = maxLinkOcc[d.target.id + '->' + d.source.id];
          const uniqueLink = a1 + a2 === 1 || (a1 === 1 && !a2);

          let source = d.source;
          let target = d.target;

          // @ts-ignore
          if (source.x > target.x) {
            // @ts-ignore
            linkTspan.text(d => '◄ ' + d.label);

            target = d.source;
            source = d.target;
            return getLinkPath(source, target, d.linknum, 1, uniqueLink);
          } else {
            // @ts-ignore
            linkTspan.text(d => d.label + '  ►');
            return getLinkPath(source, target, d.linknum, -1, uniqueLink);
          }
        }
      });
    }
  }
}