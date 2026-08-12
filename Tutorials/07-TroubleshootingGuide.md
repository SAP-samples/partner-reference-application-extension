# Troubleshooting Guide

This guide provides solutions to common issues when extending the **Poetry Slam Manager** base application. Each section describes the problem, explains the cause, and provides step-by-step instructions to resolve it.

## Extension Sync Issues (Missing `.base` / Model Out of Sync)

When working with extensions, you can encounter synchronization issues with the base application model. This typically happens after a base application update or when the local `.base` folder is missing or outdated.

### Symptoms

You may experience one or more of the following issues:

- The `.base` folder is missing from your project.
- The error message `Extension is incompatible with the current base model version` appears.

These errors indicate that your local extension project is not synchronized with the current version of the base application.

### Resolution

To resolve synchronization issues, follow these steps:

1. **Verify your roles:** Ensure you have the `PoetrySlamExtensionDeveloperRoleCollection` role assigned in the SAP BTP cockpit. This role is required to access the base application model and perform synchronization operations.

2. **Reset and resync:** Run the following commands to force a fresh synchronization with the provider:

    ```bash
    # Re-authenticate and pull the fresh base model
    cds login <PROVIDER-MTX-APP-URL> -s <SUBSCRIBER-SUBDOMAIN>
    cds pull --from <PROVIDER-MTX-APP-URL>

    # Re-install dependencies
    npm install
    ```

    > Note: The `cds pull` command automatically overrides the *.base* folder if it exists, ensuring you have the latest version of the base application model. Always pull the latest base model before deploying extensions to avoid compatibility issues.

## Extension Naming

### Extension Prefix Error

When creating extension entities or fields, all names must follow the naming convention that the base application enforces. This ensures that extensions don't conflict with base application artifacts or future updates.

#### Error Message

The following error indicates that one or more entities or fields in your extension don't use the required prefix:

```
Extension entity name must start with configured prefix
```

#### Resolution

To resolve this error, follow these steps:

1. Review all entity and field names in your extension CDS files.

2. Ensure that all custom entities and fields are prefixed with `x_`. The following examples show correct and incorrect naming:

    **Correct naming:**
    ```cds
    entity x_Caterers : cuid, managed { ... }

    extend PoetrySlams with {
      x_caterer : Association to one x_Caterers;
    }
    ```

    **Incorrect naming (fails):**
    ```cds
    entity Caterers { ... }
    ```

3. After you correct the naming, rebuild and redeploy your extension.

