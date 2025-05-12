'use client';

import React, { useEffect, useRef, useState } from 'react';
// @ts-ignore - Add module declaration to fix type issues
import * as d3 from 'd3';
// @ts-ignore
import { FeatureCollection } from 'geojson';

interface CityData {
  name: string;
  value: number;
  lng: number;
  lat: number;
}

interface ChinaMapProps {
  paused: boolean;
}

const CITIES_DATA: CityData[] = [
  { name: '北京', value: 1453, lng: 116.4, lat: 39.9 },
  { name: '上海', value: 1822, lng: 121.5, lat: 31.2 },
  { name: '广州', value: 983, lng: 113.3, lat: 23.1 },
  { name: '深圳', value: 1245, lng: 114.1, lat: 22.5 },
  { name: '杭州', value: 876, lng: 120.2, lat: 30.3 },
  { name: '成都', value: 743, lng: 104.1, lat: 30.7 },
  { name: '重庆', value: 623, lng: 106.5, lat: 29.5 },
  { name: '西安', value: 512, lng: 108.9, lat: 34.3 },
  { name: '武汉', value: 756, lng: 114.3, lat: 30.6 },
  { name: '南京', value: 678, lng: 118.8, lat: 32.1 },
  { name: '长沙', value: 456, lng: 113.0, lat: 28.2 },
  { name: '天津', value: 521, lng: 117.2, lat: 39.1 },
  { name: '青岛', value: 432, lng: 120.4, lat: 36.1 },
  { name: '沈阳', value: 345, lng: 123.4, lat: 41.8 },
  { name: '大连', value: 312, lng: 121.6, lat: 38.9 },
  { name: '济南', value: 289, lng: 117.0, lat: 36.7 },
  { name: '郑州', value: 376, lng: 113.7, lat: 34.8 },
  { name: '福州', value: 267, lng: 119.3, lat: 26.1 },
  { name: '厦门', value: 234, lng: 118.1, lat: 24.5 },
  { name: '哈尔滨', value: 187, lng: 126.5, lat: 45.8 },
  { name: '宁波', value: 321, lng: 121.6, lat: 29.9 },
  { name: '苏州', value: 498, lng: 120.6, lat: 31.3 },
];

// Simplified connection data - just store relationships without animations
interface Connection {
  fromName: string;
  toName: string;
  fromLng: number;
  fromLat: number;
  toLng: number;
  toLat: number;
  value: number;
}

function generateConnectionData(): Connection[] {
  const connections: Connection[] = [];
  const mainCities = [...CITIES_DATA]
    .sort(() => 0.5 - Math.random())
    .slice(0, 5);

  for (const mainCity of mainCities) {
    const connectCount = Math.floor(Math.random() * 3) + 2;
    const targets = [...CITIES_DATA]
      .filter((city) => city.name !== mainCity.name)
      .sort(() => 0.5 - Math.random())
      .slice(0, connectCount);

    for (const target of targets) {
      connections.push({
        fromName: mainCity.name,
        toName: target.name,
        fromLng: mainCity.lng,
        fromLat: mainCity.lat,
        toLng: target.lng,
        toLat: target.lat,
        value: Math.floor(Math.random() * 100) + 20,
      });
    }
  }

  return connections;
}

