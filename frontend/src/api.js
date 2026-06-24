export async function predict(input){
  const res = await fetch('/api/predict',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify(input)})
  return res.json()
}
