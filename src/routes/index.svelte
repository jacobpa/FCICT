<script>
import axios from 'axios';
import { chartData } from '../stores';
import Header from '../components/Header.svelte';
import Card from '../components/Card.svelte';
import ChartCard from '../components/ChartCard.svelte';
import ButtonBar from '../components/ButtonBar.svelte';

let request;
const getData = async (groupBy) => {
    request = axios.get('http://192.168.2.11:3000/api/all?groupBy=' + groupBy);
    const data = await request.then(response => response.data); 
    chartData.set(data);
}
getData('totals');
</script>

<Header />
<ChartCard />
<Card>
    <ButtonBar>
        <button on:click|preventDefault={() => getData('genders')}>View By Sex</button>
        <button on:click|preventDefault={() => getData('totals')}>View By Population Totals</button>
    </ButtonBar>
</Card>
