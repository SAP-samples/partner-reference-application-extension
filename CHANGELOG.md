# Changes

## Current Version - December 2025

The tutorials and sample extension application code are available in the `main` branch.

The current version includes:

- [Adding Role-Based Authorization](./Tutorials/02-DataModelExtensibility.md#adding-role-based-authorization): Role-based authorizations allowing the application to enforce access controls and permissions.
- [Quickstart Guide](./Tutorials/05-Quickstart.md): Streamlined guide for rapid extension setup without detailed explanations.
- Smaller corrections, improvements, and updates.

Tag: [release-2512](https://github.com/SAP-samples/partner-reference-application-extension/releases/tag/release-2512)

## Older Versions

### February 2025 (Initial Version)

The tutorials and sample extension application code are available in the `main` branch.

#### Highlights

- Comprehensive step-by-step tutorials for building and deploying partner application extensions using SAP BTP extensibility capabilities.
- Ready-to-run sample code for the Catering Management extension that demonstrates how to extend the Poetry Slam Manager application.
- Guidance on best practices for CAP extensibility, multi-tenant SaaS extensions, and SAP Fiori Elements integration.

#### Tutorials Provided

1. Learning about extensibility concepts and understanding the bill of materials required for partner extensions.
2. Extending the data model to include custom entities and fields using CAP extensibility framework.
3. Developing a SAP Fiori UI application to manage the custom entity with full CRUD operations.
4. Taking a guided tour to explore the capabilities of the sample extension application.

#### Extension Features

- **Caterer Management**: Create and manage a directory of preferred caterers with contact information, cuisine specialties, and capacity details.
- **Event Integration**: Seamlessly assign caterers to poetry slam events within the core Poetry Slam Manager application.
- **Tenant Isolation**: Demonstrate secure multi-tenant architecture ensuring data isolation between different customers.
- **UI Extension**: Add custom sections to existing application pages while maintaining consistent user experience.

#### Additional Notes

- All tutorials are located in the [Tutorials](./Tutorials/) directory.
- Refer to the [README.md](README.md) for an overview and navigation help.
- Sample extension code is available in the [partner-reference-extension-catering](partner-reference-extension-catering) and [partner-reference-extension-catering-ui](partner-reference-extension-catering-ui) directories.
- Requires a fully deployed [Partner Reference Application](https://github.com/SAP-samples/partner-reference-application) as the base application.

Tag: [release-2502](https://github.com/SAP-samples/partner-reference-application-extension/releases/tag/release-2502)
