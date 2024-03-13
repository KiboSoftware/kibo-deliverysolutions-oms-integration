import React, { useEffect, useState } from 'react';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import TenantConfigurationPage from "./tenantConfigurationPage";
import TenantConfigurationList from './tenantConfigurationList';

function App() {
  const [configurations, setConfigurations] = useState([]);
  

  useEffect(() => {
    fetch('/configs')
      .then(response => response.json())
      .then(data => setConfigurations(data.Items))
      .catch(error => console.error('Error:', error));
  }, []);

  

  const saveConfiguration = (configuration) => {
    console.log('save',configuration);
    return fetch(`/configs/${configuration.id}`, {
      method: 'PUT',
      body: JSON.stringify(configuration),
      headers: {
        'Content-Type': 'application/json'
      }
    })
      .then(response => {
        const newConfiguration = response.json();
        const existing  = configurations.find(config => config.id === newConfiguration.id)
        if(!existing){
          setConfigurations(prevConfigurations => [...prevConfigurations, newConfiguration]);
        }

      })
      .catch(error => console.error('Error:', error));
  };

  return (
    <Router>
      <div className="App">
      <Switch>
          <Route path="/" exact>
            <TenantConfigurationList configurations={configurations} saveConfiguration={saveConfiguration} />
          </Route>
          <Route path="/edit/:id" render={(props) => <TenantConfigurationPage {...props} configuration={configurations.find(config => config.id === props.match.params.id)} onSave={saveConfiguration} />} />
          <Route path="/create" render={(props) => <TenantConfigurationPage {...props} onSave={saveConfiguration} />} />
        </Switch>
        {/* Add more Route components here as needed */}
      </div>
    </Router>
  );
  // return (
  //   <div className="App">
  //     <TenantConfigurationList configurations={configurations} saveConfiguration={saveConfiguration} />
  //   </div>
  // );
}

export default App;