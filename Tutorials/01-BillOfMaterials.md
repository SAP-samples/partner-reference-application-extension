# Learn About Extensibility and get an Overview of Bill of Materials

Extensibility is the ability to serve multiple customers from a single deployment of an application and adopting it to the individual needs of the customer. Any extension is strictly separated from the core application and other customers, which allows seamless upgrades on the one hand and strict isolation of functionality on the other.

On this version of the _Poetry Slam Manager (PSM)_, the Partner Reference Application (PRA) uses a single deployment to a provider subaccount and subscriptions to this deployment in (one or more) subscriber subaccounts. In the subscriber subaccount, the customer-specific extensions can be deployed to adopt the standard solution to the individual needs.

## Prerequisites

To proceed with on-stack extensibility, you need the extensibility-enabled multi-tenant PSM application. For more information, refer to the [Partner Reference Application Tutorial - Poetry Slam Manager application with extensibility](https://github.com/SAP-samples/partner-reference-application/blob/main/Tutorials/50-Multi-Tenancy-Features-Tenant-Extensibility.md).

For bill of materials, refer to the [Partner Reference Application Tutorial - Learn about multitenancy and get an overview of the bill of materials](https://github.com/SAP-samples/partner-reference-application/blob/main/Tutorials/20-Multi-Tenancy-BillOfMaterials.md). Here, you're exploring the additional resources and materials needed, based on the linked tutorial from the Partner Reference Application, to implement on-stack extensibility.

## Subaccounts

The example setup serves below customer called *Gourmet Poetry*, a renowned food magazine that uniquely combines poetry slam events with gourmet food experiences.

To develop and run the application, the following directory and subaccount structure is proposed.

| Directory Name                   | Subaccount Name                      | Usage                                                                                                       |
| --------------------             | --------------------                 | ----------------------------                                                                                |
| Development                      |                                      |                                                                                                             |
|                                  | Development                          | SAP Business Application Studio                                                                                 |
| Partner Reference Application    |                                      |                                                                                                             |
|                                  | Provider: Poetry Slam Manager        | Application runtime, the database, other SAP BTP services used to run the application                       |
|                                  | Consumer : Gourmet Poetry      | Subscription to customer Gourmet Poetry who uses the application as a stand-alone solution          |

> Note: If you have already deployed the PSM, you can retain it and simply add the new consumer or opt for the minimal setup as outlined in the table.

## Entitlements

In addition to the entitlements needed to deploy and run the [Poetry Slam Manager](https://github.com/SAP-samples/partner-reference-application/blob/main/Tutorials/20-Multi-Tenancy-BillOfMaterials.md#entitlements), the list also includes the entitlements required in the respective subaccounts for developing and running extensions.

| Subaccount    |  Entitlement Name                                    | Service Plan              | Type          | Quantity                          |
| -----------   |  -------------------                                 | ---------                 | ---------     | ---------                         |
| Development   |                                                      |                           |               |                                   |
|               | SAP Business Application Studio                      | standard-edition          | Application   | 1 (per developer)                 |
| Consumer      |                                                      |                           |               |                                   |
|               | SAP Authorization and Trust Management service       | broker                    | Service       | 1                                 |
|               | SAP Destination service                              | lite                      | Service       | 1                                 |
|               | SAP HTML5 Application Repository service for SAP BTP | app-host                  | Service       | 1                                 |
|               | SAP HTML5 Application Repository service for SAP BTP | app-runtime               | Service       | 1                                 |
|               | SAP Build Work Zone, standard edition                | standard                  | Application   | 1                                 |

> Note: The *SAP HANA Schemas & HDI Containers* entitlement is not required in the consumer tenant, as the SAP HANA database instance from the provider tenant will be utilized.

## Services Without Entitlements

The list shows services that don't require entitlements.

| Subaccount    |  Entitlement Name                                    | Service Plan              | Type          | Quantity                          |
| -----------   |  -------------------                                 | ---------                 | ---------     | ---------                         |
| Consumer      |                                                      |                           |               |                                   |
|               | Poetry Slam Manager                                  | default                   | Application   | 1 (partner application)           |


> Note: Contact SAP if there aren't enough service entitlements available in your global account.

Before you move on to the next tutorial, ensure that the required service assignments are available in your global account and that you have completed the setup of the extensibility-enabled multi-tenant PSM application.

> Note: Subscribe to the PSM application in the consumer tenant and assign yourself the `PoetrySlamManagerRoleCollection` and `PoetrySlamVisitorRoleCollection` role collections in the consumer tenant.<br/> For more information, refer to [Partner Reference Application Tutorial - Provision Tenants of the Multi-Tenant Application to Customers](https://github.com/SAP-samples/partner-reference-application/blob/main/Tutorials/25-Multi-Tenancy-Provisioning.md#provision-tenants-of-the-multi-tenant-application-to-customers)

Now that you're familiar with the bill of materials and have set up the multi-tenant PSM application, you prepare the data model to extend the PSM application in the consumer tenant in the [next tutorial](./02-DataModelExtensibility.md).
