import React, { useEffect, useState } from 'react'
import apiClient from '../utils/apiClient'

const Sandbox = () => {
  const [sandboxData, setSandBoxData] = useState() ;

  useEffect(() => {

    const fetchData = async()=>{
      const response = await apiClient.get('/sandbox')
      console.log(response.data)
      setSandBoxData(response.data)
    }
    fetchData()
  },[])
  return (
    <div>

      {
        sandboxData && sandboxData.data.map((item, index) => (
          <div key={index}>
            <h1>{item.Title}</h1>
            <p>{item.Description}</p>
            <p>{item.Elink}</p>
            <iframe
              src={item.Elink}
              title="CodeSandbox Embed"
              className="w-full h-[600px] border-0"
              allow="accelerometer; ambient-light-sensor; camera; encrypted-media; geolocation; gyroscope; hid; microphone; midi; payment; usb; vr; xr-spatial-tracking"
              sandbox="allow-forms allow-modals allow-popups allow-presentation allow-same-origin allow-scripts"
            ></iframe>

          </div>
        ))
      }
    </div>

  )
}

export default Sandbox