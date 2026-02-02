<script setup>
import { computed, reactive } from 'vue'
import VoidFissureCard from './VoidFissureCard.vue'
import VoidFissureData from './VoidFissureData.vue'
import VoidFissureClock from './VoidFissureClock.vue'

const props = defineProps({
    WorldState: Object,
    Locale: Object,
    Title: String
})

/* ---------- normalize data ---------- */

const ComputedActiveMissions = computed(() => {
    if (!props.WorldState?.ActiveMissions) return []

    return props.WorldState.ActiveMissions.map(storm => {
        const isHard = !!storm?.Hard

        return {
            ...storm,
            Location: props.Locale?.solNodes?.[storm.Node]?.value || storm.Node,
            FactionName: props.Locale?.solNodes?.[storm.Node]?.enemy || 'Unknown',
            MissionName: props.Locale?.missionTypes?.[storm.MissionType]?.value || storm.MissionType,
            FissureName: props.Locale?.fissureModifiers?.[storm.Modifier]?.value || storm.Modifier,
            FissureCode: storm.Modifier,
            FissureType: isHard ? 'Steel Path' : 'Normal',
        }
    })
})

const ComputedVoidStorms = computed(() => {
    if (!props.WorldState?.VoidStorms) return []

    return props.WorldState.VoidStorms.map(storm => ({
        ...storm,
        Location: props.Locale?.solNodes?.[storm.Node]?.value || storm.Node,
        FactionName: props.Locale?.solNodes?.[storm.Node]?.enemy || 'Unknown',
        MissionName: props.Locale?.solNodes?.[storm.Node]?.type || 'Unknown',
        FissureName: props.Locale?.fissureModifiers?.[storm.ActiveMissionTier]?.value || storm.ActiveMissionTier,
        FissureCode: storm.ActiveMissionTier,
        FissureType: 'Railjack',
    }))
})

const ComputedVoidFissures = computed(() => [
    ...ComputedActiveMissions.value,
    ...ComputedVoidStorms.value
])

/* ---------- UI state ---------- */

const Display = reactive({
    Mode: 'cards',
    Modes: [
        {
            title: "Cards",
            value: "cards",
        },
        {
            title: "Matrix",
            value: "matrix"
        },
        {
            title: "Table",
            value: "table"
        }
    ],
    SelectedMissions: [],
    SelectedFissures: [],
})

/* ---------- precomputed axes for selectors ---------- */

const AllMissions = computed(() => {
    const set = new Set()
    for (const f of ComputedVoidFissures.value) {
        set.add(f.MissionName)
    }
    return [...set].sort()
})

const AllFissures = computed(() => {
    const set = new Set()
    for (const f of ComputedVoidFissures.value) {
        set.add(f.FissureName)
    }
    return [...set].sort()
})

/* ---------- filtered computed for display ---------- */

const FilteredComputedVoidFissures = computed(() =>
    ComputedVoidFissures.value.filter(f =>
        (!Display.SelectedMissions.length || Display.SelectedMissions.includes(f.MissionName)) &&
        (!Display.SelectedFissures.length || Display.SelectedFissures.includes(f.FissureName))
    )
)

/* ---------- indexed map ---------- */

const fissureMap = computed(() => {
    const map = Object.create(null)
    for (const f of FilteredComputedVoidFissures.value) {
        map[f.MissionName] ??= Object.create(null)
        map[f.MissionName][f.FissureName] = f
    }
    return map
})

/* ---------- axes for table (filtered) ---------- */

const missions = computed(() => Object.keys(fissureMap.value).sort())

const fissures = computed(() => {
    const set = new Set()
    for (const m in fissureMap.value) {
        for (const f in fissureMap.value[m]) {
            set.add(f)
        }
    }
    return [...set].sort()
})

/* ---------- cell helpers ---------- */

const cellData = (mission, fissure) =>
    fissureMap.value[mission]?.[fissure] ?? null

/* ---------- multiselect ---------- */

const toggleMission = mission => {
    const i = Display.SelectedMissions.indexOf(mission)
    i === -1
        ? Display.SelectedMissions.push(mission)
        : Display.SelectedMissions.splice(i, 1)
}

const toggleFissure = fissure => {
    const i = Display.SelectedFissures.indexOf(fissure)
    i === -1
        ? Display.SelectedFissures.push(fissure)
        : Display.SelectedFissures.splice(i, 1)
}
</script>

