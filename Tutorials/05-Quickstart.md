# Deploy and Run the Extension Application

The tutorial is carefully crafted to guide you through a clear, step-by-step process for developing and deploying the Caterer extension application by extending the Poetry Slam Manager(PSM).

If you prefer a quick start without further explanation, but with a deployment of the application with all features, follow these steps:

1. To proceed with side-by-side extension, you must have the extensibility enabled multi-tenant PSM application set up. If you haven't yet deployed the multi-tenant PSM application, please refer to the [quick start guide](https://github.com/SAP-samples/partner-reference-application/blob/main/Tutorials/02-Quickstart.md) for instructions on how to deploy it.
2. Prepare your consumer subaccount by ensuring that you have the necessary entitlements assigned as per the [Bill of Materials](./01-BillOfMaterials.md).
3. To extend the base data model, ensure that the required role collection is assigned to your user in the subscriber subaccount.
Follow the steps here: [Assign Extension Developer Role](02-DataModelExtensibility.md#assigning-the-extension-developer-role)
4. Clone the branch [main of the repository](https://github.com/SAP-samples/partner-reference-application-extension) in SAP Business Application Studio.
5. Open your terminal and navigate to the extension project directory by running:

    ```bash
    cd partner-reference-extension-catering
    ```

6. The CDS compiler requires the base model to be present as an NPM package in the `node_modules` folder.
To ensure this, [pull the base model](02-DataModelExtensibility.md#pulling-the-base-model) into your extension project.
7. After pulling the base model, you need to install the project dependencies to make the model usable.
Follow this step to [install the base model dependencies](02-DataModelExtensibility.md#installing-the-base-model).
8. Once everything is set up, you're ready to deploy! Push your extension project to the subscriber subaccount by following the steps outlined here: [Deploy the Extension](02-DataModelExtensibility.md#deploying-the-extension).
9. Configure the [Service Broker](03-FioriUIForExtendedEntity.md#service-broker-setup) to enable the Fiori application to communicate with the backend OData service. This step establishes the secure connectivity required between the UI and your extended data model.
10. In your subscriber subaccount, [create a destination](03-FioriUIForExtendedEntity.md#create-the-destination-to-access-the-base-application) to point to the Poetry Slams OData service. This destination enables the Fiori application to consume the extended OData service seamlessly.
11. Open your terminal and navigate to the Fiori application directory by running:

    ```bash
    cd partner-reference-extension-catering-ui
    ```

12. Deploy your Fiori UI module to the Cloud Foundry runtime by following the deployment instructions here:
[Deploy your application](03-FioriUIForExtendedEntity.md#deploy-to-cloud-foundry).
13. Finally, [configure SAP Build Work Zone](03-FioriUIForExtendedEntity.md#configure-sap-build-work-zone) to make your extension application accessible through a SAP Build Work Zone.
