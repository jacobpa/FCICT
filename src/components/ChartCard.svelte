<script>
  import { onMount } from "svelte";
  import Chart from "chart.js";
  import { chartData } from '../stores';

  let chart;
  let chartElement;

  onMount(async () => {
    chart = new Chart(chartElement, {
      type: "line",
      data: {
        datasets: $chartData
      },
      options: {
        maintainAspectRatio: false,
        scales: {
          xAxes: [
            {
              type: "time",
              time: {
                unit: "day"
              }
            }
          ]
        }
      }
    });

    chartData.subscribe(data => {
      chart.data.datasets = data;
      chart.update();
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
    height: 50vh;
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
  {#if $chartData == undefined}
    <div class="loading">LOADING...</div>
  {/if}
  <canvas bind:this={chartElement} class={$chartData == undefined ? 'hidden' : ''}/>
</section>
