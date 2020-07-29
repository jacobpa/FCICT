<script>
  import { onMount } from 'svelte';
  import chartData from '../stores/chart';
  import ApiClient from '../helpers/api';
  import Header from '../components/Header.svelte';
  import Card from '../components/Card.svelte';
  import ChartCard from '../components/ChartCard.svelte';
  import ButtonBar from '../components/ButtonBar.svelte';

  let sinceYesterday;
  let sinceYesterdayTotals;
  let dateMin;
  let minDate;
  let dateMax;
  let maxDate;

  const stringWithSign = (value) => `${value < 0 ? '' : '+'}${value}`;

  const loadChartData = async (groupBy) => {
    const data = await ApiClient.getChartData(groupBy);
    chartData.set(data);
  };

  const loadSinceYesterdayData = async () => {
    const { lastToday, lastYesterday } = await ApiClient.getSinceYesterdayData();

    if (lastToday && lastYesterday) {
      sinceYesterday = {
        inmate_male: stringWithSign(lastToday.inmate_male - lastYesterday.inmate_male),
        inmate_female: stringWithSign(lastToday.inmate_female - lastYesterday.inmate_female),
        covid_male: stringWithSign(lastToday.covid_male - lastYesterday.covid_male),
        covid_female: stringWithSign(lastToday.covid_female - lastYesterday.covid_female),
        covid_unknown: stringWithSign(lastToday.covid_unknown - lastYesterday.covid_unknown),
      };
      sinceYesterdayTotals = {
        inmate: stringWithSign(lastToday.inmate_male - lastYesterday.inmate_male + lastToday.inmate_female - lastYesterday.inmate_female),
        covid: stringWithSign(lastToday.covid_male - lastYesterday.covid_male + lastToday.covid_female - lastYesterday.covid_female),
      };
    }
  };

  onMount(() => {
    loadChartData('totals');
    loadSinceYesterdayData();

    chartData.subscribe((data) => {
      if (data) {
        dateMin = data[0].data[0].x.split(" ")[0];
        minDate = data[0].data[0].x.split(" ")[0];

        dateMax = data[0].data[data[0].data.length - 1].x.split(" ")[0];
        maxDate = data[0].data[data[0].data.length - 1].x.split(" ")[0];
      }
    });
  });
</script>

<style>
  .since-yesterday {
    text-align: center;
    display: grid;
    margin: 0 auto;
    width: max-content;
    grid-template-rows: auto auto;
  }

  .since-yesterday:first-of-type {
    border-bottom: 1px solid black;
  }

  @media only screen and (max-width: 799px) {
    .since-yesterday {
      grid-template-columns: 1fr;
    }
  }

  @media only screen and (min-width: 800px) and (max-width: 1349px) {
    .since-yesterday {
      grid-template-columns: repeat(2, max-content);
    }
  }

    @media only screen and (min-width: 1350px) {
    .since-yesterday {
      grid-template-columns: repeat(4, max-content);
    }

    .since-yesterday h3.covid {
      grid-row: 2 / 3;
    }
  }

  .since-yesterday h3 {
    padding: 0 1em;
  }

  .since-yesterday .value {
    font-size: 2rem;
  }

  .question:not(:last-child) {
    margin-bottom: 1rem;
  }
</style>

<svelte:head>
  <title>FCICT</title>
</svelte:head>

<Header />
<ChartCard dateMin={dateMin} dateMax={dateMax}>
  <span slot="description">
    The chart above displays the total inmate population in Franklin County, along with the total
    count of COVID-19 cases.
  </span>
</ChartCard>
<Card>
  <h2 slot="title">Since We Checked Yesterday</h2>
  <div slot="body">
    <div class="since-yesterday">
      {#if sinceYesterday}
        <h3>
          <span class="value">{sinceYesterday.inmate_male}</span>
          <br />
          Male Inmates
        </h3>
        <h3>
          <span class="value">{sinceYesterday.inmate_female}</span>
          <br />
          Female Inmates
        </h3>
        <h3 class="covid">
          <span class="value">{sinceYesterday.covid_male}</span>
          <br />
          Male COVID-19 Cases
        </h3>
        <h3 class="covid">
          <span class="value">{sinceYesterday.covid_female}</span>
          <br />
          Female Covid-19 Cases
        </h3>
        <h3 class="covid">
          <span class="value">{sinceYesterday.covid_unknown}</span>
          <br />
          Other Covid-19 Cases
        </h3>
      {:else}
        <h3>Loading...</h3>
      {/if}
    </div>
    <div class="since-yesterday">
      {#if sinceYesterdayTotals}
        <h3>
          <span class="value">{sinceYesterdayTotals.inmate}</span>
          <br />
          Total Inmates
        </h3>
        <h3>
          <span class="value">{sinceYesterdayTotals.covid}</span>
          <br />
          Total COVID-19 Cases
        </h3>
      {:else}
        <h3>Loading...</h3>
      {/if}
    </div>
  </div>
</Card>
<Card>
  <div slot="title">Questions?</div>
  <div slot="body" class="questions">
    <div class="question">
    <h3>Why?</h3>
    <p>
      There is a lot of talk nationwide about releasing nonvionlet or low-risk
      inmates as a result of COVID-19. This aims to be a helpful tool to see
      how Franklin County, Ohio is responding.
    </p>
    </div>
    <div class="question">
    <h3>Where is this data coming from?</h3>
    <p>
      The inmate population is scraped from the Franklin County Sheriff's
      Booking website. The COVID-19 data is provided by the state of Ohio, and
      is available directly
      <a href="https://coronavirus.ohio.gov/static/COVIDSummaryData.csv">
        here as a CSV file
      </a>
      , the link to which can be found on the same page as the
        <a
          href="https://coronavirus.ohio.gov/wps/portal/gov/covid-19/dashboards">
        Ohio Department of Health's Cronoavirus Dashboard
      </a>
      .
    </p>
    </div>
    <div class="question">
      <h3>When will this update?</h3>
      <p>
        The Ohio Department of Health releases new COVID-19 data every day at
        2:00 PM EST. This website will update at 2:15 AM, 8:15 AM, 2:15 PM, and
        8:15 PM in order to (hopefully) always have the most recent COVID-19
        data, and to have up-to-date inmate populations.
      </p>
    </div>
    <div class="question">
    <h3>This data doesn't match up with the Ohio.gov dashboard!</h3>
    <p>
        I know! The data which feeds that dashboard seems to be different than
        the data that they provide, which this website sources. Don't know what
      dashboard I'm talking about? Check it out on the
        <a
          href="https://coronavirus.ohio.gov/wps/portal/gov/covid-19/dashboards">
        Ohio Department of Health's website.
      </a>
    </p>
    </div>
    <div class="question">
    <h3>Why only Franklin County?</h3>
    <p>
        More places or sources may be added in the future, but unfortunately
        there isn't one easy place to gather all of this data. Especially the
        inmate population, which took some work to gather and update
        automatically.
    </p>
    </div>
    <div class="question">
    <h3>How was this made?</h3>
    <p>
        All of the code for this website, and the library which processes the
        data it consumes is available under
        <a href="https://unlicense.org">The Unlicense</a>
        on
        <a href="https://github.com/jacobpa/FCICT">Github</a>
        .
    </p>
  </div>
  </div>
</Card>
