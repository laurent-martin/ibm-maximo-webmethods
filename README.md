# IBM Maximo - webMethods Integration

[![License](https://img.shields.io/badge/License-Apache%202.0-blue.svg)](LICENSE)
[![IBM Maximo](https://img.shields.io/badge/IBM-Maximo-052FAD?logo=ibm)](https://www.ibm.com/products/maximo)
[![webMethods](https://img.shields.io/badge/webMethods-Integration-00C7B7)](https://www.softwareag.com/en_corporate/platform/integration-apis/webmethods-integration.html)
[![OpenAPI](https://img.shields.io/badge/OpenAPI-3.0-6BA539?logo=openapiinitiative)](https://www.openapis.org/)
[![Node.js](https://img.shields.io/badge/Node.js-Required-339933?logo=node.js)](https://nodejs.org/)

This repository provides tools and documentation for integrating IBM Maximo with enterprise applications using IBM webMethods Hybrid Integration Platform (IWHI).

## Overview

This integration enables bidirectional communication between Maximo and webMethods, supporting two key integration patterns:

### webMethods Calling Maximo REST APIs

![Overview of workflow](images/global-view.png)

webMethods workflows can invoke Maximo REST APIs to:

- Query asset information
- Create or update work orders
- Retrieve service requests
- Perform CRUD operations on Maximo objects

The `/api` directory contains tools to process and optimize Maximo's OpenAPI specification for seamless import into webMethods.

### Maximo Triggering webMethods Workflows

When objects are modified in Maximo (create, update, delete), Maximo can automatically trigger webMethods workflows to:

- Notify external systems of changes
- Orchestrate business processes across multiple applications
- Synchronize data with other enterprise systems
- Execute automated workflows based on Maximo events

### Use Cases

- **Asset Management**: Sync asset data between Maximo and ERP systems
- **Work Order Automation**: Trigger workflows when work orders are created/updated
- **Service Request Processing**: Route service requests to appropriate systems
- **Inventory Management**: Update inventory across multiple platforms
- **Compliance Reporting**: Aggregate data from Maximo for reporting systems

### Prerequisites

- IBM Maximo Application Suite (MAS) instance
- IBM webMethods Hybrid Integration Platform access
- Other enterprise applications, such as SAP, Oracle ERP, ServiceNow, Salesforce, etc.

### Repository Structure

```text
├── api/                    # OpenAPI specification processing tools
│   ├── Makefile           # Build pipeline for API spec
│   ├── filter-by-path.js  # Filter relevant API endpoints
│   ├── fix-oas.js         # Fix and enhance OpenAPI spec
│   ├── redocly.yaml       # Redocly configuration
│   ├── oas.json           # Source OpenAPI specification
│   └── README.md          # API tools documentation
├── logo/                   # Maximo logos
└── README.md              # This file
```

## Pattern: webMethods Calling Maximo REST APIs

### Prerequisites

- IBM Maximo Application Suite (MAS) instance
- IBM webMethods Hybrid Integration Platform access
- Node.js (for API processing tools)
- Redocly CLI

### Processing Maximo OpenAPI Specification

The maximo instance main URL has the format:

```text
https://<sub_domain>.<mas_domain>/
```

1. Get the OpenAPI specification for Maximo Manage from your Maximo instance:

   ```text
   https://mas.manage.<mas_domain>/maximo/api/oas
   ```

1. Save it in the `api` directory as `oas.json` (or use the one already saved)

1. Run the build process:

   ```bash
   make
   ```

This will:

- Filter relevant API endpoints (`mxapisr`, `mxapiasset`)
- Bundle and optimize the specification
- Fix common issues (operationIds, enum types, server URLs)
- Validate the output
- Generate a clean OpenAPI spec ready for webMethods import

Import the processed OpenAPI specification into webMethods to:

- Auto-generate service connectors
- Build workflows that interact with Maximo
- Leverage Maximo's REST API capabilities

## Pattern: Maximo Triggering webMethods Workflows

Configure Maximo to trigger webMethods workflows:

- Set up Maximo automation scripts or object structures
- Configure webhooks or message queues
- Implement event handlers in webMethods to process Maximo events

## Documentation

- [API Processing Tools](api/README.md)
- [Maximo REST API Documentation](https://www.ibm.com/docs/en/maximo-manage/continuous-delivery?topic=apis-maximo-rest-api)
- [webMethods Integration Documentation](https://documentation.softwareag.com/)

## License

This project is licensed under the Apache License 2.0 - see the [LICENSE](LICENSE) file for details.

## Contributing

Contributions are welcome! Please feel free to submit issues or pull requests.

## Support

For issues related to:

- **Maximo**: Consult IBM Maximo documentation or support
- **webMethods**: Consult IBM webMethods documentation or support
- **This repository**: Open an issue on GitHub

## ServiceNow

- Go to: `All > System Definitions > Business Rules`

- Create a business Rule:
  - Parameters:
    - **Table**: `Incident`
    - **Active**: `Yes`
    - **Advanced**: `Yes`
  - When to Run:
    - **When**: `after`
    - **Update**: `Yes`
