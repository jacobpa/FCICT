<script>
  import axios from "axios";
  import { chartData } from "../stores";
  import Header from "../components/Header.svelte";
  import Card from "../components/Card.svelte";
  import ChartCard from "../components/ChartCard.svelte";
  import ButtonBar from "../components/ButtonBar.svelte";

  let request;
  const getData = async groupBy => {
    request = axios.get("/api/all?groupBy=" + groupBy);
    const data = await request.then(response => response.data);
    chartData.set(data);
  };
  getData("totals");
</script>

<svelte:head>
  <title>FCICT</title>
</svelte:head>

<Header />
<ChartCard />
<Card>
  <div slot="body">
    <ButtonBar>
      <button on:click|preventDefault={() => getData('genders')}>
        View By Sex
      </button>
      <button on:click|preventDefault={() => getData('totals')}>
        View By Population Totals
      </button>
    </ButtonBar>
  </div>
</Card>
<Card>
  <div slot="title">Questions?</div>
  <div slot="body">
    <h3>Why?</h3>
    <p>
      There is a lot of talk nationwide about releasing nonvionlet or low-risk
      prisoners as a result of COVID-19. This aims to be a helpful tool to see
      how Franklin County, Ohio is responding.
    </p>
    <h3>Where is this data coming from?</h3>
    <p>
      The inmate population is scraped from the Franklin County Sheriff's
      Booking website. The COVID-19 data is provided by the state of Ohio, and
      is available directly
      <a href="https://coronavirus.ohio.gov/static/COVIDSummaryData.csv">
        here as a CSV file
      </a>
      , the link to which can be found on the same page as the
      <a href="https://coronavirus.ohio.gov/wps/portal/gov/covid-19/dashboards">
        Ohio Department of Health's Cronoavirus Dashboard
      </a>
      .
    </p>
    <h3>This data doesn't match up with the Ohio.gov dashboard!</h3>
    <p>
      I know! The data which feeds that dashboard seems to be different than the
      data that they provide, which this website sources. Don't know what
      dashboard I'm talking about? Check it out on the
      <a href="https://coronavirus.ohio.gov/wps/portal/gov/covid-19/dashboards">
        Ohio Department of Health's website.
      </a>
    </p>
    <h3>Why only Franklin County?</h3>
    <p>
      More places or sources may be added in the future, but unfortunately there
      isn't one easy place to gather all of this data. Especially the inmate
      population, which took some work to gather and update automatically.
    </p>
    <h3>How was this made?</h3>
    <p>
      All of the code for this website, and the library which processes the data
      it consumes is available under the Unlicense on my Github.
    </p>
  </div>
</Card>
