

const Counter = () {

const [count, setCount] = usestate(0)
function handleCounter(){
  setCount(count + 1)
}

  return (
    <div>
    <h1>{count}</h1>
    <button onclick={handleCounter}>Increase</button>
    </div>
  )
}


useEffect(()=>{

}, [])

import {useNavigate} from 'react-router-dom'
const navigate = useNavigate()
navigate('/home')




useEffect(()=>{
const fetchData = async () =>{
    const reponse = await fetch('sdad');
    const data = await response.json();
    setData(data)
  fetchData()
}

}, [])












import React, {useEffect, useState} from 'react'

const fetchComp = ()={
const [data, setData] = useState(null);
const [error. setError]=useState(null);

const FetchFunc = async ()=>{
try{
   const response = await axios("sadasD")
   setData(response.data)
}
catch (error){
  console.log(error)
}
}

useEffect(()=>{
FetchFunc();
}, [])

  return (
    <>
    {data.map(dadu , index){
      return <h1>{dadu.ss}</h1>
    }}
    </>
  )
}



