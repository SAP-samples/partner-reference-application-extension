# Extending Persistence and UI with Custom Fields

The Partner Reference Application Extension is an extension of the *Poetry Slam Manager (PSM)*, designed to extend its business capabilities. This tutorial shows you how ro customize the PSM to enable caterer selection for a poetry slam event.

As an event manager, you can assign a caterer responsible for providing food services. To achieve this, you create a new custom entity called *Caterer* to store caterer details and extend the *Poetry Slam* entity by establishing an association with it. Additionally, you extend the *Poetry Slam* service to expose the new entity. A new section group is added to the existing *Poetry Slam* object page, allowing you to select a caterer. Once you choose a caterer, their contact information is displayed in the newly added section.

## Create a New Project Based on SAP Cloud Application Programming Model

You need to create extension projects, which are standard SAP CAP-based projects designed to extend the functionality of the SaaS application. In this case, you will develop a catering extension application to extend the features of the PSM application.

1. To start a new development project, go to the settings in SAP Business Application Studio and open the *Command Palette...*.

2. Search for `SAP Business Application Studio: New Project from Template`.

3. Choose *CAP Project* and then click on *Start*. Make sure the target folder path is set to `home/user/projects`.

4. Add the following attributes to the *CAP Project* and then click on *Finish*:
    - As *project name*, enter `partner-reference-extension-catering`.
    - Select `Node.js` as your *runtime*.

    As a result, a folder named `partner-reference-extension-catering` is created, containing a set of files to help you start an SAP Cloud Application Programming Model project.

5. Adapt the created *.gitignore* file to your needs. You may use the [*.gitignore*](../partner-reference-extension-catering/.gitignore) of this repository with other useful entries.

6. Adapt the created *package.json* file to your needs, for example, change the description attribute, add scripts, etc. You may use the [*package.json*](../partner-reference-extension-catering/package.json) of this repository as a reference. Additionally, you need to incorporate the following configurations:

    ```json
    {
      "extends": "partner-reference-application",
      "workspaces": [
        ".base"
      ]
    }
    ```

    - `extends` is the name used by the extension model to reference the base model. It must be a valid npm package name, as it is utilized by `cds pull` as the package name for the base model.
    - `workspaces` is a list of folders, including the one where the base model is stored. If not already present, the `cds pull` command will automatically add this property to ensure proper configuration.

## Assign Extension Developer Role

