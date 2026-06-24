import React, { useEffect, useState } from 'react'
import HealthCard from '../components/HealthCard'
import RiskChart from '../components/RiskChart'

export default function Overview(){
  const [summary, setSummary] = useState(null)

  useEffect(()=>{
    fetch('/api/analysis/summary').then(r=>r.json()).then(setSummary).catch(()=>{})
  },[])

  return (
    <div>
      <h2>Overview</h2>
      <div className="cards">
        <HealthCard title="Average Health" score={summary?summary.averageHealthScore:72} risk="Mixed" />
        <div className="card">
          <h3>Total Repositories</h3>
          <div style={{fontSize:28,fontWeight:700}}>{summary?summary.totalRepositories:0}</div>
          <div style={{color:'#9aa4b2'}}>Sample repositories analyzed</div>
        </div>
        <RiskChart />
      </div>
    </div>
  )
}
