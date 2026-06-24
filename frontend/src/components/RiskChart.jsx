import React, { useEffect, useState } from 'react'
import { Pie } from 'react-chartjs-2'
import { Chart, ArcElement, Tooltip, Legend } from 'chart.js'
Chart.register(ArcElement, Tooltip, Legend)

export default function RiskChart(){
  const [data, setData] = useState({labels:['Low','Medium','High'],datasets:[{data:[2,2,1],backgroundColor:['#4ade80','#f59e0b','#f87171']} ]})

  useEffect(()=>{
    fetch('/api/analysis/summary')
      .then(r=>r.json())
      .then(j=>{
        const d = [j.riskDistribution.Low||0, j.riskDistribution.Medium||0, j.riskDistribution.High||0]
        setData({labels:['Low','Medium','High'],datasets:[{data:d,backgroundColor:['#4ade80','#f59e0b','#f87171']} ]})
      }).catch(()=>{})
  },[])

  return (
    <div className="chart card">
      <h4>Risk Distribution</h4>
      <Pie data={data} />
    </div>
  )
}