To extend the base model, assign the `PoetrySlamExtensionDeveloperRoleCollection` role collection to you in the subscriber subaccount. It is essential for working on the [CAPire Documentation - Extension model](https://cap.cloud.sap/docs/guides/extensibility/customization#about-extension-models).

> Note: The `PoetrySlamExtensionDeveloperRoleCollection` role collection is established within the base model as part of the extension enablement process. For more details, refer to [Partner Reference Application Tutorial - Poetry Slam Manager Application with extensibility](https://github.com/SAP-samples/partner-reference-application/blob/main/Tutorials/50-Multi-Tenancy-Features-Tenant-Extensibility.md#application-enablement).

## Pull the Base Model

To enable local testing and syntax highlighting, you need to ensure that the model information of the base application (in this case, the *Poetry Slam Manager*) is accessible to the extension project. The cds compiler expects the base model to be available as an NPM package within the node_modules folder.

The following section explains how to retrieve the model from the running application and make it available locally using the cds pull command.

> Note: The system searches for the `extends` field in the `package.json` file to identify the base model. 

1. To simplify the use of multitenancy-related commands, for example, `cds pull` and `cds push`, by enabling automatic authentication, you must first log in using the appropriate credentials. For more details, refer to the [CAPire Documentation - cds login](https://cap.cloud.sap/docs/guides/extensibility/customization#cds-login).

   1. Get the URL of the MTX module deployed in the provider subaccount.

      i. In the SAP BTP cockpit of the provider subaccount, navigate to the SAP BTP Cloud Foundry runtime space where the application is deployed.

      ii. In the space cockpit, navigate to *Applications* and select the link *poetry-slams-mtx*.

      iii. Copy the *Application Route* from the *Application Overview* for later use (**provider mtx URL**).

   2. Get the subdomain from the subscriber subaccount.

      i. In the SAP BTP cockpit of the subscriber subaccount, navigate to *Overview*.

      ii. Copy the *Subdomain* from the *General* section.

      iii. In the terminal of your development environment execute the following statement to log into the MTX module.

    ```bash
    cds login <PROVIDER-MTX-APP-URL> -s <SUBSCRIBER-SUBDOMAIN>
    ```

    > Note: The one-time passcode will be prompted interactively after running the above command. 

    If you need to automatically call cds login without user interaction, you can use the *Client Credentials* grant. This approach does not require a passcode and is ideal for scenarios where user authentication is not necessary. The Client Credentials grant provides an application with access to resources in a service without needing individual user consent.

    1. Get the *Client Credentials* of the MTX module deployed in the provider subaccount.

        i. In the SAP BTP cockpit of the provider subaccount, navigate to the SAP BTP Cloud Foundry runtime space where the application is deployed.

        ii. In the space cockpit, navigate to *Applications* and select the link *poetry-slams-mtx*.

        iii. Select *Environment Variables*, navigate to VCAP_SERVICES, locate xsuaa, and copy the *clientid* and *clientsecret*.

        iv. In the terminal of your development environment execute the following statement to log into the MTX module.

    ```bash
    cds login <PROVIDER-MTX-APP-URL> -s <SUBSCRIBER-SUBDOMAIN> -c '<CLIENT-ID>':'<CLIENT-SECRET>' --plain
    ```

    For more information, refer to the [CAPire Documentation - How to Login](https://cap.cloud.sap/docs/guides/extensibility/customization#how-to-login)

2. Pull the latest cds model from the provider subaccount to the extension project `partner-reference-extension-catering`.

   1. Get the URL of the MTX module deployed in the provider subaccount. The MTX module url, which was retrieved during the cds login, is also required here.

    ```bash
    cds pull --from <PROVIDER-MTX-APP-URL>
    ```

    > Note: [CAPire Documentation - cds pull](https://cap.cloud.sap/docs/guides/extensibility/customization#pull-base) creates a .base folder in your extension project and adds the .base workspace to the package.json of the extension project if it is not already there.

## Install the Base Model

To prepare the downloaded base model for use in your extension project, install it by running the `npm install` command.

> Note: This will link the base model in the workspace folder to the subdirectory node_modules/partner-reference-application.

## Write the Extension Code

It is not mandatory to split the extension model into multiple files; however, we recommend structuring it similarly to a standard SAP CAP application for better maintainability. The data model enhancements should be placed in the `db` folder, service enhancements in the `srv` folder, and UI annotations in the `app` folder. This approach ensures a well-organized project structure and aligns with best practices.

1. Extending the Data Model

    Using the `extend` directive, extending the application with new artifacts becomes straightforward. You can add new fields to existing entities, create entirely new entities, and extend existing entities with new associations. Additionally, you can add compositions to both existing and new entities, set default values, define range checks, and apply value list validations to new or existing fields. Furthermore, you can enforce mandatory field checks and introduce unique constraints on new or existing entities, ensuring data integrity and consistency.

    > Note: For more details on extending data model, refer to the [CAPire Documentation - Extending the Data Model](https://cap.cloud.sap/docs/guides/extensibility/customization#extending-the-data-model)

    1. Create a file [catererManager.cds](../partner-reference-extension-catering/db/catererManager.cds) in the */db* folder, which will reference all the entity definitions (cds-file of the database).
    2. In the sample extension application, you will create a new entity called *x_Caterers* and extend the existing *PoetrySlams* entity by adding an association to it.

        ```cds
        ...
        // Extend the entity with new x_Caterers entity
        extend PoetrySlams with {
          x_caterer : Association to one x_Caterers; 
        }
        ...
        ```

        > Note: The prefix `x_` is added to entities, namespaces, or fields based on the configuration defined during extensibility enablement in the base application. This ensures that artifacts created in the extended application do not conflict with those in the base application, maintaining consistency and avoiding naming collisions. For more information, refer to the [Partner Reference Application Tutorial - Poetry Slam Manager Application with extensibility](https://github.com/SAP-samples/partner-reference-application/blob/main/Tutorials/50-Multi-Tenancy-Features-Tenant-Extensibility.md#application-enablement).

        > Note: For more details on defining domain model, refer to the [Partner Reference Application Tutorial - Define the Domain Models](https://github.com/SAP-samples/partner-reference-application/blob/main/Tutorials/14-Develop-Core-Application.md#define-the-domain-models).

2. Extending the Service Model

    After you've defined the domain model with its entities, define a set of services to add API's to the application. In the existing service, the newly created entities are automatically included as they serve as targets for the corresponding compositions. Additionally, these new entities are automatically exposed in a read-only manner as CodeLists.

    > Note: For more details on extending service model, refer to the [CAPire Documentation - Extending the Service Model](https://cap.cloud.sap/docs/guides/extensibility/customization#extending-the-service-model).

    1. Create a file called [catererManagerService.cds](../partner-reference-extension-catering/srv/catererManagerService.cds) in the */srv* folder, which will reference all the service definitions (cds-file of the service).
    2. New entities are automatically exposed in a read-only manner. If you need to change this behavior, you must explicitly expose them

        ```cds
        ...
        extend service PoetrySlamService with{
            entity x_Caterers as projection on caterers;
        }
        ...
        ```

        > Note: For more details on defining services, refer to the [Partner Reference Application Tutorial - Define Services](https://github.com/SAP-samples/partner-reference-application/blob/main/Tutorials/14-Develop-Core-Application.md#define-services).

3. Extending UI Annotations

    Once you have defined the domain and service model, you extend UI annotations. Extending UI annotations in SAP CAP Extension Development allows you to customize and enhance the user interface of a base application without altering its core functionality. This can involve adding new UI elements such as sections, fields, and tables, modifying existing annotations, adjusting field visibility and read-only status, and defining value helps or lists. You can also reorganize the layout of pages, configure smart tables and forms, and add action buttons. By using the `extend` directive in CDS models, you can seamlessly introduce customizations, improve user experience, and ensure flexibility in adapting to business requirements while maintaining the integrity of the original application.

    1. Create a file called [catererManager.cds](../partner-reference-extension-catering/app/catererManager.cds) in the */app* folder, which will reference all the UI annotations (cds-file of the UI).

    2. In the sample extension application, you will add a new *Caterer* section between the *General* and *Visitors* sections using the `... up to` and `...` keywords. This can be accomplished by [CAPire Documentation - Extending Array Values](https://cap.cloud.sap/docs/guides/extensibility/customization#extending-array-values). The following code demonstrates how to seamlessly insert a new UI facet between the existing facets in the base application, enhancing its functionality while preserving the integrity of the current layout.

        ```cds
        ...
        annotate PoetrySlamService.PoetrySlams with @(
          UI : {
            Facets                        : [
              ... up to {ID    : 'GeneralData'},
              {
                $Type : 'UI.ReferenceFacet',
                ID    : 'CatererData',
                Label : '{i18n>caterer}',
                Target: '@UI.FieldGroup#Caterer'
              },
              ...
            ],
          }
        );
        ...
        ```

        > Note: For more details on extending UI annotations, refer to the [CAPire Documentation - Extending UI Annotations](https://cap.cloud.sap/docs/guides/extensibility/customization#extending-ui-annotations).

    3. Configure [Internationalization(i18n)](../partner-reference-extension-catering/i18n/i18n.properties) to align with specific requirements.

## Create an Initial Data Set

  Create an initial data set which will be available after you've started the application. You can specify the data in SAP Cloud Application Programming Model by creating a set of CSV files in the /db/data folder of the project. For more details, refer to the [Partner Reference Application Tutorial - Create an Initial Data Set](https://github.com/SAP-samples/partner-reference-application/blob/main/Tutorials/14-Develop-Core-Application.md#create-an-initial-data-set)

  1. Create a file called [x_sap.samples.poetryslams.catering-x_CuisineTypeCodes.csv](../partner-reference-extension-catering/db/data/x_sap.samples.poetryslams.catering-x_CuisineTypeCodes.csv) in the */db/data* folder, which adds the cuisine data to the entity.

  2. Create a file called [x_sap.samples.poetryslams.catering-x_Caterers.csv](../partner-reference-extension-catering/db/data/x_sap.samples.poetryslams.catering-x_Caterers.csv) in the */db/data* folder, which adds the caterer data to the entity.

  > Note: We are simply adding caterers data here for demonstration purposes, which is not suitable for a production environment. While implementing a test action, as outlined in the *Partner Reference Application*, would be a more appropriate solution, the current extensibility framework does not yet support the implementation of such logic.

## Deploy the Extension
  
  Now that you have added your extension code, you deploy it by pushing the code to your subscriber subaccount. This ensures that your extension code is isolated to your subaccount, preventing any impact on other subscriber subaccounts.

  To push the extension code to the subscriber subaccount, use  the [CAPire Documentation - cds push](https://cap.cloud.sap/docs/guides/extensibility/customization#push-extension) command.
  
  1. Get the URL of the MTX module deployed in the provider subaccount. The MTX module url, which was retrieved during the cds login, is also required here.

  2. Get the subdomain from the subscriber subaccount. The subscriber subdomain, which was retrieved during the cds login, is also required here.

  ```bash
  cds push --to <PROVIDER-MTX-APP-URL> -s <SUBSCRIBER-SUBDOMAIN>
  ```

 > Note: A new `Caterer` section is introduced in the PSM application within your subscriber subaccount, enabling you to effortlessly select caterers for your events.

Now that you're familiar with extending the data model, you'll create the UI for the extended entity to manage its lifecycle efficiently in the [next tutorial](./03-FioriUIForExtendedEntity.md).
