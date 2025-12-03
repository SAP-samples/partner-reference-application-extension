# Extending Persistence and UI with Custom Fields

The Partner Reference Application Extension enhances the *Poetry Slam Manager (PSM)* by expanding its business capabilities. This tutorial guides you through customizing the PSM to enable caterer selection for poetry slam events.

As an event manager, you can assign a caterer to provide food services. To do this, create a new custom entity called *Caterer* to store caterer details. Extend the *Poetry Slam* entity by establishing an association with the *Caterer* entity. Additionally, extend the *Poetry Slam* service to expose the new entity. A new section group is added to the existing *Poetry Slam* object page, which allows you to select a caterer. Once you choose a caterer, their contact information appears in the newly added section.

## Creating a New Project Based on SAP Cloud Application Programming Model

You need to create extension projects. These are standard CAP-based projects designed to extend the functionality of SaaS applications. In this case, you develop a catering extension application to enhance the features of the PSM application.

1. Open the SAP Business Application Studio in your **development subaccount**.

2. Create a new *Dev Space* for the development of this tutorial. Name it **PartnerReferenceApplicationExtension** and select *Full-Stack Cloud Application*.

1. To start a new development project, go to the settings in SAP Business Application Studio and open the **Command Palette...** or Windows/Linux: Press Ctrl + Shift + P, Mac: Press Cmd + Shift + P.

3. Search for `SAP Business Application Studio: New Project from Template`.

4. Make sure the target folder path is set to `home/user/projects`. Choose **CAP Project** and then **Start**. 

5. Add the following attributes to the **CAP Project** and choose **Finish**:
    - As **project name**, enter `partner-reference-extension-catering`.
    - As **runtime**, enter `Node.js`.

    As a result, a folder named `partner-reference-extension-catering` is created. It contains a set of files to help you start a SAP Cloud Application Programming Model project.

6. Adapt the created **.gitignore** file to your needs. You may use the [*.gitignore*](../partner-reference-extension-catering/.gitignore) file of this repository with other useful entries.

7. Adapt the created **package.json** file to your needs, for example, change the description attribute, add scripts, etc. You may use the [*package.json*](../partner-reference-extension-catering/package.json) file of this repository as a reference. Additionally, you need to incorporate the following configurations:

    ```json
    {
      ...
      "extends": "partner-reference-application",
      "workspaces": [
        ".base"
      ]
      ...
    }
    ```

    - `extends` is the identifier used by the extension model to reference the base model. It must be a valid base application name, as it serves as the package name for the base model when executing `cds pull`.
    - `workspaces` is a list of folders, including the one where the base model is stored. If not already present, the `cds pull` command automatically adds this property to ensure proper configuration.

## Assigning the Extension Developer Role

