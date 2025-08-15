import { feedback_table, updateDashboardAnalysis} from './timeframe_handler.js'; // Import feedback_table
export const filters = []; 
filters[0]= ['food_rating_filter', function food_rating(cellData, rowData, rowDataArray, rowId) {
  const food_rating= parseFloat(cellData);
  if (isNaN(food_rating)){
    return false;
  } 
  const minFood = parseFloat(document.getElementById('minFood').value)
  const maxFood = parseFloat(document.getElementById('maxFood').value)
  return (isNaN(minFood) || minFood<=food_rating ) && (isNaN(maxFood) || maxFood>=food_rating)
}]
filters[1]= ['cleanliness_rating_filter', function cleanliness_rating(cellData, rowData, rowDataArray, rowId) {
  const cleanliness_rating= parseFloat(cellData);
  if (isNaN(cleanliness_rating)){
    return false;
  } 
  const minCleanliness = parseFloat(document.getElementById('minCleanliness').value)
  const maxCleanliness = parseFloat(document.getElementById('maxCleanliness').value)
  return (isNaN(minCleanliness) || minCleanliness<=cleanliness_rating ) && (isNaN(maxCleanliness) || maxCleanliness>=cleanliness_rating)
}]
filters[2]= ['service_rating_filter', function service_rating(cellData, rowData, rowDataArray, rowId) {
  const service_rating= parseFloat(cellData);
  if (isNaN(service_rating)){
    return false;
  } 
  const minService = parseFloat(document.getElementById('minService').value)
  const maxService = parseFloat(document.getElementById('maxService').value)
  return (isNaN(minService) || minService<=service_rating ) && (isNaN(maxService) || maxService>=service_rating)
}]
filters[3]= ['ambience_rating_filter', function ambience_rating(cellData, rowData, rowDataArray, rowId) {
  const ambience_rating= parseFloat(cellData);
  if (isNaN(ambience_rating)){
    return false;
  } 
  const minAmbience = parseFloat(document.getElementById('minAmbience').value)
  const maxAmbience = parseFloat(document.getElementById('maxAmbience').value)
  return (isNaN(minAmbience) || minAmbience<=ambience_rating ) && (isNaN(maxAmbience) || maxAmbience>=ambience_rating)
}]
filters[4]= ['overall_rating_filter', function overall_rating(cellData, rowData, rowDataArray, rowId) {
  const overall_rating= parseFloat(cellData);
  if (isNaN(overall_rating)){
    return false;
  } 
  const minOverall = parseFloat(document.getElementById('minOverall').value)
  const maxOverall = parseFloat(document.getElementById('maxOverall').value)
  return (isNaN(minOverall) || minOverall<=overall_rating ) && (isNaN(maxOverall) || maxOverall>=overall_rating)
}]
filters[5]=['recommendation_filter', function recommendation_filter(cellData, rowData, rowDataArray, rowId) {
  const recommend_status = cellData;
  const yes_recommend = document.getElementById('recommend').classList.contains('active')
  const no_recommend = document.getElementById('not_recommend').classList.contains('active')
  if (recommend_status=="Yes" && yes_recommend){
    return true
  }
  if (recommend_status=="No" && no_recommend){
    return true
  }
  return false
}]
filters[6]=['suggestions_filter', function suggestions_filter(cellData, rowData, rowDataArray, rowId) {
  const suggestions = cellData;
  const yes_suggestions = document.getElementById('suggestions').classList.contains('active')
  const no_suggestions = document.getElementById('no_suggestions').classList.contains('active')
  const has_suggestions = suggestions !== null && suggestions !== undefined && suggestions !== '';
  return (yes_suggestions && has_suggestions) || (no_suggestions && !has_suggestions)
}]
filters[7]=['comment_filter', function comment_filter(cellData, rowData, rowDataArray, rowId) {
  const comment = cellData;
  const yes_comment = document.getElementById('comment').classList.contains('active')
  const no_comment = document.getElementById('no_comment').classList.contains('active')
  const has_comment = comment !== null && comment !== undefined && comment !== '';
  return (yes_comment && has_comment) || (no_comment && !has_comment)
}]
filters[8]=['visit_time_filter', function visit_time_filter(cellData, rowData, rowDataArray, rowId) {
  const visit_time = cellData;
  const lunch = document.getElementById('lunch').classList.contains('active')
  const dinner = document.getElementById('dinner').classList.contains('active')
  return (visit_time=="Lunch" && lunch )||(visit_time=="Dinner" && dinner )
}]
export function applyFilters(feedback_table){
  for (let i = 0; i < filters.length; i++) {
  feedback_table.column(i+3).search.fixed(filters[i][0], null);
  }
  for (let i = 0; i < filters.length; i++) {
  feedback_table.column(i+3).search.fixed(filters[i][0], filters[i][1]);
  }
  feedback_table.draw()
  updateDashboardAnalysis()
}
