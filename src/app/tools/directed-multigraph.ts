// https://observablehq.com/@zechasault/directed-multigraph

import { closestPointOnCircleEdge } from "./closest-point-on-circle-edge";

const nodeRadius = 30;

export function computeLinkNumber(links: Relationship[], maxLinkOcc: { [key: string]: number }) {
  //sort links by source, then target
  links.sort(linkSort);
  //any links with duplicate source and target get an incremented 'linknum'
  for (let i = 0; i < links.length; i++) {
    if (
      i != 0 &&
      links[i].source == links[i - 1].source &&
      links[i].target == links[i - 1].target
    ) {
      links[i].linknum = links[i - 1].linknum! + 1;
      maxLinkOcc[links[i].source + '->' + links[i].target] += 1;
    } else {
      links[i].linknum = 1;
      maxLinkOcc[links[i].source + '->' + links[i].target] = 1;
    }
  }
}

export function linkSort(a: Relationship, b: Relationship) {
  if (a.source > b.source) {
    return 1;
  } else if (a.source < b.source) {
    return -1;
  } else {
    if (a.target > b.target) {
      return 1;
    }
    if (a.target < b.target) {
      return -1;
    } else {
      return 0;
    }
  }
}

export function findNodeById(nodes: Node[], id: string) {
  return nodes.find(d => d.id === id);
}

// @ts-ignore
export function getLinkPath(source, target, linknum, inv, uniqueLink) {
  const dx = target.x - source.x;
  const dy = target.y - source.y;
  const dist = Math.sqrt(Math.pow(dx, 2) + Math.pow(dy, 2));

  const c1 = closestPointOnCircleEdge(source, target, nodeRadius);
  const c2 = closestPointOnCircleEdge(target, source, nodeRadius);

  const startX = c1.x;
  const startY = c1.y;
  const endX = c2.x;
  const endY = c2.y;
  const centerX = (startX + endX) / 2;
  const centerY = (startY + endY) / 2;
  const angle = Math.atan2(endY - startY, endX - startX);

  if (uniqueLink) {
    return `M${startX} ${startY} L${endX} ${endY}`;
  }

  const p = Math.max(Math.min(30, 10000 / dist), 25);

  const mx = Math.sin(angle) * (inv * linknum * p) + centerX;
  const my = -Math.cos(angle) * (inv * linknum * p) + centerY;

  return `M${startX} ${startY} C${startX} ${startY}, ${mx} ${my} , ${endX} ${endY}`;
}

export interface Node {
  id: string;
  label: string;
}

export interface Relationship {
  id: string;
  label: string;
  source: string;
  target: string;
  linknum?: number;
}