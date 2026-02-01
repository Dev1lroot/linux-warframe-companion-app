<script setup>
	import { ref, computed, onMounted, onUnmounted } from 'vue'

	const props = defineProps({
		WorldState: Object,
		Locale: Object,
		IsSteelPath: Boolean
	});

	const now = ref(Date.now());
	let timer = null;

	const filteredMissions = computed(() =>
	{
		if (!props.WorldState?.ActiveMissions) return [];
		
		return props.WorldState.ActiveMissions.filter(storm =>
		{
			const isHard = !!storm?.Hard;
			return props.IsSteelPath ? isHard : !isHard;
		});
	});

	onMounted(() =>
	{
		timer = setInterval(() =>
		{
			now.value = Date.now();
		}, 1000);
	});

	onUnmounted(() =>
	{
		if (timer) clearInterval(timer);
	});

	const getMissionTimeStatus = (missionData) =>
	{
		const startTime = parseInt(missionData?.Activation?.$date?.$numberLong) || 0;
		const endTime = parseInt(missionData?.Expiry?.$date?.$numberLong) || 0;

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
	};
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
				<tr v-for="storm in filteredMissions" :key="storm._id.$oid">
					<td>{{ Locale.solNodes?.[storm.Node]?.value || storm.Node }}</td>
					<td>{{ Locale.solNodes?.[storm.Node]?.enemy || 'Unknown' }}</td>
					<td>{{ Locale.missionTypes?.[storm.MissionType]?.value || storm.MissionType }}</td>
					<td>{{ Locale.fissureModifiers?.[storm.Modifier]?.value || storm.Modifier }}</td>
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