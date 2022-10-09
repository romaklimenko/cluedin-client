import { AfterViewInit, Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { getOrganizationUrl } from 'src/app/models/jtw';
import { getTokenSlug, Token } from 'src/app/models/token';
import { CluedInService, VocabularyKeyResponse } from 'src/app/services/cluedin.service';
import { TokensService } from 'src/app/services/tokens.service';
import * as d3 from 'd3';

@Component({
  selector: 'app-vocabularies-page',
  templateUrl: './vocabularies-page.component.html',
  styleUrls: ['./vocabularies-page.component.css']
})
export class VocabulariesPageComponent implements OnInit, AfterViewInit {

  public token: Token | null = null;
  public tokenSlug: string | null = null;
  public organizationUrl: string = '#';

  @ViewChild('svgElement') svgElement!: ElementRef;
  @ViewChild('widthStandard') widthStandard!: ElementRef;

  constructor(
    private route: ActivatedRoute,
    private tokenService: TokensService,
    private cluedInService: CluedInService) { }

  ngOnInit(): void {
    this.route.params.subscribe(params => {
      const jti = params['slug-jti'].split('-').pop();
      for (let token of this.tokenService.getTokens()) { // TODO: tokenService.getTokens(x => x..JWT?.jti === jti)
        if (token.JWT?.jti === jti) {
          this.token = token;
          this.tokenSlug = getTokenSlug(token);
          this.organizationUrl = getOrganizationUrl(token);
        }
      }
    });
  }

  ngAfterViewInit(): void {
    this.render();
  }

  async render() {

    // sizing
    const element = this.svgElement.nativeElement;
    const width = this.widthStandard.nativeElement.clientWidth - 25;

    // const height = Math.max(400, width / 16 * 7);

    const vocabularyKeys = await this.cluedInService.getEntitySchema(this.token!);

    console.log(vocabularyKeys);


    // observable

    const mappingPath = (map: Map<string, VocabularyKeyResponse>, key: string, path: string[] = []): string[] => {
      const mapsToOtherKey: string | undefined = map?.get(key)?.MapsToOtherKey;
      if (mapsToOtherKey) {
        path.push(mapsToOtherKey);
        return mappingPath(map, mapsToOtherKey, path);
      }
      return path;
    }

    const enrich = (vocabulary: VocabularyKeyResponse[]) => {
      const map = new Map();
      vocabulary.forEach((v) => {
        map.set(v.Key, {
          ...v,
          Children: [],
          MappingPath: [],
          MapsToCore: null,
          Level: 0
        });
      });

      map.forEach((v, k, m) => {
        v.MappingPath = mappingPath(map, k);
        v.MapsToCore =
          v.MappingPath.length > 0
            ? map.get(v.MappingPath.slice(-1)[0]).IsCore
            : false;
        if (v['MapsToOtherKey']) {
          m.get(v.MapsToOtherKey).Children.push(k);
        }
      });

      return map;
    }

    const map = enrich(vocabularyKeys);

    const children = (node: any) => { // TODO:
      return node.Children.map((c: any) => {
        const child = map.get(c);
        if (child === undefined) throw Error(c);
        return { ...child, name: child.Key, children: children(child) };
      });
    };

    const data = {
      name: '',
      children: [...map]
        .map((a) => a[1])
        .filter((v) => v.MapsToOtherKey === undefined)
        .map((v) => {
          const child = { ...v, name: v.Key };
          return { ...child, children: children(child) };
        })
    };

    const hierarchy = d3.hierarchy(data);
    // @ts-ignore
    hierarchy.dx = 10;
    // @ts-ignore
    hierarchy.dy = (width * 0.95) / (hierarchy.height + 1);
    // @ts-ignore
    const root = d3.tree().nodeSize([hierarchy.dx, hierarchy.dy])(hierarchy);

    let x0 = Infinity;
    let x1 = -x0;
    root.each((d) => {
      if (d.x > x1) x1 = d.x;
      if (d.x < x0) x0 = d.x;
    });

    // @ts-ignore
    element.setAttribute('viewBox', `0,0,${width},${x1 - x0 + root.dx * 2}`)

    const svg = d3.select(this.svgElement.nativeElement);

    const g = svg
      .append('g')
      .attr('font-family', 'sans-serif')
      .attr('font-size', 10)
      // @ts-ignore
      .attr('transform', `translate(${root.dy / 3},${root.dx - x0})`); // TODO: dx, dy

    g
      .append('g')
      .attr('fill', 'none')
      .attr('stroke', '#555')
      .attr('stroke-opacity', 0.4)
      .attr('stroke-width', 1.5)
      .selectAll('path')
      .data(root.links())
      .join('path')
      .attr(
        // @ts-ignore
        'd', d3.linkHorizontal().x((d) => d.y).y((d) => d.x)
      )
      .attr('stroke', (d) => (d.source.depth === 0 ? '#FFF' : '#555'));

    const node = g
      .append('g')
      .attr('stroke-linejoin', 'round')
      .attr('stroke-width', 3)
      .selectAll('g')
      .data(root.descendants())
      .join('g')
      .attr('transform', (d) => `translate(${d.y},${d.x})`);

    node
      .append('circle')
      .attr('fill', (d) => {
        // @ts-ignore
        if (d.data.IsCore) {
          return '#1DE9B6';
        }

        // @ts-ignore
        if (!d.data.MapsToCore) {
          return '#FFD600';
        }
        return '#999';
      })
      .attr('r', 2.5);

    node
      .append('text')
      .attr('dy', '0.31em')
      .attr('x', (d) => (d.children ? -6 : 6))
      .attr('text-anchor', (d) => (d.children ? 'end' : 'start'))
      // @ts-ignore
      .text((d) => d.data.name)
      .clone(true)
      .lower()
      .attr('stroke', 'white');

    svg.attr('transform', 'scale(-1, 1)');
    svg
      .selectAll('text')
      .attr('transform', 'scale(-1, 1)')
      // @ts-ignore
      .attr('text-anchor', (d) => (d.depth === 1 ? 'start' : 'end'))
      .attr('x', function (d) {
        return d3.select(this).attr('text-anchor') === 'start' ? 6 : -6;
      });
  }

}
