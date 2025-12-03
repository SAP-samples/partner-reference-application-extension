using { PoetrySlamService } from '../srv/catererManagerService';

// ----------------------------------------------------------------------------
// Required authorization roles
annotate PoetrySlamService.x_Caterers with @(requires: [
  // Full authorization for managers
  'PoetrySlamFull',
  // Read-only access for APIs
  'PoetrySlamReadonly'
]);

// ----------------------------------------------------------------------------
// Restriction per authorization role:
annotate PoetrySlamService.x_Caterers with @(restrict: [
  {
    // Managers can create new, delete and update the caterer details
    grant: ['*'],
    to   : 'PoetrySlamFull'
  },
  {
    // Read-only access
    grant: ['READ'],
    to   : 'PoetrySlamReadonly'
  }
]);
