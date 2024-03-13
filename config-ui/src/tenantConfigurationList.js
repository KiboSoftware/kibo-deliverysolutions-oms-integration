import React, { useState } from "react";
import { useHistory } from 'react-router-dom';
import {
  Button,
  Card,
  CardContent,
  Typography,
  Container,
  Grid,
} from "@material-ui/core";
import TenantConfigurationPage from "./tenantConfigurationPage";

const TenantConfigurationList = ({ configurations, saveConfiguration }) => {
  const history = useHistory();
  const [selectedConfiguration, setSelectedConfiguration] = useState(null);

  const handleEdit = (configuration) => {
    history.push(`/edit/${configuration.id}`)
  };

  const handleAdd = () => {
    history.push('/create');
    return;
    
  };

  const handleSave = (updatedConfiguration) => {
    saveConfiguration(updatedConfiguration)
      .then(() => {
        setSelectedConfiguration(null);
      })
      .catch((error) => {
        console.error("Error saving configuration:", error);
      });
    setSelectedConfiguration(null);
  };

  return (
    <Container>
      {selectedConfiguration ? (
        <TenantConfigurationPage
          configuration={selectedConfiguration}
          onSave={handleSave}
        />
      ) : (
        <Grid container spacing={3}>
          {configurations.map((configuration) => (
            <Grid item xs={12} sm={6} md={4} key={configuration.id}>
              <Card>
                <CardContent>
                  <Typography variant="h5">ID: {configuration.id}</Typography>
                  <Typography variant="body1">
                    Kibo Tenant: {configuration.kiboTenant}
                  </Typography>
                  <Typography variant="body1">
                    DS Tenant: {configuration.dsTenant}
                  </Typography>
                  <Button
                    variant="contained"
                    color="primary"
                    onClick={() => handleEdit(configuration)}
                  >
                    Edit
                  </Button>
                </CardContent>
              </Card>
            </Grid>
          ))}
          <Button variant="contained" color="primary" onClick={handleAdd}>
            Add
          </Button>
        </Grid>
      )}
    </Container>
  );
};

export default TenantConfigurationList;
