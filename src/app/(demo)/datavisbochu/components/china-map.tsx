'use client';

import React, { useEffect, useRef, useState } from 'react';
import * as d3 from 'd3';
import { Feature, FeatureCollection } from 'geojson';

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

interface Connection {
  fromName: string;
  toName: string;
  coords: [number, number][];
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
        coords: [
          [mainCity.lng, mainCity.lat],
          [target.lng, target.lat],
        ],
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
  const [dimensions, setDimensions] = useState({ width: 1920, height: 1080 });

  // Fetch GeoJSON data
  useEffect(() => {
    // 使用本地的GeoJSON文件
    // 导入在同一目录下的chinaGeoJson.json
    fetch('/datavisbochu/chinaGeoJson.json')
      .then((response) => response.json())
      .then((data) => {
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

    // 改进的投影设置，更好地展示完整的中国地图
    const projection = d3
      .geoMercator()
      .center([105, 30]) // 调整中心位置
      .scale(width * 0.5) // 调整缩放以显示完整的中国地图
      .translate([width / 2, height / 2]); // 调整位置

    // Create path generator
    const pathGenerator = d3.geoPath().projection(projection);

    // Create container groups
    const containerGroup = svg.append('g'); // Main container for zooming
    const mapGroup = containerGroup.append('g');
    const connectionGroup = containerGroup.append('g');
    const cityGroup = containerGroup.append('g');

    // Add zoom behavior
    const zoom = d3
      .zoom<SVGSVGElement, unknown>()
      .scaleExtent([0.5, 8])
      .on('zoom', (event) => {
        containerGroup.attr('transform', event.transform);
      });

    svg.call(zoom);

    // Optional: Set initial zoom for better view
    svg.call(zoom.transform, d3.zoomIdentity.translate(0, 0).scale(1));

    // 创建省份悬停提示
    const tooltip = d3
      .select(svgRef.current.parentElement)
      .append('div')
      .attr('class', 'absolute z-20 pointer-events-none')
      .style('display', 'none');

    // Render map with improved styling
    mapGroup
      .selectAll('path')
      .data(chinaGeoJson.features)
      .enter()
      .append('path')
      .attr('d', pathGenerator)
      .attr('stroke', 'var(--bochu-primary-dark)')
      .attr('fill', 'var(--bochu-background-card)')
      .attr('stroke-width', 1) // Thinner borders for cleaner look
      .attr('opacity', 1)
      .attr('cursor', 'pointer')
      .on('mouseover', function (event, d: any) {
        // 高亮当前省份
        d3.select(this)
          .transition()
          .duration(300)
          .attr('fill', 'var(--bochu-background-card)')
          .attr('opacity', 0.9);

        // 显示省份名称提示
        const province = d.properties?.name || '';
        const [x, y] = d3.pointer(event, svg.node());

        tooltip
          .style('display', 'block')
          .html(
            `
            <div class="p-2 text-xs bg-slate-800/90 rounded-md backdrop-blur-sm">
              <p class="font-bold text-blue-300">${province}</p>
            </div>
          `,
          )
          .style('left', x + 15 + 'px')
          .style('top', y - 15 + 'px');
      })
      .on('mouseout', function () {
        d3.select(this)
          .transition()
          .duration(300)
          .attr('fill', '#1e293b')
          .attr('opacity', 1);

        tooltip.style('display', 'none');
      });

    // 添加主要省份名称标签
    chinaGeoJson.features.forEach((feature) => {
      const province = feature.properties?.name || '';
      // 计算省份中心点
      const centroid = pathGenerator.centroid(feature);

      // 只为较大的省份添加标签，避免拥挤
      const majorProvinces = [
        '新疆',
        '西藏',
        '内蒙古',
        '青海',
        '四川',
        '黑龙江',
        '甘肃',
        '云南',
        '广西',
        '湖南',
      ];

      if (majorProvinces.includes(province)) {
        mapGroup
          .append('text')
          .attr('x', centroid[0])
          .attr('y', centroid[1])
          .attr('text-anchor', 'middle')
          .attr('font-size', '10px')
          .attr('fill', '#9ca3af')
          .attr('pointer-events', 'none')
          .text(province);
      }
    });

    // Add cities with improved sizing
    CITIES_DATA.forEach((city) => {
      const [x, y] = projection([city.lng, city.lat]) || [0, 0];
      const size = Math.log(city.value) * 1.3; // Slightly adjusted sizing

      // City outer glow
      cityGroup
        .append('circle')
        .attr('cx', x)
        .attr('cy', y)
        .attr('r', size * 2.2)
        .attr('fill', 'rgba(49, 130, 206, 0.25)')
        .attr('class', 'city-glow')
        .attr('filter', 'url(#glow)');

      // City dot
      const cityDot = cityGroup
        .append('circle')
        .attr('cx', x)
        .attr('cy', y)
        .attr('r', size)
        .attr('fill', 'var(--bochu-primary)')
        .attr('stroke', 'var(--bochu-primary-light)')
        .attr('stroke-width', 1)
        .attr('cursor', 'pointer')
        .on('mouseover', function () {
          // Show tooltip with improved positioning
          tooltip
            .style('display', 'block')
            .html(
              `
              <div class="p-2 text-xs bg-slate-800/90 rounded-md backdrop-blur-sm">
                <p class="font-bold text-blue-300">${city.name}</p>
                <p class="text-gray-300">客户数量: ${city.value}</p>
                <p class="text-gray-400">活跃: ${Math.floor(city.value * 0.7)}</p>
              </div>
            `,
            )
            .style('left', x + 15 + 'px')
            .style('top', y - 15 + 'px');

          d3.select(this)
            .transition()
            .duration(300)
            .attr('fill', 'var(--bochu-success)');
        })
        .on('mouseout', function () {
          tooltip.style('display', 'none');
          d3.select(this)
            .transition()
            .duration(300)
            .attr('fill', 'var(--bochu-primary)');
        });

      // Add pulsing animation to major cities
      if (city.value > 700) {
        cityDot.classed('animate-pulse', true);
      }

      // Add city name for major cities with better visibility
      if (city.value > 500) {
        cityGroup
          .append('text')
          .attr('x', x + size + 4)
          .attr('y', y + 4)
          .attr('font-size', '12px')
          .attr('fill', '#CBD5E0')
          .attr('paint-order', 'stroke') // Add text border for better readability
          .attr('stroke', '#111827')
          .attr('stroke-width', '3px')
          .attr('stroke-opacity', '0.6')
          .text(city.name);
      }
    });

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

    // 添加城市之间的连接线
    connections.forEach((connection) => {
      // 创建曲线路径
      const curveGenerator = d3
        .line<[number, number]>()
        .x((d) => d[0])
        .y((d) => d[1])
        .curve(d3.curveBasis);

      // 把城市经纬度坐标转换为屏幕坐标
      const [fromCity] = CITIES_DATA.filter(
        (city) => city.name === connection.fromName,
      );
      const [toCity] = CITIES_DATA.filter(
        (city) => city.name === connection.toName,
      );

      if (fromCity && toCity) {
        const source = projection([fromCity.lng, fromCity.lat]) || [0, 0];
        const target = projection([toCity.lng, toCity.lat]) || [0, 0];

        // 创建曲线控制点 (让线条有弧度)
        const dx = target[0] - source[0];
        const dy = target[1] - source[1];
        const dr = Math.sqrt(dx * dx + dy * dy);

        // 控制点偏移，让线条有弧度
        const mid1: [number, number] = [
          source[0] + dx / 3 + (Math.random() - 0.5) * dx * 0.2,
          source[1] + dy / 3 + (Math.random() - 0.5) * dy * 0.2,
        ];
        const mid2: [number, number] = [
          source[0] + (dx * 2) / 3 + (Math.random() - 0.5) * dx * 0.2,
          source[1] + (dy * 2) / 3 + (Math.random() - 0.5) * dy * 0.2,
        ];

        const curvePoints: [number, number][] = [
          source as [number, number],
          mid1,
          mid2,
          target as [number, number],
        ];

        // 绘制连接线
        const path = connectionGroup
          .append('path')
          .attr('d', curveGenerator(curvePoints))
          .attr('fill', 'none')
          .attr('stroke', 'rgba(49, 130, 206, 0.3)')
          .attr('stroke-width', 1.5)
          .attr('opacity', 0.6)
          .attr('class', 'connection-line');

        const pathLength = path.node()?.getTotalLength() || 0;

        // 给连接线添加动画效果
        connectionGroup
          .append('circle')
          .attr('r', 3)
          .attr('fill', '#5df1ff')
          .attr('opacity', 0.8)
          .attr('filter', 'url(#glow)')
          .attr('class', 'animate-pulse')
          .append('animateMotion')
          .attr('dur', `${5 + Math.random() * 5}s`) // 随机动画时间
          .attr('repeatCount', 'indefinite')
          .attr('path', path.attr('d'));
      }
    });
  }, [chinaGeoJson, connections, dimensions]);

  return (
    <div className="absolute z-0 rounded-lg">
      {loading ? (
        <div className="flex h-full w-full items-center justify-center">
          <div className="h-12 w-12 animate-spin rounded-full border-4 border-t-4 border-[var(--bochu-primary)] border-t-transparent"></div>
          <p className="ml-3 text-sm text-gray-400">加载地图中...</p>
        </div>
      ) : (
        <div className="relative h-full w-full">
          <svg
            ref={svgRef}
            className="h-full w-full"
            width={dimensions.width}
            height={dimensions.height}
          ></svg>

          {/* Controls - Simple zoom buttons */}
          <div className="absolute left-4 top-4 flex flex-col gap-2">
            <button
              className="rounded bg-slate-800/70 p-2 text-white backdrop-blur-sm hover:bg-slate-700/70"
              onClick={() => {
                if (svgRef.current) {
                  const svg = d3.select(svgRef.current);
                  const zoom = d3
                    .zoom<SVGSVGElement, unknown>()
                    .scaleExtent([0.5, 8]);
                  svg.transition().call(zoom.scaleBy as any, 1.3);
                }
              }}
            >
              <svg
                width="14"
                height="14"
                viewBox="0 0 24 24"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M12 4V20M4 12H20"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                />
              </svg>
            </button>
            <button
              className="rounded bg-slate-800/70 p-2 text-white backdrop-blur-sm hover:bg-slate-700/70"
              onClick={() => {
                if (svgRef.current) {
                  const svg = d3.select(svgRef.current);
                  const zoom = d3
                    .zoom<SVGSVGElement, unknown>()
                    .scaleExtent([0.5, 8]);
                  svg.transition().call(zoom.scaleBy as any, 0.7);
                }
              }}
            >
              <svg
                width="14"
                height="14"
                viewBox="0 0 24 24"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M4 12H20"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                />
              </svg>
            </button>
            <button
              className="rounded bg-slate-800/70 p-2 text-white backdrop-blur-sm hover:bg-slate-700/70"
              onClick={() => {
                if (svgRef.current) {
                  const svg = d3.select(svgRef.current);
                  const zoom = d3
                    .zoom<SVGSVGElement, unknown>()
                    .scaleExtent([0.5, 8]);
                  svg.transition().call(zoom.transform as any, d3.zoomIdentity);
                }
              }}
            >
              <svg
                width="14"
                height="14"
                viewBox="0 0 24 24"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M15 9l-6 6M9 9l6 6"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                />
              </svg>
            </button>
          </div>

          {/* Legend */}
          <div className="absolute bottom-96 right-1/4 rounded-md bg-slate-800/70 p-3 text-xs backdrop-blur-sm">
            <div className="mb-2 font-semibold text-white">图例</div>
            <div className="space-y-2">
              <div className="flex items-center">
                <div className="mr-2 h-3 w-3 animate-pulse rounded-full bg-[var(--bochu-primary)]"></div>
                <span className="text-[var(--bochu-text-muted)]">客户分布</span>
              </div>
              <div className="flex items-center">
                <div className="mr-2 h-3 w-3 animate-pulse rounded-full bg-[var(--bochu-success)]"></div>
                <span className="text-[var(--bochu-text-muted)]">实时活动</span>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
