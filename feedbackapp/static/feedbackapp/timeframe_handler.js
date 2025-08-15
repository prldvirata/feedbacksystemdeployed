export let feedback_table;
let feedbacks;
export async function initDashboard() {
  // NOTE: function initializes the dashboard with the default timeline by reaching out 
  // to the API then re-rendering with data
  const default_start = new Date();
  let default_end= new Date();
  default_start.setDate(default_end.getDate()-300);
  const start_date_str=default_start.toISOString().slice(0,10);
  const end_date_str=default_end.toISOString().slice(0,10);
  feedbacks=await fetchData(start_date_str,end_date_str)
  populateDataTable(feedbacks)
  updateDashboardAnalysis()
}
export function updateDashboardAnalysis() {
  // NOTE: function updates dashboard charts & summary cards by calling relevant functions 
  if (!feedback_table) {
    alert('DataTable not initialized yet for analysis.');
    return;
  }
  const filteredData = feedback_table.rows({search: 'applied'}).data().toArray()
  const unfilteredData = feedback_table.rows().data().toArray()
  const filteredData_analysis = analyze(filteredData)
  const unfilteredData_analysis = analyze(unfilteredData)
  const filter_ratings = document.getElementById("ratings_chart_filter_pill").classList.contains("active"); // Check filter state for charts
  const bipart_ratings = document.getElementById("ratings_chart_bipart_pill").classList.contains("active"); // Check bipartite state for ratings chart
  const filter_performance = document.getElementById("performance_chart_bipart_pill").classList.contains("active"); // Check bipartite state for categories chart
  const bipart_performance = document.getElementById("performance_chart_bipart_pill").classList.contains("active"); // Check bipartite state for categories chart
  updateSummaryCards(filteredData_analysis, unfilteredData_analysis)
  if (filter_ratings){
    updateRatingsChart(filteredData_analysis, bipart_ratings)
  } else {
    updateRatingsChart(unfilteredData_analysis, bipart_ratings)
  }
  if (filter_performance){
    updatePerformanceChart(filteredData_analysis, bipart_performance)
  } else {
    updatePerformanceChart(unfilteredData_analysis, bipart_performance)
  }
}
export function updateSummaryCards(filtered, unfiltered) {
  const mealtimes = ["Lunch", "Dinner", "Overall"];
  const metrics = [
    "total_reviews",
    "recommendation_rate",
    "average_overall_rating",
  ];

  const currentData = {};

  // Initialize currentData with unfiltered values
  for (const mealtime of mealtimes) {
    currentData[mealtime] = {};
    for (const metric of metrics) {
      currentData[mealtime][metric] = unfiltered[mealtime][metric];
    }
  }
  //override with filtered values based on the relevant pill
  if (document.getElementById("total_reviews_pill").classList.contains("active")) {
    for (const mealtime of mealtimes) {
      currentData[mealtime].total_reviews = filtered[mealtime].total_reviews;
    }
  }
  if ( document.getElementById("recommendation_rate_pill").classList.contains("active")) {
    for (const mealtime of mealtimes) {
      currentData[mealtime].recommendation_rate = filtered[mealtime].recommendation_rate;
    }
  }
  if ( document.getElementById("average_overall_rating_pill").classList.contains("active")) {
    for (const mealtime of mealtimes) {
      currentData[mealtime].average_overall_rating = filtered[mealtime].average_overall_rating;
    }
  }

  // put em in the dom
  document.getElementById( "total_reviews").textContent = `${currentData.Overall.total_reviews}`;
  document.getElementById( "total_reviews_bipart").innerHTML = `Lunch: ${currentData.Lunch.total_reviews}  |  Dinner: ${currentData.Dinner.total_reviews}`;
  document.getElementById( "average_overall_rating").textContent = `${currentData.Overall.average_overall_rating}`;
  document.getElementById( "average_overall_rating_bipart").innerHTML = `Lunch: ${currentData.Lunch.average_overall_rating}  |  Dinner: ${currentData.Dinner.average_overall_rating}`;
  document.getElementById( "recommendation_rate").textContent = `${currentData.Overall.recommendation_rate}%`;
  document.getElementById( "recommendation_rate_bipart").innerHTML = `Lunch: ${currentData.Lunch.recommendation_rate}%  |  Dinner: ${currentData.Dinner.recommendation_rate}%`;
}

