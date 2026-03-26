module.exports = async function (req) {

  const updatedPoetrySlam = req.data;
  if (!updatedPoetrySlam.x_caterer_ID) {
    return;
  }
  const caterer = await SELECT.one.from(`x_Caterers`).where({ ID: updatedPoetrySlam.x_caterer_ID });
  if(caterer){
  if (caterer.maxServiceCapacity < updatedPoetrySlam.maxVisitorsNumber) {
    req.error(
      422,
      `Service capacity of caterer (${caterer.maxServiceCapacity}) is less than the event's max capacity (${updatedPoetrySlam.maxVisitorsNumber})`
    );
  }
 }
};
