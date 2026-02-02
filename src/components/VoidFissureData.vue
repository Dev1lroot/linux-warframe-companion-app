<script setup>
	import { ref } from 'vue'
	import VoidFissureClock from './VoidFissureClock.vue';

	const props = defineProps({
		MissionData: Object
	});
</script>

<template>
    <div class="VoidFissureData">
        <div>
            <h3>{{ MissionData.Location }}</h3>
			<p>{{ MissionData.FissureType }} | <VoidFissureClock :MissionData="MissionData"/></p>
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