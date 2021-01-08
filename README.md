https://pcs-assignment.web.app/landing

# Technologies Used:

1. Angular 10.
2. Angular Material for Buttons and Slide Buttons.
3. Google Firebase for Hosting purpose.

# Methods Adapted on the way based on Scenarios:

1. The Year Filter: A basic array of all the years received from the API Reponse, collected in one array and filtered to remove the duplicate ones. Each button is toggle-able. When the user selects on year, that button becomes the active one and the main array containing all the years is filtered via the 'Array.filter' method to provide the matching values on the UI. This can be achieved by implementing pipes, however, as the data to be filtered is not too much, hence I took this approach. For years which do not hold any corresponding response in the cards, a message is shown 'No Data Found'.

2. Mission IDs: When investigating the API response, I found that a lot of objects came back with no mission_id data in them, hence I filtered them out and showing only with valid mission_ids.

3. Launch and Land selection: Ideally, a landing to be successful, the launch has to be automatically successful, hence, I am disabling the 'Successful Landing' button without the 'Successful Launch' button enabled. Based on this selection, respective APIs are called and the view is refreshed while not refreshing the entire page/window.

4. Frameworks: No Bootstrap or Materialoze or any UI framework is used. Plain basic CSS/LESS written for RWD(Responsive Web Design) aspect. As the elements on the page are not too much, hence wrote a mix of basic and very few LESS parameters and CSS.

5. Interface: The API response brings back a lot of data, I filtered them out and kept a few while using respective Interface.

# LightHouse Report

![image](https://raw.github.com/sunits2014/PCS-Assignment/master/LighthouseReport.jpg)

The Performance score is little low because of the image files being fetched directly from the links in the API response + due to their varied sizes and formats. That can be corrected once the size and format issues are sorted.
