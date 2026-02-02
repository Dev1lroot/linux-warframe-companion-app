<script setup>
	import { ref } from 'vue'
	import VoidFissureClock from './VoidFissureClock.vue';

	const props = defineProps({
		MissionData: Object
	});
    

</script>

<template>
    <div class="VoidFissureCard">
        <img class="VoidFissureCard-FissureIcon" :src="`/assets/fissures/${MissionData.FissureCode}.svg`"/>
        <div>
            <h3>{{ MissionData.MissionName }} | {{ MissionData.FactionName }}</h3>
            <p><b>{{ MissionData.FissureName }} Fissure</b></p>
            <p>{{ MissionData.Location }}</p>
            <p><VoidFissureClock :MissionData="MissionData"/></p>
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
</style>