---
title: "Deployment view"
sidebar_label: "Deployment view"
sidebar_position: 4
metaTitle: "This is the meta title tag for Deployment view page"
metaDescription: "This is the meta description for Deployment views page"
---

![Deployment view Diagram](/img/deploymentDiagram.png)
- **Static Page generator** -> Azure: Static web apps
- **Api Gateway**
  - **/Router** -> Azure: Api managment
  - **/Autz manager** -> Azure: Function
  - **/Transaction manager** -> Azure: Function
  - **/Structured storage** -> Azure: Cosmos DB
- **Identity service** -> Azure: Active directory
- **Network** -> Azure: Virtual network
- **User profile service**
  - **/API** -> Azure: Function
  - **/Structured** storage -> Azure: CosmosDB
  - **/Unstructured** storage -> Azure: Blob-storage
- **Donation Service**
  - **/API** -> Azure: Function
  - **/Integrator connector** -> Azure: Function
- **Content Service**
  - **/API** -> Azure: Function
  - **/Integrator connector** -> Azure: Function
- **Task Service**
  - **/API** -> Azure: Function
  - **/Integrator connector** -> Azure: Function
  - **/Task generator** -> Azure: Function
  - **/Task exporter** -> Azure: Function
  - **/Task checker** -> Azure: Function