export function ChinaMap({ paused }: ChinaMapProps) {
  const svgRef = useRef<SVGSVGElement>(null);
  const [connections, setConnections] = useState<Connection[]>(
    generateConnectionData(),
  );
  const [chinaGeoJson, setChinaGeoJson] = useState<FeatureCollection | null>(
    null,
  );
  const [loading, setLoading] = useState(true);
  const [dimensions, setDimensions] = useState({ width: 800, height: 600 });
  const [activeCity, setActiveCity] = useState<string | null>(null);

  // Fetch GeoJSON data
  useEffect(() => {
    fetch('../china.json')
      .then((response) => response.json())
      .then((data) => {
        console.log('Map data loaded:', data.features.length, 'features');
        setChinaGeoJson(data);
        setLoading(false);
      })
      .catch((error) => {
        console.error('Error loading China GeoJSON:', error);
        setLoading(false);
      });
  }, []);

  // Update connections periodically
  useEffect(() => {
    if (paused) return;

    const interval = setInterval(() => {
      setConnections(generateConnectionData());
    }, 20000);

    return () => clearInterval(interval);
  }, [paused]);

  // Handle resize
  useEffect(() => {
    const updateDimensions = () => {
      if (svgRef.current && svgRef.current.parentElement) {
        const { width, height } =
          svgRef.current.parentElement.getBoundingClientRect();
        setDimensions({ width, height });
      }
    };

    window.addEventListener('resize', updateDimensions);
    updateDimensions();

    return () => window.removeEventListener('resize', updateDimensions);
  }, []);

  // Render map with D3
  useEffect(() => {
    if (!chinaGeoJson || !svgRef.current) return;

    const svg = d3.select(svgRef.current);
    svg.selectAll('*').remove();

    const { width, height } = dimensions;

    // Improved projection to show complete China map
    // First calculate bounds of the GeoJSON to properly fit the map
    const path = d3.geoPath();
    const bounds = path.bounds(chinaGeoJson as any);
    const [[x0, y0], [x1, y1]] = bounds;

    // Calculate scale to fit the map properly
    const scale = 0.8 * Math.min(width / (x1 - x0), height / (y1 - y0));

    // Calculate center point of the map
    const centroid = d3.geoCentroid(chinaGeoJson as any);
    const projection = d3
      .geoMercator()
      .center(centroid)
      .scale(scale)
      .translate([width / 2, height / 2]);

    // Create path generator with the calculated projection
    const pathGenerator = d3.geoPath().projection(projection);

    // Create container groups
    const mapGroup = svg.append('g');
    const connectionGroup = svg.append('g');
    const cityGroup = svg.append('g');

    // Create tooltip
    const tooltip = d3
      .select(svgRef.current.parentElement)
      .append('div')
      .attr('class', 'absolute z-10 pointer-events-none')
      .style('display', 'none');

    // Add filter for glow effect
    const defs = svg.append('defs');
    const filter = defs.append('filter').attr('id', 'glow');
    filter
      .append('feGaussianBlur')
      .attr('stdDeviation', '3.5')
      .attr('result', 'coloredBlur');
    const feMerge = filter.append('feMerge');
    feMerge.append('feMergeNode').attr('in', 'coloredBlur');
    feMerge.append('feMergeNode').attr('in', 'SourceGraphic');

    // Calculate value ranges for color scaling
    const valueExtent = d3.extent(CITIES_DATA, (d: CityData) => d.value) as [
      number,
      number,
    ];
    const colorScale = d3
      .scaleLinear<string>()
      .domain(valueExtent)
      .range(['#90cdf4', '#3182ce']);

    const sizeScale = d3.scaleLog().domain(valueExtent).range([3, 12]);

    // Render map with improved style
    mapGroup
      .selectAll('path')
      .data(chinaGeoJson.features)
      .enter()
      .append('path')
      .attr('d', pathGenerator)
      .attr('fill', '#162a47')
      .attr('stroke', '#276ecf')
      .attr('stroke-width', 0.8)
      .attr('opacity', 0.7)
      .on('mouseover', function (this: SVGPathElement) {
        d3.select(this)
          .transition()
          .duration(300)
          .attr('fill', '#276ecf')
          .attr('opacity', 0.5);
      })
      .on('mouseout', function (this: SVGPathElement) {
        d3.select(this)
          .transition()
          .duration(300)
          .attr('fill', '#162a47')
          .attr('opacity', 0.7);
      });

    // Draw simple connection lines (less emphasis)
    connectionGroup
      .selectAll('line')
      .data(connections)
      .enter()
      .append('line')
      .attr('x1', (d: Connection) => projection([d.fromLng, d.fromLat])![0])
      .attr('y1', (d: Connection) => projection([d.fromLng, d.fromLat])![1])
      .attr('x2', (d: Connection) => projection([d.toLng, d.toLat])![0])
      .attr('y2', (d: Connection) => projection([d.toLng, d.toLat])![1])
      .attr('stroke', 'rgba(79, 195, 247, 0.3)')
      .attr('stroke-width', 0.8)
      .attr('stroke-dasharray', '3,3');

    // Add cities with improved visual clarity
    cityGroup
      .selectAll('circle')
      .data(CITIES_DATA)
      .enter()
      .append('circle')
      .attr('cx', (d: CityData) => projection([d.lng, d.lat])![0])
      .attr('cy', (d: CityData) => projection([d.lng, d.lat])![1])
      .attr('r', (d: CityData) => sizeScale(d.value))
      .attr('fill', (d: CityData) => colorScale(d.value))
      .attr('stroke', '#ffffff')
      .attr('stroke-width', 1)
      .attr('opacity', 0.9)
      .attr('cursor', 'pointer')
      .on(
        'mouseover',
        function (this: SVGCircleElement, event: MouseEvent, d: CityData) {
          // Highlight
          d3.select(this)
            .transition()
            .duration(200)
            .attr('r', sizeScale(d.value) * 1.3)
            .attr('fill', '#5df1ff');

          setActiveCity(d.name);

          // Show tooltip
          const [x, y] = projection([d.lng, d.lat])!;
          tooltip
            .style('display', 'block')
            .html(
              `
            <div class="p-2 text-xs bg-slate-800/90 rounded-md backdrop-blur-sm">
              <p class="font-bold text-blue-300">${d.name}</p>
              <p class="text-gray-300">客户数量: ${d.value}</p>
              <p class="text-gray-400">活跃: ${Math.floor(d.value * 0.7)}家</p>
            </div>
          `,
            )
            .style('left', `${x + 15}px`)
            .style('top', `${y - 15}px`);
        },
      )
      .on('mouseout', function (this: SVGCircleElement) {
        const d = d3.select(this).datum() as CityData;
        d3.select(this)
          .transition()
          .duration(200)
          .attr('r', sizeScale(d.value))
          .attr('fill', colorScale(d.value));

        setActiveCity(null);
        tooltip.style('display', 'none');
      });

    // Add city labels for all cities, with better visibility
    cityGroup
      .selectAll('text')
      .data(CITIES_DATA)
      .enter()
      .append('text')
      .attr(
        'x',
        (d: CityData) =>
          projection([d.lng, d.lat])![0] + sizeScale(d.value) + 3,
      )
      .attr('y', (d: CityData) => projection([d.lng, d.lat])![1] + 4)
      .attr('font-size', (d: CityData) => (d.value > 500 ? '12px' : '10px'))
      .attr('fill', '#CBD5E0')
      .text((d: CityData) => d.name)
      .attr('opacity', (d: CityData) => (d.value > 400 ? 1 : 0.7));
  }, [chinaGeoJson, connections, dimensions, activeCity]);

  return (
    <div className="relative h-full w-full rounded-lg bg-[#171B23]">
      {loading ? (
        <div className="flex h-full w-full items-center justify-center">
          <div className="h-12 w-12 animate-spin rounded-full border-4 border-t-4 border-blue-500 border-t-transparent"></div>
          <p className="ml-3 text-sm text-gray-400">
            Loading China map data...
          </p>
        </div>
      ) : (
        <div className="relative h-full w-full">
          <svg
            ref={svgRef}
            className="h-full w-full"
            width={dimensions.width}
            height={dimensions.height}
          ></svg>

          {/* City data summary */}
          <div className="absolute left-4 top-4 rounded-md bg-slate-800/80 p-3 text-xs backdrop-blur-sm">
            <div className="mb-2 font-semibold text-white">客户分布统计</div>
            <div className="grid grid-cols-2 gap-2">
              <div>
                <span className="text-gray-400">总客户数:</span>
                <span className="ml-1 text-blue-300">
                  {CITIES_DATA.reduce((sum, city) => sum + city.value, 0)}
                </span>
              </div>
              <div>
                <span className="text-gray-400">覆盖城市:</span>
                <span className="ml-1 text-blue-300">{CITIES_DATA.length}</span>
              </div>
            </div>
          </div>

          {/* Legend */}
          <div className="absolute bottom-4 right-4 rounded-md bg-slate-800/80 p-3 text-xs backdrop-blur-sm">
            <div className="mb-2 font-semibold text-white">图例</div>
            <div className="space-y-2">
              <div className="flex items-center">
                <div className="mr-2 h-3 w-6 bg-gradient-to-r from-blue-200 to-blue-600"></div>
                <span className="text-gray-300">客户数量</span>
              </div>
              <div className="flex items-center">
                <div className="mr-2 h-3 w-3 rounded-full bg-blue-500"></div>
                <span className="text-gray-300">城市分布</span>
              </div>
              <div className="flex items-center">
                <div className="mr-2 h-0.5 w-6 border-t border-dashed border-blue-300"></div>
                <span className="text-gray-300">数据连接</span>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
