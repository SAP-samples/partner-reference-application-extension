# SAP Fiori UI for Extended Entity

As an extension developer working with a consumer like Gourmet Poetry, imagine the need to create a specialized SAP Fiori UI for managing their catering services—something not available in the standard Poetry Slam Manager (PSM) application. This tutorial demonstrates how to achieve that using SAP BTP’s extensibility capabilities. By developing an extension application, you can introduce a custom UI for Gourmet Poetry without modifying the core PSM application, ensuring data remains isolated and secure within their own tenant by leveraging BTP’s multi-tenancy features. This approach not only provides Gourmet Poetry with a tailored solution but also allows the core PSM application to remain stable while enabling partners like you to deliver valuable, differentiated functionality.

Building on the previous tutorial, [Data Model Extensibility](./02-DataModelExtensibility.md), where you extended the PSM data model with the *x_Caterers* entity, this tutorial will now guide you in creating a corresponding Fiori UI to efficiently manage this data for Gourmet Poetry.

## Enable SAP BTP Cloud Foundry Runtime in Subscriber Subaccount

The SAP BTP Cloud Foundry runtime environment is required in the subscriber subaccount, as you will be deploying the web application to manage caterer information. For more details, refer to the [Partner Reference Application Tutorial - Enable SAP BTP Cloud Foundry Runtime](https://github.com/SAP-samples/partner-reference-application/blob/main/Tutorials/22-Multi-Tenancy-Prepare-Deployment.md#enable-sap-btp-cloud-foundry-runtime).

## Get Poetry Slam Manager EDMX

You consume the metadata of the *Poetry Slams* OData service from the subscriber subaccount, where the backend is independently managed. This metadata is then utilized to create the Fiori project. To obtain the metadata, follow the steps outlined below:

1. Copy the poetry slams application url from the subscriber subaccount.

    i. In the SAP BTP cockpit of the subscriber subaccount, navigate to *Instances and Subscriptions* in the *Services* section.

    ii. Copy the url of the *Poetry Slam Manager* application on the *Subscription* tab.

2. Open any web browser, such as *Google Chrome*, and enable the *Developer Tools*.

    > Note: You can enable *Developer Tools* in *Google Chrome* using a keyboard shortcut:
    >
    > i. Windows/Linux: Press `Ctrl + Shift + I` or `F12`.  
    > ii. Mac: Press `Cmd + Option + I`.

3. Paste the application URL into the browser's address bar and press *Enter*.

4. In the *Network* tab's filter bar, type `metadata` to filter the requests related to the metadata.

5. Copy the response of the metadata API call.

6. Create a folder **partner-reference-extension-catering-ui** in your workspace in SAP Business Application Studio.

7. Create a new file **PoetrySlamService.edmx**.

8. Paste the copied metadata into the file.

## Add a Web Application with SAP Fiori Elements

You create the SAP Fiori project by uploading the metadata using the *SAP Fiori Elements Application Wizard* under *partner-reference-extension-catering-ui* folder.

1. To start a new development project, go to the settings in SAP Business Application Studio from your subscriber subaccount and open the Command Palette... or Windows/Linux: Press Ctrl + Shift + P, Mac: Press Cmd + Shift + P.
2. To start the wizard, search for *SAP Business Application Studio: New Project from Template* in the *Command Palette...*.
3. Select the *SAP Fiori Generator* module template and then click on *Start*. 
4. Choose *List Report Page*. and click on *Next*.
5. Select the data source and the OData service as follows:
   - *Data source*: *Upload a Metadata Document*
   - *Metadata file path*: *Upload the metadata file created in the previous section*
6. Select the main entity from the list:
   - *Main entity*: *x_Caterers*
   - *Automatically add table columns*: *Yes*
   - *Table Type*: *Responsive*
7. Add further project attributes:
   - *Module name*: *caterer*
   - *Application title*: *Caterers*
   - *Application namespace*: leave empty
   - *Description*: *Application to create and manage caterers*
   - *Project folder path*: *Choose the project folder*
   - *Enable Typescript*: *No*
   - *Add deployment configuration*: *Yes*
   - *Add FLP configuration*: *No*
   - *Configure Advanced Options*: *No*
8. Select the deployment configuration:
   - *Please choose the target*: *Cloud Foundry*
   - *Destination name*: *none*
   - *Add Router Module*: *Add Application to Managed Application Router*
9. Choose *Finish*. The wizard creates the *caterer* folder, which contains all files related to the user interface.

## Fine-Tune the User Interface

Creating the extension UI follows the same process as developing the standard UI for the PSM application. To customize the generated user interface to meet specific requirements, you can either leverage the [SAP Fiori Tools - Application Modeler extension](https://help.sap.com/docs/SAP_FIORI_tools/17d50220bcd848aa854c9c182d65b699/a9c004397af5461fbf765419fc1d606a.html?locale=en-US) for a guided, low-code approach or manually modify the generated files for greater flexibility and control.

The SAP Fiori Tools - Application Modeler extension includes two tools, which are helpful when creating new pages or adjusting existing ones:

- [Page Editor](https://help.sap.com/docs/SAP_FIORI_tools/17d50220bcd848aa854c9c182d65b699/047507c86afa4e96bb3d284adb9f4726.html?locale=en-US): Create and maintain annotation-based UI elements.
- [Page Map](https://help.sap.com/docs/SAP_FIORI_tools/17d50220bcd848aa854c9c182d65b699/bae38e6216754a76896b926a3d6ac3a9.html?locale=en-US): Change the structure of pages and application-wide settings.

> Note: The recommendation is to use the SAP Fiori tools to create new pages or to enhance existing ones with additional features as the tools generate the required annotations in the annotations file. For better readability, you can restructure the annotations afterwards.

This tutorial will not go into a line-by-line explanation of the files. However, you are encouraged to explore each file in detail to gain a deeper understanding of the sample implementation. The most relevant files are the following:

- [`manifest.json`](../partner-reference-extension-catering-ui/caterer/webapp/manifest.json): Describe the application structure, routing, services, dependencies, and SAP Fiori launchpad integration. The *crossNavigation* section must be defined to enable intent-based navigation, allowing the app to be launched using a specified semantic object and action.
- [`annotation.xml`](../partner-reference-extension-catering-ui/caterer/webapp/annotations/annotation.xml): Define UI-specific annotations that dictate how data is displayed and behaves in the SAP Fiori application.
- [`Internationalization(i18n)`](../partner-reference-extension-catering-ui/caterer/webapp/i18n/i18n.properties): Configure to align with specific requirements.

## Add Destination Route to App Router

To ensure secure and tenant-isolated communication between the new SAP Fiori application and the core PSM OData service, all requests from the SAP Fiori application must be properly routed. This is achieved by configuring the routing rules in the [xs-app.json](../partner-reference-extension-catering-ui/caterer/xs-app.json) file. By doing so, requests to the core *Poetry Slams* OData service are securely handled, maintaining tenant isolation and enforcing controlled access while seamlessly integrating the extension with the core application. Add the following destination route as the first entry in the route configuration.

```json
{  
   ...   
   "source": "^/odata/v4/poetryslamcaterer/(.*)$",
   "target": "/odata/v4/poetryslamservice/$1",
   "destination": "poetry-slams-caterer",
   "authenticationType": "xsuaa",
   "csrfProtection": true
   ...
}
```

| **Property**              | **Description** |
|---------------------------|----------------|
| **source** | Defines the pattern for incoming requests. Any request that starts with `/odata/v4/poetryslamcaterer/` is matched, and the `(.*)` dynamically captures the remaining part of the request URL. This pattern ensures that all relevant requests are correctly routed. Additionally, this URI is specified as the main service URI in the [manifest.json](../partner-reference-extension-catering-ui/caterer/webapp/manifest.json) file, ensuring seamless integration with the SAP Fiori application. |
| **target** | Rewrites the incoming request URL to this new target path. The `$1` placeholder refers to the captured portion from the `source`, ensuring that the rest of the request path remains intact. |
| **destination** | Specifies the backend service or system to which the request should be forwarded. This is typically configured in the SAP BTP Destination Service, enabling seamless connectivity between the SAP Fiori application and the backend system. In the upcoming sections, you will create and configure this destination. |
| **authenticationType** | Enforces authentication using *SAP BTP XSUAA (SAP Authorization and Trust Management Service)* to ensure secure access control. |
| **csrfProtection** | Enables *Cross-Site Request Forgery (CSRF) protection* for this route. |

## Service Broker Setup

To access the *Poetry Slams* OData services from your SAP Fiori application, you must use the service broker. The service broker enables secure access to application OData services by utilizing tenant-specific credentials and authorizations, ensuring effective tenant isolation in a multi-tenant application environment. If you have already created the service broker instance with a *namedaccess* plan in your consumer subaccount, you can safely skip this step.

> Note: A service broker should be added to your PSM application to enable seamless integration and access to the required services. For more details, refer to the [Partner Reference Application Tutorial - Enable API Access to SAP BTP Applications Using Service Broker](https://github.com/SAP-samples/partner-reference-application/blob/main/Tutorials/42a-Multi-Tenancy-Service-Broker.md#enable-api-access-to-sap-btp-applications-using-service-broker).

You need to configure the service broker with *namedaccess* plan in your subscriber subaccount to access the *Poetry Slams* OData services. For more details, refer to the [Partner Reference Application Tutorial - Configure the Service Broker in a Consumer SAP BTP Subaccount](https://github.com/SAP-samples/partner-reference-application/blob/main/Tutorials/42b-Multi-Tenancy-Provisioning-Service-Broker.md#configure-the-service-broker-in-a-consumer-sap-btp-subaccount).

## Create the Destination to Access the Base Application

You need to create a destination in the subscriber subaccount to connect to the *Poetry Slams* OData service using the service broker instance. This destination is already configured in the [xs-app.json](../partner-reference-extension-catering-ui/caterer/xs-app.json) file to enable tenant-specific data calls.

1. First get the information from the service key of the service broker instance *psm-sb-sub1-full*:
   1. In the SAP BTP cockpit of the **consumer subaccount**, navigate to **Services** -> **Instances and Subscriptions**.
   2. View the credentials of the service broker instance *psm-sb-sub1-full*.
   3. Use the *psm-servicebroker* in section *endpoints* as **ServiceBrokerEndpoint**. 
   4. Get the **ServiceBrokerClientID** and **ServiceBrokerClientSecret** from the *uaa*-section.
   5. For the **ServiceBrokerTokenServiceURL**, get the *URL* of the *uaa*-section and add `/oauth/token`. 

2. Go to **Connectivity** and choose **Destinations**.

3. Create a new destination with the following field values:

| Parameter Name    | Value                                                                                             |
| :---------------- | :------------------------------------------------------------------------------------------------ |
| **Name**            | `poetry-slams-caterer`                                                                          |
| **Type**            | `HTTP`                                                                                          |
| **Description**     | Destination description. For example, `Poetry Slams Manager`.                                   |
| **URL**             | Use entry ServiceBrokerEndpoint from the previous step.                                         |
| **Proxy Type**      | `Internet`                                                                                      |
| **Authentication**  | `OAuth2UserTokenExchange`                                                                       |
| **Client Id**       | Use entry ServiceBrokerClientID from the previous step.                                         |
| **Client secret**   | Use entry ServiceBrokerClientSecret from the previous step.                                     |
| **Token Service URL**:      | Use entry ServiceBrokerTokenServiceURL from the previous step.                          |
| **Token Service URL Type**: | `Dedicated`                                                                             |

> Note: For more information on *HTTP Destinations*, refer to the [SAP BTP Connectivity - HTTP Destinations](https://help.sap.com/docs/connectivity/sap-btp-connectivity-cf/http-destinations?locale=en-US).

## Deploy to Cloud Foundry

Now that you have completed all the development and configurations, you can proceed to deploy the application.

1. In the SAP Business Application Studio, open a new terminal and navigate into the `home/user/projects/partner-reference-extension-catering-ui` folder.
2. Enter the SAP BTP Cloud Foundry runtime API of your environment, for example, `https://api.cf.eu10.hana.ondemand.com`.
   1. In the SAP BTP cockpit of the subscriber subaccount, navigate to *Overview*.
   2. Copy the *API Endpoint* from *Cloud Foundry Environment*.
   3. Run the command: 
      
      ```
      cf login -a <API Endpoint>
      ```

   2. Enter your development user and password.
   3. Select the SAP BTP Cloud Foundry runtime space (*app*). 

3. Navigate into the **caterer** folder with the command:
   ```
   cd caterer
   ```
4. To install the dependencies, run the command:
   ```
   npm install
   ```
5. To build the application, run the command:
   ```
   npm run build:mta
   ```

6. To deploy the application, run the command:
   ```
   npm run deploy
   ```

> Note: Looking for more details? Go to the [CAPire Documentation - Deploy to Cloud Foundry](https://cap.cloud.sap/docs/guides/deployment/to-cf).

## Configure SAP Build Work Zone

You have already created a *Launchpad Site* in *SAP Build Work Zone* for the *Poetry Slam Manager* application. Now you have to add *Caterer* web application.

This is done in the *Site Manager* that is launched when you go to the application *SAP Build Work Zone, standard edition* under *Instances and Subscriptions* in the consumer subaccount.

> Note: For more details on configuring *Poetry Slam Manager* application, refer to [Partner Reference Application Tutorial - Configure SAP Build Work Zone](https://github.com/SAP-samples/partner-reference-application/blob/main/Tutorials/25-Multi-Tenancy-Provisioning.md#configure-sap-build-work-zone)

### Add Web Application to Content Manager

The *Content Manager* is the central place to manage applications, roles, and groups in *SAP Build Work Zone*. Applications must be added to the content repository before they can be assigned to users.

1. Open the **SAP Build Work Zone, standard edition** application under **Services -> Instances and Subscriptions** in the **consumer subaccount**. The site manager is opened.
2. Open the **Channel Manager**.
3. Update the **HTML5 Apps** content channel using the **Update content** button on the right side of the table to get the latest changes of your application.
4. Go to the **Content Manager**.
5. Select **Content Explorer**.
6. Choose **HTML5 Apps**.
7. Select the **Caterer** web application.
8. Choose **Add**.

### Create a Role and Assign the Application in Content Manager

A role created in the **Content Manager** is used to manage user access to specific apps, pages, and workspaces in **SAP Build Work Zone**. It organizes related content into logical groups and assigns them to users or user groups, enabling a personalized and secure user experience based on roles.

1. In the **Site Manager**, open the **Content Manager**.
2. Choose **Create > Role**.
3. As role title, enter *PoetrySlamCatererManager*.
4. Choose **Save**.

By assigning the application to the **PoetrySlamCatererManager** role, you ensure that authorized users can see and manage the application.

1. Open the **Content Manager** and choose the **PoetrySlamCatererManager** role.
2. Assign the **Caterer** application to this role and save your changes.

### Create a New Group for the Application

Creating a Group allows you to categorize applications based on functionality, user roles, or business processes. This improves accessibility by ensuring that related applications appear together in a structured manner.

1. Open the **Content Manager**.
2. Create a new **Group**.
3. Enter a title, for example **Caterer**, and a description, for example **Maintain caterer** for better organization.
4. Add the **Caterer** application to the newly created group.
5. Save your changes.

### Configure Role Assignments in Site Settings

By assigning the *PoetrySlamCatererManager* role (or a specific business role) in *Site Settings*, you provide authorized users with the necessary permissions to access the launchpad, navigate through available applications, and use the applications seamlessly.

1. Navigate to the *Site Directory* and open *Site Settings*.
2. Go to *Role Assignments*, assign the *PoetrySlamCatererManager* and save your changes.

> Note: To access the *Caterer* application, assign the `PoetrySlamCatererManager` role collection to your user in the subscriber subaccount—this enables visibility of the *Caterer* tile on the site. Additionally, assign the `~poetry_slam_manager_poetrySlamManagerRole` role collection to ensure access to the underlying OData service.
