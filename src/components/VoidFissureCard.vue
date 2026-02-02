<script setup>
	import { ref, onMounted, onUnmounted, inject } from 'vue'

	const props = defineProps({
		MissionData: Object
	});

	const RateVoidFissure = inject('RateVoidFissure');
    
    props.MissionData.Score = RateVoidFissure(props.MissionData);

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
    const EstimateVoidFissureClass = (missionData) =>
    {
        if (missionData.Score >= 80) return 'VoidFissureRank-ExcellentFissure';
        else if (missionData.Score >= 40) return 'VoidFissureRank-GoodFissure';
        else if (missionData.Score >= 0) return 'VoidFissureRank-AverageFissure';
        else if (missionData.Score >= -40) return 'VoidFissureRank-PoorFissure';
        else return 'VoidFissureRank-TerribleFissure';
    };
</script>

<template>
    <div class="VoidFissureCard" :class="EstimateVoidFissureClass(MissionData)">
        <img class="VoidFissureCard-FissureIcon" :src="`/assets/fissures/${MissionData.FissureCode}.svg`"/>
        <div>
            <h3>{{ MissionData.MissionName }} | {{ MissionData.FactionName }}</h3>
            <p><b>{{ MissionData.FissureName }} Fissure</b></p>
            <p>{{ MissionData.Location }}</p>
            <p>{{ getMissionTimeStatus(MissionData) }}</p>
        </div>
        <div>

        </div>
    </div>
</template>

<style scoped>
.VoidFissureCard{
    /* border: 1px solid #ccc; */
    background-color: #FFFFFF10;
    border-radius: 10px;
    padding: 8px;
    display: flex;
    width: 100%;
    flex-grow: 1;
    gap: 8px;
}
.VoidFissureCard-FissureIcon{
    max-height: 90px;
    height: 90px;
    filter: invert();
    max-width: 90px !important;
}
.VoidFissureCard p, .VoidFissureCard b{
    color: #FFFFFFAA;
}
.VoidFissureCard h3{
    font-size: 17px;
}
.VoidFissureRank-ExcellentFissure{
    outline: 2px solid #00AF00;
}
.VoidFissureRank-GoodFissure{
    /* outline: 2px solid #A0FF00; */
}
.VoidFissureRank-AverageFissure{
    /* outline: 2px solid #FFFF00; */
}
.VoidFissureRank-PoorFissure{
    /* outline: 2px solid #FF8000; */
}
.VoidFissureRank-TerribleFissure{
    outline: 2px solid #FF0000;
}  
</style>