// https://observablehq.com/@zechasault/append-fitted-text-to-circle

import * as d3 from 'd3';

const lineHeight = 12;

export function getContext() {
  return document.createElement('canvas').getContext('2d') as CanvasText;
}

export function measureWidth(context: CanvasText, text: string) {
  return context.measureText(text).width;
}

export function getLines(context: CanvasText, text: string) {
  if (text === undefined || text === null) {
    return { lines: [] }
  }

  text = String(text);

  const words = text.split(/\s+/g); // To hyphenate: /\s+|(?<=-)/
  if (!words[words.length - 1]) {
    words.pop();
  }
  if (!words[0]) {
    words.shift();
  }
  const targetWidth = Math.sqrt(measureWidth(context, text.trim()) * lineHeight);
  let line: { text: any; width?: number; } | null = null;
  let lineWidth0 = Infinity;
  const lines = [];

  for (let i = 0, n = words.length; i < n; ++i) {
    const lineText1 = (line ? line.text + ' ' : '') + words[i];
    const lineWidth1 = measureWidth(context, lineText1);
    if ((lineWidth0 + lineWidth1) / 2 < targetWidth) {
      line!.width = lineWidth0 = lineWidth1;
      line!.text = lineText1;
    } else {
      lineWidth0 = measureWidth(context, words[i]);
      line = { width: lineWidth0, text: words[i] };
      lines.push(line);
    }
  }

  let textRadius = 0;
  for (let i = 0, n = lines.length; i < n; ++i) {
    const dy = (Math.abs(i - n / 2 + 0.5) + 0.5) * lineHeight
    // @ts-ignore
    let dx = lines[i].width / 2;
    textRadius = Math.max(textRadius, Math.sqrt(dx * dx + dy * dy));
  }

  return {
    'lines': lines.map((d) => {
      return { 'text': d.text, 'linesLength': lines.length };
    }),
    'textRadius': textRadius
  };
}

// @ts-ignore
export function appendFittedText(context, selection, textParam, radiusParam) {
  const getRadius = typeof radiusParam === 'function'
    ? radiusParam
    : () => { return radiusParam };

  const getText = typeof textParam === 'function'
    ? textParam
    : () => { return textParam };

  // @ts-ignore
  selection.each((_, i, n) => {
    d3.select(n[i])
      .selectAll('.fitted-text')
      .data([{}])
      .enter()
      .append('text')
      .attr('class', 'fitted-text')
      .attr('style', 'text-anchor: middle; font: 10px sans-serif');
  })

  let text = selection.select('.fitted-text');

  // @ts-ignore
  text.datum(d => {
    const lines = getLines(context, getText(d));
    d.lines = lines.lines;
    d.textRadius = lines.textRadius;
    return d
  });

  text.selectAll('tspan')
    // @ts-ignore  
    .data(d => d.lines)
    .enter()
    .append('tspan')
    .attr('x', 0)
    // @ts-ignore
    .attr('y', (d, i) => (i - d.linesLength / 2 + 0.8) * lineHeight)
    // @ts-ignore
    .text(d => d.text);

  // @ts-ignore
  text.attr('transform', d => {
    let scale = 1;
    if (d.textRadius !== 0 && d.textRadius) {
      scale = getRadius(d) / d.textRadius;
    }
    return `translate(0, 0) scale(${scale})`;
  });
}