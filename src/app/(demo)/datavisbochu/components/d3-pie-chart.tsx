'use client';

import React, { useEffect, useRef, useState } from 'react';
import * as d3 from 'd3';
import { Card } from '@/components/ui/card';
import { AnimatedCounter } from './animated-counter';

interface PieChartData {
  name: string;
  value: number;
  color: string;
}

interface D3PieChartProps {
  paused: boolean;
  customerCount?: number;
  productionCapacity?: number;
}

export function D3PieChart({
  paused,
  customerCount = 37846,
  productionCapacity = 1870,
}: D3PieChartProps) {
  const svgRef = useRef<SVGSVGElement>(null);
  const [data, setData] = useState<PieChartData[]>([
    { name: '机械制造', value: 28, color: '#60A5FA' },
    { name: '钢结构', value: 22, color: '#34D399' },
    { name: '模具制造', value: 18, color: '#F59E0B' },
    { name: '装配设备', value: 15, color: '#EC4899' },
    { name: '金属加工', value: 12, color: '#A78BFA' },
    { name: '自动化', value: 5, color: '#10B981' },
  ]);

  // 随机更新数据
  useEffect(() => {
    if (paused) return;

    const interval = setInterval(() => {
      const newData = [...data];
      // 随机更新数据
      newData.forEach((item) => {
        item.value = Math.max(
          10,
          Math.min(50, item.value + Math.floor(Math.random() * 5) - 2),
        );
      });
      // 确保总和为100
      const total = newData.reduce((sum, item) => sum + item.value, 0);
      newData.forEach((item) => {
        item.value = Math.round((item.value / total) * 100);
      });
      // 调整，确保总和为100
      const finalTotal = newData.reduce((sum, item) => sum + item.value, 0);
      if (finalTotal !== 100) {
        newData[0].value += 100 - finalTotal;
      }

      setData([...newData]);
    }, 5000);

    return () => clearInterval(interval);
  }, [paused, data]);

  // 绘制饼图
  useEffect(() => {
    if (!svgRef.current) return;

    const svg = d3.select(svgRef.current);
    svg.selectAll('*').remove();

    const width = svgRef.current.clientWidth;
    const height = svgRef.current.clientHeight;
    const radius = (Math.min(width, height) / 2) * 0.8;

    // 创建饼图布局
    const pie = d3
      .pie<PieChartData>()
      .value((d) => d.value)
      .sort(null);

    // 创建弧生成器
    const arc = d3
      .arc<d3.PieArcDatum<PieChartData>>()
      .innerRadius(radius * 0.4) // 内半径，创建环形图效果
      .outerRadius(radius * 0.9);

    // 创建标签弧生成器
    const labelArc = d3
      .arc<d3.PieArcDatum<PieChartData>>()
      .innerRadius(radius * 0.6)
      .outerRadius(radius * 0.6);

    // 中心组
    const g = svg
      .append('g')
      .attr('transform', `translate(${width / 2},${height / 2})`);

    // 创建外发光效果的过滤器
    const defs = svg.append('defs');
    const filter = defs.append('filter').attr('id', 'glow');

    filter
      .append('feGaussianBlur')
      .attr('stdDeviation', '3.5')
      .attr('result', 'coloredBlur');

    const feMerge = filter.append('feMerge');
    feMerge.append('feMergeNode').attr('in', 'coloredBlur');
    feMerge.append('feMergeNode').attr('in', 'SourceGraphic');

    // 绘制饼图部分
    const arcs = g
      .selectAll('.arc')
      .data(pie(data))
      .enter()
      .append('g')
      .attr('class', 'arc');

    // 添加前发光效果
    arcs
      .append('path')
      .attr('d', arc)
      .attr('fill', (d) => d.data.color)
      .attr('opacity', 0.3)
      .attr('filter', 'url(#glow)');

    // 添加主要路径
    arcs
      .append('path')
      .attr('d', arc)
      .attr('fill', (d) => d.data.color)
      .attr('stroke', '#1e293b')
      .attr('stroke-width', 2)
      .attr('opacity', 0.8)
      .on('mouseover', function () {
        d3.select(this)
          .transition()
          .duration(300)
          .attr('opacity', 1)
          .attr('transform', 'scale(1.05)');
      })
      .on('mouseout', function () {
        d3.select(this)
          .transition()
          .duration(300)
          .attr('opacity', 0.8)
          .attr('transform', 'scale(1)');
      });

    // 添加百分比标签
    arcs
      .append('text')
      .attr('transform', (d) => `translate(${labelArc.centroid(d)})`)
      .attr('dy', '.35em')
      .attr('text-anchor', 'middle')
      .attr('fill', '#ffffff')
      .attr('font-size', '24px')
      .attr('font-weight', 'bold')
      .text((d) => `${d.data.value}%`);

    // 中心圆环
    g.append('circle')
      .attr('cx', 0)
      .attr('cy', 0)
      .attr('r', radius * 0.3)
      .attr('fill', '#1e293b')
      .attr('stroke', '#2a4d79')
      .attr('stroke-width', 2)
      .attr('opacity', 0.8);

    // 中心文字
    g.append('text')
      .attr('x', 0)
      .attr('y', 0)
      .attr('text-anchor', 'middle')
      .attr('dy', '0.3em')
      .attr('fill', '#ffffff')
      .attr('font-size', '14px')
      .attr('font-weight', 'bold')
      .text('行业分布');
  }, [data]);

  return (
    <div className="flex h-full flex-col">
      {/* 统计数据 */}

      <div className="grid grid-cols-2 gap-2">
        <Card className="rounded-sm border-none bg-gradient-to-br from-[#1e293b] to-[#162131] p-2 shadow-md">
          <div className="flex flex-col">
            <h3 className="text-lg font-medium text-blue-300/80">客户总数</h3>
            <div className="mt-1 text-2xl">
              <AnimatedCounter from={0} to={customerCount} />
            </div>
          </div>
        </Card>
        <Card className="rounded-sm border-none bg-gradient-to-br from-[#1e293b] to-[#162131] p-2 shadow-md">
          <div className="flex flex-col">
            <h3 className="text-lg font-medium text-blue-300/80">制造产能</h3>
            <div className="mt-1 flex items-baseline text-2xl text-white">
              <AnimatedCounter from={0} to={productionCapacity} />
              <span className="ml-1 text-lg text-gray-400">吨</span>
            </div>
          </div>
        </Card>
      </div>

      <div className="relative flex-1 justify-center">
        <svg
          ref={svgRef}
          className="h-full w-full"
          style={{ minHeight: '200px' }}
        ></svg>
      </div>

      <div className="mt-2 grid grid-cols-3 gap-1">
        {data.map((item) => (
          <div
            key={item.name}
            className="rounded-md border-2 border-[#2a4d79] bg-[#1e293b80] p-1"
          >
            <p className="text-lg text-gray-400">{item.name}</p>
            <p className="text-2xl font-bold" style={{ color: item.color }}>
              {item.value}%
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}
