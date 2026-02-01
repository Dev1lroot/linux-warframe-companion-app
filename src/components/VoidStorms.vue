<script setup>
	import { ref, onMounted, onUnmounted } from 'vue'

	const props = defineProps({
		WorldState: Object,
		Locale: Object
	});

	const now = ref(Date.now());
	let timer = null;

	onMounted(() =>
	{
		timer = setInterval(() =>
		{
			now.value = Date.now();
		}, 1000);
	});

	onUnmounted(() =>
	{
		clearInterval(timer);
	});

	function getMissionTimeStatus(missionData)
	{
		const startTime = parseInt(missionData.Activation.$date.$numberLong);
		const endTime = parseInt(missionData.Expiry.$date.$numberLong);

		const formatDiff = (ms) =>
		{
			if (ms < 0) ms = 0;
			const totalSeconds = Math.floor(ms / 1000);
			const minutes = Math.floor(totalSeconds / 60);
			const seconds = totalSeconds % 60;
			return `${minutes}m ${seconds}s`;
		};

		if (now.value < startTime)
		{
			return `Begin after ${formatDiff(startTime - now.value)}`;
		}
		else if (now.value < endTime)
		{
			return `Ends in ${formatDiff(endTime - now.value)}`;
		}
		else
		{
			return "Mission ended";
		}
	}
</script>

<template>
	<div class="TableBox">
		<table>
			<tbody>
				<tr>
					<td><b>Location:</b></td>
					<td><b>Faction:</b></td>
					<td><b>Mission:</b></td>
					<td><b>Fissure:</b></td>
					<td><b>Time:</b></td>
				</tr>
				<tr v-for="storm in WorldState.VoidStorms" :key="storm.Node">
					<td>{{ Locale.solNodes[storm.Node].value }}</td>
					<td>{{ Locale.solNodes[storm.Node].enemy }}</td>
					<td>{{ Locale.solNodes[storm.Node].type }}</td>
					<td>{{ Locale.fissureModifiers[storm.ActiveMissionTier].value }}</td>
					<td>{{ getMissionTimeStatus(storm) }}</td>
				</tr>
			</tbody>
		</table>
	</div>
</template>

<style scoped>
.TableBox {
	background-color: #EEE;
	padding: 10px;
}
.TableBox table {
	width: 100%;
	border-collapse: collapse;
}
.TableBox tr:nth-child(odd) {
	background-color: #00000020;
}
</style>