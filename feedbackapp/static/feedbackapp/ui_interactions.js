import {
  initDashboard,
  feedback_table,
  updateDashboardAnalysis,
} from './timeframe_handler.js';
import { filters, applyFilters } from './filtering.js';
function toggleDropdown() {
  const dropdown = document.getElementById("dateDropdown");
  dropdown.style.display = dropdown.style.display === "none" ? "block" : "none";
}

// Optional: Close dropdown if clicked outside
window.onclick = function(event) {
  if (!event.target.matches('.dropdown-btn')) {
    document.querySelectorAll('.dropdown-content').forEach(dd => dd.style.display = 'none');
  }
}

document.addEventListener('DOMContentLoaded', () => {
  initDashboard()
  setup()
})
function setup() {
  document.querySelectorAll('.filter-pill').forEach((pill)=>{
    pill.addEventListener("click",()=>{
      pill.classList.toggle("active")
      console.log(pill.classList)
    })
    
  })
  document.querySelectorAll('.switch-pill').forEach((pill)=>{
    pill.addEventListener("click",()=>{
      pill.classList.toggle("active")
      if (pill.classList.contains("active")){
        pill.textContent="remove filters"
      } else {
        pill.textContent="apply filter"
      } 
      updateDashboardAnalysis()
    })
    
  })
  document.querySelectorAll('.chart-switch-pill').forEach((pill)=>{
    pill.addEventListener("click",()=>{
      pill.classList.toggle("active")
      if (pill.classList.contains("active")){
        pill.textContent="show bipartite"
      } else {
        pill.textContent="show overall"
      } 
      updateDashboardAnalysis()
    })
    
  })
  document.getElementById('feedbackModal').addEventListener('show.bs.modal', function (event) {
    const clickedElement = event.relatedTarget//specific cell
    const row = feedback_table.row(clickedElement).node()//tr element
    const feedbackData = feedback_table.row(row).data()//data object associated with tr element
    if (!feedbackData){
      console.error("could not retrieve data for clicked row.")
    }
    const feedbackModal = document.getElementById('feedbackModal')
    populateModal(feedbackModal, feedbackData)
    applyFilters(feedback_table)
  })
  document.getElementById('applyFilters').addEventListener("click",()=>{
      applyFilters(feedback_table)
    })
}
function populateModal(feedbackModal, feedbackData) {
  const stars = score => '★'.repeat(score) + '☆'.repeat(5 - score);
  feedbackModal.querySelector('.modal-title').textContent=`${feedbackData.name || 'Anonymous'}'s Review`
  feedbackModal.querySelector('#overallRating').textContent=`Overall: ${stars(feedbackData.overall_rating)}`
  feedbackModal.querySelector('#foodRating').textContent=`Food: ${stars(feedbackData.food_rating)}`
  feedbackModal.querySelector('#serviceRating').textContent=`Service: ${stars(feedbackData.service_rating)}`
  feedbackModal.querySelector('#ambienceRating').textContent=`Ambience: ${stars(feedbackData.ambience_rating)}`
  feedbackModal.querySelector('#cleanlinessRating').textContent=`Cleanliness: ${stars(feedbackData.cleanliness_rating)}`
  feedbackModal.querySelector('#feedbackComment').textContent=`${feedbackData.comment || 'Customer did not provide comment.'}`
  feedbackModal.querySelector('#feedbackSuggestions').textContent=`${feedbackData.suggestions || 'Customer made no suggestions.'}`
  if (feedbackData.recommendation == "Yes"){
    feedbackModal.querySelector('#recommendation').innerHTML=`<strong class="text-success">Would Recommend</strong>`
  } else {
    feedbackModal.querySelector('#recommendation').innerHTML=`<strong class="text-danger">Would NOT Recommend</strong>`
  }
}