function analyze(data) {
  const result = {
    Lunch: {
      total_reviews: 0,
      overall_ratings_count: { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 },
      recommended_count: 0,
      average_overall_rating: 0,
      average_cleanliness_rating: 0,
      average_service_rating: 0,
      average_food_rating: 0,
      average_ambience_rating: 0,
    },
    Dinner: {
      total_reviews: 0,
      overall_ratings_count: { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 },
      recommended_count: 0,
      average_overall_rating: 0,
      average_cleanliness_rating: 0,
      average_service_rating: 0,
      average_food_rating: 0,
      average_ambience_rating: 0,
    },
    Overall: {
      total_reviews: 0,
      overall_ratings_count: { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 },
      recommended_count: 0,
      average_overall_rating: 0,
      average_cleanliness_rating: 0,
      average_service_rating: 0,
      average_food_rating: 0,
      average_ambience_rating: 0,
    },
  };

  data.forEach((record) => {
    const meal = record["visit_time"];
    const overall = result["Overall"];

    // Update Overall totals
    overall["total_reviews"]++;
    overall["overall_ratings_count"][record["overall_rating"]]++;
    overall["average_overall_rating"] += record["overall_rating"];
    overall["average_service_rating"] += record["service_rating"];
    overall["average_ambience_rating"] += record["ambience_rating"];
    overall["average_food_rating"] += record["food_rating"];
    overall["average_cleanliness_rating"] += record["cleanliness_rating"];
    if (record["recommendation"] === "Yes") {
      overall["recommended_count"]++;
    }

    // Update Lunch/Dinner totals
    if (result[meal]) {
      const bucket = result[meal];
      bucket["total_reviews"]++;
      bucket["overall_ratings_count"][record["overall_rating"]]++;
      bucket["average_overall_rating"] += record["overall_rating"];
      bucket["average_service_rating"] += record["service_rating"];
      bucket["average_ambience_rating"] += record["ambience_rating"];
      bucket["average_food_rating"] += record["food_rating"];
      bucket["average_cleanliness_rating"] += record["cleanliness_rating"];
      if (record["recommendation"] === "Yes") {
        bucket["recommended_count"]++;
      }
    } else {
      console.warn(`Unexpected meal type encountered: ${meal}`);
    }
  });

  // Calculate averages and rates for each meal type and Overall
  for (const type in result) {
    const bucket = result[type]
    if (bucket["total_reviews"] > 0) {
      bucket["recommendation_rate"] = ((bucket["recommended_count"] / bucket["total_reviews"]) * 100).toFixed(1)
      bucket["average_overall_rating"] = (bucket["average_overall_rating"] / bucket["total_reviews"]).toFixed(1)
      bucket["average_cleanliness_rating"] = (bucket["average_cleanliness_rating"] / bucket["total_reviews"]).toFixed(1)
      bucket["average_service_rating"] = (bucket["average_service_rating"] / bucket["total_reviews"]).toFixed(1)
      bucket["average_ambience_rating"] = (bucket["average_ambience_rating"] / bucket["total_reviews"]).toFixed(1)
      bucket["average_food_rating"] = (bucket["average_food_rating"] / bucket["total_reviews"]).toFixed(1)
    } else {
      // If no reviews for this meal type, rates and averages remain 0
      bucket["recommendation_rate"] = 0;
      bucket["average_overall_rating"] = 0;
      bucket["average_cleanliness_rating"] = 0;
      bucket["average_service_rating"] = 0;
      bucket["average_ambience_rating"] = 0;
      bucket["average_food_rating"] = 0;
    }
  }
  return result;
}

