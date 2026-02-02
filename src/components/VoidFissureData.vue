<script setup>
	import { ref, onMounted, onUnmounted, inject } from 'vue'

	const props = defineProps({
		MissionData: Object
	});

	const RateVoidFissure = inject('RateVoidFissure');
    
    props.MissionData.Score = 0; //RateVoidFissure(props.MissionData);

	const now = ref(Date.now());
	let timer = null;

	onMounted(() =>
	{
		timer = setInterval(() =>
		{
			now.value = Date.now();
		}, 400);
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
    <div class="VoidFissureData">
        <div>
            <h3>{{ MissionData.Location }}</h3>
			<p>{{ MissionData.FissureType }} | {{ getMissionTimeStatus(MissionData) }}</p>
        </div>
    </div>
</template>

<style scoped>
.VoidFissureData{
    margin: 4px 0px;
}
.VoidFissureCard-FissureIcon{
    max-height: 90px;
    height: 90px;
    filter: invert();
    max-width: 90px !important;
}
.VoidFissureData p, .VoidFissureData b{
    color: #FFFFFFAA;
}
.VoidFissureData h3{
    font-size: 17px;
} 
</style>