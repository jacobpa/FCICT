<script>
  import { onMount, afterUpdate } from 'svelte';
  import axios from 'axios';

  import Chart from 'chart.js';
  import ButtonBar from './ButtonBar.svelte';
  import Card from './Card.svelte';
  import chartData from '../stores/chart';

  let chart;
  let chartElement;
  export let dateMin;
  export let dateMax;
  export let minDate;
  export let maxDate;

  const getChartData = async (groupBy) => {
    const chartDataRequest = axios.get(`/api/all?groupBy=${groupBy}`);
    const data = await chartDataRequest.then((response) => response.data);
    chartData.set(data);
  };

  const createChart = () => {
    chart = new Chart(chartElement, {
      type: 'line',
      data: {
        datasets: $chartData,
      },
      options: {
        maintainAspectRatio: false,
        scales: {
          xAxes: [
            {
              id: 'dates',
              type: 'time',
              time: {
                unit: 'day',
              },
            },
          ],
          yAxes: [
            {
              id: 'covid',
              position: 'left',
              scaleLabel: {
                display: true,
                labelString: 'Total County COVID-19 Cases',
              },
              stacked: true,
            },
            {
              id: 'inmates',
              position: 'right',
              scaleLabel: {
                display: true,
                labelString: 'Inmate Count',
              },
              stacked: true,
            },
          ],
        },
      },
    });
  };

  const updateYAxes = () => {
    const { covid, inmates } = chart.scales;
    const scaleMax = Math.max(covid.max, inmates.max);

    chart.options.scales.yAxes[0].ticks.max = scaleMax;
    chart.options.scales.yAxes[1].ticks.max = scaleMax;

    chart.update();
  };

  const updateXAxes = () => {
    const dates = chart.scales.dates;

    chart.options.scales.xAxes[0].ticks.min = dateMin;
    chart.options.scales.xAxes[0].ticks.max = dateMax;
    
    if (!maxDate && !minDate) {
      maxDate = dateMax;
      minDate = dateMin;
    }

    chart.update();
  }

  onMount(async () => {
    chartData.subscribe((data) => {
      if (data && chart) {
        chart.data.datasets = data;
        updateYAxes();
        updateXAxes();
      } else if (data && !chart) {
        createChart();
        updateYAxes();
        updateXAxes();
      }
    });
  });

  afterUpdate(() => {
    if (chart) {
      updateXAxes();
    }
  });
</script>

<style>
  section {
    position: relative;
    background-color: white;
    border-radius: 8px;
    padding: 1rem;
    margin-bottom: 1rem;
    color: black;
    border: 1px solid black;
    box-shadow: 3px 4px 0 black;
  }

  .chart-container {
    height: 50vh;
  }

  .description {
    text-align: center;
  }

  .loading {
    font-size: 2em;
    font-weight: 800;
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
  }

  div.date-select-table {
    display: grid;
    grid-column-gap: 0.5rem;
    column-gap: 0.5rem;
    grid-template-columns: repeat(2, max-content);
    grid-template-rows: auto;
  }

  .date-select-table label {
    text-align: right;
    margin: auto 0;
  }
</style>

<section>
  {#if !$chartData}
    <div class="loading">LOADING...</div>
  {/if}
  <div class="chart-container">
    <canvas
      bind:this={chartElement}
      class={$chartData === undefined ? 'hidden' : ''} />
  </div>
  <p class="description"><slot name="description" /></p>
</section>

<Card hasTitle={false}>
  <div slot="body">
    <ButtonBar>
      <button on:click|preventDefault={() => getChartData('genders')}>
        View By Sex
      </button>
      <button on:click|preventDefault={() => getChartData('totals')}>
        View By Population Totals
      </button>
      <div class="date-select-table">
        <label for="dateMin">Start Date</label>
        <input id="dateMin" type="date" min={minDate} max={maxDate} bind:value={dateMin} />
        <label for="dateMax">End Date</label>
        <input id="dateMax" type="date" min={minDate} max={maxDate} bind:value={dateMax} />
      </div>
    </ButtonBar>
    <ButtonBar>

    </ButtonBar>
  </div>
</Card>
