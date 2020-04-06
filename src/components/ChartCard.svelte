<script>
  import { onMount } from "svelte";
  import Chart from "chart.js";

  export let dataRequest;
  let chartElement;
  let loading = true;

  onMount(async () => {
    const response = await dataRequest;

    new Chart(chartElement, {
      type: "line",
      data: {
        datasets: response.data
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

    loading = false;
  });
</script>

<style>
  section {
    position: relative;
    background-color: white;
    border-radius: 8px;
    padding: 1rem;
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
  {#if loading}
    <div class="loading">LOADING...</div>
  {/if}
  <canvas bind:this={chartElement} />
</section>
