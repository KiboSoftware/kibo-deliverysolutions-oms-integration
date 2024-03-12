# Kibo Delivery Solutions Integration 

This repository contains a serverless application built with TypeScript and AWS Lambda. It is designed to integrate with Kibo Commerce and Delivery Solutions APIs.

## Structure

The application is structured into several modules, each responsible for a specific functionality:

- `src/api`: Contains the API configurations.
- `src/consumers`: Contains the consumer services.
- `src/mappers`: Contains the mapping functions to transform data between different formats.
- `src/processors`: Contains the core business logic of the application.
- `src/producers`: Contains the producer services.
- `src/services`: Contains the service classes that interact with external APIs.
- `src/types`: Contains the TypeScript type definitions used throughout the application.
- `src/webhooks`: Contains the webhook handlers.

## Key Services

- `KiboShipmentService`: This service interacts with the Kibo Commerce API to manage shipments.
- `KiboCommerceService`: This service interacts with the Kibo Commerce API to manage orders.
- `DeliverySolutionsService`: This service interacts with the Delivery Solutions API.

## Getting Started

To get started with this application, follow these steps:

1. Clone the repository: `git clone https://github.com/KiboSoftware/kibo-deliverysolutions-oms-integration.git`
2. Install the dependencies: `npm install`
3. Configure your AWS credentials: [Serverless AWS Credentials](https://www.serverless.com/framework/docs/providers/aws/guide/credentials/)
4. Deploy the application: `serverless deploy`

## Usage

Once the application is deployed, you can use the following endpoints:

## Endpoints
* POST - https://{aws-api-gateway1}/dev/webhooks/ds
* POST - https://{aws-api-gateway1}/dev/webhooks/kibo
* GET - https://{aws-api-gateway2}/configs
* GET - https://{aws-api-gateway2}/configs/{id}
* PUT - https://{aws-api-gateway2}/configs/{id}

## Testing

The application uses Jest for testing. You can run the tests by running:

```bash
npm run test
```

### License
This project is licensed under the MIT License. See the LICENSE file for details.
