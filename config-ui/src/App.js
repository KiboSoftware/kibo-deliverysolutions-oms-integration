import React, { useEffect, useState } from "react";
import { BrowserRouter as Router, Route, Switch } from "react-router-dom";

import TenantConfigurationPage from "./tenantConfigurationPage";

let empty = {
  id: "",
  kiboTenant:0 ,
  kiboSites: [],
  dsTenant: "",
  locationMapping: [], 
  dsCredentials: {
    apiKey: "",
    api: null,
  },
  createOrderEvent: "ACCEPTED_SHIPMENT",
  orderReadyEvent: "READY_FOR_DELIVERY",
  tipProductCode: "",
};

function App() {
  
  const [selectedConfiguration, setSelectedConfiguration] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const getApi = () => {
    const root = window.location.pathname.split("/")[1];
    return `/${root}/configs`;
  };

  useEffect(() => {
    fetch(`${getApi()}/current`)
      .then((response) => response.json())
      .then((data) => {
        if ( data.dsCredentials == null){
          data.dsCredentials = {
            apiKey: "",
            api: null,
          }
        }
        setSelectedConfiguration({...data});
        setIsLoading(false);
      })
      .catch((error) =>{       
        setSelectedConfiguration({...empty});
        setIsLoading(false);
        console.error("Error:", error)
      });
  }, []);

  const saveConfiguration = async (configuration) => {
    console.log("save", configuration);
    try {
      const response = await fetch(`${getApi()}/${configuration.id}`, {
        method: "PUT",
        body: JSON.stringify(configuration),
        headers: {
          "Content-Type": "application/json",
        },
      });
      const newConfiguration = response.json();
      setSelectedConfiguration(newConfiguration);
    } catch (error) {
      return console.error("Error:", error);
    }
  };


  return (
    <div>
      {isLoading ? <div>Loading...</div> :  <TenantConfigurationPage
          configuration={selectedConfiguration}
          onSave={saveConfiguration}
        />}
    </div>
  );
  // return (
   
  // );
  // return (
  //   <div className="App">
  //     <TenantConfigurationList configurations={configurations} saveConfiguration={saveConfiguration} />
  //   </div>
  // );
}

export default App;
