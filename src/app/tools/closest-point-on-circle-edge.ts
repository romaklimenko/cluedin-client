// https://observablehq.com/@zechasault/closest-point-on-circle-edge
export function closestPointOnCircleEdge(A: { x: number; y: number; }, B: { x: number; y: number; }, r: number) {
  const a1 = B.x - A.x;
  const b1 = (B.x - A.x) ** 2 + (B.y - A.y) ** 2;

  const x = A.x + r * (a1 / Math.sqrt(b1));

  const a2 = B.y - A.y;
  const b2 = (B.x - A.x) ** 2 + (B.y - A.y) ** 2;

  const y = A.y + r * (a2 / Math.sqrt(b2));

  const C = { x, y };

  return C;
}