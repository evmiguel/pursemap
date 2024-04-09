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

type DataItem = {
    name: string;
    value: number;
};

type DonutChartProps = {
    width: number;
    height: number;
    data: DataItem[];
};

const colors = [
    "#e0ac2b",
    "#e85252",
    "#6689c6",
    "#9a6fb0",
    "#a53253",
    "#69b3a2",
  ];

const MARGIN_X = 150;
const MARGIN_Y = 50;
const INFLEXION_PADDING = 20; // space between donut and label inflexion point

const sumByKey = (arr: Array<any>, key: string, value: string) => {
    const map = new Map();
    for(const obj of arr) {
      const currSum = map.get(obj[key]) || 0;
      map.set(obj[key], currSum + obj[value]);
    }
    const res = Array.from(map, ([k, v]) => ({[key]: k, [value]: v}));
    return res;
}

export default function Analysis({ purchases }: AnalysisProps) {
    const context = useContext(FilterContext);

    const filteredPurchases = filterPurchases(purchases, context.purchaseFilter);

    const itemsBought = filteredPurchases.filter((value, index, self) => index === self.findIndex((p) => p.name === value.name));

    const categoriesChartData = sumByKey(filteredPurchases.map(purchase => { 
        return { name: purchase.category, value: 1}
    }), 'name', 'value');


    const width = 500;
    const height = 500;
    const radius = Math.min(width - 2 * MARGIN_X, height - 2 * MARGIN_Y) / 2;
    const innerRadius = radius / 2;

    const pie = useMemo(() => {
        const pieGenerator = d3.pie<any, any>().value((d) => d.value);
        return pieGenerator(categoriesChartData);
    }, [categoriesChartData]);

    const arcGenerator = d3.arc();

    const shapes = pie.map((grp, i) => {
        // First arc is for the donut
        const sliceInfo = {
          innerRadius,
          outerRadius: radius,
          startAngle: grp.startAngle,
          endAngle: grp.endAngle,
        };
        const centroid = arcGenerator.centroid(sliceInfo);
        const slicePath = arcGenerator(sliceInfo);
    
        // Second arc is for the legend inflexion point
        const inflexionInfo = {
          innerRadius: radius + INFLEXION_PADDING,
          outerRadius: radius + INFLEXION_PADDING,
          startAngle: grp.startAngle,
          endAngle: grp.endAngle,
        };
        const inflexionPoint = arcGenerator.centroid(inflexionInfo);
    
        const isRightLabel = inflexionPoint[0] > 0;
        const labelPosX = inflexionPoint[0] + 50 * (isRightLabel ? 1 : -1);
        const textAnchor = isRightLabel ? "start" : "end";
        const label = grp.data.name;
    
        return (
          <g key={i}>
            <path d={slicePath} fill={colors[i]} />
            <circle cx={centroid[0]} cy={centroid[1]} r={2} />
            <line
              x1={centroid[0]}
              y1={centroid[1]}
              x2={inflexionPoint[0]}
              y2={inflexionPoint[1]}
              stroke={"black"}
              fill={"black"}
            />
            <line
              x1={inflexionPoint[0]}
              y1={inflexionPoint[1]}
              x2={labelPosX}
              y2={inflexionPoint[1]}
              stroke={"black"}
              fill={"black"}
            />
            <text
              x={labelPosX + (isRightLabel ? 2 : -2)}
              y={inflexionPoint[1]}
              textAnchor={textAnchor}
              dominantBaseline="middle"
              fontSize={14}
            >
              {label}
            </text>
          </g>
        );
      });

    return (
        <Dialog>
            <DialogTrigger asChild>
                <Button className="Analyze">Analyze</Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[1000px]">
                <DialogHeader>
                    <DialogTitle>This is what you&apos;ve accumulated {context.purchaseFilter === 'all' ? 'for all time' : `this ${context.purchaseFilter}`}</DialogTitle>
                </DialogHeader>
                <Tabs defaultValue="items">
                    <TabsList className="grid w-full grid-cols-2">
                        <TabsTrigger value="items">Items</TabsTrigger>
                        <TabsTrigger value="categories">Categories</TabsTrigger>
                    </TabsList>
                    <TabsContent value="items">
                        <ul>
                            {itemsBought.map(purchase => (
                                <li key={purchase.id}>{purchase.name}</li>
                            ))}
                        </ul>
                    </TabsContent>
                    <TabsContent value="categories">
                        <div className="text-center">
                            <svg width={width} height={height} style={{ display: "inline-block" }}>
                                <g transform={`translate(${width / 2}, ${height / 2})`}>{shapes}</g>
                            </svg>
                        </div>
                    </TabsContent>
                </Tabs>
            </DialogContent>
        </Dialog>
    )
}