<template>
    <div class="ControlPanel">
        <nav>
            <div>
                <a>View</a>
                <div class="Popup">
                    <a
                        v-for="option in Display.Modes"
                        :key="option"
                        @click="Display.Mode = option.value"
                        :class="{ selected: (Display.Mode == option.value)}"
                    >
                        {{ option.title }}
                    </a>
                </div>
            </div>
            <div>
                <a>Missions <span v-if="Display.SelectedMissions.length > 0">({{ Display.SelectedMissions.length }})</span></a>
                <div class="Popup">
                    <a @click="Display.SelectedMissions = []">All</a>
                    <a
                        v-for="m in AllMissions"
                        :key="m"
                        :class="{ selected: Display.SelectedMissions.includes(m) }"
                        @click="toggleMission(m)"
                    >
                        {{ m }}
                    </a>
                </div>
            </div>
            <div>
                <a>Fissures <span v-if="Display.SelectedFissures.length > 0">({{ Display.SelectedFissures.length }})</span></a>
                <div class="Popup">
                    <a @click="Display.SelectedFissures = []">All</a>
                    <a
                        v-for="f in AllFissures"
                        :key="f"
                        :class="{ selected: Display.SelectedFissures.includes(f) }"
                        @click="toggleFissure(f)"
                    >
                        {{ f }}
                    </a>
                </div>
            </div>
        </nav>
    </div>

    <!-- ===== cards mode ===== -->

    <div v-if="Display.Mode === 'cards'">
        <div class="VoidFissureGridBox">
            <div v-for="storm in FilteredComputedVoidFissures" :key="storm.Node + storm.FissureCode + storm.FissureType">
                <VoidFissureCard
                    :MissionData="storm"
                    :Locale="Locale"
                />
            </div>
        </div>
    </div>

    <!-- ===== matrix mode ===== -->

    <div v-if="Display.Mode === 'matrix'">
        <table class="VoidFissureTable">
            <tbody>
                <tr>
                    <td>Mission / Fissure</td>
                    <td v-for="f in fissures" :key="f">
                        {{ f }}
                    </td>
                </tr>

                <tr v-for="m in missions" :key="m">
                    <td>{{ m }}</td>

                    <td v-for="f in fissures" :key="f">
                        <VoidFissureData
                            v-if="cellData(m, f)"
                            :MissionData="cellData(m, f)"
                        />
                    </td>
                </tr>
            </tbody>
        </table>
    </div>

    <!-- ===== table mode ===== -->

     <div v-if="Display.Mode === 'table'">
        <table class="VoidFissureTable">
            <tbody>
                <tr>
                    <td>Location</td>
                    <td>Section</td>
                    <td>Faction</td>
                    <td>Mission</td>
                    <td>Fissure</td>
                    <td>Time</td>
                </tr>
                <tr v-for="m in FilteredComputedVoidFissures">
                    <td>{{ m.Location }}</td>
                    <td>{{ m.FissureType }}</td>
                    <td>{{ m.FactionName }}</td>
                    <td>{{ m.MissionName }}</td>
                    <td>{{ m.FissureName }}</td>
                    <td><VoidFissureClock :MissionData="m"/></td>
                </tr>
            </tbody>
        </table>
    </div>
</template>

<style scoped>
.VoidFissureGridBox{
	display: grid;
	grid-template-columns: repeat(auto-fill, minmax(335px, 1fr));
	gap: 10px;
}
.VoidFissureTitle{
	margin-top: 20px;
	margin-bottom: 10px;
}
.VoidFissureTable{
    width: 100%;
    border-collapse: collapse;
}
.VoidFissureTable tr:nth-child(2n){
    background-color: #FFFFFF10;
}
.VoidFissureTable td{
    padding-left: 10px;
    border-left: 1px solid #FFFFFF20;
}
.VoidFissureTable td:first-child{
    border-left: none;
    padding: 0px;
    text-align: center;
    font-weight: bolder;
}
.VoidFissureTable tr:first-child td{
    font-weight: bolder;
    border-left: none;
    text-align: center;
}
.multiselect, .subnav{
    display: flex;
    flex-wrap: wrap;
    gap: 10px;
}
.multiselect a, .subnav a{
    cursor: pointer;
    padding: 10px;
    background-color: #FFFFFF10;
    display: block;
}
.multiselect a.selected{
    background-color: #FFFFFF90;
}
.disabled {
    opacity: 0.3;
}
.ControlPanel{
    position: absolute;
    right: 0px;
    top: 0px;
    width: auto;
}
.ControlPanel .Popup{
    display: block;
    pointer-events: none;
    opacity: 0;
    position: absolute;
    top: 50px;
    right: 0px;
    width: 200px;
    border: 1px solid #555;
    z-index: 1000;
    box-shadow: 0px 0px 0px #00000001;
    transition: all 0.3s;
}
.ControlPanel > nav{
    display: flex;
}
.ControlPanel > nav > div{
    position: relative;
}
.ControlPanel > nav > div{
    cursor: pointer;
    height: 80px;
    display: flex;
    justify-content: center;
    align-items: center;
    padding: 0px 10px;
}
.ControlPanel > nav > div > a{
    font-size: 26px;
    cursor: pointer;
}
.ControlPanel > nav > div:hover > a{
    border-bottom: 4px solid orange;
    color: orange;
}
.ControlPanel > nav > div:hover .Popup{
    display: block;
    pointer-events: all;
    background-color: #222;
    opacity: 1;
    top: 80px;
    box-shadow: 0px 0px 24px #00000040;
    transition: all 0.3s;
}
.Popup a{
    display: block;
    width: 100%;
    border-left: 3px solid transparent;
    font-size: 20px;
    cursor: pointer;
}
.Popup a:hover{
    background-color: #FFFFFF10;
}
.Popup a.selected{
    border-left: 3px solid orange;
}
</style>