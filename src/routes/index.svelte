<script>
import axios from 'axios';
import Header from '../components/Header.svelte';
import Card from '../components/Card.svelte';
import ChartCard from '../components/ChartCard.svelte';

let request;
const getData = (groupBy) => {
    request = axios.get('http://192.168.2.11:3000/api/all?groupBy=' + groupBy);
}

getData('totals');
</script>

<Header />
<ChartCard dataRequest={request}/>
