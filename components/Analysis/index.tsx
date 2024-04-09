'use client';

import { Button } from "../ui/button";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
  } from "@/components/ui/dialog"
import {
    Tabs,
    TabsContent,
    TabsList,
    TabsTrigger,
  } from "@/components/ui/tabs"
import { useContext, useMemo } from "react";
import { FilterContext } from "@/app/filter-provider";
import { filterPurchases } from "../Purchases";
import { Purchase } from "../Purchases/columns";
import * as d3 from 'd3';

type AnalysisProps = {
    purchases: Array<Purchase>
}

const sumByKey = (arr: Array<any>, key: string, value: string) => {
    const map = new Map();
    for(const obj of arr) {
      const currSum = map.get(obj[key]) || 0;
      map.set(obj[key], currSum + obj[value]);
    }
    const res = Array.from(map, ([k, v]) => ({[key]: k, [value]: v}));
    return res;
}

const MARGIN = { top: 30, right: 30, bottom: 30, left: 30 };
const BAR_PADDING = 0.3;

export default function Analysis({ purchases }: AnalysisProps) {
    const context = useContext(FilterContext);

    const filteredPurchases = filterPurchases(purchases, context.purchaseFilter);

    const itemsBought = sumByKey(filteredPurchases, 'name', 'cost').sort((a, b) => b.cost - a.cost);

    const categoriesChartData = sumByKey(filteredPurchases.map(purchase => { 
        return { name: purchase.category, value: purchase.cost}
    }), 'name', 'value');

    // bounds = area inside the graph axis = calculated by substracting the margins
    const width = 700;
    const height = 700;
    const boundsWidth = width - MARGIN.right - MARGIN.left;
    const boundsHeight = height - MARGIN.top - MARGIN.bottom;

    // Y axis is for groups since the barplot is horizontal
    const groups = categoriesChartData.sort((a, b) => b.value - a.value).map((d) => d.name);
    
    const xScale = useMemo(() => {
      const [min, max] = d3.extent(categoriesChartData.map((d) => d.value));
      return d3
        .scaleLinear()
        .domain([0, max || 10])
        .range([0, boundsWidth]);
    }, [categoriesChartData, width]);

    const yScale = useMemo(() => {
      return d3
        .scaleBand()
        .domain(groups)
        .range([0, boundsHeight])
        .padding(BAR_PADDING);
    }, [categoriesChartData, height]);
    // Build the shapes
  const allShapes = categoriesChartData.map((d, i) => {
    const y = yScale(d.name);
    if (y === undefined) {
      return null;
    }

    return (
      <g key={i}>
        <rect
          x={xScale(0)}
          y={yScale(d.name)}
          width={xScale(d.value)}
          height={yScale.bandwidth()}
          opacity={0.7}
          stroke="#3399ff"
          fill="#3399ff"
          fillOpacity={0.3}
          strokeWidth={1}
          rx={1}
        />
        <text
          x={xScale(0) + 7}
          y={y + yScale.bandwidth() / 2}
          textAnchor="start"
          alignmentBaseline="central"
          fontSize={12}
        >
          {d.name}
        </text>
      </g>
    );
  });
 
    return (
        <Dialog>
            <DialogTrigger asChild>
                <Button className="Analyze">Analyze</Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[1000px] overflow-y-scroll">
                <DialogHeader>
                    <DialogTitle>This is what you&apos;ve accumulated {context.purchaseFilter === 'all' ? 'for all time' : `this ${context.purchaseFilter}`}</DialogTitle>
                </DialogHeader>
                <Tabs defaultValue="items">
                    <TabsList className="grid w-full grid-cols-2">
                        <TabsTrigger value="items">Items</TabsTrigger>
                        <TabsTrigger value="categories">Categories</TabsTrigger>
                    </TabsList>
                    <TabsContent value="items" className="overflow-scroll max-h-96">
                        <div>
                          <ul>
                              {itemsBought.map(purchase => (
                                  <li className="flex justify-between" key={purchase.name}><span className="inline-block">{purchase.name}</span> <span className="inline-block">{new Intl.NumberFormat("en-US", {
                                    style: "currency",
                                    currency: "USD",
                                }).format(purchase.cost)}</span></li>
                              ))}
                          </ul>
                        </div>
                    </TabsContent>
                    <TabsContent value="categories">
                    <div className="text-center max-h-96">
                      <svg width={width} height={height}>
                        <g
                          width={boundsWidth}
                          height={boundsHeight}
                          transform={`translate(${[MARGIN.left, MARGIN.top].join(",")})`}
                        >
                          {allShapes}
                        </g>
                      </svg>
                    </div>
                    </TabsContent>
                </Tabs>
            </DialogContent>
        </Dialog>
    )
}