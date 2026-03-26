module.exports = async function (req) {
let PlannedEndDate , PlannedStartDate ;
let projectRecord = req.data.Project;
   if (
    !projectRecord ||
    typeof projectRecord !== 'object' ||
    !Array.isArray(projectRecord.to_EnterpriseProjectElement)
  ) {
    return req.reject(422, 'Invalid or missing Project record');
  }
   if (projectRecord.to_EnterpriseProjectElement[0]) {
      PlannedStartDate = projectRecord.to_EnterpriseProjectElement[0].PlannedStartDate
    } else {
      // Generate today's date in YYYY-MM-DD format
      const today = new Date();
      const formattedToday = today.toISOString().split('T')[0];
      PlannedStartDate = formattedToday 
    }
    if (projectRecord.to_EnterpriseProjectElement[0]) {
      PlannedEndDate = projectRecord.to_EnterpriseProjectElement[0].PlannedEndDate
    } else {
      PlannedEndDate = '9999-12-31'
    }
   const extensionValue = {
    ProjectElement: projectRecord.Project+"-EXT-CAT",
    ProjectElementDescription: 'Catering Management',
    PlannedStartDate: PlannedStartDate,
    PlannedEndDate: PlannedEndDate
    };
    projectRecord.to_EnterpriseProjectElement.push(extensionValue);
    return projectRecord;
};
