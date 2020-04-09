<script>
  import { onMount } from 'svelte';
  import Chart from 'chart.js';
  import chartData from '../stores/chart';

  let chart;
  let chartElement;

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

  const updateScales = () => {
    const { covid, inmates } = chart.scales;
    const scaleMax = Math.max(covid.max, inmates.max);

    chart.options.scales.yAxes[0].ticks.max = scaleMax;
    chart.options.scales.yAxes[1].ticks.max = scaleMax;

    chart.update();
  };

  onMount(async () => {
    chartData.subscribe((data) => {
      if (data && chart) {
        chart.data.datasets = data;
        updateScales();
      } else if (data && !chart) {
        createChart();
        updateScales();
      }
    });
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