async function renderDashboard(){

  // NOTE: function updates dashboard charts & summary cards by calling relevant functions 

  const start_date=document.getElementById('start_date').value;
  const end_date=document.getElementById('end_date').value;
  feedbacks=await fetchData(start_date,end_date)
  populateDataTable(feedbacks)
  updateDashboardAnalysis(feedbacks)
}
function populateDataTable(feedbacks){
  // NOTE: populates the dataTable after recieveing data from fetchData
  if (feedback_table) {
    // If the DataTable instance already exists, update its data
    feedback_table.clear().rows.add(feedbacks).draw();
  } else {
    //create the DataTable.
    feedback_table = new DataTable('#feedback_table', {
      data: feedbacks,
      paging: true,
      searching: true,
      ordering: true,
      info: true,
      columns: [
        { data: 'id', title: 'ID', visible: false },
        { data: 'name', title: 'Name', defaultContent: 'Anonymous' },
        { data: 'visit_date', title: 'Visit Date' },
        { data: 'food_rating', title: 'Food' },//0+3
        { data: 'cleanliness_rating', title: 'Cleanliness' },//1+3
        { data: 'service_rating', title: 'Service' },//2+3
        { data: 'ambience_rating', title: 'Ambience' },//3+3
        { data: 'overall_rating', title: 'Overall' },//4+3
        { data: 'recommendation', title: 'Recommend?' },
        { data: 'suggestions', title: 'suggestions' , visible: false},
        { data: 'comment', title: 'comment' , visible: false},
        { data: 'visit_time', title: 'visit_time' , visible: false},
        { data: 'email', title: 'email' , visible: false},
      ],
      createdRow: function(row, data, dataIndex) {
        $(row).attr('data-bs-toggle', 'modal');
        $(row).attr('data-bs-target', '#feedbackModal');
        $(row).addClass('feedback-row');
        $(row).data('feedbackData', data);
      }
    });  
  }

}
function updateRatingsChart(analysis, bipart){
  // NOTE: updates horizontal chart for how much of each star rating you got.
  if(Chart.getChart("ratings_chart")) {
    Chart.getChart("ratings_chart")?.destroy()
  }
  let chart = document.getElementById('ratings_chart').getContext('2d')
  let ratings_chart
  if (bipart){
    ratings_chart = new Chart(chart, {
      type: 'bar',
      data: {
        labels: ['1','2', '3', '4','5'],
        datasets: [
          {
            label: "Lunch",
            data: analysis.Lunch["overall_ratings_count"],
            backgroundColor: "#FFC107",
          },
          {
            label: "Dinner",
            data: analysis.Dinner["overall_ratings_count"],
            backgroundColor: "#8B1A1A",
          }
        ]
      },
      options: {
        indexAxis: 'y',
      }
    })
  } else {
    ratings_chart = new Chart(chart, {
      type: 'bar',
      data: {
        labels: ['1','2', '3', '4','5'],
        datasets: [
          {
            label: "Ratings",
            data: analysis.Overall["overall_ratings_count"],
            backgroundColor: "#8B1A1A",
          },
        ]
      },
      options: {
        indexAxis: 'y',
      }
    })
  }
}
function updatePerformanceChart(analysis, bipart){
  // NOTE: updates horizontal chart for how much of each star rating you got.
  if(Chart.getChart("performance_chart")) {
    Chart.getChart("performance_chart")?.destroy()
  }
  let chart = document.getElementById('performance_chart').getContext('2d')
  let performance_chart
  if (bipart){
    performance_chart = new Chart(chart, {
      type: 'bar',
      data: {
        labels: ['Food', 'Service', 'Ambience', 'Cleanliness'],
        datasets: [
          {
            label: "Lunch",
            data: [analysis.Lunch["average_food_rating"],analysis.Lunch["average_service_rating"],analysis.Lunch["average_ambience_rating"],analysis.Lunch["average_cleanliness_rating"]],
            backgroundColor: "#FFC107",
          },
          {
            label: "Dinner",
            data: [analysis.Dinner["average_food_rating"],analysis.Dinner["average_service_rating"],analysis.Dinner["average_ambience_rating"],analysis.Dinner["average_cleanliness_rating"]],
            backgroundColor: "#8B1A1A",
          }
        ]
      },
    })
  } else {
    performance_chart = new Chart(chart, {
      type: 'bar',
      data: {
        labels: ['Food', 'Service', 'Ambience', 'Cleanliness'],
        datasets: [
          {
            label: "Categories",
            data: [analysis.Overall["average_food_rating"],analysis.Overall["average_service_rating"],analysis.Overall["average_ambience_rating"],analysis.Overall["average_cleanliness_rating"]],
            backgroundColor: "#8B1A1A",
          },
        ]
      },
    })
  }
}
async function fetchData(start_date, end_date) {
  // NOTE: retrieves data from api asynchronously.
  const url=`/feedback_api/?start_date=${start_date}&end_date=${end_date}`
  try {
    const response=await fetch(url)
    if (!response.ok){
      throw new Error(`HTTP error! Status: ${response.status}`)
    }
    const feedbacks=await response.json();
    return feedbacks;
  } catch (error) {
    console.error(`Error fetching data: ${error}`)
    throw error
  }
}
/*
 * 
<script>
const chartData = {{ chart_data_json|safe }};
const ctx = document.getElementById('ratingsChart').getContext('2d');
new Chart(ctx, {
  type: 'bar',
  data: {
    labels: chartData.labels,
    datasets: chartData.datasets
  },
  options: {
    responsive: true,
    scales: {
      y: {
        beginAtZero: true,
        max: 5
      }
    }
  }
});
new DataTable('#reviewTable');
</script>

<script>
const countData = {{ bar_chart_data_json|safe }};
const ctx2 = document.getElementById('ratingCountChart').getContext('2d');
new Chart(ctx2, {
  type: 'bar',
  data: {
    labels: countData.labels,
    datasets: countData.datasets
  },
  options: {
    responsive: true,
    scales: {
      y: {
        beginAtZero: true,
        precision: 0
      }
    }
  }
});
</script>

 * */
