const width = 960;
const height = 480;
const radius = Math.min(width, height) / 2;
const animation = 1000;

const svg = d3.select('body')
  .append('svg')
    .attr('viewBox', [0, 0, width, height].join(' '))
  .append('g')

svg.append('g')
  .attr('class', 'slices');
svg.append('g')
  .attr('class', 'labels');
svg.append('g')
  .attr('class', 'lines');

const pie = d3.layout.pie()
  .sort(null)
  .value((d) => d.value);

const arc = d3.svg.arc()
  .outerRadius(radius * 0.8)
  .innerRadius(radius * 0.5);

const selectedArc = d3.svg.arc()
  .outerRadius(radius * 0.85)
  .innerRadius(radius * 0.55);

const outerArc = d3.svg.arc()
  .innerRadius(radius * 0.9)
  .outerRadius(radius * 0.85);

svg.attr('transform', `translate(${width / 2}, ${height / 2})`);

const key = (d) => d.data.label;

const data = [{
    label: 'Lorem ipsum',
    color: '#edc8a3',
    selected: false,
  }, {
    label: 'Dolor sit',
    color: '#8d9697',
    selected: false,
  }, {
    label: 'Consectetur',
    color: '#a5adad',
    selected: false,
  }, {
    label: 'Ddipisicing',
    color: '#bdc3c3',
    selected: false,
  }, {
    label: 'Elit',
    color: '#d5d9da',
    selected: false,
  }, {
    label: 'Incididunt',
    color: '#edf0f0',
    selected: false,
  }];

const color = d3.scale.ordinal()
  .domain(data.map((item) => item.label))
  .range(data.map((item) => item.color));

const calculateAngle = (d) => d.startAngle + (d.endAngle - d.startAngle) / 2;

const createTitle = () => {

  const title = svg.select('.title');

  title.enter()
    .insert('path')
    .style('fill', (d) => color(d.data.color))
    .attr('class', 'slice')
    .on('click', function() {

      d3.select(this)
        .transition().duration(animation)
        .attrTween('d', function (d) {
          this._current = this._current || d;

          const interpolate = d3.interpolate(this._current, d);

          this._current = interpolate(0);

          d.data.selected = !d.data.selected;

          if(d.data.selected) {
            return (t) => selectedArc(interpolate(t));
          } else {
            return (t) => arc(interpolate(t));
          }
        });
    });

  slice
    .transition().duration(animation)
    .attrTween('d', function (d) {

      this._current = this._current || d;

      const interpolate = d3.interpolate(this._current, d);

      this._current = interpolate(0);

      if(d.data.selected) {
        return (t) => selectedArc(interpolate(t));
      } else {
        return (t) => arc(interpolate(t));
      }
    });

  slice.exit()
    .remove();
};

const createSlice = (data) => {

  const slice = svg.select('.slices').selectAll('path.slice')
    .data(pie(data), key);

  slice.enter()
    .insert('path')
    .style('fill', (d) => color(d.data.color))
    .attr('class', 'slice')
    .on('click', function() {

      d3.select(this)
        .transition().duration(animation)
        .attrTween('d', function (d) {
          this._current = this._current || d;

          const interpolate = d3.interpolate(this._current, d);

          this._current = interpolate(0);

          d.data.selected = !d.data.selected;

          if(d.data.selected) {
            return (t) => selectedArc(interpolate(t));
          } else {
            return (t) => arc(interpolate(t));
          }
        });
    });

  slice
    .transition().duration(animation)
    .attrTween('d', function (d) {

      this._current = this._current || d;

      const interpolate = d3.interpolate(this._current, d);

      this._current = interpolate(0);

      if(d.data.selected) {
        return (t) => selectedArc(interpolate(t));
      } else {
        return (t) => arc(interpolate(t));
      }
    });

  slice.exit()
    .remove();
};

const createStructure = (name, amount, percent, color) => {

  const createElement = (name, attrs = {}, value) => {
    let element = document.createElementNS(d3.ns.prefix.svg, name);

    element.innerHTML = value || '';

    for (let attr in attrs) {
      element.setAttribute(attr, attrs[attr]);
    }

    return element;
  }

  const block = createElement('g', { class: 'tick' });

  const groupPercent = createElement('g', { 'class': 'group-percent' });
  const groupName = createElement('g', { 'class': 'group-name' });

  const rectBackground = createElement('rect', { 'class': 'background', 'fill': color });
  const textPercent = createElement('text', { 'class': 'percent', 'x': 34, 'dy': '1.4em' }, `${percent}%`);

  const textName = createElement('text', { 'class': 'name', 'dy': '.3em' }, name);
  const textAmount = createElement('text', { 'class': 'amount', 'dy': '.3em', 'y': 18 }, amount);

  groupPercent.appendChild(rectBackground);
  groupPercent.appendChild(textPercent);

  groupName.appendChild(textName);
  groupName.appendChild(textAmount);

  block.appendChild(groupPercent);
  block.appendChild(groupName);

  return block;
};

const createLabels = (data) => {
  const text = svg.select('.labels').selectAll('g.tick')
    .data(pie(data), key);

  text.enter()
    .append((d) => createStructure(d.data.label, '2.1M', d.data.value, d.data.color));

  text
    .transition().duration(animation)
    .attrTween('transform', function (d) {

      this._current = this._current || d;

      const interpolate = d3.interpolate(this._current, d);

      this._current = interpolate(0);

      return (t) => {

        const d2 = interpolate(t);
        const pos = outerArc.centroid(d2);

        pos[0] = radius * (calculateAngle(d2) < Math.PI ? 1 : -1);

        return `translate(${pos})`;
      };

    })
    .attrTween('class', function (d) {

      this._current = this._current || d;

      const interpolate = d3.interpolate(this._current, d);

      this._current = interpolate(0);

      return (t) => calculateAngle(interpolate(t)) < Math.PI ? 'tick text-start' : 'tick text-end';
    });

  text.select('text.percent')
    .text((d) => d.data.percent.toFixed() + '%');

  text.exit()
    .remove();
};


const createPolylines = (data) => {
  const polyline = svg.select('.lines').selectAll('polyline')
    .data(pie(data), key);

  polyline.enter()
    .append('polyline')
    .attr('stroke', (d) => d.data.color);

  polyline.transition().duration(animation)
    .attrTween('points', function (d) {

      this._current = this._current || d;

      const interpolate = d3.interpolate(this._current, d);

      this._current = interpolate(0);

      return (t) => {

        const d2 = interpolate(t);
        const pos = outerArc.centroid(d2);

        pos[0] = radius * 1 * (calculateAngle(d2) < Math.PI ? 1 : -1);

        return [arc.centroid(d2), outerArc.centroid(d2), pos];
      };
    });

  polyline.exit()
    .remove();
};

const change = () => {

  let total = 0;

  let _data = data.map((item) => {

    const value = Math.random();
    total += value;

    return Object.assign({}, item, {
      value
    });
  });

  _data = _data.map((item) => Object.assign({}, item, {
    percent: item.value / (total / 100)
  }));

  createSlice(_data);
  createLabels(_data);
  createPolylines(_data);

};

let randomize = true;

d3.select('.run').on('click', () => {
  randomize = true;
});

d3.select('.stop').on('click', () => {
  randomize = false;
});

setInterval(() => {
  if (randomize) {
    change()
  }
}, animation);