To extend the base model, assign the `PoetrySlamExtensionDeveloperRoleCollection` role collection to you in the subscriber subaccount. It is essential for working on the [CAPire Documentation - Extension model](https://cap.cloud.sap/docs/guides/extensibility/customization#about-extension-models).

1. In the **subscriber subaccount**, go to **Security** -> **Role Collections**.
2. Edit the role collection `PoetrySlamExtensionDeveloperRoleCollection` that was created by the **Poetry Slam Manager**. 
3. In section **Users**, add the users that shall be allowed to build extensions for the **Poetry Slam Manager**. 
4. Click the `+` button.
5. Save the changes.

> Note: The `PoetrySlamExtensionDeveloperRoleCollection` role collection is established within the base model as part of the extension enablement process. For more details, refer to the [Partner Reference Application Tutorial - Poetry Slam Manager Application with extensibility](https://github.com/SAP-samples/partner-reference-application/blob/main/Tutorials/50-Multi-Tenancy-Features-Tenant-Extensibility.md#application-enablement).

## Pulling the Base Model

To enable local testing and syntax highlighting, ensure that the model information of the base application (in this case, the **Poetry Slam Manager**) is accessible to the extension project. The cds compiler expects the base model to be available as an NPM package within the node_modules folder.

The following section explains how to retrieve the model from the running application and make it available locally using the cds pull command.

> Note: The system searches for the `extends` field in the `package.json` file to identify the base model. 

1. To simplify the use of multitenancy-related commands, for example, `cds pull` and `cds push`, by enabling automatic authentication, you must first log in using the appropriate credentials. For more details, refer to the [CAPire Documentation - cds login](https://cap.cloud.sap/docs/guides/extensibility/customization#cds-login).

   1. Get the URL of the MTX module deployed in the provider subaccount.

      i. In the SAP BTP cockpit of the provider subaccount, navigate to the SAP BTP Cloud Foundry runtime space where the application is deployed.

      ii. In the space cockpit, navigate to **Applications** and select the link *poetry-slams-mtx*.

      iii. Copy the **Application Route** from the **Application Overview** for later use (**provider mtx URL**).

   2. Get the subdomain from the subscriber subaccount.

      i. In the SAP BTP cockpit of the subscriber subaccount, navigate to **Overview**.

      ii. Copy the **Subdomain** from the **General** section.

      iii. In the terminal of your development environment, execute the following statement to log into the MTX module.

        ```bash
        cds login <PROVIDER-MTX-APP-URL> -s <SUBSCRIBER-SUBDOMAIN>
        ```

        > Note: The one-time passcode is prompted interactively after running the above command.

    If you need to automatically call cds login without user interaction, you can use the **Client Credentials** grant. This approach does not require a passcode and is ideal for scenarios where user authentication is not necessary. The Client Credentials grant provides an application with access to resources in a service without needing individual user consent. This approach is not recommended and should only be used if logging in without user context is explicitly required.

    1. Get the **Client Credentials** of the MTX module deployed in the provider subaccount.

        i. In the SAP BTP cockpit of the provider subaccount, navigate to the SAP BTP Cloud Foundry runtime space where the application is deployed.

        ii. In the space cockpit, navigate to **Applications** and select the link **poetry-slams-mtx**.

        iii. Choose **Environment Variables**, navigate to **VCAP_SERVICES**, locate *xsuaa*, and copy the **clientid** and **clientsecret**.

        iv. In the terminal of your development environment, execute the following statement to log into the MTX module.

    2. Open a new terminal in your SAP Business Application Studio space or Windows/Linux: Press Ctrl + Shift + C, Mac: Press Cmd + Shift + C.
   
    3. In the terminal, execute the following statement to log in to the MTX module. 

        ```bash
        cds login <PROVIDER-MTX-APP-URL> -s <SUBSCRIBER-SUBDOMAIN> -c '<CLIENT-ID>':'<CLIENT-SECRET>' --plain
        ```

        For more information, refer to the [CAPire Documentation - How to Login](https://cap.cloud.sap/docs/guides/extensibility/customization#how-to-login).

2. Pull the latest cds model from the provider subaccount to the extension project named `partner-reference-extension-catering`.

   1. Run the following command. The MTX module URL, retrieved during the cds login, is also required here.

    ```bash
    cds pull --from <PROVIDER-MTX-APP-URL>
    ```

    > Note: [cds pull](https://cap.cloud.sap/docs/guides/extensibility/customization#pull-base) creates a .base folder in your extension project and adds the .base workspace to the package.json of the extension project if it is not already there.

## Installing the Base Model

To prepare the downloaded base model for use in your extension project, install it.

1. Run the following command:

   ```
   npm install
   ```

> Note: This will link the base model in the workspace folder to the subdirectory *node_modules/partner-reference-application*.

## Writing the Extension Code

It is not mandatory to split the extension model into multiple files. However, for better maintainability, CAP recommends structuring it similarly to a standard SAP CAP application. The data model enhancements should be placed in the `db` folder, service enhancements in the `srv` folder, and UI annotations in the `app` folder. This approach ensures a well-organized project structure and aligns with best practices.

1. Extending the data model:

    Using the `extend` directive simplifies the process of enhancing the application with new artifacts. You can add new fields to existing entities, create entirely new entities, and extend existing entities with new associations. Additionally, you can add compositions to both existing and new entities, set default values, define range checks, and apply value list validations to new or existing fields. Furthermore, you can enforce mandatory field checks and introduce unique constraints on new or existing entities, ensuring data integrity and consistency.

    > Note: For more details on extending data model, refer to the [CAPire Documentation - Extending the Data Model](https://cap.cloud.sap/docs/guides/extensibility/customization#extending-the-data-model).

    1. Create a file named catererManager.cds file in the **/db** folder. This references all the entity definitions (cds-file of the database).

    2. Copy the content of the [catererManager.cds](../partner-reference-extension-catering/db/catererManager.cds) file into the newly created file. A new entity called **x_Caterers** is created. The existing **PoetrySlams** entity is extended by adding an association to it. The following example shows how to extend the data model.

        ```cds
        ...
        // Extend the entity with new x_Caterers entity
        extend PoetrySlams with {
          x_caterer : Association to one x_Caterers @title: '{i18n>caterer}';
        }
        ...
        ```

        > **Note**:
        > - The prefix `x_` is added to entities, namespaces, or fields based on the configuration defined during extensibility enablement in the base application. This ensures that artifacts created in the extended application don't conflict with those in the base application, maintaining consistency and avoiding naming collisions. For more information, refer to the [Partner Reference Application Tutorial - Poetry Slam Manager Application with extensibility](https://github.com/SAP-samples/partner-reference-application/blob/main/Tutorials/50-Multi-Tenancy-Features-Tenant-Extensibility.md#application-enablement).
        > - For more details on defining domain models, refer to the [Partner Reference Application Tutorial - Define the Domain Models](https://github.com/SAP-samples/partner-reference-application/blob/main/Tutorials/14-Develop-Core-Application.md#define-the-domain-models).

2. Extending the service model:

    After you've defined the domain model with its entities, define a set of services to add APIs to the application. In the existing service, the newly created entities are automatically included as they serve as targets for the corresponding compositions. Additionally, these new entities are automatically exposed in a read-only manner as CodeLists.

    > Note: For more details on extending service models, refer to the [CAPire Documentation - Extending the Service Model](https://cap.cloud.sap/docs/guides/extensibility/customization#extending-the-service-model).

    1. Create a file called `catererManagerService.cds` in the **/srv** folder, which includes all service definitions (cds-file of the service).  

    2. Copy the following content into the newly created file: 

        ```cds
        using { x_sap.samples.poetryslams.catering.x_Caterers as caterers } from '../db/catererManager';

        // Extend the PoetrySlamService of the base application with the X_Caterers entity.
        extend service PoetrySlamService with{
            entity x_Caterers as projection on caterers;
        }
        ```

        > Note: For more details on defining services, refer to the [Partner Reference Application Tutorial - Define Services](https://github.com/SAP-samples/partner-reference-application/blob/main/Tutorials/14-Develop-Core-Application.md#define-services).

3. Extending UI annotations:

    Once you have defined the domain and service model, you extend UI annotations. Extending UI annotations in SAP CAP Extension Development allows you to customize and enhance the user interface of a base application without altering its core functionality. This can involve adding new UI elements such as sections, fields, and tables. You can modify existing annotations, adjust field visibility and read-only status, and define value helps or lists. You can also reorganize the layout of pages, configure smart tables and forms, and add action buttons. By using the `extend` directive in CDS models, you can seamlessly introduce customizations. This approach improves user experience and ensures flexibility in adapting to business requirements while maintaining the integrity of the original application.

    1. Create a file called `catererManager.cds` in the **/app** folder, which references all UI annotations (cds-file of the UI).
    2. Copy the content of the [catererManager.cds](https://github.com/SAP-samples/partner-reference-application-extension/blob/main/partner-reference-extension-catering/app/catererManager.cds) of the Partner Reference Application Extension into the newly created file.

      > Note: With this code snippet, you add a new **Caterer** section between the **General** and **Visitors** sections using the `... up to` and `...` keywords. This can be accomplished by [extending array values](https://cap.cloud.sap/docs/guides/extensibility/customization#extending-array-values). The following code demonstrates how to seamlessly insert a new UI facet between the existing facets in the base application, enhancing its functionality while preserving the integrity of the current layout.

      ```cds
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
      ```

    3. Create a new folder called `i18n` in the **partner-reference-extension-catering** folder.
    4. Create new file called `i18n.properties` in the newly created i18n-folder to support translation.
    5. Copy the content of the [i18n.properties](https://github.com/SAP-samples/partner-reference-application-extension/blob/main/partner-reference-extension-catering/i18n/i18n.properties) of the Partner Reference Application Extension into the newly created file.

    > Note: Extending UI annotations in SAP CAP Extension Development allows you to customize and enhance the user interface of a base application without altering its core functionality. For more details on extending UI annotations, refer to [Extending UI Annotations](https://cap.cloud.sap/docs/guides/extensibility/customization#extending-ui-annotations) of the capire documentation.


## Adding Role-Based Authorization

To safeguard the extension application from unauthorized access, it's essential to implement user-based authorization mechanisms. Typically, the extension application statically assigns roles to specific service operations, such as reading or writing particular entities. To manage assignments efficiently, leverage the roles defined in your base application. These roles can be systematically assigned to users, allowing the application to enforce access controls and permissions.

Authorizations are consistently defined at the service level. For this application, they are specifically in [/srv/catererManagerService.cds](../partner-reference-extension-catering/srv/catererManagerService.cds). To improve readability and maintainability, it's recommended to separate the authorization definitions from the main service logic. You can use the [@requires](https://cap.cloud.sap/docs/guides/security/authorization#requires) and [@restrict](https://cap.cloud.sap/docs/guides/security/authorization#restrict-annotation) annotations in CAP model to control access to resources based on user roles. These annotations help enforce role-based authorization by specifying which roles are required to access a service or entity.

The roles available for assignment are typically defined in the base application. These roles, configured for a specific service, are listed in the [index.csn](../partner-reference-extension-catering/.base/index.csn) file generated during build time. This file reflects the metadata of your CAP model, including role-based access definitions. A sample configuration might look like the following:

```json
"PoetrySlamService": {
  "kind": "service",
  "@source": "srv/poetryslam/poetrySlamService.cds",
  "@path": "poetryslamservice",
  "@requires": [
    "PoetrySlamFull",
    "PoetrySlamRestricted",
    "PoetrySlamReadonly"
  ]
}
```

  1. Create a [srv/catererManagerServiceAuthorization.cds](../partner-reference-extension-catering/srv/catererManagerServiceAuthorization.cds) file that encapsulates all authorization-relevant model elements.

> Note: For more details on the roles included in the base application, refer to the [Partner Reference Application Tutorial - Add Authentication and Role-Based Authorization](https://github.com/SAP-samples/partner-reference-application/blob/main/Tutorials/14-Develop-Core-Application.md#add-authentication-and-role-based-authorization).

## Creating an Initial Data Set

  Create an initial data set that is available after you've started the application. You can specify the data in SAP CAP by creating a set of CSV files in the */db/data* folder of the project. For more details, refer to the [Partner Reference Application Tutorial - Create an Initial Data Set](https://github.com/SAP-samples/partner-reference-application/blob/main/Tutorials/14-Develop-Core-Application.md#create-an-initial-data-set).
  
   1. Open a new terminal in your SAP Business Application Studio space or Windows/Linux: Press Ctrl + Shift + C, Mac: Press Cmd + Shift + C. 
   
   2. In the terminal, execute the following statement to create the files with the initial data in the **/db/data** folder:
      ```
      cds add data -f x_sap.samples.poetryslams
      ```

   3. Copy the data from [x_sap.samples.poetryslams.catering-x_CuisineTypeCodes.csv](https://github.com/SAP-samples/partner-reference-application-extension/blob/main/partner-reference-extension-catering/db/data/x_sap.samples.poetryslams.catering-x_CuisineTypeCodes.csv) into the `db/data/x_sap.samples.poetryslams.catering-x_CuisineTypeCodes.csv` file. It adds the cuisine data to the entity.
   
   4. Copy the data from [x_sap.samples.poetryslams.catering-x_Caterers.csv](https://github.com/SAP-samples/partner-reference-application-extension/blob/main/partner-reference-extension-catering/db/data/x_sap.samples.poetryslams.catering-x_Caterers.csv) into the `db/data/x_sap.samples.poetryslams.catering-x_Caterers.csv` file. It adds the caterer data to the entity.

   5. Delete the file `x_sap.samples.poetryslams.catering-x_CuisineTypeCodes.texts.csv`. It is required for translation and not used in this example.

> Note: Adding caterers data serves demonstration purposes only and isn't suitable for a production environment. As outlined in the **Partner Reference Application**, implementing a test action is a more appropriate solution. However, the current extensibility framework doesn't yet support the implementation of such logic.

## Deploying the Extension
  
  Now that you've added your extension code, you deploy it by pushing the code to your subscriber subaccount. This ensures that your extension code is isolated to your subaccount, preventing any impact on other subscriber subaccounts.

  To push the extension code to the subscriber subaccount, use  the [cds push](https://cap.cloud.sap/docs/guides/extensibility/customization#push-extension) command.
  
  1. Get the URL of the MTX module deployed in the provider subaccount. The MTX module URL, which was retrieved during the cds login, is also required here.

  2. Get the subdomain from the subscriber subaccount. The subscriber subdomain, which was retrieved during the cds login, is also required here.

  ```bash
  cds push --to <PROVIDER-MTX-APP-URL> -s <SUBSCRIBER-SUBDOMAIN>
  ```

 > Note: A new `Caterer` section is introduced in the PSM application within your subscriber subaccount, enabling you to effortlessly select caterers for your events.

## Test the Extension

Now, a new **Caterer** section is introduced in the **Poetry Slam Manager** application within your subscriber subaccount, enabling you to effortlessly select caterers for your events.

1. Launch your Poetry Slam Manager application from your subscriber subaccount.
2. Select a published poetry slam. You can see that the new **Caterer** section is available.
3. Choose **Edit** and select a caterer for your event from the predefined list. The poetry slam is updated with the caterer information.
4. Save your changes.

Now that you're familiar with extending the data model, you can create the UI for the extended entity to manage its lifecycle efficiently in the [next tutorial](./03-FioriUIForExtendedEntity.md).
