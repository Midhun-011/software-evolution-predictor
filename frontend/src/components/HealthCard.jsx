import React from 'react'

export default function HealthCard({title, score, risk, recommendations=[]}){
  return (
    <div className="card">
      <h3>{title}</h3>
      <div style={{fontSize:28,fontWeight:700}}>{score}</div>
      <div style={{color:'#9aa4b2'}}>Risk: {risk}</div>
      {recommendations.length>0 && (
        <ul style={{marginTop:8,color:'#cdd7e6'}}>
          {recommendations.map((r,i)=>(<li key={i}>{r}</li>))}
        </ul>
      )}
    </div>
  )
}
