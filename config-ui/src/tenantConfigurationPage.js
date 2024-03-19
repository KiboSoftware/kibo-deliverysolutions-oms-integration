import React, { useState, useEffect } from "react";
import { useHistory } from "react-router-dom";

import {
  Container,
  TextField,
  Button,
  Typography,
  Grid,
  IconButton,
  List,
  ListItem,
  ListItemText,
  ListItemSecondaryAction,
  Card,
  CardContent,
} from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import AddCircleOutlineIcon from "@mui/icons-material/AddCircleOutline";

let empty = {
  id: "",
  kiboTenant: null,
  kiboSites: [],
  dsTenant: "",
  locationMapping: [],
  kiboCredentials: {
    clientId: "",
    clientSecret: "",
    api: null,
  },
  dsCredentials: {
    apiKey: "",
    api: null,
  },
};

const TenantConfigurationPage = ({ configuration, onSave }) => {
  const history = useHistory();
  const [localConfiguration, setLocalConfiguration] = useState(
    configuration || empty
  );
  const [formData, setFormData] = useState(configuration || empty);
  useEffect(() => {
    console.log("c", configuration);
    setLocalConfiguration(configuration);
  }, [configuration]);

  const handleChange = (path, value) => {
    const paths = path.split(".");
    const depth = paths.length;
    setFormData((prev) => {
      const newData = { ...prev };
      let current = newData;
      for (let i = 0; i < depth - 1; i++) {
        if (!current[paths[i]]) current[paths[i]] = i < depth - 2 ? {} : [];
        current = current[paths[i]];
      }
      current[paths[depth - 1]] = value;
      return newData;
    });
  };

  const handleSiteChange = (value) => {
    const sites = value
      .split(",")
      .map((site) => parseInt(site.trim(), 10))
      .filter((site) => !isNaN(site));
    setFormData({ ...formData, kiboSites: sites });
  };

  const handleLocationChange = (index, key, value) => {
    const newLocationMapping = formData.locationMapping.map((item, i) => {
      if (i === index) {
        return { ...item, [key]: value };
      }
      return item;
    });
    setFormData({ ...formData, locationMapping: newLocationMapping });
  };

  const addLocationMapping = () => {
    setFormData({
      ...formData,
      locationMapping: [...formData.locationMapping, { ds: "", kibo: "" }],
    });
  };

  const removeLocationMapping = (index) => {
    const newLocationMapping = formData.locationMapping.filter(
      (_, i) => i !== index
    );
    setFormData({ ...formData, locationMapping: newLocationMapping });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log(formData);
    // Handle form submission logic here
  };
  const goBackToIndex = () => {
    history.push("/");
  };

  return (
    <Container maxWidth="md" container spacing={2}>
      <Typography variant="h4" component="h1" gutterBottom>
        Edit Configuration
      </Typography>
      <form onSubmit={handleSubmit}>
        <Grid container spacing={2}>
          {/* ID */}
          <Grid item xs={12}>
            <TextField
              fullWidth
              label="ID"
              value={formData.id}
              onChange={(e) => handleChange("id", e.target.value)}
            />
          </Grid>
          {/* DS Credentials */}
          <Grid item xs={12}>
            <Card>
              <CardContent>
                <Typography variant="h6" component="h2" gutterBottom>
                  Delivery Solutions Info
                </Typography>
                <Grid container spacing={2}>
                  <Grid item xs={12}>
                    <TextField
                      fullWidth
                      label="Tenant"
                      value={formData.dsTenant}
                      onChange={(e) => handleChange("dsTenant", e.target.value)}
                    />
                  </Grid>
                  <Grid item xs={12} sm={8}>
                    <TextField
                      fullWidth
                      label="API"
                      value={formData.dsCredentials.api}
                      onChange={(e) =>
                        handleChange("dsCredentials.api", e.target.value)
                      }
                    />
                  </Grid>
                  <Grid item xs={12} sm={4}>
                    <TextField
                      type="password"
                      fullWidth
                      label="API Key"
                      value={formData.dsCredentials.apiKey}
                      onChange={(e) =>
                        handleChange("dsCredentials.apiKey", e.target.value)
                      }
                    />
                  </Grid>
                </Grid>
              </CardContent>
            </Card>
          </Grid>
          {/* DS Tenant */}

          {/* Kibo Credentials */}
          <Grid item xs={12}>
            <Card>
              <CardContent>
                <Typography variant="h6" component="h2" gutterBottom>
                  Kibo Info
                </Typography>
                <Grid container spacing={2}>
                  <Grid item xs={12}>
                    <TextField
                      fullWidth
                      label="Kibo Tenant"
                      value={formData.kiboTenant}
                      onChange={(e) =>
                        handleChange("kiboTenant", Number(e.target.value))
                      }
                    />
                  </Grid>
                  <Grid item xs={7}>
                    <TextField
                      fullWidth
                      label="Kibo Sites (comma-separated)"
                      value={formData.kiboSites.join(", ")}
                      onChange={(e) => handleSiteChange(e.target.value)}
                    />
                  </Grid>
                  <Grid item xs={5}>
                    <TextField
                      fullWidth
                      label="API Host"
                      value={formData.kiboCredentials.api}
                      onChange={(e) =>
                        handleChange("kiboCredentials.api", e.target.value)
                      }
                    />
                  </Grid>

                  <Grid item xs={7}>
                    <TextField
                      fullWidth
                      label="Kibo Client ID"
                      value={formData.kiboCredentials.clientId}
                      onChange={(e) =>
                        handleChange("kiboCredentials.clientId", e.target.value)
                      }
                    />
                  </Grid>

                  <Grid item xs={5}>
                    <TextField
                      fullWidth
                      type="password"
                      label="Kibo Client Secret"
                      value={formData.kiboCredentials.clientSecret}
                      onChange={(e) =>
                        handleChange(
                          "kiboCredentials.clientSecret",
                          e.target.value
                        )
                      }
                    />
                  </Grid>
                </Grid>
              </CardContent>
            </Card>
          </Grid>
          {/* Location Mapping */}
          <Grid item xs={12}>
            <Card>
              <CardContent>
            <Typography variant="h6">Location Mapping</Typography>
            <List>
              {formData.locationMapping.map((mapping, index) => (
                <ListItem key={index} dense>
                  <ListItemText>
                    <Grid container spacing={2}>
                      <Grid item xs={6}>
                        <TextField
                          fullWidth
                          label="Delivery Solutions Location"
                          value={mapping.ds}
                          onChange={(e) =>
                            handleLocationChange(index, "ds", e.target.value)
                          }
                        />
                      </Grid>
                      <Grid item xs={6}>
                        <TextField
                          fullWidth
                          label="Kibo Location"
                          value={mapping.kibo}
                          onChange={(e) =>
                            handleLocationChange(index, "kibo", e.target.value)
                          }
                        />
                      </Grid>
                    </Grid>
                  </ListItemText>
                  <ListItemSecondaryAction>
                    <IconButton
                      edge="end"
                      aria-label="delete"
                      onClick={() => removeLocationMapping(index)}
                    >
                      <DeleteIcon />
                    </IconButton>
                  </ListItemSecondaryAction>
                </ListItem>
              ))}
            </List>
            <Button
              startIcon={<AddCircleOutlineIcon />}
              onClick={addLocationMapping}
              variant="outlined"
            >
              Add Location Mapping
            </Button>
            </CardContent>
            </Card>
          </Grid>
        </Grid>
        <Grid container spacing={2}>
          <Grid item>
            <Button
              type="submit"
              variant="contained"
              color="primary"
              sx={{ mt: 3 }}
              onClick={() => onSave(formData)}
            >
              Save Changes
            </Button>
          </Grid>
          <Grid item>
            <Button
              variant="outlined"
              sx={{ mt: 3 }}
              onClick={() => history.goBack()}
            >
              Cancel
            </Button>
          </Grid>
        </Grid>
      </form>
    </Container>
  );
};

export default TenantConfigurationPage;
