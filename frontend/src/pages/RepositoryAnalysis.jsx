import React, { useEffect, useState } from 'react'
import HealthCard from '../components/HealthCard'

const sampleRepos = [
  'facebook/react','microsoft/typescript','vercel/next.js','expressjs/express','rust-lang/rust'
]

export default function RepositoryAnalysis(){
  const [repos, setRepos] = useState([])
  const [selected, setSelected] = useState(null)
  const [prediction, setPrediction] = useState(null)

  useEffect(()=>{
    fetch('/api/repositories').then(r=>r.json()).then(setRepos).catch(()=>setRepos(sampleRepos.map(r=>({fullName:r}))))
  },[])

  function analyze(repo){
    // Create some mock input based on repo
    const mock = {
      projectName: repo.fullName,
      language: repo.fullName.includes('rust')? 'Rust' : 'JS',
      linesOfCode: Math.floor(Math.random()*500000),
      ageInMonths: Math.floor(Math.random()*200),
      numberOfContributors: Math.floor(Math.random()*200),
      openIssues: Math.floor(Math.random()*1000),
      testCoverage: Math.floor(Math.random()*100),
      hasCI: Math.random()>0.2,
      commitFrequencyPerMonth: Math.floor(Math.random()*200)
    }
    fetch('/api/predict',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify(mock)})
      .then(r=>r.json()).then(j=>setPrediction(j)).catch(()=>{})
    setSelected(repo.fullName)
  }

  return (
    <div>
      <h2>Repository Analysis</h2>
      <div style={{display:'flex',gap:16}}>
        <div style={{width:300}}>
          <h4>Repositories</h4>
          <div style={{display:'grid',gap:8}}>
            {repos.map(r=>(
              <button key={r.fullName} onClick={()=>analyze(r)} style={{textAlign:'left'}}>{r.fullName}</button>
            ))}
          </div>
        </div>
        <div style={{flex:1}}>
          {selected && <h3>Analysis: {selected}</h3>}
          {prediction ? (
            <div className="cards">
              <HealthCard title={prediction.projectName} score={prediction.healthScore} risk={prediction.riskLevel} recommendations={prediction.recommendations} />
            </div>
          ) : (
            <div className="card">Select a repository to run analysis.</div>
          )}
        </div>
      </div>
    </div>
  )
}
