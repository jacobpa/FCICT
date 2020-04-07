import { writable } from 'svelte/store';

const chartData = writable(null);

export { chartData as default };