> Note: For more information about how the extension prefix is configured, see the [Partner Reference Application Tutorial - Enable Consumer-Specific Extensions](https://github.com/SAP-samples/partner-reference-application/blob/main/Tutorials/50-Multi-Tenancy-Features-Tenant-Extensibility.md#application-enablement).

## Business Logic Extensibility (BLE)

Business logic extensibility allows you to add custom logic to your extension through event handlers. These handlers are invoked automatically by the framework when specific events occur. However, improper configuration can prevent handlers from executing.

### Event Handler Not Triggered

If your custom event handler isn't being executed, the most common cause is incorrect folder structure or file naming.

#### Understanding the Naming Convention

The business logic extensibility framework uses a specific folder structure and file naming pattern to discover and register event handlers. The structure must exactly match the following:

```text
srv/
└── PoetrySlamService/              # Exact service name
    ├── on-extendProjectData.js     # Custom exit
    └── PoetrySlams/                # Exact entity name
        └── before-UPDATE.js        # Pattern: WHEN-WHAT.js
```

The file naming follows the `WHEN-WHAT.js` pattern:
- **WHEN** specifies when the handler is executed: 
  - `before` - Executes before the operation
  - `after` - Executes after the operation
  - `on` - Custom exit or action handler
- **WHAT** specifies the operation or action name: 
  - Standard operations: `CREATE`, `READ`, `UPDATE`, `DELETE`
  - Custom actions: Use the action name (for example, `extendProjectData`)

Valid patterns include: `before-UPDATE.js`, `after-CREATE.js`, `on-extendProjectData.js`

#### Resolution

To resolve this issue, follow these steps:

1. Verify that your folder structure exactly matches the required pattern. The service folder name must match your service name, and the entity folder name must match your entity name.

2. Ensure your handler file follows the `WHEN-WHAT.js` naming pattern.

3. Verify that your handler exports a single async function:

    ```javascript
    module.exports = async function (req) {
      // handler logic
    };
    ```

### SELECT Query Fails

When writing custom logic in business logic extensibility handlers, you may encounter issues when trying to query data from the database.

The following error indicates that the `SELECT` query is not properly constructed in the context of the business logic extensibility runtime:

```
Cannot read properties of undefined (reading 'from')
```


#### Resolution

To resolve this error, follow these steps:

1. Identify any SELECT queries in your handler that use service context or entity imports.

2. Replace them with the global `SELECT` API using string entity names:

    **Correct approach:**
    ```javascript
    const caterer = await SELECT.one.from('x_Caterers').where({ ID: req.data.x_caterer_ID });
    ```

3. Test your handler to ensure the query executes successfully.

### Missing Oyster Configuration

The Oyster runtime is required to execute business logic extensibility handlers. If this configuration is missing, your handlers won't run.

The following error indicates that the Oyster runtime configuration is missing from your *package.json* file:

```
code-extensibility configuration not found
```

#### Resolution

To resolve this error, follow these steps:

1. Open your *package.json* file.

2. Add the following configuration to the `cds` section:

    ```json
    {
      "cds": {
        "requires": {
          "code-extensibility": {
            "runtime": "oyster",
            "maxTime": 1000,
            "maxMemory": 4,
            "maxDepth": 4,
            "maxResultSize": 100,
            "continueOnError": false
          }
        }
      }
    }
    ```

3. Restart your application to apply the configuration.

## Service Extension

When extending the **Poetry Slam Manager** with custom entities, you need to expose these entities through the service layer. If your extension entities aren't visible in the service metadata, the UI can't access them.

## Authentication

Authentication issues are among the most common problems when working with multi-tenant extensions. These issues typically manifest as authorization errors or token-related problems.

### Extension Developer Role Missing

To develop and deploy extensions, you need specific authorization roles. Without these roles, you can't access the base application model or deploy your extensions.

#### Resolution

To resolve this issue, follow these steps:

1. Open the SAP BTP cockpit and navigate to your subscriber subaccount.

2. In the left navigation, go to **Security → Role Collections**.

3. Locate the `PoetrySlamExtensionDeveloperRoleCollection` in the list.

4. Select the role collection to open it and add your user.

5. Save your changes and wait a few minutes for the role assignment to propagate.

6. Log out and log back in to ensure your session includes the new role.

### Token Expired

Authentication tokens have a limited lifetime. When working with the CDS CLI to push extensions, you may encounter errors if your token has expired.

The following error indicates that your authentication token has expired and needs to be refreshed:

```
Invalid JWT token
```


#### Resolution

To resolve this error, follow these steps:

1. For interactive development, run the following command to authenticate again:

    ```bash
    cds login <MTX_URL> -s <SUBDOMAIN>
    ```

    This command opens a browser window where you can authenticate and obtain a new token.

2. For CI/CD pipelines or automated deployments, use client credentials instead:

    ```bash
    cds login <MTX_URL> -s <SUBDOMAIN> -c '<CLIENT_ID>':'<CLIENT_SECRET>' --plain
    ```

    Replace `<CLIENT_ID>` and `<CLIENT_SECRET>` with the credentials from your service key.

### 403 Forbidden

The **Poetry Slam Manager** uses role-based authorization to control access to entities. Your extension entities inherit this authorization model and require proper configuration.

#### Resolution

To resolve this error, follow these steps:

1. **Assign role collections to your user:**
   - Navigate to your SAP BTP subaccount in the cockpit.
   - Go to **Security → Role Collections**.
   - Assign either `PoetrySlamFull` (for full access) or `PoetrySlamReadonly` (for read-only access) to your user.

2. **Verify authorization annotations in your CDS files:**
   
   Create or verify your authorization file (for example, *catererManagerServiceAuthorization.cds*):

    ```cds
    annotate PoetrySlamService.x_Caterers with @(requires: [
      'PoetrySlamFull',
      'PoetrySlamReadonly'
    ]);
    annotate PoetrySlamService.x_Caterers with @(restrict: [
      { grant: ['*'],    to: 'PoetrySlamFull' },
      { grant: ['READ'], to: 'PoetrySlamReadonly' }
    ]);
    ```

    This configuration ensures that:
    - Users with `PoetrySlamFull` role have full access (create, read, update, delete)
    - Users with `PoetrySlamReadonly` role have read-only access

3. Redeploy your extension to apply the authorization changes.

4. Log out and log back in to ensure your session includes the updated role assignments.

## Deployment

Deploying extensions to the base application requires several steps. If any of these steps fail, the deployment won't complete successfully.

## UI Routing

SAP Fiori applications use the approuter to route requests to the appropriate back-end services. If the routing configuration is incorrect, the UI can't access your extension services.

### 404 Not Found

When the UI tries to access your extension entities, you may see 404 errors if the routing configuration is missing or incorrect.

The following error indicates that the approuter can't find a route to handle requests to your extension service:

```
404 Not Found: /odata/v4/poetryslamcaterer/...
```


#### Resolution

To resolve this error, follow these steps:

1. Locate your *xs-app.json* file in your extension project.

2. Verify that you have a route configured for your extension service:

    ```json
    {
      "routes": [
        {
          "source": "^/odata/v4/poetryslamcaterer/(.*)$",
          "target": "/odata/v4/poetryslamservice/$1",
          "destination": "poetry-slams-caterer",
          "authenticationType": "xsuaa",
          "csrfProtection": true
        }
      ]
    }
    ```

    This configuration:
    - Matches requests to `/odata/v4/poetryslamcaterer/*`
    - Forwards them to `/odata/v4/poetryslamservice/*` on the back end
    - Uses the `poetry-slams-caterer` destination
    - Requires XSUAA authentication and CSRF protection

3. Redeploy your application to apply the routing changes.

### 503 Service Unavailable

After subscribing to the application from a consumer subaccount, you may encounter a 503 error when trying to access the application for the first time.

When opening the application, you may see:

```
503 Service Unavailable
```

This error appears in the browser console and indicates that the user doesn't have the required role to access the application.

#### Resolution

To resolve this error, follow these steps:

1. Open the SAP BTP cockpit and navigate to your consumer subaccount (the subaccount that subscribed to the application).

2. In the left navigation, go to *Security → Role Collections*.

3. Locate the `PoetrySlamManager` role collection in the list and select it.

4. Assign the role collection to a user group and verify the identity provider:
   - In the *User Groups* section, add the appropriate user group (for example, `PSM_Users`).
   - Verify that the *Identity Provider* field shows your correct identity provider (for example, your organization's Azure AD or SAP Cloud Identity Service).
   - Save your changes.

5. Ensure your user is a member of this user group in your identity provider.

6. Log out and log back in to refresh your session.

7. Wait a few minutes for the role assignment to propagate, then access the application again.

> Note: The `PoetrySlamManager` role collection must be assigned in the consumer subaccount after subscription. If you don't have administrator access, contact your subaccount administrator to assign the role collection to your user group.

## Best Practices

Follow these best practices to avoid common issues when developing extensions:

1. **Keep your base model synchronized:** Always run `cds pull` to get the latest base model before deploying extensions. This ensures compatibility with the current version of the base application.

2. **Follow naming conventions:** Use the configured prefix (for example, `x_`) for all extension artifacts as defined in the [MTX sidecar package.json](https://github.com/SAP-samples/partner-reference-application/blob/main-multi-tenant-features/mtx/sidecar/package.json) file. Consistent naming prevents conflicts and errors.

3. **Use correct folder structure for business logic extensibility:** Exactly follow the `srv/<Service>/<Entity>/WHEN-WHAT.js` pattern. The framework relies on this structure to discover and register handlers.

4. **Validate your build:** Run `cds build` before `cds push` to validate your CDS models and catch compilation errors. A successful build indicates that your extension is ready for deployment.

## Additional Help

For more information and support, refer to these resources:

- [CAP Documentation](https://cap.cloud.sap/docs/) - Comprehensive documentation for the SAP Cloud Application Programming Model
- [@sap/cds-oyster](https://www.npmjs.com/package/@sap/cds-oyster) - Documentation for the Oyster runtime used in business logic extensibility