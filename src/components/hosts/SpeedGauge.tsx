import React from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer } from 'recharts';

interface SpeedGaugeProps {
    value: number;
    max: number;
    label: string;
    unit: string;
    color?: string;
}

export const SpeedGauge: React.FC<SpeedGaugeProps> = ({ value, max, label, unit, color = '#00EDA0' }) => {
    // Normalize value strictly between 0 and max for the gauge visual
    const chartValue = Math.min(Math.max(0, value), max);
    const remaining = max - chartValue;

    const data = [
        { name: 'Value', value: chartValue },
        { name: 'Remaining', value: remaining },
    ];

    // Calculate percentage for display
    const percentage = Math.round((chartValue / max) * 100);

    return (
        <div className="flex flex-col items-center justify-center p-4 bg-background-elevated border border-border rounded-xl relative overflow-hidden">
            <h3 className="text-xs uppercase tracking-wider text-foreground-subtle mb-2">{label}</h3>

            <div className="relative w-full h-[120px] flex items-end justify-center">
                <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                        <Pie
                            data={data}
                            cx="50%"
                            cy="100%"
                            startAngle={180}
                            endAngle={0}
                            innerRadius={60}
                            outerRadius={80}
                            paddingAngle={0}
                            dataKey="value"
                            stroke="none"
                        >
                            <Cell key="value" fill={color} className="drop-shadow-[0_0_10px_rgba(0,237,160,0.3)]" />
                            <Cell key="remaining" fill="hsl(var(--secondary))" opacity={0.1} />
                        </Pie>
                    </PieChart>
                </ResponsiveContainer>

                {/* Value Display */}
                <div className="absolute bottom-0 flex flex-col items-center">
                    <span className="text-2xl font-bold font-mono text-foreground">{value}</span>
                    <span className="text-xs text-foreground-muted">{unit}</span>
                </div>
            </div>
        </div>
    );
};
