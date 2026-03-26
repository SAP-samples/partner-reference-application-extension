# Code Extensibility in SAP BTP CAP

In CAP, extensibility and connectivity are fundamental concepts that enable developers to build flexible and connected applications that can adapt to changing business needs and integrate seamlessly with various data sources and services.

## Extensibility in CAP

Extensibility in CAP refers to the ability to customize and extend the data models, business logic, and user interfaces of applications to accommodate specific business requirements. CAP offers several mechanisms for achieving extensibility:

### Data Model Extensibility
Developers can define data models using Core Data Services (CDS). CAP allows you to add custom entities, fields, and relationships to the data model to meet specific business needs. You can extend existing data models without altering the core structure, making it easier to adapt to changing data requirements.

### Behavioral Extensibility
CAP provides service handlers and event handlers that allow you to define custom business logic. You can implement custom code that executes during various application events, such as create, read, update, and delete (CRUD) operations, validations, and data transformations.

### UI Extensibility
When building user interfaces (UIs) with CAP, you can customize and extend SAP Fiori applications. This includes adding new UI components, modifying existing views, or creating custom pages to tailor the user experience to your organization's needs.

### Service Extensibility
CAP allows you to create custom OData services that expose additional functionality or data to external consumers. These services can integrate with other SAP applications or external systems, facilitating data exchange and interoperability.

### Localization
CAP supports localization features that enable you to adapt your application to different languages and regions, which is crucial for global deployments.

## Business Logic Extensibility

Business logic extensibility integrates seamlessly with the CAP on SAP BTP. It enables developers to enhance service implementations by adding custom entity events, actions, and functions, while also leveraging predefined extension points provided by the base application to address specific extension requirements.

With custom extensibility now enabled for partners to meet unique business requirements, this tutorial guides you through how to enable custom business logic extensibility in your applications.

We’ll explore how the `@sap/cds-oyster` plugin empowers partners to safely write and deploy custom code in a multi-tenant SaaS environment, allowing extensions such as custom calculations or input validations tailored to specific customer needs.

Key topics include:

1. Implementing business logic to validate data between new extensible requirements and the base application.

2. Defining extension points where custom logic can be merged with the base application to meet specific business needs.

The [@sap/cds-oyster](https://www.npmjs.com/package/@sap/cds-oyster) plugin for CAP introduces robust support for business logic extensibility, enabling partners to build flexible, compliant, and customer-specific extensions with confidence.

## Prerequisites to Enable Business Logic Extensibility
Business logic extensibility can only work in the extension application when the basic setup is completed in both base application and extension application. The following tutorials guide you through the process:

1.  Enable the base application for [business logic extensibility​](https://github.com/SAP-samples/partner-reference-application/blob/main/Tutorials/50a-Multi-Tenancy-Features-Tenant-BusinessLogicExtensibility.md).
​
2. Enable the extension application for business logic extensibility.​
      1.  Extend the application configuration in the [package.json](../partner-reference-extension-catering/package.json#L34) file to the base application and enable code-extensibility. This enables the code sandbox in the project for the extension code:​

      ```
      "extends": "partner-reference-application",​
      ….​
      "cds": {​
      "requires": {​
      "code-extensibility": {​
        "runtime": "oyster",​
        "maxTime": 1000,​
        "maxMemory": 4​,
        "maxDepth": 4,
        "maxResultSize": 100,
        "continueOnError": false
      },​
      ...          ​
      ```
      2. Pull the base model into the extension application, make the necessary changes, and deploy the extension application by following this [tutorial](https://github.com/SAP-samples/partner-reference-application-extension/blob/main/Tutorials/02-DataModelExtensibility.md).

      3. Create a custom event handler: To support extension logic, a custom event handler must be implemented. The [event handler scope](https://www.npmjs.com/package/@sap/cds-oyster#event-handler-scope) provides an overview of how the events in business logic extensibility should be defined, illustrating its execution flow and how requests are processed within the system. 

## Business Logic Extensibility Use Cases
### 1. Validate Data Between Extensible Requirements and the Base Application

The data model has been extended to support catering management. Each caterer declares a serving capacity (the number of guests they can serve). The base application defines a maximum event capacity when an event is created.

#### Requirement
When an event is saved, validate that the selected caterer’s serving capacity isn't less than the event’s maximum capacity. If the caterer’s capacity is insufficient, the save is rejected and an error message is shown to the event manager. They can choose a different caterer or adjust the event.

#### How to Achieve
Let's do a deep dive into the application and see how this is achieved by following the [setup guide](./06a-BusinessLogicExtensibility_ValidationUseCase.md).

### 2. Define Extension Points to Integrate Custom Logic into the Base Application

The base application integrates with multiple ERPs. One scenario is creating projects and tasks in SAP S/4HANA Cloud Public Edition. The base application creates projects from a project template. Customers can modify the template and add tasks that are specific to their business.

#### Requirement
Provide an extension point in the base application’s project or task creation flow that allows the extension application to add additional tasks in SAP S/4HANA Cloud Public Edition after the base project is created.

#### How to Achieve
Let's do a deep dive into the application and see how this is achieved by following the [setup guide](./06b-BusinessLogicExtensibility_CustomExitUSeCase.md).
