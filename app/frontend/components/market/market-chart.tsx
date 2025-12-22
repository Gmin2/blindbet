'use client'

import { Area, AreaChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

const data = [
    { time: '00:00', yes: 45, no: 55 },
    { time: '04:00', yes: 48, no: 52 },
    { time: '08:00', yes: 42, no: 58 },
    { time: '12:00', yes: 52, no: 48 },
    { time: '16:00', yes: 55, no: 45 },
    { time: '20:00', yes: 58, no: 42 },
    { time: '24:00', yes: 62, no: 38 },
]

export function MarketChart() {
    return (
        <Card className="border-border/50 bg-card/50 backdrop-blur-sm rounded-none">
            <CardHeader>
                <CardTitle className="text-lg font-medium text-muted-foreground">Outcome Probability History</CardTitle>
            </CardHeader>
            <CardContent>
                <div className="h-[300px] w-full">
                    <ResponsiveContainer width="100%" height="100%">
                        <AreaChart data={data}>
                            <defs>
                                <linearGradient id="colorYes" x1="0" y1="0" x2="0" y2="1">
                                    <stop offset="5%" stopColor="#22c55e" stopOpacity={0.3}/>
                                    <stop offset="95%" stopColor="#22c55e" stopOpacity={0}/>
                                </linearGradient>
                                <linearGradient id="colorNo" x1="0" y1="0" x2="0" y2="1">
                                    <stop offset="5%" stopColor="#ef4444" stopOpacity={0.3}/>
                                    <stop offset="95%" stopColor="#ef4444" stopOpacity={0}/>
                                </linearGradient>
                            </defs>
                            <XAxis 
                                dataKey="time" 
                                stroke="#888888" 
                                fontSize={12} 
                                tickLine={false} 
                                axisLine={false} 
                            />
                            <YAxis 
                                stroke="#888888" 
                                fontSize={12} 
                                tickLine={false} 
                                axisLine={false} 
                                tickFormatter={(value) => `${value}%`} 
                            />
                            <Tooltip 
                                contentStyle={{ backgroundColor: '#1f2937', border: 'none', borderRadius: '0px' }}
                                itemStyle={{ color: '#fff' }}
                            />
                            <Area 
                                type="monotone" 
                                dataKey="yes" 
                                stroke="#22c55e" 
                                strokeWidth={2}
                                fillOpacity={1} 
                                fill="url(#colorYes)" 
                                name="Yes"
                            />
                            <Area 
                                type="monotone" 
                                dataKey="no" 
                                stroke="#ef4444" 
                                strokeWidth={2}
                                fillOpacity={1} 
                                fill="url(#colorNo)" 
                                name="No"
                            />
                        </AreaChart>
                    </ResponsiveContainer>
                </div>
            </CardContent>
        </Card>
    )
}
