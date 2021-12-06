# Belly_Button_Biodiversity
## Overview
In this assignment, an interactive dashboard was built to explore the Belly Button Biodiversity dataset, which catalogs the microbes that colonize human navels in JSON format.

The dataset reveals that a small handful of microbial species (also called operational taxonomic units, or OTUs, in the study) were present in more than 70% of people, while the rest were relatively rare.

Demographics information is dynamically populated based upon a user-selected test subject ID. A bar chart, bubble chart and a bonus gauge chart also update once the ID is changed. Code has been written using Plotly, JavaScript, HTML, CSS, and D3.js.All CSS, JS and images required are under the static folder.

### Results:

<1>The ask was to retrieve test subject demographics, and draw a bar chart and bubble chart displaying each individual's samples. This was done as follows:

* Read in samples.json using the D3 library

* Retrieve metadata info for each test subject and display this in the form of panel as a key-value pair on the dashboard.

* Get required data for plotting, including sample_values, otu_ids and otu_labels which were used to create a trace and plot the bar chart.

* Since the task was to only plot the top 10 values, the three arrays were sliced and reversed to display the chart as below.

**Horizontal Bar Chart For Top 10 OTUs for test Subject 940**

![Horizonal_bargraph](https://user-images.githubusercontent.com/90277142/144779155-7cd53e10-f745-4efd-a5e9-ffc6b8125006.png)

<2> The entire sample arrays were used to plot a bubble chart.

![Bubblechart](https://user-images.githubusercontent.com/90277142/144779174-094b30d5-bce8-44b0-b629-af85ec16024d.png)

<3>The bonus challenge was to create a gauge chart. Using the [documentation](https://plotly.com/javascript/gauge-charts/), an indicator trace was created with wfreq as the value for plotting.Any null values were given a value of zero.The gauge chart accounts for weekly washing frequency values ranging from 0-10.

![Guagegraph](https://user-images.githubusercontent.com/90277142/144779198-d2ae2457-ab54-468d-ac5e-31b5a9821819.png)

* A function called plotCharts(id) was created that would take in a test subject ID as a parameter and plot all the above charts.

* A function called resetData() clears all the divs of the charts and demographic info.

* Another function init() calls the resetData() function, populates the dropdown menu with test subject IDs from the dataset and displays data of the first subject as a starting point.

* Everytime a new ID is selected from the dropdown (on change), an optionChanged(this.value) function is called, that resets the data once again and calls the plotCharts() function.

#### Dashboard
<4> Bootstrap and custom CSS was used to pretty up the dashboard. A screenshot of the dashboard can be seen below.
![dashboard1](https://user-images.githubusercontent.com/90277142/144781077-d74a73e0-d1e0-40fd-8f9a-b07f19d8de4e.png)
![dashboard2](https://user-images.githubusercontent.com/90277142/144781086-9b8b9691-c831-4592-94cd-6715da15b6bf.png)


